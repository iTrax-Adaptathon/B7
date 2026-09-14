import React from 'react';
import { Check, Clock, Plus, Trash2 } from 'lucide-react';

export const SetLogger = ({
  sets = [],
  isBodyweight = false,
  suggestedWeight = null,
  targetReps = 10,
  targetDuration = null,
  onSetChange,
  onAddSet,
  onRemoveSet,
}) => {
  return (
    <div style={{ marginTop: '1rem' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '40px 1fr 1fr 1fr 44px',
          gap: '0.5rem',
          paddingBottom: '0.4rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          textAlign: 'center',
        }}
      >
        <span>Set</span>
        <span>Target</span>
        <span>{isBodyweight ? (targetDuration ? 'Seconds' : 'Reps') : 'Weight (kg)'}</span>
        <span>{isBodyweight ? 'Actual' : 'Reps'}</span>
        <span>Done</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.6rem' }}>
        {sets.map((set, idx) => {
          const isDone = set.completed;
          return (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr 1fr 1fr 44px',
                gap: '0.5rem',
                alignItems: 'center',
                background: isDone ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                border: isDone ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.4rem 0.5rem',
                transition: 'all 0.15s ease',
              }}
            >
              {/* Set index */}
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: isDone ? '#10b981' : 'var(--text-secondary)', textAlign: 'center' }}>
                {idx + 1}
              </span>

              {/* Target */}
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                {isBodyweight
                  ? (targetDuration ? `${targetDuration}s` : `${targetReps} reps`)
                  : `${suggestedWeight || 10}kg × ${targetReps}`}
              </span>

              {/* Input 1: Weight or Duration/Reps */}
              <div>
                {!isBodyweight ? (
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={set.weight !== undefined ? set.weight : (suggestedWeight || 10)}
                    onChange={(e) => onSetChange(idx, 'weight', parseFloat(e.target.value) || 0)}
                    className="form-input"
                    style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                    placeholder="kg"
                  />
                ) : (
                  <input
                    type="number"
                    min="0"
                    value={set.duration !== undefined ? set.duration : (targetDuration || targetReps || 10)}
                    onChange={(e) => onSetChange(idx, targetDuration ? 'duration' : 'reps', parseInt(e.target.value) || 0)}
                    className="form-input"
                    style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                    placeholder={targetDuration ? 'sec' : 'reps'}
                  />
                )}
              </div>

              {/* Input 2: Reps for weighted exercises or confirmation */}
              <div>
                {!isBodyweight ? (
                  <input
                    type="number"
                    min="0"
                    value={set.reps !== undefined ? set.reps : (targetReps || 10)}
                    onChange={(e) => onSetChange(idx, 'reps', parseInt(e.target.value) || 0)}
                    className="form-input"
                    style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem', textAlign: 'center' }}
                    placeholder="reps"
                  />
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', display: 'block' }}>
                    Bodyweight
                  </span>
                )}
              </div>

              {/* Completion Button */}
              <button
                type="button"
                onClick={() => onSetChange(idx, 'completed', !isDone)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  border: isDone ? '1px solid #10b981' : '1px solid var(--border-color)',
                  background: isDone ? '#10b981' : 'rgba(255, 255, 255, 0.05)',
                  color: isDone ? '#ffffff' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  justifySelf: 'center',
                }}
              >
                <Check size={18} strokeWidth={isDone ? 3 : 2} />
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.75rem' }}>
        {sets.length > 1 && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onRemoveSet}
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
          >
            <Trash2 size={14} /> Remove Set
          </button>
        )}
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onAddSet}
          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
        >
          <Plus size={14} /> Add Set
        </button>
      </div>
    </div>
  );
};
