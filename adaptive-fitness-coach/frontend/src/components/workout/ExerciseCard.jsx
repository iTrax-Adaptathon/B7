import React, { useState } from 'react';
import { SetLogger } from './SetLogger';
import { Info, Dumbbell, Timer, Flame, CheckCircle2 } from 'lucide-react';

export const ExerciseCard = ({
  workoutExercise,
  exerciseData,
  onExerciseUpdate,
}) => {
  const [showInstructions, setShowInstructions] = useState(false);
  const exercise = workoutExercise.exercise || {};
  const isBodyweight = exercise.is_bodyweight;

  const handleSetChange = (setIndex, field, value) => {
    const updatedSets = [...exerciseData.sets];
    updatedSets[setIndex] = {
      ...updatedSets[setIndex],
      [field]: value,
    };
    onExerciseUpdate(exercise.id, {
      ...exerciseData,
      sets: updatedSets,
    });
  };

  const handleAddSet = () => {
    const lastSet = exerciseData.sets[exerciseData.sets.length - 1] || {};
    const newSet = {
      weight: lastSet.weight !== undefined ? lastSet.weight : (workoutExercise.suggested_weight || 10),
      reps: lastSet.reps !== undefined ? lastSet.reps : (workoutExercise.target_reps || 10),
      duration: lastSet.duration !== undefined ? lastSet.duration : (workoutExercise.target_duration_seconds || 30),
      completed: false,
    };
    onExerciseUpdate(exercise.id, {
      ...exerciseData,
      sets: [...exerciseData.sets, newSet],
    });
  };

  const handleRemoveSet = () => {
    if (exerciseData.sets.length > 1) {
      onExerciseUpdate(exercise.id, {
        ...exerciseData,
        sets: exerciseData.sets.slice(0, -1),
      });
    }
  };

  const handleRpeChange = (val) => {
    onExerciseUpdate(exercise.id, {
      ...exerciseData,
      rpe: parseFloat(val) || 7.0,
    });
  };

  const allCompleted = exerciseData.sets.length > 0 && exerciseData.sets.every((s) => s.completed);

  return (
    <div
      className="glass-card"
      style={{
        border: allCompleted ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)',
        transition: 'all var(--transition-normal)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(56, 189, 248, 0.1)',
                color: 'var(--accent-cyan)',
                fontWeight: 600,
              }}
            >
              #{workoutExercise.order || 1}
            </span>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>{exercise.name}</h3>
            {allCompleted && (
              <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: 600 }}>
                <CheckCircle2 size={16} /> Completed
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span>Target: <strong>{workoutExercise.target_sets} sets</strong></span>
            <span>•</span>
            {isBodyweight ? (
              <span>
                {workoutExercise.target_duration_seconds
                  ? `<strong>${workoutExercise.target_duration_seconds} sec</strong> hold`
                  : `<strong>${workoutExercise.target_reps || 10} reps</strong> (Bodyweight)`}
              </span>
            ) : (
              <span>
                <strong>{workoutExercise.target_reps || 10} reps</strong> @ <strong>{workoutExercise.suggested_weight || 10} kg</strong>
              </span>
            )}
            <span>•</span>
            <span>Rest: <strong>{workoutExercise.rest_period_seconds || 60}s</strong></span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {exercise.equipment_required && exercise.equipment_required.length > 0 ? (
            <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
              <Dumbbell size={12} /> {exercise.equipment_required.join(', ')}
            </span>
          ) : (
            <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
              Bodyweight
            </span>
          )}

          <button
            type="button"
            onClick={() => setShowInstructions(!showInstructions)}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.35rem 0.6rem' }}
            title="Toggle Exercise Instructions"
          >
            <Info size={15} />
          </button>
        </div>
      </div>

      {showInstructions && (
        <div
          style={{
            marginTop: '0.85rem',
            padding: '0.75rem 1rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-md)',
            borderLeft: '3px solid var(--accent-cyan)',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
          }}
        >
          {exercise.instructions || workoutExercise.instructions || 'Execute with steady pacing and controlled eccentric tempo.'}
        </div>
      )}

      {/* Set Logger Matrix */}
      <SetLogger
        sets={exerciseData.sets}
        isBodyweight={isBodyweight}
        suggestedWeight={workoutExercise.suggested_weight}
        targetReps={workoutExercise.target_reps}
        targetDuration={workoutExercise.target_duration_seconds}
        onSetChange={handleSetChange}
        onAddSet={handleAddSet}
        onRemoveSet={handleRemoveSet}
      />

      {/* Exercise-level RPE selector */}
      <div
        style={{
          marginTop: '1.25rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          <Flame size={15} color="#f59e0b" />
          <span>Exercise Intensity (RPE 1–10):</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <input
            type="range"
            min="1"
            max="10"
            step="0.5"
            value={exerciseData.rpe || 7}
            onChange={(e) => handleRpeChange(e.target.value)}
            style={{ width: '120px', accentColor: '#38bdf8' }}
          />
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-cyan)', minWidth: '35px', textAlign: 'right' }}>
            {exerciseData.rpe || 7.0}
          </span>
        </div>
      </div>
    </div>
  );
};
