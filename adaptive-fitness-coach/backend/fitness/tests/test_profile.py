from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from fitness.models import Profile, FitnessGoal, ProgressionMethod, ExperienceLevel

class ProfileTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='profile_user', password='password123')
        self.profile = Profile.objects.create(user=self.user, name='Profile User')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.profile_url = '/api/profile/'

    def test_get_profile(self):
        res = self.client.get(self.profile_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['name'], 'Profile User')
        self.assertEqual(res.data['onboarding_completed'], False)

    def test_update_profile_and_onboarding(self):
        payload = {
            'name': 'Alex Johnson',
            'age': 28,
            'height': 178.0,
            'weight': 74.5,
            'experience': ExperienceLevel.INTERMEDIATE,
            'fitness_goal': FitnessGoal.BUILD_STRENGTH,
            'focus_areas': ['Upper Body', 'Core'],
            'equipment': ['Dumbbells', 'Bench'],
            'gym_access': False,
            'days_per_week': 4,
            'workout_duration': 45,
            'progression_method': ProgressionMethod.FIXED,
            'progression_value': 2.5,
            'onboarding_completed': True
        }
        res = self.client.patch(self.profile_url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['name'], 'Alex Johnson')
        self.assertEqual(res.data['days_per_week'], 4)
        self.assertEqual(res.data['onboarding_completed'], True)

        self.profile.refresh_from_db()
        self.assertEqual(self.profile.age, 28)
        self.assertEqual(self.profile.equipment, ['Dumbbells', 'Bench'])

    def test_invalid_profile_values(self):
        res = self.client.patch(self.profile_url, {'age': 150}, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

        res = self.client.patch(self.profile_url, {'days_per_week': 10}, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
