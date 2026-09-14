# Generated initial migration for fitness app
import django.core.validators
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Exercise',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150, unique=True)),
                ('category', models.CharField(choices=[('STRENGTH', 'Strength'), ('CARDIO', 'Cardio'), ('MOBILITY', 'Mobility'), ('CORE', 'Core')], default='STRENGTH', max_length=20)),
                ('difficulty', models.CharField(choices=[('BEGINNER', 'Beginner'), ('INTERMEDIATE', 'Intermediate'), ('ADVANCED', 'Advanced')], default='BEGINNER', max_length=20)),
                ('equipment_required', models.JSONField(blank=True, default=list)),
                ('target_muscle_group', models.CharField(choices=[('FULL_BODY', 'Full Body'), ('UPPER_BODY', 'Upper Body'), ('LOWER_BODY', 'Lower Body'), ('CORE', 'Core'), ('CARDIO', 'Cardio'), ('MOBILITY', 'Mobility / Flexibility')], default='FULL_BODY', max_length=30)),
                ('is_bodyweight', models.BooleanField(default=False)),
                ('default_sets', models.PositiveIntegerField(default=3, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(20)])),
                ('default_reps', models.PositiveIntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(100)])),
                ('default_duration_seconds', models.PositiveIntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(5), django.core.validators.MaxValueValidator(7200)])),
                ('default_rest_seconds', models.PositiveIntegerField(default=60, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(600)])),
                ('instructions', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=120)),
                ('age', models.PositiveIntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(10), django.core.validators.MaxValueValidator(120)])),
                ('height', models.FloatField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(50.0), django.core.validators.MaxValueValidator(280.0)])),
                ('weight', models.FloatField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(20.0), django.core.validators.MaxValueValidator(400.0)])),
                ('experience', models.CharField(choices=[('BEGINNER', 'Beginner'), ('INTERMEDIATE', 'Intermediate'), ('ADVANCED', 'Advanced')], default='BEGINNER', max_length=20)),
                ('fitness_goal', models.CharField(choices=[('BUILD_STRENGTH', 'Build Strength'), ('BUILD_MUSCLE', 'Build Muscle'), ('IMPROVE_FITNESS', 'Improve Fitness'), ('GENERAL_WELLNESS', 'General Wellness'), ('IMPROVE_FLEXIBILITY', 'Improve Flexibility / Mobility')], default='GENERAL_WELLNESS', max_length=30)),
                ('focus_areas', models.JSONField(blank=True, default=list)),
                ('equipment', models.JSONField(blank=True, default=list)),
                ('gym_access', models.BooleanField(default=False)),
                ('location', models.CharField(choices=[('HOME', 'Home'), ('GYM', 'Gym'), ('OUTDOORS', 'Outdoors')], default='HOME', max_length=20)),
                ('days_per_week', models.PositiveIntegerField(default=3, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(7)])),
                ('workout_duration', models.PositiveIntegerField(default=30, validators=[django.core.validators.MinValueValidator(10), django.core.validators.MaxValueValidator(180)])),
                ('preferred_workout_style', models.CharField(blank=True, default='Adaptive Hybrid', max_length=100)),
                ('progression_method', models.CharField(choices=[('FIXED', 'Fixed Weight Progression (+1.25, +2.5, +5 kg)'), ('PERCENTAGE', 'Percentage Weight Progression (+2.5%, +5%, +7.5%)')], default='FIXED', max_length=20)),
                ('progression_value', models.FloatField(default=2.5, validators=[django.core.validators.MinValueValidator(0.1), django.core.validators.MaxValueValidator(50.0)])),
                ('onboarding_completed', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='WorkoutPlan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150)),
                ('focus', models.CharField(max_length=100)),
                ('estimated_duration', models.PositiveIntegerField(default=30)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='workout_plans', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='WorkoutExercise',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.PositiveIntegerField(default=1)),
                ('target_sets', models.PositiveIntegerField(default=3, validators=[django.core.validators.MinValueValidator(1)])),
                ('target_reps', models.PositiveIntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(1)])),
                ('target_duration_seconds', models.PositiveIntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(1)])),
                ('suggested_weight', models.FloatField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(0.0)])),
                ('rest_period_seconds', models.PositiveIntegerField(default=60)),
                ('instructions', models.TextField(blank=True)),
                ('exercise', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='plan_occurrences', to='fitness.exercise')),
                ('workout_plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='workout_exercises', to='fitness.workoutplan')),
            ],
            options={
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='WorkoutSession',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('workout_name', models.CharField(max_length=150)),
                ('started_at', models.DateTimeField(auto_now_add=True)),
                ('completed_at', models.DateTimeField(blank=True, null=True)),
                ('difficulty_rating', models.PositiveIntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)])),
                ('energy_rating', models.PositiveIntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)])),
                ('recovery_rating', models.PositiveIntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(1), django.core.validators.MaxValueValidator(5)])),
                ('notes', models.TextField(blank=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='workout_sessions', to=settings.AUTH_USER_MODEL)),
                ('workout_plan', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='sessions', to='fitness.workoutplan')),
            ],
            options={
                'ordering': ['-started_at'],
            },
        ),
        migrations.CreateModel(
            name='ExerciseLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('planned_sets', models.PositiveIntegerField(default=3, validators=[django.core.validators.MinValueValidator(1)])),
                ('planned_reps', models.PositiveIntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(0)])),
                ('planned_duration', models.PositiveIntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(0)])),
                ('planned_weight', models.FloatField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(0.0)])),
                ('actual_sets', models.PositiveIntegerField(default=0, validators=[django.core.validators.MinValueValidator(0)])),
                ('actual_reps', models.PositiveIntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(0)])),
                ('actual_duration', models.PositiveIntegerField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(0)])),
                ('actual_weight', models.FloatField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(0.0)])),
                ('rpe', models.FloatField(blank=True, null=True, validators=[django.core.validators.MinValueValidator(1.0), django.core.validators.MaxValueValidator(10.0)])),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('exercise', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='execution_logs', to='fitness.exercise')),
                ('session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='exercise_logs', to='fitness.workoutsession')),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='AdaptationResult',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('adaptation_score', models.FloatField(validators=[django.core.validators.MinValueValidator(0.0), django.core.validators.MaxValueValidator(100.0)])),
                ('decision', models.CharField(choices=[('PROGRESS', 'Progress'), ('HOLD', 'Hold'), ('BACK_OFF', 'Back Off')], default='HOLD', max_length=20)),
                ('performance_component', models.FloatField(default=0.0)),
                ('rep_completion_component', models.FloatField(default=0.0)),
                ('rpe_difficulty_component', models.FloatField(default=0.0)),
                ('recovery_component', models.FloatField(default=0.0)),
                ('consistency_component', models.FloatField(default=0.0)),
                ('explanation', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='adaptation_results', to=settings.AUTH_USER_MODEL)),
                ('workout_session', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='adaptation_result', to='fitness.workoutsession')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
