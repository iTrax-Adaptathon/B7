from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class ExperienceLevel(models.TextChoices):
    BEGINNER = 'BEGINNER', 'Beginner'
    INTERMEDIATE = 'INTERMEDIATE', 'Intermediate'
    ADVANCED = 'ADVANCED', 'Advanced'

class FitnessGoal(models.TextChoices):
    BUILD_STRENGTH = 'BUILD_STRENGTH', 'Build Strength'
    BUILD_MUSCLE = 'BUILD_MUSCLE', 'Build Muscle'
    IMPROVE_FITNESS = 'IMPROVE_FITNESS', 'Improve Fitness'
    GENERAL_WELLNESS = 'GENERAL_WELLNESS', 'General Wellness'
    IMPROVE_FLEXIBILITY = 'IMPROVE_FLEXIBILITY', 'Improve Flexibility / Mobility'

class WorkoutLocation(models.TextChoices):
    HOME = 'HOME', 'Home'
    GYM = 'GYM', 'Gym'
    OUTDOORS = 'OUTDOORS', 'Outdoors'

class ProgressionMethod(models.TextChoices):
    FIXED = 'FIXED', 'Fixed Weight Progression (+1.25, +2.5, +5 kg)'
    PERCENTAGE = 'PERCENTAGE', 'Percentage Weight Progression (+2.5%, +5%, +7.5%)'

class AdaptationDecision(models.TextChoices):
    PROGRESS = 'PROGRESS', 'Progress'
    HOLD = 'HOLD', 'Hold'
    BACK_OFF = 'BACK_OFF', 'Back Off'

class MuscleGroup(models.TextChoices):
    FULL_BODY = 'FULL_BODY', 'Full Body'
    UPPER_BODY = 'UPPER_BODY', 'Upper Body'
    LOWER_BODY = 'LOWER_BODY', 'Lower Body'
    CORE = 'CORE', 'Core'
    CARDIO = 'CARDIO', 'Cardio'
    MOBILITY = 'MOBILITY', 'Mobility / Flexibility'

class ExerciseCategory(models.TextChoices):
    STRENGTH = 'STRENGTH', 'Strength'
    CARDIO = 'CARDIO', 'Cardio'
    MOBILITY = 'MOBILITY', 'Mobility'
    CORE = 'CORE', 'Core'


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    name = models.CharField(max_length=120)
    age = models.PositiveIntegerField(null=True, blank=True, validators=[MinValueValidator(10), MaxValueValidator(120)])
    height = models.FloatField(null=True, blank=True, validators=[MinValueValidator(50.0), MaxValueValidator(280.0)]) # in cm
    weight = models.FloatField(null=True, blank=True, validators=[MinValueValidator(20.0), MaxValueValidator(400.0)]) # in kg
    
    experience = models.CharField(
        max_length=20,
        choices=ExperienceLevel.choices,
        default=ExperienceLevel.BEGINNER
    )
    fitness_goal = models.CharField(
        max_length=30,
        choices=FitnessGoal.choices,
        default=FitnessGoal.GENERAL_WELLNESS
    )
    focus_areas = models.JSONField(default=list, blank=True) # list of selected muscle/focus groups
    equipment = models.JSONField(default=list, blank=True)   # list of available equipment
    gym_access = models.BooleanField(default=False)
    
    location = models.CharField(
        max_length=20,
        choices=WorkoutLocation.choices,
        default=WorkoutLocation.HOME
    )
    days_per_week = models.PositiveIntegerField(default=3, validators=[MinValueValidator(1), MaxValueValidator(7)])
    workout_duration = models.PositiveIntegerField(default=30, validators=[MinValueValidator(10), MaxValueValidator(180)]) # minutes
    preferred_workout_style = models.CharField(max_length=100, blank=True, default='Adaptive Hybrid')
    
    progression_method = models.CharField(
        max_length=20,
        choices=ProgressionMethod.choices,
        default=ProgressionMethod.FIXED
    )
    progression_value = models.FloatField(default=2.5, validators=[MinValueValidator(0.1), MaxValueValidator(50.0)])
    onboarding_completed = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile: {self.name} ({self.user.username})"


