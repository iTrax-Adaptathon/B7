from django.test import TestCase
from django.contrib.auth.models import User
from fitness.models import Profile, Exercise, WorkoutSession, ExerciseLog, AdaptationDecision
from fitness.engine import AdaptationEngine

class AdaptiveEngineTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='adapt_user', password='pass')
        self.profile = Profile.objects.create(user=self.user, name='Adapt User', days_per_week=3)
        self.exercise = Exercise.objects.create(name='Adapt Bench Press', is_bodyweight=False)

    def test_strong_performance_yields_progress(self):
        session = WorkoutSession.objects.create(
            user=self.user,
            workout_name='Test Push Day',
            difficulty_rating=3, # Moderate
            energy_rating=5,     # Excellent
            recovery_rating=5,   # Excellent
        )
        ExerciseLog.objects.create(
            session=session,
            exercise=self.exercise,
            planned_sets=3, planned_reps=10, planned_weight=50.0,
            actual_sets=3, actual_reps=10, actual_weight=50.0,
            rpe=7.0
        )

        eval_res = AdaptationEngine.evaluate_user_session(self.user, session)
        self.assertEqual(eval_res['decision'], AdaptationDecision.PROGRESS)
        self.assertGreaterEqual(eval_res['adaptation_score'], 70.0)
        self.assertIn('strong target repetition completion', eval_res['explanation'])

    def test_poor_performance_yields_back_off(self):
        session = WorkoutSession.objects.create(
            user=self.user,
            workout_name='Exhausted Day',
            difficulty_rating=5, # Very Hard
            energy_rating=1,     # Very Low
            recovery_rating=1,   # Very Poor
        )
        ExerciseLog.objects.create(
            session=session,
            exercise=self.exercise,
            planned_sets=3, planned_reps=10, planned_weight=50.0,
            actual_sets=1, actual_reps=5, actual_weight=40.0,
            rpe=10.0
        )

        eval_res = AdaptationEngine.evaluate_user_session(self.user, session)
        self.assertEqual(eval_res['decision'], AdaptationDecision.BACK_OFF)
        self.assertLess(eval_res['adaptation_score'], 45.0)

    def test_safety_override_triggered(self):
        # Reps completed, but difficulty 5 and recovery 1 triggers safety override
        session = WorkoutSession.objects.create(
            user=self.user,
            workout_name='Overexertion Day',
            difficulty_rating=5, # Very Hard
            energy_rating=1,
            recovery_rating=1,   # Very Poor
        )
        ExerciseLog.objects.create(
            session=session,
            exercise=self.exercise,
            planned_sets=3, planned_reps=10, planned_weight=50.0,
            actual_sets=3, actual_reps=10, actual_weight=50.0,
            rpe=9.5
        )

        eval_res = AdaptationEngine.evaluate_user_session(self.user, session)
        # Should NOT be PROGRESS due to safety override
        self.assertNotEqual(eval_res['decision'], AdaptationDecision.PROGRESS)
        self.assertIn('Safety override', eval_res['explanation'])
