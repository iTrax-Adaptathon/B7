from rest_framework import serializers
from django.contrib.auth.models import User
from fitness.models import (
    Profile, Exercise, WorkoutPlan, WorkoutExercise,
    WorkoutSession, ExerciseLog, AdaptationResult,
    ExperienceLevel, FitnessGoal, WorkoutLocation, ProgressionMethod
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    name = serializers.CharField(required=False, default='')

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'name']

    def create(self, validated_data):
        name = validated_data.pop('name', '')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        # Create user profile automatically
        Profile.objects.create(
            user=user,
            name=name if name else user.username,
            onboarding_completed=False
        )
        return user


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Profile
        fields = [
            'id', 'username', 'email', 'name', 'age', 'height', 'weight',
            'experience', 'fitness_goal', 'focus_areas', 'equipment',
            'gym_access', 'location', 'days_per_week', 'workout_duration',
            'preferred_workout_style', 'progression_method', 'progression_value',
            'onboarding_completed', 'created_at', 'updated_at'
        ]

    def validate_age(self, value):
        if value is not None and (value < 10 or value > 120):
            raise serializers.ValidationError("Age must be between 10 and 120.")
        return value

    def validate_height(self, value):
        if value is not None and (value < 50.0 or value > 280.0):
            raise serializers.ValidationError("Height must be between 50 and 280 cm.")
        return value

    def validate_weight(self, value):
        if value is not None and (value < 20.0 or value > 400.0):
            raise serializers.ValidationError("Weight must be between 20 and 400 kg.")
        return value

    def validate_days_per_week(self, value):
        if value < 1 or value > 7:
            raise serializers.ValidationError("Days per week must be between 1 and 7.")
        return value

    def validate_workout_duration(self, value):
        if value < 10 or value > 180:
            raise serializers.ValidationError("Workout duration must be between 10 and 180 minutes.")
        return value

    def validate_progression_value(self, value):
        if value <= 0:
            raise serializers.ValidationError("Progression value must be greater than zero.")
        return value


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__'


class WorkoutExerciseSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer(read_only=True)
    exercise_id = serializers.PrimaryKeyRelatedField(
        queryset=Exercise.objects.all(), source='exercise', write_only=True
    )

    class Meta:
        model = WorkoutExercise
        fields = [
            'id', 'order', 'exercise', 'exercise_id', 'target_sets',
            'target_reps', 'target_duration_seconds', 'suggested_weight',
            'rest_period_seconds', 'instructions'
        ]


class WorkoutPlanSerializer(serializers.ModelSerializer):
    workout_exercises = WorkoutExerciseSerializer(many=True, read_only=True)

    class Meta:
        model = WorkoutPlan
        fields = [
            'id', 'name', 'focus', 'estimated_duration', 'is_active',
            'workout_exercises', 'created_at'
        ]


class ExerciseLogSerializer(serializers.ModelSerializer):
    exercise_name = serializers.CharField(source='exercise.name', read_only=True)
    is_bodyweight = serializers.BooleanField(source='exercise.is_bodyweight', read_only=True)
    equipment_required = serializers.JSONField(source='exercise.equipment_required', read_only=True)

    class Meta:
        model = ExerciseLog
        fields = [
            'id', 'session', 'exercise', 'exercise_name', 'is_bodyweight',
            'equipment_required', 'planned_sets', 'planned_reps',
            'planned_duration', 'planned_weight', 'actual_sets',
            'actual_reps', 'actual_duration', 'actual_weight', 'rpe', 'date'
        ]

    def validate_actual_sets(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Actual sets cannot be negative.")
        return value

    def validate_actual_reps(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Actual reps cannot be negative.")
        return value

    def validate_actual_weight(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Actual weight cannot be negative.")
        return value

    def validate_rpe(self, value):
        if value is not None and (value < 1.0 or value > 10.0):
            raise serializers.ValidationError("RPE must be between 1.0 and 10.0.")
        return value


class WorkoutSessionSerializer(serializers.ModelSerializer):
    exercise_logs = ExerciseLogSerializer(many=True, read_only=True)
    adaptation_decision = serializers.SerializerMethodField()

    class Meta:
        model = WorkoutSession
        fields = [
            'id', 'workout_plan', 'workout_name', 'started_at',
            'completed_at', 'difficulty_rating', 'energy_rating',
            'recovery_rating', 'notes', 'exercise_logs', 'adaptation_decision'
        ]

    def get_adaptation_decision(self, obj):
        res = getattr(obj, 'adaptation_result', None)
        if res and hasattr(res, 'first'):
            first_res = res.first()
            return first_res.decision if first_res else None
        return None

    def validate_difficulty_rating(self, value):
        if value is not None and (value < 1 or value > 5):
            raise serializers.ValidationError("Difficulty rating must be between 1 and 5.")
        return value

    def validate_energy_rating(self, value):
        if value is not None and (value < 1 or value > 5):
            raise serializers.ValidationError("Energy rating must be between 1 and 5.")
        return value

    def validate_recovery_rating(self, value):
        if value is not None and (value < 1 or value > 5):
            raise serializers.ValidationError("Recovery rating must be between 1 and 5.")
        return value


class AdaptationResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdaptationResult
        fields = [
            'id', 'workout_session', 'adaptation_score', 'decision',
            'performance_component', 'rep_completion_component',
            'rpe_difficulty_component', 'recovery_component',
            'consistency_component', 'explanation', 'created_at'
        ]


class SingleExerciseLogInputSerializer(serializers.Serializer):
    exercise_id = serializers.IntegerField()
    planned_sets = serializers.IntegerField(default=3, min_value=1)
    planned_reps = serializers.IntegerField(required=False, allow_null=True, min_value=0)
    planned_duration = serializers.IntegerField(required=False, allow_null=True, min_value=0)
    planned_weight = serializers.FloatField(required=False, allow_null=True, min_value=0.0)
    actual_sets = serializers.IntegerField(default=3, min_value=0)
    actual_reps = serializers.IntegerField(required=False, allow_null=True, min_value=0)
    actual_duration = serializers.IntegerField(required=False, allow_null=True, min_value=0)
    actual_weight = serializers.FloatField(required=False, allow_null=True, min_value=0.0)
    rpe = serializers.FloatField(required=False, allow_null=True, min_value=1.0, max_value=10.0)


class WorkoutSubmissionSerializer(serializers.Serializer):
    workout_plan_id = serializers.IntegerField(required=False, allow_null=True)
    workout_name = serializers.CharField(max_length=150, default='Adaptive Workout Session')
    difficulty_rating = serializers.IntegerField(min_value=1, max_value=5)
    energy_rating = serializers.IntegerField(min_value=1, max_value=5)
    recovery_rating = serializers.IntegerField(min_value=1, max_value=5)
    notes = serializers.CharField(required=False, allow_blank=True, default='')
    exercises = SingleExerciseLogInputSerializer(many=True)
