from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from fitness.models import Profile, WorkoutPlan, WorkoutSession, AdaptationResult

class UserIsolationTests(TestCase):
    def setUp(self):
        # Create User A
        self.user_a = User.objects.create_user(username='user_a', password='passwordA123')
        self.profile_a = Profile.objects.create(user=self.user_a, name='User Alpha')
        self.plan_a = WorkoutPlan.objects.create(user=self.user_a, name="Alpha's Plan", focus="Strength")
        self.session_a = WorkoutSession.objects.create(user=self.user_a, workout_name="Alpha's Session", difficulty_rating=3, energy_rating=3, recovery_rating=3)
        self.adapt_a = AdaptationResult.objects.create(user=self.user_a, workout_session=self.session_a, adaptation_score=80.0, explanation="Alpha only")

        # Create User B
        self.user_b = User.objects.create_user(username='user_b', password='passwordB123')
        self.profile_b = Profile.objects.create(user=self.user_b, name='User Beta')

        self.client = APIClient()

    def test_user_b_cannot_view_user_a_profile(self):
        self.client.force_authenticate(user=self.user_b)
        res = self.client.get('/api/profile/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # Should return User B's profile, never User A
        self.assertEqual(res.data['name'], 'User Beta')
        self.assertNotEqual(res.data['name'], 'User Alpha')

    def test_user_b_cannot_access_user_a_workouts(self):
        self.client.force_authenticate(user=self.user_b)
        res = self.client.get('/api/workouts/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # Should be empty for User B
        self.assertEqual(len(res.data), 0)

        # Attempting direct access to User A's workout plan ID returns 404
        detail_res = self.client.get(f'/api/workouts/{self.plan_a.id}/')
        self.assertEqual(detail_res.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_b_cannot_access_user_a_logs_or_adaptation(self):
        self.client.force_authenticate(user=self.user_b)
        logs_res = self.client.get('/api/logs/')
        self.assertEqual(logs_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(logs_res.data), 0)

        history_res = self.client.get('/api/history/')
        self.assertEqual(history_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(history_res.data), 0)
