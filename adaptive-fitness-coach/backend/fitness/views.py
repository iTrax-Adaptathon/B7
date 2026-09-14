from django.utils import timezone
from django.db.models import Avg, Count, Q
from rest_framework import status, permissions, viewsets, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.views import exception_handler
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from fitness.models import (
    Profile, Exercise, WorkoutPlan, WorkoutExercise,
    WorkoutSession, ExerciseLog, AdaptationResult, AdaptationDecision
)
from fitness.serializers import (
    UserSerializer, RegisterSerializer, ProfileSerializer,
    ExerciseSerializer, WorkoutPlanSerializer, WorkoutSessionSerializer,
    ExerciseLogSerializer, AdaptationResultSerializer, WorkoutSubmissionSerializer
)
from fitness.engine import AdaptationEngine, WorkoutGenerator


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None:
        # Standardize error format
        errors = []
        if isinstance(response.data, dict):
            for field, messages in response.data.items():
                if isinstance(messages, list):
                    errors.append(f"{field}: {' '.join(str(m) for m in messages)}")
                else:
                    errors.append(f"{field}: {str(messages)}")
        elif isinstance(response.data, list):
            errors = [str(item) for item in response.data]
        else:
            errors = [str(response.data)]

        response.data = {
            'error': True,
            'message': errors[0] if errors else 'An unexpected error occurred.',
            'details': response.data
        }
    return response


# --- AUTH VIEWS ---

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
                'message': 'Registration successful.'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomLoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            from django.contrib.auth.models import User
            user = User.objects.filter(username=request.data.get('username')).first()
            if user:
                profile, _ = Profile.objects.get_or_create(
                    user=user,
                    defaults={'name': user.username, 'onboarding_completed': False}
                )
                response.data['user'] = {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'name': profile.name,
                    'onboarding_completed': profile.onboarding_completed
                }
        return response


# --- PROFILE VIEW ---

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, _ = Profile.objects.get_or_create(
            user=request.user,
            defaults={'name': request.user.username, 'onboarding_completed': False}
        )
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        return self.patch(request)

    def patch(self, request):
        profile, _ = Profile.objects.get_or_create(
            user=request.user,
            defaults={'name': request.user.username}
        )
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            updated_profile = serializer.save()

            # If user completed onboarding or changed equipment, auto-generate fresh adapted workout plan
            if updated_profile.onboarding_completed:
                WorkoutGenerator.generate_workout_plan(request.user)

            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --- EXERCISE VIEW ---

class ExerciseListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        category = request.query_params.get('category')
        difficulty = request.query_params.get('difficulty')
        compatible_only = request.query_params.get('compatible_only', 'false').lower() == 'true'

        if compatible_only:
            queryset = WorkoutGenerator.get_compatible_exercises(request.user)
        else:
            queryset = Exercise.objects.all()

        if category:
            queryset = queryset.filter(category=category.upper())
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty.upper())

        serializer = ExerciseSerializer(queryset, many=True)
        return Response(serializer.data)


# --- WORKOUT & NEXT WORKOUT VIEWS ---

class WorkoutPlanListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        plans = WorkoutPlan.objects.filter(user=request.user)
        serializer = WorkoutPlanSerializer(plans, many=True)
        return Response(serializer.data)

    def post(self, request):
        plan = WorkoutGenerator.generate_workout_plan(request.user)
        if not plan:
            return Response(
                {'error': 'Unable to generate workout plan. Please ensure onboarding is complete.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(WorkoutPlanSerializer(plan).data, status=status.HTTP_201_CREATED)


class WorkoutPlanDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            plan = WorkoutPlan.objects.get(pk=pk, user=request.user)
        except WorkoutPlan.DoesNotExist:
            return Response({'error': 'Workout plan not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(WorkoutPlanSerializer(plan).data)


class NextWorkoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Look for existing active plan
        plan = WorkoutPlan.objects.filter(user=request.user, is_active=True).first()
        if not plan:
            plan = WorkoutGenerator.generate_workout_plan(request.user)

        if not plan:
            return Response({
                'workout': None,
                'message': 'No workout available. Please complete onboarding or generate a new workout.'
            })

        latest_adaptation = AdaptationResult.objects.filter(user=request.user).first()
        
        return Response({
            'workout': WorkoutPlanSerializer(plan).data,
            'latest_adaptation': AdaptationResultSerializer(latest_adaptation).data if latest_adaptation else None
        })


# --- WORKOUT LOGGING & ADAPTATION SUBMISSION ---

class WorkoutLogSubmissionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        sessions = WorkoutSession.objects.filter(user=request.user)
        serializer = WorkoutSessionSerializer(sessions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = WorkoutSubmissionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        # 1. Create WorkoutSession
        plan = None
        if data.get('workout_plan_id'):
            plan = WorkoutPlan.objects.filter(id=data['workout_plan_id'], user=request.user).first()

        session = WorkoutSession.objects.create(
            user=request.user,
            workout_plan=plan,
            workout_name=data.get('workout_name', 'Adaptive Workout Session'),
            completed_at=timezone.now(),
            difficulty_rating=data['difficulty_rating'],
            energy_rating=data['energy_rating'],
            recovery_rating=data['recovery_rating'],
            notes=data.get('notes', '')
        )

        # 2. Create ExerciseLog entries
        for ex_item in data.get('exercises', []):
            try:
                exercise = Exercise.objects.get(id=ex_item['exercise_id'])
            except Exercise.DoesNotExist:
                continue

            ExerciseLog.objects.create(
                session=session,
                exercise=exercise,
                planned_sets=ex_item.get('planned_sets', 3),
                planned_reps=ex_item.get('planned_reps'),
                planned_duration=ex_item.get('planned_duration'),
                planned_weight=ex_item.get('planned_weight'),
                actual_sets=ex_item.get('actual_sets', 3),
                actual_reps=ex_item.get('actual_reps'),
                actual_duration=ex_item.get('actual_duration'),
                actual_weight=ex_item.get('actual_weight'),
                rpe=ex_item.get('rpe')
            )

        # 3. Calculate Adaptation Score & Decision using Adaptive Engine
        eval_result = AdaptationEngine.evaluate_user_session(request.user, session)

        # 4. Save AdaptationResult
        adaptation_record = AdaptationResult.objects.create(
            user=request.user,
            workout_session=session,
            adaptation_score=eval_result['adaptation_score'],
            decision=eval_result['decision'],
            performance_component=eval_result['performance_component'],
            rep_completion_component=eval_result['rep_completion_component'],
            rpe_difficulty_component=eval_result['rpe_difficulty_component'],
            recovery_component=eval_result['recovery_component'],
            consistency_component=eval_result['consistency_component'],
            explanation=eval_result['explanation']
        )

        # 5. Generate Next Workout applying adaptation and equipment filters
        next_plan = WorkoutGenerator.generate_workout_plan(request.user, decision=eval_result['decision'])

        return Response({
            'message': 'Workout logged successfully and next workout adapted.',
            'session': WorkoutSessionSerializer(session).data,
            'adaptation_result': AdaptationResultSerializer(adaptation_record).data,
            'next_workout': WorkoutPlanSerializer(next_plan).data if next_plan else None
        }, status=status.HTTP_201_CREATED)


# --- ADAPTATION VIEWS ---

class LatestAdaptationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        latest = AdaptationResult.objects.filter(user=request.user).first()
        if not latest:
            # Generate baseline evaluation
            eval_baseline = AdaptationEngine.evaluate_user_session(request.user)
            return Response(eval_baseline)
        return Response(AdaptationResultSerializer(latest).data)


class CalculateAdaptationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        eval_result = AdaptationEngine.evaluate_user_session(request.user)
        return Response(eval_result)


# --- HISTORY VIEW ---

class HistoryListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        sessions = WorkoutSession.objects.filter(user=request.user)
        
        # Filtering
        exercise_id = request.query_params.get('exercise_id')
        workout_name = request.query_params.get('workout_name')
        decision = request.query_params.get('decision')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if exercise_id:
            sessions = sessions.filter(exercise_logs__exercise_id=exercise_id).distinct()
        if workout_name:
            sessions = sessions.filter(workout_name__icontains=workout_name)
        if decision:
            sessions = sessions.filter(adaptation_result__decision=decision.upper())
        if start_date:
            sessions = sessions.filter(started_at__date__gte=start_date)
        if end_date:
            sessions = sessions.filter(started_at__date__lte=end_date)

        serializer = WorkoutSessionSerializer(sessions, many=True)
        return Response(serializer.data)


# --- PROGRESS & DASHBOARD VIEWS ---

class ProgressAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        sessions = list(WorkoutSession.objects.filter(user=user).order_by('started_at'))
        logs = list(ExerciseLog.objects.filter(session__user=user).order_by('date'))
        adaptations = list(AdaptationResult.objects.filter(user=user).order_by('created_at'))

        # 1. Weight Progression data by Exercise
        weight_history = {}
        for log in logs:
            if log.actual_weight is not None and log.actual_weight > 0:
                ex_name = log.exercise.name
                if ex_name not in weight_history:
                    weight_history[ex_name] = []
                weight_history[ex_name].append({
                    'date': log.date.strftime('%Y-%m-%d'),
                    'weight': log.actual_weight,
                    'reps': log.actual_reps or log.planned_reps,
                    'sets': log.actual_sets or log.planned_sets
                })

        # 2. RPE and Recovery trends across sessions
        session_trends = []
        for s in sessions:
            avg_rpe = s.exercise_logs.filter(rpe__isnull=False).aggregate(Avg('rpe'))['rpe__avg']
            session_trends.append({
                'id': s.id,
                'date': s.started_at.strftime('%Y-%m-%d'),
                'workout_name': s.workout_name,
                'difficulty': s.difficulty_rating,
                'recovery': s.recovery_rating,
                'energy': s.energy_rating,
                'avg_rpe': round(avg_rpe, 1) if avg_rpe else None
            })

        # 3. Adaptation Decision Breakdown
        decision_counts = {
            'PROGRESS': sum(1 for a in adaptations if a.decision == AdaptationDecision.PROGRESS),
            'HOLD': sum(1 for a in adaptations if a.decision == AdaptationDecision.HOLD),
            'BACK_OFF': sum(1 for a in adaptations if a.decision == AdaptationDecision.BACK_OFF),
        }

        # 4. Score Trend over time
        score_trend = [
            {
                'date': a.created_at.strftime('%Y-%m-%d'),
                'score': a.adaptation_score,
                'decision': a.decision,
                'explanation': a.explanation
            }
            for a in adaptations
        ]

        return Response({
            'weight_history': weight_history,
            'session_trends': session_trends,
            'decision_counts': decision_counts,
            'score_trend': score_trend,
            'total_sessions': len(sessions)
        })


class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = getattr(user, 'profile', None)

        # Workouts this week (last 7 days)
        seven_days_ago = timezone.now() - timezone.timedelta(days=7)
        weekly_count = WorkoutSession.objects.filter(user=user, started_at__gte=seven_days_ago).count()

        # Averages across last 10 sessions
        recent_sessions = list(WorkoutSession.objects.filter(user=user)[:10])
        diff_vals = [s.difficulty_rating for s in recent_sessions if s.difficulty_rating is not None]
        avg_diff = sum(diff_vals) / len(diff_vals) if diff_vals else None
        rec_vals = [s.recovery_rating for s in recent_sessions if s.recovery_rating is not None]
        avg_rec = sum(rec_vals) / len(rec_vals) if rec_vals else None

        latest_session = WorkoutSession.objects.filter(user=user).first()
        latest_adapt = AdaptationResult.objects.filter(user=user).first()
        active_plan = WorkoutPlan.objects.filter(user=user, is_active=True).first()

        if not active_plan and profile and profile.onboarding_completed:
            active_plan = WorkoutGenerator.generate_workout_plan(user)

        return Response({
            'user_name': profile.name if profile and profile.name else user.username,
            'weekly_workouts': weekly_count,
            'target_days_per_week': profile.days_per_week if profile else 3,
            'average_difficulty': round(avg_diff, 1) if avg_diff else None,
            'average_recovery': round(avg_rec, 1) if avg_rec else None,
            'fitness_goal': profile.get_fitness_goal_display() if profile else 'General Wellness',
            'available_equipment': profile.equipment if profile else [],
            'gym_access': profile.gym_access if profile else False,
            'latest_session': WorkoutSessionSerializer(latest_session).data if latest_session else None,
            'latest_adaptation': AdaptationResultSerializer(latest_adapt).data if latest_adapt else None,
            'next_workout': WorkoutPlanSerializer(active_plan).data if active_plan else None,
            'training_status': latest_adapt.decision if latest_adapt else 'PROGRESS'
        })