class Exercise(models.Model):
    name = models.CharField(max_length=150, unique=True)
    category = models.CharField(
        max_length=20,
        choices=ExerciseCategory.choices,
        default=ExerciseCategory.STRENGTH
    )
    difficulty = models.CharField(
        max_length=20,
        choices=ExperienceLevel.choices,
        default=ExperienceLevel.BEGINNER
    )
    equipment_required = models.JSONField(default=list, blank=True) # e.g. ["Dumbbells", "Bench"] or [] for bodyweight
    target_muscle_group = models.CharField(
        max_length=30,
        choices=MuscleGroup.choices,
        default=MuscleGroup.FULL_BODY
    )
    is_bodyweight = models.BooleanField(default=False)
    default_sets = models.PositiveIntegerField(default=3, validators=[MinValueValidator(1), MaxValueValidator(20)])
    default_reps = models.PositiveIntegerField(null=True, blank=True, validators=[MinValueValidator(1), MaxValueValidator(100)])
    default_duration_seconds = models.PositiveIntegerField(null=True, blank=True, validators=[MinValueValidator(5), MaxValueValidator(7200)])
    default_rest_seconds = models.PositiveIntegerField(default=60, validators=[MinValueValidator(0), MaxValueValidator(600)])
    instructions = models.TextField(blank=True)

    def __str__(self):
        return self.name


class WorkoutPlan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workout_plans')
    name = models.CharField(max_length=150)
    focus = models.CharField(max_length=100)
    estimated_duration = models.PositiveIntegerField(default=30)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} for {self.user.username} ({self.created_at.strftime('%Y-%m-%d')})"


class WorkoutExercise(models.Model):
    workout_plan = models.ForeignKey(WorkoutPlan, on_delete=models.CASCADE, related_name='workout_exercises')
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name='plan_occurrences')
    order = models.PositiveIntegerField(default=1)
    target_sets = models.PositiveIntegerField(default=3, validators=[MinValueValidator(1)])
    target_reps = models.PositiveIntegerField(null=True, blank=True, validators=[MinValueValidator(1)])
    target_duration_seconds = models.PositiveIntegerField(null=True, blank=True, validators=[MinValueValidator(1)])
    suggested_weight = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0.0)])
    rest_period_seconds = models.PositiveIntegerField(default=60)
    instructions = models.TextField(blank=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.order}. {self.exercise.name} ({self.target_sets} sets)"


class WorkoutSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workout_sessions')
    workout_plan = models.ForeignKey(WorkoutPlan, on_delete=models.SET_NULL, null=True, blank=True, related_name='sessions')
    workout_name = models.CharField(max_length=150)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    difficulty_rating = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    ) # 1: Very Easy to 5: Very Hard
    energy_rating = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    ) # 1: Very Low to 5: Excellent
    recovery_rating = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    ) # 1: Very Poor to 5: Excellent
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-started_at']

    def __str__(self):
        return f"{self.workout_name} - {self.user.username} ({self.started_at.strftime('%Y-%m-%d %H:%M')})"


class ExerciseLog(models.Model):
    session = models.ForeignKey(WorkoutSession, on_delete=models.CASCADE, related_name='exercise_logs')
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name='execution_logs')
    planned_sets = models.PositiveIntegerField(default=3, validators=[MinValueValidator(1)])
    planned_reps = models.PositiveIntegerField(null=True, blank=True, validators=[MinValueValidator(0)])
    planned_duration = models.PositiveIntegerField(null=True, blank=True, validators=[MinValueValidator(0)]) # in seconds
    planned_weight = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0.0)])
    
    actual_sets = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
    actual_reps = models.PositiveIntegerField(null=True, blank=True, validators=[MinValueValidator(0)])
    actual_duration = models.PositiveIntegerField(null=True, blank=True, validators=[MinValueValidator(0)])
    actual_weight = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0.0)])
    
    rpe = models.FloatField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1.0), MaxValueValidator(10.0)]
    ) # 1 to 10
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.exercise.name} in {self.session.id}"


class AdaptationResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='adaptation_results')
    workout_session = models.ForeignKey(WorkoutSession, on_delete=models.SET_NULL, null=True, blank=True, related_name='adaptation_result')
    adaptation_score = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(100.0)])
    decision = models.CharField(
        max_length=20,
        choices=AdaptationDecision.choices,
        default=AdaptationDecision.HOLD
    )
    performance_component = models.FloatField(default=0.0)
    rep_completion_component = models.FloatField(default=0.0)
    rpe_difficulty_component = models.FloatField(default=0.0)
    recovery_component = models.FloatField(default=0.0)
    consistency_component = models.FloatField(default=0.0)
    explanation = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.decision} ({self.adaptation_score:.1f}) for {self.user.username} at {self.created_at.strftime('%Y-%m-%d %H:%M')}"
