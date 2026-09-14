import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../api/endpoints';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Toast } from '../components/common/Toast';
import {
  User, Dumbbell, Target, Clock, Sliders, Shield,
  Save, CheckCircle2, Building2
} from 'lucide-react';

export const ProfilePage = () => {
  const { profile, refreshProfile } = useAuth();
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        age: profile.age || '',
        height: profile.height || '',
        weight: profile.weight || '',
        experience: profile.experience || 'BEGINNER',
        fitness_goal: profile.fitness_goal || 'GENERAL_WELLNESS',
        focus_areas: profile.focus_areas || ['Full Body'],
        equipment: profile.equipment || ['No Equipment'],
        gym_access: profile.gym_access || false,
        location: profile.location || 'HOME',
        days_per_week: profile.days_per_week || 3,
        workout_duration: profile.workout_duration || 30,
        progression_method: profile.progression_method || 'FIXED',
        progression_value: profile.progression_value || 2.5,
      });
    }
  }, [profile]);

  if (!formData) {
    return <LoadingSpinner text="Loading profile preferences..." />;
  }

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

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setToastMessage('');

    try {
      const payload = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        days_per_week: parseInt(formData.days_per_week),
        workout_duration: parseInt(formData.workout_duration),
        progression_value: parseFloat(formData.progression_value),
      };

      await profileAPI.updateProfile(payload);
      await refreshProfile();
      setToastType('success');
      setToastMessage('Profile settings updated successfully! Next workouts will adapt to new settings.');
    } catch (err) {
      console.error(err);
      setToastType('error');
      setToastMessage('Failed to save profile changes.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          User Settings
        </span>
        <h1 style={{ fontSize: '2rem', color: '#ffffff', marginTop: '0.15rem' }}>
          Profile & Workout Configuration
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Update your equipment, progression method, goals, and workout duration.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Section 1: Basic Profile */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} color="var(--accent-cyan)" /> Personal Details
          </h3>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Experience Level</label>
              <select
                className="form-select"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Age (Optional)</label>
              <input
                type="number"
                min="10"
                max="120"
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
                className="form-input"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Goals & Focus */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={20} color="#10b981" /> Primary Goal & Focus Areas
          </h3>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Primary Fitness Goal</label>
            <select
              className="form-select"
              value={formData.fitness_goal}
              onChange={(e) => setFormData({ ...formData, fitness_goal: e.target.value })}
            >
              <option value="BUILD_STRENGTH">Build Strength</option>
              <option value="BUILD_MUSCLE">Build Muscle</option>
              <option value="IMPROVE_FITNESS">Improve Fitness</option>
              <option value="GENERAL_WELLNESS">General Wellness</option>
              <option value="IMPROVE_FLEXIBILITY">Improve Flexibility / Mobility</option>
            </select>
          </div>

          <div>
            <label className="form-label" style={{ marginBottom: '0.6rem', display: 'block' }}>
              Focus Areas (Multi-select)
            </label>
            <div className="grid-3">
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
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                      border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem',
                      color: isSelected ? '#38bdf8' : '#ffffff',
                    }}
                  >
                    <span>{area}</span>
                    {isSelected && <CheckCircle2 size={16} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: Equipment */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Dumbbell size={20} color="#f59e0b" /> Equipment Access
          </h3>

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
                  Grants access to barbells, machines, cables, dumbbells, and cardio equipment.
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
              <label className="form-label" style={{ marginBottom: '0.6rem', display: 'block' }}>
                Select Available Equipment:
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
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                        border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.85rem',
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

        {/* Section 4: Progression Rules */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={20} color="#818cf8" /> Weight Progression Settings
          </h3>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Progression Method</label>
              <select
                className="form-select"
                value={formData.progression_method}
                onChange={(e) => {
                  const method = e.target.value;
                  setFormData({
                    ...formData,
                    progression_method: method,
                    progression_value: method === 'FIXED' ? 2.5 : 5.0,
                  });
                }}
              >
                <option value="FIXED">Fixed Weight Increment (kg)</option>
                <option value="PERCENTAGE">Percentage Progression (%)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                {formData.progression_method === 'FIXED' ? 'Increment Value (kg)' : 'Percentage Value (%)'}
              </label>
              <select
                className="form-select"
                value={formData.progression_value}
                onChange={(e) => setFormData({ ...formData, progression_value: parseFloat(e.target.value) })}
              >
                {formData.progression_method === 'FIXED' ? (
                  <>
                    <option value={1.25}>+1.25 kg (Micro-load)</option>
                    <option value={2.5}>+2.5 kg (Standard)</option>
                    <option value={5.0}>+5.0 kg (Aggressive)</option>
                  </>
                ) : (
                  <>
                    <option value={2.5}>+2.5% (Conservative)</option>
                    <option value={5.0}>+5.0% (Standard)</option>
                    <option value={7.5}>+7.5% (Aggressive)</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Section 5: Schedule & Duration */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color="#38bdf8" /> Schedule & Target Duration
          </h3>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Target Workouts / Week</label>
              <select
                className="form-select"
                value={formData.days_per_week}
                onChange={(e) => setFormData({ ...formData, days_per_week: parseInt(e.target.value) })}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <option key={n} value={n}>{n} Days per week</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Workout Duration</label>
              <select
                className="form-select"
                value={formData.workout_duration}
                onChange={(e) => setFormData({ ...formData, workout_duration: parseInt(e.target.value) })}
              >
                <option value={20}>15–20 minutes (3 exercises)</option>
                <option value={30}>30 minutes (4 exercises)</option>
                <option value={45}>45 minutes (5 exercises)</option>
                <option value={60}>60+ minutes (6 exercises)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <select
                className="form-select"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              >
                <option value="HOME">Home</option>
                <option value="GYM">Gym</option>
                <option value="OUTDOORS">Outdoors</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}>
            <Save size={18} />
            <span>{isLoading ? 'Saving Preferences...' : 'Save All Preferences'}</span>
          </button>
        </div>
      </form>

      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
    </div>
  );
};
