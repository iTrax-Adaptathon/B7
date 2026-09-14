import math

def round_to_increment(value, step=0.5):
    """
    Rounds a weight value to the nearest practical equipment increment (default 0.5 kg).
    """
    if step <= 0:
        step = 0.5
    return round(round(value / step) * step, 2)


def calculate_next_weight(current_weight, method='FIXED', value=2.5, decision='PROGRESS'):
    """
    Calculates the next target weight based on user's progression settings and engine decision.
    
    Parameters:
    - current_weight (float): Current working weight in kg.
    - method (str): 'FIXED' or 'PERCENTAGE'.
    - value (float): Increment value (e.g. 1.25, 2.5, 5.0 kg or 2.5, 5.0, 7.5 %).
    - decision (str): 'PROGRESS', 'HOLD', or 'BACK_OFF'.
    
    Returns:
    - float: Recommended next weight in kg, never below 0.
    """
    if current_weight is None or current_weight <= 0:
        # Default starting weight if none existed
        return 10.0 if method == 'FIXED' else 10.0

    if decision == 'HOLD':
        return round_to_increment(current_weight)

    if decision == 'PROGRESS':
        if method == 'PERCENTAGE':
            # e.g. 40kg * (1 + 5 / 100) = 42kg
            perc = max(0.5, min(float(value), 15.0))
            raw_next = current_weight * (1.0 + (perc / 100.0))
        else: # FIXED
            # e.g. 20kg + 2.5kg = 22.5kg
            inc = max(0.25, min(float(value), 10.0))
            raw_next = current_weight + inc

        result = round_to_increment(raw_next)
        # Ensure at least minimum progression of 0.5kg if raw_next rounded to same
        if result <= current_weight:
            result = round_to_increment(current_weight + 0.5)
        return max(0.0, result)

    elif decision == 'BACK_OFF':
        # Safely reduce load by ~5% to 10% or by standard fixed step
        if method == 'PERCENTAGE':
            perc = max(5.0, min(float(value), 10.0))
            raw_next = current_weight * (1.0 - (perc / 100.0))
        else: # FIXED
            inc = max(1.25, min(float(value), 5.0))
            raw_next = current_weight - inc

        result = round_to_increment(raw_next)
        # Never drop below 0; if result is 0 or less, retain at minimum 2.5kg or 0 if user started very light
        return max(0.0, result)

    return round_to_increment(current_weight)


def calculate_bodyweight_progression(current_sets=3, current_reps=10, current_duration=None, decision='PROGRESS'):
    """
    Adjusts bodyweight exercise parameters (reps, duration, or sets) without assigning external weight.
    
    Parameters:
    - current_sets (int)
    - current_reps (int or None)
    - current_duration (int seconds or None)
    - decision (str): 'PROGRESS', 'HOLD', 'BACK_OFF'
    
    Returns:
    - dict: {'target_sets': int, 'target_reps': int or None, 'target_duration_seconds': int or None}
    """
    sets = current_sets or 3
    reps = current_reps
    duration = current_duration

    if decision == 'HOLD':
        return {
            'target_sets': sets,
            'target_reps': reps,
            'target_duration_seconds': duration,
        }

    if decision == 'PROGRESS':
        if duration is not None and duration > 0:
            # Increase hold/plank/cardio duration by +5 to +10 seconds
            new_dur = min(300, duration + 5)
            return {'target_sets': sets, 'target_reps': None, 'target_duration_seconds': new_dur}
        elif reps is not None and reps > 0:
            # If reps reach 15-20, consider adding a set or increasing reps by 2
            if reps >= 18 and sets < 5:
                return {'target_sets': sets + 1, 'target_reps': 10, 'target_duration_seconds': None}
            else:
                new_reps = min(50, reps + 2)
                return {'target_sets': sets, 'target_reps': new_reps, 'target_duration_seconds': None}
        else:
            return {'target_sets': min(5, sets + 1), 'target_reps': 12, 'target_duration_seconds': None}

    elif decision == 'BACK_OFF':
        if duration is not None and duration > 0:
            new_dur = max(15, duration - 5)
            return {'target_sets': sets, 'target_reps': None, 'target_duration_seconds': new_dur}
        elif reps is not None and reps > 0:
            new_reps = max(5, reps - 2)
            return {'target_sets': sets, 'target_reps': new_reps, 'target_duration_seconds': None}
        else:
            return {'target_sets': max(2, sets - 1), 'target_reps': 8, 'target_duration_seconds': None}

    return {
        'target_sets': sets,
        'target_reps': reps,
        'target_duration_seconds': duration,
    }
