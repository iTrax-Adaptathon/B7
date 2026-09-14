import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../common/StatusBadge';
import { Sparkles, ArrowRight, CheckCircle2, TrendingUp, Cpu, BarChart2 } from 'lucide-react';

export const AdaptationResultModal = ({ isOpen, adaptationResult, nextWorkout, onClose }) => {
  const navigate = useNavigate();
  if (!isOpen || !adaptationResult) return null;

  const {
    adaptation_score,
    decision,
    performance_component,
    rep_completion_component,
    rpe_difficulty_component,
    recovery_component,
    consistency_component,
    explanation,
  } = adaptationResult;

  const handleGoDashboard = () => {
    onClose();
    navigate('/dashboard');
  };

  const handleGoWorkout = () => {
    onClose();
    navigate('/workout');
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '640px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '2px solid var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
              color: 'var(--accent-cyan)',
            }}
          >
            <Cpu size={30} />
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#ffffff' }}>Adaptive Calibration Complete</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Your performance and recovery have been processed by the adaptive progression engine.
          </p>
        </div>

        {/* Primary Decision Banner */}
        <div
          className="glass-card"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Engine Recommendation
            </span>
            <div style={{ marginTop: '0.35rem' }}>
              <StatusBadge status={decision} size="lg" />
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Adaptation Score
            </span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
              {adaptation_score}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span>
            </div>
          </div>
        </div>

        {/* Narrative Explanation */}
        <div
          style={{
            background: 'rgba(56, 189, 248, 0.08)',
            borderLeft: '4px solid var(--accent-cyan)',
            padding: '1rem',
            borderRadius: '0 var(--radius-md) var(--radius-md) 0',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
            Why this decision?
          </div>
          <p style={{ fontSize: '0.92rem', color: '#f8fafc', lineHeight: 1.5 }}>
            "{explanation}"
          </p>
        </div>

        {/* Multi-factor Score Breakdown */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            Evaluation Signals
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
            {[
              { label: 'Performance Trend (30%)', val: performance_component, color: '#38bdf8' },
              { label: 'Rep Completion (20%)', val: rep_completion_component, color: '#10b981' },
              { label: 'RPE & Strain Tolerance (20%)', val: rpe_difficulty_component, color: '#f59e0b' },
              { label: 'Recovery & Energy (20%)', val: recovery_component, color: '#818cf8' },
              { label: 'Consistency (10%)', val: consistency_component, color: '#ec4899' },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: '#ffffff' }}>{item.val || 0}%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, Math.max(0, item.val || 0))}%`,
                      background: item.color,
                      borderRadius: '3px',
                      transition: 'width 0.6s ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Workout Targets Preview */}
        {nextWorkout && nextWorkout.workout_exercises && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
              Next Adapted Workout: {nextWorkout.name}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {nextWorkout.workout_exercises.slice(0, 4).map((we, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 0.75rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                  }}
                >
                  <span style={{ fontWeight: 600, color: '#ffffff' }}>{we.exercise?.name}</span>
                  <span style={{ color: 'var(--accent-cyan)' }}>
                    {we.exercise?.is_bodyweight
                      ? (we.target_duration_seconds ? `${we.target_duration_seconds}s hold` : `${we.target_sets} × ${we.target_reps} reps`)
                      : `${we.suggested_weight || 10} kg × ${we.target_sets} × ${we.target_reps}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={handleGoDashboard} className="btn btn-secondary">
            View Dashboard
          </button>
          <button onClick={handleGoWorkout} className="btn btn-primary">
            <span>Next Workout</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
