from django.core.management.base import BaseCommand
from fitness.models import Exercise, ExerciseCategory, ExperienceLevel, MuscleGroup

class Command(BaseCommand):
    help = 'Seeds database with beginner-to-advanced exercises across Bodyweight, Dumbbells, Barbells, Resistance Bands, Machines, and Cardio.'

    def handle(self, *args, **options):
        self.stdout.write("Seeding Exercise database...")

        exercises = [
            # BODYWEIGHT
            {
                "name": "Push-up",
                "category": ExerciseCategory.STRENGTH,
                "difficulty": ExperienceLevel.BEGINNER,
                "equipment_required": [],
                "target_muscle_group": MuscleGroup.UPPER_BODY,
                "is_bodyweight": True,
                "default_sets": 3,
                "default_reps": 10,
                "default_duration_seconds": None,
                "default_rest_seconds": 60,
                "instructions": "Place hands shoulder-width apart, lower chest until near the floor while maintaining a straight body line, then push back up."
            },
            {
                "name": "Bodyweight Squat",
                "category": ExerciseCategory.STRENGTH,
                "difficulty": ExperienceLevel.BEGINNER,
                "equipment_required": [],
                "target_muscle_group": MuscleGroup.LOWER_BODY,
                "is_bodyweight": True,
                "default_sets": 3,
                "default_reps": 12,
                "default_duration_seconds": None,
                "default_rest_seconds": 60,
                "instructions": "Stand with feet shoulder-width apart. Lower your hips back and down as if sitting in a chair. Drive through heels to return to standing."
            },
            {
                "name": "Reverse Lunge",
                "category": ExerciseCategory.STRENGTH,
                "difficulty": ExperienceLevel.BEGINNER,
                "equipment_required": [],
                "target_muscle_group": MuscleGroup.LOWER_BODY,
                "is_bodyweight": True,
                "default_sets": 3,
                "default_reps": 10,
                "default_duration_seconds": None,
                "default_rest_seconds": 60,
                "instructions": "Step backward with one leg, lowering your hips until both knees are bent at 90-degree angles. Push back to starting position."
            },
            {
                "name": "Plank",
                "category": ExerciseCategory.CORE,
                "difficulty": ExperienceLevel.BEGINNER,
                "equipment_required": [],
                "target_muscle_group": MuscleGroup.CORE,
                "is_bodyweight": True,
                "default_sets": 3,
                "default_reps": None,
                "default_duration_seconds": 30,
                "default_rest_seconds": 45,
                "instructions": "Hold a rigid forearm plank position, keeping your core braced and your body in a straight line from head to heels."
            },
            {
                "name": "Glute Bridge",
                "category": ExerciseCategory.STRENGTH,
                "difficulty": ExperienceLevel.BEGINNER,
                "equipment_required": [],
                "target_muscle_group": MuscleGroup.LOWER_BODY,
                "is_bodyweight": True,
                "default_sets": 3,
                "default_reps": 15,
                "default_duration_seconds": None,
                "default_rest_seconds": 45,
                "instructions": "Lie on your back with knees bent and feet flat. Squeeze glutes and press hips upward until thighs and torso align."
            },
            {
                "name": "Mountain Climber",
                "category": ExerciseCategory.CARDIO,
                "difficulty": ExperienceLevel.BEGINNER,
                "equipment_required": [],
                "target_muscle_group": MuscleGroup.CORE,
                "is_bodyweight": True,
                "default_sets": 3,
                "default_reps": 20,
                "default_duration_seconds": 30,
                "default_rest_seconds": 45,
                "instructions": "From a high plank position, rapidly drive knees toward your chest in alternating fashion with control."
            },
            {
                "name": "Burpees",
                "category": ExerciseCategory.CARDIO,
                "difficulty": ExperienceLevel.INTERMEDIATE,
                "equipment_required": [],
                "target_muscle_group": MuscleGroup.FULL_BODY,
                "is_bodyweight": True,
                "default_sets": 3,
                "default_reps": 8,
                "default_duration_seconds": None,
                "default_rest_seconds": 60,
                "instructions": "Drop into a squat, kick feet back to plank, perform a pushup, jump feet back, and explode upward into a jump."
            },
            {
                "name": "Bicycle Crunch",
                "category": ExerciseCategory.CORE,
                "difficulty": ExperienceLevel.BEGINNER,
                "equipment_required": [],
                "target_muscle_group": MuscleGroup.CORE,
                "is_bodyweight": True,
                "default_sets": 3,
                "default_reps": 16,
                "default_duration_seconds": None,
                "default_rest_seconds": 45,
                "instructions": "Lie on back with hands behind head, alternate touching opposite elbow to opposite knee with controlled torso twist."
            },

            # DUMBBELL
            {
                "name": "Dumbbell Row",
                "category": ExerciseCategory.STRENGTH,
                "difficulty": ExperienceLevel.BEGINNER,
                "equipment_required": ["Dumbbells"],
                "target_muscle_group": MuscleGroup.UPPER_BODY,
                "is_bodyweight": False,
                "default_sets": 3,
                "default_reps": 10,
                "default_duration_seconds": None,
                "default_rest_seconds": 60,
                "instructions": "Hinge forward at the hips with a flat back, pulling dumbbells up toward your ribs while squeezing your shoulder blades."
            },
            {
                "name": "Dumbbell Shoulder Press",
                "category": ExerciseCategory.STRENGTH,
                "difficulty": ExperienceLevel.BEGINNER,
                "equipment_required": ["Dumbbells"],
                "target_muscle_group": MuscleGroup.UPPER_BODY,
                "is_bodyweight": False,
                "default_sets": 3,
                "default_reps": 10,
                "default_duration_seconds": None,
                "default_rest_seconds": 60,
                "instructions": "Hold dumbbells at shoulder height with palms forward. Press overhead until arms are extended, then lower with control."
            },
            {
                "name": "Goblet Squat",
                "category": ExerciseCategory.STRENGTH,
                "difficulty": ExperienceLevel.BEGINNER,
                "equipment_required": ["Dumbbells"],
                "target_muscle_group": MuscleGroup.LOWER_BODY,
                "is_bodyweight": False,
                "default_sets": 3,
                "default_reps": 10,
                "default_duration_seconds": None,
                "default_rest_seconds": 60,
                "instructions": "Hold a single dumbbell vertically against your chest. Squat deeply keeping your chest tall, then push back up."
            },
            {
                "name": "Dumbbell Romanian Deadlift",
                "category": ExerciseCategory.STRENGTH,
                "difficulty": ExperienceLevel.INTERMEDIATE,
                "equipment_required": ["Dumbbells"],
                "target_muscle_group": MuscleGroup.LOWER_BODY,
                "is_bodyweight": False,
                "default_sets": 3,
                "default_reps": 10,
                "default_duration_seconds": None,
                "default_rest_seconds": 60,
                "instructions": "Hold dumbbells in front of thighs. Hinge back at hips with soft knees, lowering weights along shins until hamstrings stretch."
            },
            {
                "name": "Dumbbell Bicep Curl",
                "category": ExerciseCategory.STRENGTH,
                "difficulty": ExperienceLevel.BEGINNER,
                "equipment_required": ["Dumbbells"],
                "target_muscle_group": MuscleGroup.UPPER_BODY,
                "is_bodyweight": False,
                "default_sets": 3,
                "default_reps": 12,
                "default_duration_seconds": None,
                "default_rest_seconds": 45,
                "instructions": "Keep elbows close to torso, curl dumbbells up toward shoulders while contracting biceps, lower smoothly."
            },
            {
                "name": "Dumbbell Lateral Raise",
                "category": ExerciseCategory.STRENGTH,
                "difficulty": ExperienceLevel.BEGINNER,
                "equipment_required": ["Dumbbells"],
                "target_muscle_group": MuscleGroup.UPPER_BODY,
                "is_bodyweight": False,
                "default_sets": 3,
                "default_reps": 12,
                "default_duration_seconds": None,
                "default_rest_seconds": 45,
                "instructions": "Raise dumbbells out to your sides with slight elbow bend until parallel with floor, then slowly lower."
            },
            {
                "name": "Dumbbell Bench Press",
                "category": ExerciseCategory.STRENGTH,
                "difficulty": ExperienceLevel.INTERMEDIATE,
                "equipment_required": ["Dumbbells", "Bench"],
                "target_muscle_group": MuscleGroup.UPPER_BODY,
                "is_bodyweight": False,
                "default_sets": 3,
                "default_reps": 10,
                "default_duration_seconds": None,
                "default_rest_seconds": 75,
                "instructions": "Lie flat on bench holding dumbbells above chest. Lower until elbows reach 90 degrees, then press back up."
            },

            # BARBELL
            {
                "name": "Barbell Squat",
                "category": ExerciseCategory.STRENGTH,
                "difficulty": ExperienceLevel.INTERMEDIATE,
                "equipment_required": ["Barbell"],
                "target_muscle_group": MuscleGroup.LOWER_BODY,
                "is_bodyweight": False,
                "default_sets": 3,
                "default_reps": 8,
                "default_duration_seconds": None,
                "default_rest_seconds": 90,
                "instructions": "Rest barbell across upper traps. Squat down with knees tracking over toes until thighs are parallel, drive back up."
            },
            {
                "name": "Bench Press",
                "category": ExerciseCategory.STRENGTH,
                "difficulty": ExperienceLevel.INTERMEDIATE,
                "equipment_required": ["Barbell", "Bench"],
                "target_muscle_group": MuscleGroup.UPPER_BODY,
                "is_bodyweight": False,
                "default_sets": 3,
                "default_reps": 8,
                "default_duration_seconds": None,
                "default_rest_seconds": 90,
                "instructions": "Lie on bench, grip barbell slightly wider than shoulder width, lower bar to mid-chest and press up powerfully."
            },
            {
                "name": "Deadlift",
                "category": ExerciseCategory.STRENGTH,
                "difficulty": ExperienceLevel.ADVANCED,
                "equipment_required": ["Barbell"],
                "target_muscle_group": MuscleGroup.LOWER_BODY,
                "is_bodyweight": False,
                "default_sets": 3,
                "default_reps": 5,
                "default_duration_seconds": None,
                "default_rest_seconds": 120,
                "instructions": "Stand with feet hip-width apart. Grip barbell, brace core, drive through floor while keeping back flat to lockout."
            },
            {
                "name": "Barbell Row",
                "category": ExerciseCategory.STRENGTH,
                "difficulty": ExperienceLevel.INTERMEDIATE,
                "equipment_required": ["Barbell"],
                "target_muscle_group": MuscleGroup.UPPER_BODY,
                "is_bodyweight": False,
                "default_sets": 3,
                "default_reps": 8,
                "default_duration_seconds": None,
                "default_rest_seconds": 75,
                "instructions": "Hinge at hips holding bar with overhand grip, pull barbell to lower abdomen and lower under control."
            },
            {
                "name": "Overhead Press",
                "category": ExerciseCategory.STRENGTH,
                "difficulty": ExperienceLevel.INTERMEDIATE,
                "equipment_required": ["Barbell"],
                "target_muscle_group": MuscleGroup.UPPER_BODY,
                "is_bodyweight": False,
                "default_sets": 3,
                "default_reps": 8,
                "default_duration_seconds": None,
                "default_rest_seconds": 90,
                "instructions": "Hold barbell at clavicle level, squeeze glutes and core, press bar straight overhead to full lockout."
            },

            # RESISTANCE BANDS
            {
                "name": "Band Row",
                "category": ExerciseCategory.STRENGTH,
                "difficulty": ExperienceLevel.BEGINNER,
                "equipment_required": ["Resistance Bands"],
                "target_muscle_group": MuscleGroup.UPPER_BODY,
                "is_bodyweight": False,
                "default_sets": 3,
                "default_reps": 12,
                "default_duration_seconds": None,
                "default_rest_seconds": 45,
                "instructions": "Anchor resistance band, pull handles toward hips while squeezing back musculature."
            },
            {
                "name": "Band Chest Press",
                "category": ExerciseCategory.STRENGTH,
                "difficulty": ExperienceLevel.BEGINNER,
                "equipment_required": ["Resistance Bands"],
                "target_muscle_group": MuscleGroup.UPPER_BODY,
                "is_bodyweight": False,
                "default_sets": 3,
                "default_reps": 12,
                "default_duration_seconds": None,
                "default_rest_seconds": 45,
                "instructions": "Wrap band behind upper back, press handles forward at chest level until arms are straight."
            },
            {
                "name": "Band Squat",
                "category": ExerciseCategory.STRENGTH,
                "difficulty": ExperienceLevel.BEGINNER,
                "equipment_required": ["Resistance Bands"],
                "target_muscle_group": MuscleGroup.LOWER_BODY,
                "is_bodyweight": False,
                "default_sets": 3,
                "default_reps": 12,
                "default_duration_seconds": None,
                "default_rest_seconds": 45,
                "instructions": "Stand on loop band holding top of band at shoulders, squat down and drive up against increasing tension."
            },
            {
                "name": "Band Curl",
                "category": ExerciseCategory.STRENGTH,
                "difficulty": ExperienceLevel.BEGINNER,
                "equipment_required": ["Resistance Bands"],
                "target_muscle_group": MuscleGroup.UPPER_BODY,
                "is_bodyweight": False,
                "default_sets": 3,
                "default_reps": 15,
                "default_duration_seconds": None,
                "default_rest_seconds": 45,
                "instructions": "Stand on center of band, curl handles up toward chest keeping elbows pinned to sides."
            },
            {
                "name": "Band Pull Apart",
                "category": ExerciseCategory.STRENGTH,
                "difficulty": ExperienceLevel.BEGINNER,
                "equipment_required": ["Resistance Bands"],
                "target_muscle_group": MuscleGroup.UPPER_BODY,
                "is_bodyweight": False,
                "default_sets": 3,
                "default_reps": 15,
                "default_duration_seconds": None,
                "default_rest_seconds": 30,
                "instructions": "Hold band with arms extended forward, pull band apart horizontally until it touches chest to activate rear delts."
            },

            # MACHINES
            {
                "name": "Leg Press",
                "category": ExerciseCategory.STRENGTH,
                "difficulty": ExperienceLevel.BEGINNER,
                "equipment_required": ["Machines"],
                "target_muscle_group": MuscleGroup.LOWER_BODY,
                "is_bodyweight": False,
                "default_sets": 3,
                "default_reps": 10,
                "default_duration_seconds": None,
                "default_rest_seconds": 75,
                "instructions": "Sit in machine with feet shoulder-width on sled, lower weight until knees reach 90 degrees, press through heels."
            },
            {
                "name": "Lat Pulldown",
                "category": ExerciseCategory.STRENGTH,
                "difficulty": ExperienceLevel.BEGINNER,
                "equipment_required": ["Cable Machine"],
                "target_muscle_group": MuscleGroup.UPPER_BODY,
                "is_bodyweight": False,
                "default_sets": 3,
                "default_reps": 10,
                "default_duration_seconds": None,
                "default_rest_seconds": 60,
                "instructions": "Grip wide bar, sit upright, pull bar smoothly down to upper chest while driving elbows down."
            },
            {
                "name": "Chest Press Machine",
                "category": ExerciseCategory.STRENGTH,
                "difficulty": ExperienceLevel.BEGINNER,
                "equipment_required": ["Machines"],
                "target_muscle_group": MuscleGroup.UPPER_BODY,
                "is_bodyweight": False,
                "default_sets": 3,
                "default_reps": 10,
                "default_duration_seconds": None,
                "default_rest_seconds": 60,
                "instructions": "Adjust seat so handles align with mid-chest, press handles forward smoothly, return under control."
            },
            {
                "name": "Seated Row",
                "category": ExerciseCategory.STRENGTH,
                "difficulty": ExperienceLevel.BEGINNER,
                "equipment_required": ["Cable Machine"],
                "target_muscle_group": MuscleGroup.UPPER_BODY,
                "is_bodyweight": False,
                "default_sets": 3,
                "default_reps": 10,
                "default_duration_seconds": None,
                "default_rest_seconds": 60,
                "instructions": "Sit with knees slightly bent, pull cable attachment toward abdomen while keeping torso upright."
            },
            {
                "name": "Leg Curl",
                "category": ExerciseCategory.STRENGTH,
                "difficulty": ExperienceLevel.BEGINNER,
                "equipment_required": ["Machines"],
                "target_muscle_group": MuscleGroup.LOWER_BODY,
                "is_bodyweight": False,
                "default_sets": 3,
                "default_reps": 12,
                "default_duration_seconds": None,
                "default_rest_seconds": 60,
                "instructions": "Position legs under pad, curl heels up toward glutes focusing on hamstring contraction."
            },

            # CARDIO
            {
                "name": "Walking",
                "category": ExerciseCategory.CARDIO,
                "difficulty": ExperienceLevel.BEGINNER,
                "equipment_required": [],
                "target_muscle_group": MuscleGroup.CARDIO,
                "is_bodyweight": True,
                "default_sets": 1,
                "default_reps": None,
                "default_duration_seconds": 900,
                "default_rest_seconds": 0,
                "instructions": "Brisk aerobic walking maintaining consistent pace and posture."
            },
            {
                "name": "Jogging",
                "category": ExerciseCategory.CARDIO,
                "difficulty": ExperienceLevel.BEGINNER,
                "equipment_required": [],
                "target_muscle_group": MuscleGroup.CARDIO,
                "is_bodyweight": True,
                "default_sets": 1,
                "default_reps": None,
                "default_duration_seconds": 1200,
                "default_rest_seconds": 0,
                "instructions": "Steady-state aerobic jogging with controlled rhythmic breathing."
            },
            {
                "name": "Treadmill Walk",
                "category": ExerciseCategory.CARDIO,
                "difficulty": ExperienceLevel.BEGINNER,
                "equipment_required": ["Treadmill"],
                "target_muscle_group": MuscleGroup.CARDIO,
                "is_bodyweight": True,
                "default_sets": 1,
                "default_reps": None,
                "default_duration_seconds": 1200,
                "default_rest_seconds": 0,
                "instructions": "Walk on treadmill at moderate incline and brisk pace."
            },
            {
                "name": "Stationary Bike",
                "category": ExerciseCategory.CARDIO,
                "difficulty": ExperienceLevel.BEGINNER,
                "equipment_required": ["Exercise Bike"],
                "target_muscle_group": MuscleGroup.CARDIO,
                "is_bodyweight": False,
                "default_sets": 1,
                "default_reps": None,
                "default_duration_seconds": 1200,
                "default_rest_seconds": 0,
                "instructions": "Low-impact cycling maintaining 70-90 RPM with steady resistance."
            },
        ]

        created_count = 0
        updated_count = 0

        for ex_data in exercises:
            name = ex_data.pop("name")
            obj, created = Exercise.objects.update_or_create(
                name=name,
                defaults=ex_data
            )
            if created:
                created_count += 1
            else:
                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully seeded database: {created_count} created, {updated_count} updated ({len(exercises)} total exercises)."
            )
        )
