import random
from django.db.models import Q
from fitness.models import (
    Profile, Exercise, WorkoutPlan, WorkoutExercise,
    ExerciseLog, AdaptationResult, AdaptationDecision,
    ExperienceLevel, FitnessGoal, MuscleGroup
)
from .progression import calculate_next_weight, calculate_bodyweight_progression

class WorkoutGenerator:
    """
    Generates personalized, equipment-restricted workout routines adapted
    to the user's latest adaptation state, goals, focus areas, and history.
    """

    @classmethod
    def get_compatible_exercises(cls, user):
        """
        Enforces STRICT backend equipment filtering:
        Returns queryset of exercises that the user has all necessary equipment for.
        """
        profile = getattr(user, 'profile', None)
        if not profile:
            # Fallback to pure bodyweight
            return Exercise.objects.filter(is_bodyweight=True)

        if profile.gym_access:
            # Gym access grants access to all equipment categories
            return Exercise.objects.all()

        user_equipment = [eq.strip().lower() for eq in (profile.equipment or [])]
        
        # If user explicitly chose "No Equipment" or empty list
        is_no_equipment = ('no equipment' in user_equipment) or (len(user_equipment) == 0)

        all_exercises = Exercise.objects.all()
        compatible_ids = []

        for ex in all_exercises:
            req_list = [r.strip().lower() for r in (ex.equipment_required or [])]
            
            if not req_list or ex.is_bodyweight:
                # Bodyweight / zero-equipment exercise
                compatible_ids.append(ex.id)
            elif not is_no_equipment:
                # Must have every required equipment item
                has_all = all(
                    any(user_eq in req or req in user_eq for user_eq in user_equipment)
                    for req in req_list
                )
                if has_all:
                    compatible_ids.append(ex.id)

        return Exercise.objects.filter(id__in=compatible_ids)

    @classmethod
    def generate_workout_plan(cls, user, decision=None):
        """
        Generates and persists an adapted WorkoutPlan with WorkoutExercise items.
        """
        profile = getattr(user, 'profile', None)
        if not profile:
            return None

        # Determine adaptation decision if not explicitly provided
        if not decision:
            latest_adapt = AdaptationResult.objects.filter(user=user).order_by('-created_at').first()
            decision = latest_adapt.decision if latest_adapt else AdaptationDecision.PROGRESS

        compatible_exercises = cls.get_compatible_exercises(user)
        if not compatible_exercises.exists():
            # Fallback if seeder hasn't run or table is empty
            return None

        # Determine workout size based on duration preference
        dur = profile.workout_duration or 30
        if dur <= 20:
            exercise_count = 3
        elif dur <= 35:
            exercise_count = 4
        elif dur <= 50:
            exercise_count = 5
        else:
            exercise_count = 6

        # Determine focus areas
        selected_focuses = profile.focus_areas or ['Full Body']
        
        # Prioritize exercises matching user focus and difficulty level
        matching_exercises = []
        for focus in selected_focuses:
            f_norm = focus.lower()
            if 'upper' in f_norm:
                matching_exercises.extend(compatible_exercises.filter(target_muscle_group=MuscleGroup.UPPER_BODY))
            elif 'lower' in f_norm:
                matching_exercises.extend(compatible_exercises.filter(target_muscle_group=MuscleGroup.LOWER_BODY))
            elif 'core' in f_norm:
                matching_exercises.extend(compatible_exercises.filter(target_muscle_group=MuscleGroup.CORE))
            elif 'cardio' in f_norm:
                matching_exercises.extend(compatible_exercises.filter(target_muscle_group=MuscleGroup.CARDIO))
            elif 'mobility' in f_norm or 'flexibility' in f_norm:
                matching_exercises.extend(compatible_exercises.filter(target_muscle_group=MuscleGroup.MOBILITY))

        if not matching_exercises:
            matching_exercises = list(compatible_exercises)

        # Remove duplicates while preserving order
        unique_matches = []
        seen = set()
        for ex in matching_exercises:
            if ex.id not in seen:
                seen.add(ex.id)
                unique_matches.append(ex)

        # Fallback pool from remaining compatible exercises
        fallback_pool = [ex for ex in compatible_exercises if ex.id not in seen]
        all_candidates = unique_matches + fallback_pool

        selected_exercises = all_candidates[:exercise_count]
        if len(selected_exercises) < exercise_count:
            selected_exercises = list(compatible_exercises[:exercise_count])

        # Deactivate older active plans
        WorkoutPlan.objects.filter(user=user, is_active=True).update(is_active=False)

        # Create new WorkoutPlan
        focus_title = ", ".join(selected_focuses[:2]) if selected_focuses else "Adaptive Routine"
        plan_name = f"{profile.name or user.username}'s {focus_title} Session"
        
        plan = WorkoutPlan.objects.create(
            user=user,
            name=plan_name,
            focus=focus_title,
            estimated_duration=dur,
            is_active=True
        )

        # Create WorkoutExercises with adapted targets
        order = 1
        for ex in selected_exercises:
            # Check user history for previous weight & reps with this exercise
            last_log = (
                ExerciseLog.objects.filter(session__user=user, exercise=ex)
                .order_by('-date')
                .first()
            )

            if ex.is_bodyweight:
                prev_sets = last_log.actual_sets if last_log and last_log.actual_sets else ex.default_sets
                prev_reps = last_log.actual_reps if last_log and last_log.actual_reps else ex.default_reps
                prev_dur = last_log.actual_duration if last_log and last_log.actual_duration else ex.default_duration_seconds

                bw_targets = calculate_bodyweight_progression(
                    current_sets=prev_sets,
                    current_reps=prev_reps,
                    current_duration=prev_dur,
                    decision=decision
                )
                target_sets = bw_targets['target_sets']
                target_reps = bw_targets['target_reps']
                target_duration = bw_targets['target_duration_seconds']
                suggested_weight = None
            else:
                # Weighted exercise
                if last_log and last_log.actual_weight is not None:
                    prev_weight = last_log.actual_weight
                elif last_log and last_log.planned_weight is not None:
                    prev_weight = last_log.planned_weight
                else:
                    # Baseline weight by experience
                    if profile.experience == ExperienceLevel.ADVANCED:
                        prev_weight = 40.0 if 'barbell' in ex.name.lower() else 18.0
                    elif profile.experience == ExperienceLevel.INTERMEDIATE:
                        prev_weight = 25.0 if 'barbell' in ex.name.lower() else 12.0
                    else:
                        prev_weight = 15.0 if 'barbell' in ex.name.lower() else 6.0

                suggested_weight = calculate_next_weight(
                    current_weight=prev_weight,
                    method=profile.progression_method,
                    value=profile.progression_value,
                    decision=decision
                )
                target_sets = ex.default_sets or 3
                target_reps = ex.default_reps or 10
                target_duration = None

            WorkoutExercise.objects.create(
                workout_plan=plan,
                exercise=ex,
                order=order,
                target_sets=target_sets,
                target_reps=target_reps,
                target_duration_seconds=target_duration,
                suggested_weight=suggested_weight,
                rest_period_seconds=ex.default_rest_seconds or 60,
                instructions=ex.instructions or f"Perform {target_sets} sets with proper form."
            )
            order += 1

        return plan
