from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from fitness.models import Exercise

class ValidationTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='val_user', password='password123')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.exercise = Exercise.objects.create(name='Val Push-up', is_bodyweight=True)
        self.logs_url = '/api/logs/'

    def test_reject_negative_weight_or_reps(self):
        payload = {
            'workout_name': 'Invalid Workout',
            'difficulty_rating': 3,
            'energy_rating': 3,
            'recovery_rating': 3,
            'exercises': [
                {
                    'exercise_id': self.exercise.id,
                    'actual_sets': 3,
                    'actual_reps': -5, # invalid
                    'actual_weight': -10.0 # invalid
                }
            ]
        }
        res = self.client.post(self.logs_url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_reject_invalid_rpe_bounds(self):
        payload = {
            'workout_name': 'Invalid RPE',
            'difficulty_rating': 3,
            'energy_rating': 3,
            'recovery_rating': 3,
            'exercises': [
                {
                    'exercise_id': self.exercise.id,
                    'actual_sets': 3,
                    'actual_reps': 10,
                    'rpe': 15.0 # invalid (max 10)
                }
            ]
        }
        res = self.client.post(self.logs_url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_reject_invalid_difficulty_bounds(self):
        payload = {
            'workout_name': 'Invalid Difficulty',
            'difficulty_rating': 6, # invalid (1-5)
            'energy_rating': 3,
            'recovery_rating': 3,
            'exercises': []
        }
        res = self.client.post(self.logs_url, payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
