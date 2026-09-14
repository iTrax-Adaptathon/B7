from django.test import TestCase
from django.contrib.auth.models import User
from fitness.models import Profile, Exercise, ExerciseCategory, ExperienceLevel, MuscleGroup
from fitness.engine import WorkoutGenerator

class EquipmentFilteringTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='equip_tester', password='pass')
        self.profile = Profile.objects.create(user=self.user, name='Equip Tester')

        # Create test exercises with different equipment requirements
        self.pushup = Exercise.objects.create(
            name='Test Push-up',
            category=ExerciseCategory.STRENGTH,
            is_bodyweight=True,
            equipment_required=[]
        )
        self.squat = Exercise.objects.create(
            name='Test Bodyweight Squat',
            category=ExerciseCategory.STRENGTH,
            is_bodyweight=True,
            equipment_required=[]
        )
        self.db_row = Exercise.objects.create(
            name='Test Dumbbell Row',
            category=ExerciseCategory.STRENGTH,
            is_bodyweight=False,
            equipment_required=['Dumbbells']
        )
        self.db_bench = Exercise.objects.create(
            name='Test Dumbbell Bench Press',
            category=ExerciseCategory.STRENGTH,
            is_bodyweight=False,
            equipment_required=['Dumbbells', 'Bench']
        )
        self.bb_squat = Exercise.objects.create(
            name='Test Barbell Squat',
            category=ExerciseCategory.STRENGTH,
            is_bodyweight=False,
            equipment_required=['Barbell']
        )
        self.machine_press = Exercise.objects.create(
            name='Test Leg Press Machine',
            category=ExerciseCategory.STRENGTH,
            is_bodyweight=False,
            equipment_required=['Machines']
        )

    def test_no_equipment_filter(self):
        self.profile.equipment = ['No Equipment']
        self.profile.gym_access = False
        self.profile.save()

        compatible = list(WorkoutGenerator.get_compatible_exercises(self.user))
        comp_names = [e.name for e in compatible]

        self.assertIn('Test Push-up', comp_names)
        self.assertIn('Test Bodyweight Squat', comp_names)
        self.assertNotIn('Test Dumbbell Row', comp_names)
        self.assertNotIn('Test Barbell Squat', comp_names)
        self.assertNotIn('Test Leg Press Machine', comp_names)

    def test_dumbbells_only_filter(self):
        self.profile.equipment = ['Dumbbells']
        self.profile.gym_access = False
        self.profile.save()

        compatible = list(WorkoutGenerator.get_compatible_exercises(self.user))
        comp_names = [e.name for e in compatible]

        self.assertIn('Test Push-up', comp_names)
        self.assertIn('Test Dumbbell Row', comp_names)
        self.assertNotIn('Test Dumbbell Bench Press', comp_names) # needs bench
        self.assertNotIn('Test Barbell Squat', comp_names)
        self.assertNotIn('Test Leg Press Machine', comp_names)

    def test_dumbbells_and_bench_filter(self):
        self.profile.equipment = ['Dumbbells', 'Bench']
        self.profile.gym_access = False
        self.profile.save()

        compatible = list(WorkoutGenerator.get_compatible_exercises(self.user))
        comp_names = [e.name for e in compatible]

        self.assertIn('Test Push-up', comp_names)
        self.assertIn('Test Dumbbell Row', comp_names)
        self.assertIn('Test Dumbbell Bench Press', comp_names)
        self.assertNotIn('Test Barbell Squat', comp_names)

    def test_gym_access_allows_all(self):
        self.profile.equipment = []
        self.profile.gym_access = True
        self.profile.save()

        compatible = list(WorkoutGenerator.get_compatible_exercises(self.user))
        self.assertEqual(len(compatible), 6)
