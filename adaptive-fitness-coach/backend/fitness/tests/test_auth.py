from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = '/api/auth/register/'
        self.login_url = '/api/auth/login/'
        self.refresh_url = '/api/auth/refresh/'
        self.profile_url = '/api/profile/'

    def test_user_registration(self):
        payload = {
            'username': 'john_doe',
            'email': 'john@example.com',
            'password': 'StrongPassword123!',
            'name': 'John Doe'
        }
        response = self.client.post(self.register_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertTrue(User.objects.filter(username='john_doe').exists())
        user = User.objects.get(username='john_doe')
        self.assertEqual(user.profile.name, 'John Doe')

    def test_user_login(self):
        User.objects.create_user(username='jane_doe', password='SecretPassword123!')
        payload = {
            'username': 'jane_doe',
            'password': 'SecretPassword123!'
        }
        response = self.client.post(self.login_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_token_refresh(self):
        user = User.objects.create_user(username='test_refresh', password='SecretPassword123!')
        login_res = self.client.post(self.login_url, {
            'username': 'test_refresh',
            'password': 'SecretPassword123!'
        }, format='json')
        refresh_token = login_res.data['refresh']

        res = self.client.post(self.refresh_url, {'refresh': refresh_token}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('access', res.data)

    def test_protected_endpoint_without_token(self):
        res = self.client.get(self.profile_url)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
