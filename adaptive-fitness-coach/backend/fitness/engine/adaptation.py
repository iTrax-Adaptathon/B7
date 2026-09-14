from datetime import timedelta
from django.utils import timezone
from fitness.models import WorkoutSession, ExerciseLog, AdaptationResult, AdaptationDecision

class AdaptationEngine:
    """
    Multi-signal Adaptive Engine analyzing rolling history of 3-5 recent workout sessions
    to compute a transparent adaptation score (0-100), decision (PROGRESS, HOLD, BACK_OFF),
    safety overrides, and personalized data-driven explanations.
    """

    @classmethod
    def evaluate_user_session(cls, user, current_session=None):
        """
        Main entrypoint: analyzes recent sessions for the given user, evaluates scores,
        applies safety overrides, generates human-readable narrative, and returns structured result.
        """
        # Fetch rolling history of the most recent 5 completed sessions
        recent_sessions = list(
            WorkoutSession.objects.filter(user=user)
            .order_by('-started_at')[:5]
        )

        if not recent_sessions and not current_session:
            # First-time user with no history -> standard neutral baseline
            return {
                'adaptation_score': 75.0,
                'decision': AdaptationDecision.PROGRESS,
                'performance_component': 80.0,
                'rep_completion_component': 85.0,
                'rpe_difficulty_component': 75.0,
                'recovery_component': 80.0,
                'consistency_component': 80.0,
                'explanation': "Baseline session initialized. Complete your workout to begin personalized adaptation.",
            }

        # Use current session as primary if provided
        primary_session = current_session or recent_sessions[0]
        sessions_to_analyze = recent_sessions if recent_sessions else [primary_session]

        # 1. Performance Trend (30%)
        performance_comp = cls._calculate_performance_trend(sessions_to_analyze)

        # 2. Rep & Set Completion (20%)
        rep_comp = cls._calculate_rep_completion(sessions_to_analyze)

        # 3. RPE & Perceived Difficulty (20%)
        rpe_diff_comp = cls._calculate_rpe_difficulty(sessions_to_analyze)

        # 4. Recovery & Energy (20%)
        recovery_comp = cls._calculate_recovery_energy(sessions_to_analyze)

        # 5. Consistency (10%)
        consistency_comp = cls._calculate_consistency(user, sessions_to_analyze)

        # Weighted combination: 30% + 20% + 20% + 20% + 10%
        raw_score = (
            (0.30 * performance_comp) +
            (0.20 * rep_comp) +
            (0.20 * rpe_diff_comp) +
            (0.20 * recovery_comp) +
            (0.10 * consistency_comp)
        )
        adaptation_score = round(max(0.0, min(100.0, raw_score)), 1)

        # Determine preliminary decision based on thresholds
        if adaptation_score >= 70.0:
            decision = AdaptationDecision.PROGRESS
        elif adaptation_score >= 45.0:
            decision = AdaptationDecision.HOLD
        else:
            decision = AdaptationDecision.BACK_OFF

        # Safety Overrides Check
        decision, safety_triggered, safety_note = cls._apply_safety_overrides(
            decision, primary_session, sessions_to_analyze
        )

        # Generate contextual, data-driven explanation
        explanation = cls._generate_explanation(
            decision,
            adaptation_score,
            performance_comp,
            rep_comp,
            rpe_diff_comp,
            recovery_comp,
            consistency_comp,
            safety_triggered,
            safety_note
        )

        return {
            'adaptation_score': adaptation_score,
            'decision': decision,
            'performance_component': round(performance_comp, 1),
            'rep_completion_component': round(rep_comp, 1),
            'rpe_difficulty_component': round(rpe_diff_comp, 1),
            'recovery_component': round(recovery_comp, 1),
            'consistency_component': round(consistency_comp, 1),
            'explanation': explanation,
        }

    @classmethod
    def _calculate_performance_trend(cls, sessions):
        """
        Calculates performance volume trend across exercises: actual weight & reps vs planned.
        """
        total_ratio_sum = 0.0
        total_logs = 0

        for session in sessions:
            logs = session.exercise_logs.all()
            for log in logs:
                total_logs += 1
                # Weight ratio
                w_ratio = 1.0
                if log.planned_weight and log.planned_weight > 0:
                    act_w = log.actual_weight if log.actual_weight is not None else log.planned_weight
                    w_ratio = min(1.3, act_w / log.planned_weight)

                # Rep ratio
                r_ratio = 1.0
                if log.planned_reps and log.planned_reps > 0:
                    act_r = log.actual_reps if log.actual_reps is not None else log.planned_reps
                    r_ratio = min(1.3, act_r / log.planned_reps)

                combined_ratio = (w_ratio * 0.5) + (r_ratio * 0.5)
                total_ratio_sum += combined_ratio

        if total_logs == 0:
            return 75.0

        avg_ratio = total_ratio_sum / total_logs
        # Map 1.0 ratio -> 80 points, 1.15 -> 100 points, 0.8 -> 50 points, 0.5 -> 20 points
        score = 80.0 + (avg_ratio - 1.0) * 120.0
        return max(0.0, min(100.0, score))

    @classmethod
    def _calculate_rep_completion(cls, sessions):
        """
        Calculates percentage of target sets/reps completed without missing or cutting short.
        """
        completed_sets = 0
        planned_sets = 0

        for session in sessions:
            logs = session.exercise_logs.all()
            for log in logs:
                p_sets = log.planned_sets or 3
                a_sets = log.actual_sets if log.actual_sets is not None else p_sets
                planned_sets += p_sets
                completed_sets += min(p_sets, a_sets)

        if planned_sets == 0:
            return 80.0

        completion_ratio = completed_sets / planned_sets
        return max(0.0, min(100.0, completion_ratio * 100.0))

    @classmethod
    def _calculate_rpe_difficulty(cls, sessions):
        """
        Normalizes workout difficulty (1-5) and exercise RPE (1-10) to a 0-100 score.
        Optimal adaptive zone: difficulty 3 (Moderate) or RPE 6-7 -> ~75-85 score.
        Max difficulty 5 or RPE 10 -> low headroom for progression -> ~20-35 score.
        Very easy difficulty 1-2 or RPE 3-5 -> high headroom -> 90-100 score.
        """
        diff_scores = []
        rpe_scores = []

        for session in sessions:
            if session.difficulty_rating is not None:
                # 1 -> 95, 2 -> 90, 3 -> 75, 4 -> 50, 5 -> 25
                d_map = {1: 95.0, 2: 90.0, 3: 75.0, 4: 50.0, 5: 25.0}
                diff_scores.append(d_map.get(session.difficulty_rating, 75.0))

            logs = session.exercise_logs.all()
            for log in logs:
                if log.rpe is not None:
                    # 1-6 -> 90, 7 -> 80, 8 -> 70, 9 -> 45, 10 -> 20
                    if log.rpe <= 6:
                        rpe_score = 90.0
                    elif log.rpe <= 7.5:
                        rpe_score = 80.0 - (log.rpe - 6.0) * 10.0
                    elif log.rpe <= 9.0:
                        rpe_score = 65.0 - (log.rpe - 7.5) * 20.0
                    else:
                        rpe_score = max(10.0, 35.0 - (log.rpe - 9.0) * 25.0)
                    rpe_scores.append(rpe_score)

        scores = diff_scores + rpe_scores
        if not scores:
            return 75.0

        return sum(scores) / len(scores)

    @classmethod
    def _calculate_recovery_energy(cls, sessions):
        """
        Averages perceived recovery rating (1-5) and energy rating (1-5) to 0-100.
        5 (Excellent) -> 100, 4 (Good) -> 80, 3 (Moderate) -> 60, 2 (Poor) -> 40, 1 (Very Poor) -> 20.
        """
        values = []
        for session in sessions:
            if session.recovery_rating is not None:
                values.append(session.recovery_rating * 20.0)
            if session.energy_rating is not None:
                values.append(session.energy_rating * 20.0)

        if not values:
            return 75.0

        return sum(values) / len(values)

    @classmethod
    def _calculate_consistency(cls, user, sessions):
        """
        Calculates consistency score based on recent workout frequency vs user target days_per_week.
        """
        target_days = 3
        if hasattr(user, 'profile') and user.profile.days_per_week:
            target_days = user.profile.days_per_week

        # Check workouts completed in last 14 days
        cutoff = timezone.now() - timedelta(days=14)
        count_14d = WorkoutSession.objects.filter(user=user, started_at__gte=cutoff).count()

        # Expected in 14 days = target_days * 2
        expected = max(1, target_days * 2)
        ratio = min(1.2, count_14d / expected)
        score = ratio * 85.0
        return max(20.0, min(100.0, score))

    @classmethod
    def _apply_safety_overrides(cls, decision, primary_session, recent_sessions):
        """
        Enforces conservative safety checks:
        - If perceived difficulty is 5 (Very Hard) AND recovery is <= 2 (Poor/Very Poor),
          override PROGRESS to HOLD or BACK_OFF.
        - If recent 2 sessions both had difficulty 5 and recovery <= 2, force BACK_OFF.
        """
        diff = primary_session.difficulty_rating
        rec = primary_session.recovery_rating

        if diff == 5 and rec is not None and rec <= 2:
            if decision == AdaptationDecision.PROGRESS:
                return (
                    AdaptationDecision.HOLD,
                    True,
                    "Safety override applied: Workload felt maximum while recovery readiness is low. Progression paused to avoid overtraining."
                )
            elif decision == AdaptationDecision.HOLD:
                return (
                    AdaptationDecision.BACK_OFF,
                    True,
                    "Safety override applied: High exertion combined with low recovery requires a restorative deload session."
                )

        # Check for multi-session strain
        severe_strain_count = sum(
            1 for s in recent_sessions[:2]
            if s.difficulty_rating == 5 and (s.recovery_rating and s.recovery_rating <= 2)
        )
        if severe_strain_count >= 2:
            return (
                AdaptationDecision.BACK_OFF,
                True,
                "Multi-session fatigue detected. Decreasing target volume and intensity to support muscle recovery."
            )

        return decision, False, ""

    @classmethod
    def _generate_explanation(cls, decision, score, perf, reps, rpe_diff, rec, const, safety_triggered, safety_note):
        """
        Generates transparent, personalized narrative grounded directly in the user's logged metrics.
        """
        if safety_triggered and safety_note:
            return safety_note

        if decision == AdaptationDecision.PROGRESS:
            reasons = []
            if reps >= 80:
                reasons.append("strong target repetition completion")
            if perf >= 75:
                reasons.append("solid performance execution")
            if rec >= 65:
                reasons.append("healthy recovery readiness")
            if rpe_diff >= 65:
                reasons.append("manageable exertion levels")
            
            joined = ", ".join(reasons) if reasons else "positive overall training indicators"
            return (
                f"Your recent performance shows {joined} (Adaptation Score: {score}/100). "
                f"The engine is advancing your target parameters for the next workout."
            )

        elif decision == AdaptationDecision.HOLD:
            reasons = []
            if rec < 60:
                reasons.append("moderate recovery levels suggest building more adaptation capacity")
            elif rpe_diff < 60:
                reasons.append("elevated exertion ratings indicate your current load is challenging")
            elif perf < 70:
                reasons.append("performance is consolidating at your current working weights")
            else:
                reasons.append("steady performance indicates maintaining current targets is optimal")

            joined = " and ".join(reasons)
            return (
                f"Your performance is consistent, but {joined} (Adaptation Score: {score}/100). "
                f"Maintaining current workload for another session before progressing."
            )

        else: # BACK_OFF
            reasons = []
            if rec <= 45:
                reasons.append("fatigue/recovery scores indicate the need for restoration")
            if rpe_diff <= 45:
                reasons.append("perceived difficulty was very high")
            if reps < 70:
                reasons.append("repetition completion fell below target threshold")
            
            joined = " and ".join(reasons) if reasons else "accumulated fatigue indicators"
            return (
                f"Recent indicators show {joined} (Adaptation Score: {score}/100). "
                f"The next session adjusts targets down conservatively to allow your body to rebuild."
            )
