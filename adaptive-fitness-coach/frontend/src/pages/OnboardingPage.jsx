import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../api/endpoints';
import {
  User, Target, Layout, Dumbbell, Clock, Sliders,
  CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Building2, Home, Trees
} from 'lucide-react';

export const OnboardingPage = () => {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    experience: 'BEGINNER',
    fitness_goal: 'GENERAL_WELLNESS',
    focus_areas: ['Full Body'],
    equipment: ['No Equipment'],
    gym_access: false,
    location: 'HOME',
    days_per_week: 3,
    workout_duration: 30,
    progression_method: 'FIXED',
    progression_value: 2.5,
  });

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        name: profile.name || '',
        age: profile.age || '',
        height: profile.height || '',
        weight: profile.weight || '',
        experience: profile.experience || 'BEGINNER',
        fitness_goal: profile.fitness_goal || 'GENERAL_WELLNESS',
        focus_areas: profile.focus_areas && profile.focus_areas.length > 0 ? profile.focus_areas : ['Full Body'],
        equipment: profile.equipment && profile.equipment.length > 0 ? profile.equipment : ['No Equipment'],
        gym_access: profile.gym_access || false,
        location: profile.location || 'HOME',
        days_per_week: profile.days_per_week || 3,
        workout_duration: profile.workout_duration || 30,
        progression_method: profile.progression_method || 'FIXED',
        progression_value: profile.progression_value || 2.5,
      }));
    }
  }, [profile]);

  const stepsList = [
    { num: 1, title: 'Profile', icon: User },
    { num: 2, title: 'Goal', icon: Target },
    { num: 3, title: 'Focus', icon: Layout },
    { num: 4, title: 'Equipment', icon: Dumbbell },
    { num: 5, title: 'Preferences', icon: Clock },
    { num: 6, title: 'Progression', icon: Sliders },
  ];

  const handleNext = () => {
    setError('');
    if (step === 1 && !formData.name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (step < 6) {
      setStep(step + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleArrayItem = (field, item) => {
    setFormData((prev) => {
      const current = prev[field] || [];
      if (item === 'No Equipment') {
        return { ...prev, [field]: ['No Equipment'] };
      }
      let updated = current.filter((x) => x !== 'No Equipment');
      if (updated.includes(item)) {
        updated = updated.filter((x) => x !== item);
        if (updated.length === 0) updated = ['No Equipment'];
      } else {
        updated.push(item);
      }
      return { ...prev, [field]: updated };
    });
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        days_per_week: parseInt(formData.days_per_week),
        workout_duration: parseInt(formData.workout_duration),
        progression_value: parseFloat(formData.progression_value),
        onboarding_completed: true,
      };

      await profileAPI.updateProfile(payload);
      await refreshProfile();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to save profile. Please verify your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1.5rem 3rem' }}>
      {/* Progress Steps Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '1.5rem' }}>
          {/* Progress track */}
          <div
            style={{
              position: 'absolute',
              top: '18px',
              left: '0',
              right: '0',
              height: '3px',
              background: 'rgba(255, 255, 255, 0.08)',
              zIndex: 1,
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${((step - 1) / (stepsList.length - 1)) * 100}%`,
                background: 'var(--accent-cyan)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          {stepsList.map((s) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div
                key={s.num}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 2,
                  cursor: s.num < step ? 'pointer' : 'default',
                }}
                onClick={() => s.num < step && setStep(s.num)}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: isCurrent
                      ? 'var(--accent-cyan)'
                      : isCompleted
                      ? '#10b981'
                      : '#1e293b',
                    color: isCurrent || isCompleted ? '#ffffff' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    border: isCurrent ? '3px solid rgba(56, 189, 248, 0.3)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isCompleted ? <CheckCircle2 size={18} /> : s.num}
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    marginTop: '0.4rem',
                    color: isCurrent ? '#38bdf8' : isCompleted ? '#10b981' : 'var(--text-muted)',
                    fontWeight: isCurrent ? 700 : 500,
                  }}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content Container */}
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        {error && (
          <div
            style={{
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              color: '#f43f5e',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
            }}
          >
            {error}
          </div>
        )}

        {/* STEP 1: BASIC PROFILE */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.35rem' }}>
              Step 1: Basic Profile
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
              Tell us a bit about yourself to personalize your fitness calculations.
            </p>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Fitness Experience</label>
                <select
                  className="form-select"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                >
                  <option value="BEGINNER">Beginner (0–1 years training)</option>
                  <option value="INTERMEDIATE">Intermediate (1–3 years training)</option>
                  <option value="ADVANCED">Advanced (3+ years consistent training)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Age (Optional)</label>
                <input
                  type="number"
                  min="10"
                  max="120"
                  placeholder="e.g. 28"
                  className="form-input"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Height (cm, Optional)</label>
                <input
                  type="number"
                  min="50"
                  max="280"
                  placeholder="e.g. 175"
                  className="form-input"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Weight (kg, Optional)</label>
                <input
                  type="number"
                  step="0.5"
                  min="20"
                  max="400"
                  placeholder="e.g. 72"
                  className="form-input"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: FITNESS GOAL */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.35rem' }}>
              Step 2: What's your main goal?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
              Select one primary focus to calibrate exercise selection and volume distribution.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                { id: 'BUILD_STRENGTH', title: 'Build Strength', desc: 'Focus on compound power, progressive overload, and neural drive.' },
                { id: 'BUILD_MUSCLE', title: 'Build Muscle', desc: 'Optimize hypertrophy with balanced volume and progressive tension.' },
                { id: 'IMPROVE_FITNESS', title: 'Improve Fitness', desc: 'Conditioning, functional strength, and stamina.' },
                { id: 'GENERAL_WELLNESS', title: 'General Wellness', desc: 'Healthy movement, consistent habits, and joint health.' },
                { id: 'IMPROVE_FLEXIBILITY', title: 'Improve Flexibility / Mobility', desc: 'Range of motion, active stretching, and movement freedom.' },
              ].map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => setFormData({ ...formData, fitness_goal: goal.id })}
                  style={{
                    padding: '1.1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: formData.fitness_goal === goal.id ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                    border: formData.fitness_goal === goal.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: formData.fitness_goal === goal.id ? '#38bdf8' : '#ffffff' }}>
                      {goal.title}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {goal.desc}
                    </p>
                  </div>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: formData.fitness_goal === goal.id ? '6px solid var(--accent-cyan)' : '2px solid var(--text-muted)',
                      background: formData.fitness_goal === goal.id ? '#ffffff' : 'transparent',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: FOCUS AREAS */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.35rem' }}>
              Step 3: Which areas would you like to focus on?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
              Select one or multiple body regions to emphasize.
            </p>

            <div className="grid-2">
              {[
                'Full Body',
                'Upper Body',
                'Lower Body',
                'Core',
                'Cardio',
                'Mobility / Flexibility',
              ].map((area) => {
                const isSelected = (formData.focus_areas || []).includes(area);
                return (
                  <div
                    key={area}
                    onClick={() => toggleArrayItem('focus_areas', area)}
                    style={{
                      padding: '1.1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                      border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontWeight: 600, color: isSelected ? '#38bdf8' : '#ffffff' }}>{area}</span>
                    <div
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: 'var(--radius-sm)',
                        background: isSelected ? 'var(--accent-cyan)' : 'transparent',
                        border: isSelected ? 'none' : '2px solid var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                      }}
                    >
                      {isSelected && <CheckCircle2 size={16} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: EQUIPMENT */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.35rem' }}>
              Step 4: Equipment Access
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              The engine will NEVER generate an exercise requiring equipment you do not have.
            </p>

            {/* Gym Access toggle */}
            <div
              style={{
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                background: formData.gym_access ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                border: formData.gym_access ? '1px solid #10b981' : '1px solid var(--border-color)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
              onClick={() => setFormData({ ...formData, gym_access: !formData.gym_access })}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Building2 size={24} color={formData.gym_access ? '#10b981' : 'var(--text-muted)'} />
                <div>
                  <h4 style={{ color: formData.gym_access ? '#10b981' : '#ffffff', fontSize: '1rem' }}>
                    Full Commercial Gym Access
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Unlocks barbells, machines, cables, dumbbells, and cardio equipment.
                  </p>
                </div>
              </div>
              <div
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '12px',
                  background: formData.gym_access ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    position: 'absolute',
                    top: '3px',
                    left: formData.gym_access ? '23px' : '3px',
                    transition: 'all 0.2s ease',
                  }}
                />
              </div>
            </div>

            {!formData.gym_access && (
              <div>
                <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>
                  Select your available equipment:
                </label>
                <div className="grid-3">
                  {[
                    'No Equipment',
                    'Dumbbells',
                    'Barbell',
                    'Weight Plates',
                    'Resistance Bands',
                    'Kettlebell',
                    'Bench',
                    'Pull-up Bar',
                    'Cable Machine',
                    'Machines',
                    'Treadmill',
                    'Exercise Bike',
                  ].map((eq) => {
                    const isSelected = (formData.equipment || []).includes(eq);
                    return (
                      <div
                        key={eq}
                        onClick={() => toggleArrayItem('equipment', eq)}
                        style={{
                          padding: '0.85rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                          border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          color: isSelected ? '#38bdf8' : '#ffffff',
                        }}
                      >
                        <span>{eq}</span>
                        {isSelected && <CheckCircle2 size={16} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: WORKOUT PREFERENCES */}
        {step === 5 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.35rem' }}>
              Step 5: Workout Preferences
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
              Configure your schedule and environment.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Location */}
              <div>
                <label className="form-label">Preferred Location</label>
                <div className="grid-3" style={{ marginTop: '0.5rem' }}>
                  {[
                    { id: 'HOME', label: 'Home', icon: Home },
                    { id: 'GYM', label: 'Gym', icon: Building2 },
                    { id: 'OUTDOORS', label: 'Outdoors', icon: Trees },
                  ].map((loc) => {
                    const Icon = loc.icon;
                    return (
                      <div
                        key={loc.id}
                        onClick={() => setFormData({ ...formData, location: loc.id })}
                        style={{
                          padding: '1rem',
                          borderRadius: 'var(--radius-md)',
                          background: formData.location === loc.id ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                          border: formData.location === loc.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.4rem',
                          color: formData.location === loc.id ? '#38bdf8' : '#ffffff',
                        }}
                      >
                        <Icon size={22} />
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{loc.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Days Per Week */}
              <div>
                <label className="form-label">Target Workouts per Week</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({ ...formData, days_per_week: num })}
                      style={{
                        flex: 1,
                        padding: '0.75rem 0.25rem',
                        borderRadius: 'var(--radius-md)',
                        background: formData.days_per_week === num ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-input)',
                        border: formData.days_per_week === num ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                        color: formData.days_per_week === num ? '#38bdf8' : '#ffffff',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Session Duration */}
              <div>
                <label className="form-label">Workout Duration</label>
                <div className="grid-4" style={{ marginTop: '0.5rem' }}>
                  {[
                    { mins: 20, label: '15–20 mins' },
                    { mins: 30, label: '30 mins' },
                    { mins: 45, label: '45 mins' },
                    { mins: 60, label: '60+ mins' },
                  ].map((dur) => (
                    <button
                      key={dur.mins}
                      type="button"
                      onClick={() => setFormData({ ...formData, workout_duration: dur.mins })}
                      style={{
                        padding: '0.85rem 0.5rem',
                        borderRadius: 'var(--radius-md)',
                        background: formData.workout_duration === dur.mins ? 'rgba(56, 189, 248, 0.15)' : 'var(--bg-input)',
                        border: formData.workout_duration === dur.mins ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                        color: formData.workout_duration === dur.mins ? '#38bdf8' : '#ffffff',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                    >
                      {dur.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: CONFIGURABLE WEIGHT PROGRESSION */}
        {step === 6 && (
          <div>
            <h2 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.35rem' }}>
              Step 6: Progression Rules
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
              Choose how the engine increments working weight when PROGRESS is triggered.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Method selection */}
              <div>
                <label className="form-label">Progression Method</label>
                <div className="grid-2" style={{ marginTop: '0.5rem' }}>
                  <div
                    onClick={() => setFormData({ ...formData, progression_method: 'FIXED', progression_value: 2.5 })}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      background: formData.progression_method === 'FIXED' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                      border: formData.progression_method === 'FIXED' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                    }}
                  >
                    <h4 style={{ color: formData.progression_method === 'FIXED' ? '#38bdf8' : '#ffffff', fontSize: '1.1rem' }}>
                      Fixed Weight Progression
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                      Add a static increment in kilograms (e.g. +2.5 kg).
                    </p>
                  </div>

                  <div
                    onClick={() => setFormData({ ...formData, progression_method: 'PERCENTAGE', progression_value: 5.0 })}
                    style={{
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      background: formData.progression_method === 'PERCENTAGE' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                      border: formData.progression_method === 'PERCENTAGE' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                    }}
                  >
                    <h4 style={{ color: formData.progression_method === 'PERCENTAGE' ? '#38bdf8' : '#ffffff', fontSize: '1.1rem' }}>
                      Percentage Progression
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                      Scale up by percentage relative to current load (e.g. +5%).
                    </p>
                  </div>
                </div>
              </div>

              {/* Increment Options */}
              <div>
                <label className="form-label">
                  {formData.progression_method === 'FIXED' ? 'Fixed Weight Increment' : 'Percentage Increment'}
                </label>
                <div className="grid-3" style={{ marginTop: '0.5rem' }}>
                  {formData.progression_method === 'FIXED'
                    ? [
                        { val: 1.25, label: '+1.25 kg', desc: 'Conservative micro-loading' },
                        { val: 2.5, label: '+2.5 kg', desc: 'Standard barbell & dumbbell step' },
                        { val: 5.0, label: '+5.0 kg', desc: 'Aggressive strength jump' },
                      ].map((opt) => (
                        <div
                          key={opt.val}
                          onClick={() => setFormData({ ...formData, progression_value: opt.val })}
                          style={{
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            background: formData.progression_value === opt.val ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-input)',
                            border: formData.progression_value === opt.val ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                            cursor: 'pointer',
                            textAlign: 'center',
                          }}
                        >
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: formData.progression_value === opt.val ? '#38bdf8' : '#ffffff' }}>
                            {opt.label}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                            {opt.desc}
                          </div>
                        </div>
                      ))
                    : [
                        { val: 2.5, label: '+2.5%', desc: 'Small steady progression' },
                        { val: 5.0, label: '+5.0%', desc: 'Balanced volume adaptation' },
                        { val: 7.5, label: '+7.5%', desc: 'Faster progression speed' },
                      ].map((opt) => (
                        <div
                          key={opt.val}
                          onClick={() => setFormData({ ...formData, progression_value: opt.val })}
                          style={{
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            background: formData.progression_value === opt.val ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-input)',
                            border: formData.progression_value === opt.val ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                            cursor: 'pointer',
                            textAlign: 'center',
                          }}
                        >
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: formData.progression_value === opt.val ? '#38bdf8' : '#ffffff' }}>
                            {opt.label}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                            {opt.desc}
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          {step > 1 ? (
            <button type="button" onClick={handleBack} className="btn btn-secondary">
              <ArrowLeft size={16} /> Back
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={handleNext}
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {step === 6 ? (
              <>
                <Sparkles size={18} />
                <span>{isSubmitting ? 'Generating Routine...' : 'Complete & Generate Workout'}</span>
              </>
            ) : (
              <>
                <span>Next Step</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
