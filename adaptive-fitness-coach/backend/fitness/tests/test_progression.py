from django.test import TestCase
from fitness.engine.progression import calculate_next_weight, calculate_bodyweight_progression

class ProgressionTests(TestCase):
    def test_fixed_weight_progression(self):
        # 20kg + 2.5kg = 22.5kg
        res = calculate_next_weight(current_weight=20.0, method='FIXED', value=2.5, decision='PROGRESS')
        self.assertEqual(res, 22.5)

        # 40kg + 5.0kg = 45.0kg
        res5 = calculate_next_weight(current_weight=40.0, method='FIXED', value=5.0, decision='PROGRESS')
        self.assertEqual(res5, 45.0)

        # 20kg HOLD = 20.0kg
        res_hold = calculate_next_weight(current_weight=20.0, method='FIXED', value=2.5, decision='HOLD')
        self.assertEqual(res_hold, 20.0)

        # 20kg BACK_OFF with 2.5 step = 17.5kg
        res_back = calculate_next_weight(current_weight=20.0, method='FIXED', value=2.5, decision='BACK_OFF')
        self.assertEqual(res_back, 17.5)

    def test_percentage_weight_progression(self):
        # 40kg with +5% = 42.0kg
        res = calculate_next_weight(current_weight=40.0, method='PERCENTAGE', value=5.0, decision='PROGRESS')
        self.assertEqual(res, 42.0)

        # 50kg with +2.5% = 51.25 -> rounded to 51.5kg (step 0.5)
        res_perc = calculate_next_weight(current_weight=50.0, method='PERCENTAGE', value=2.5, decision='PROGRESS')
        self.assertEqual(res_perc, 51.5)

    def test_weight_never_negative(self):
        res = calculate_next_weight(current_weight=1.0, method='FIXED', value=5.0, decision='BACK_OFF')
        self.assertGreaterEqual(res, 0.0)

    def test_bodyweight_progression(self):
        # Rep progression
        bw_prog = calculate_bodyweight_progression(current_sets=3, current_reps=10, current_duration=None, decision='PROGRESS')
        self.assertEqual(bw_prog['target_sets'], 3)
        self.assertEqual(bw_prog['target_reps'], 12)

        # Duration progression (e.g. Plank 30s -> 35s)
        plank_prog = calculate_bodyweight_progression(current_sets=3, current_reps=None, current_duration=30, decision='PROGRESS')
        self.assertEqual(plank_prog['target_duration_seconds'], 35)

        # Back off rep reduction
        bw_back = calculate_bodyweight_progression(current_sets=3, current_reps=10, current_duration=None, decision='BACK_OFF')
        self.assertEqual(bw_back['target_reps'], 8)
