import React, { useState } from 'react';
import { Activity, Zap, HeartPulse, FileText, Sparkles } from 'lucide-react';

export const PostWorkoutModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [difficulty, setDifficulty] = useState(3);
  const [energy, setEnergy] = useState(4);
  const [recovery, setRecovery] = useState(4);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      difficulty_rating: difficulty,
      energy_rating: energy,
      recovery_rating: recovery,
      notes,
    });
  };

  const difficultyOptions = [
    { val: 1, label: 'Very Easy' },
    { val: 2, label: 'Easy' },
    { val: 3, label: 'Moderate' },
    { val: 4, label: 'Hard' },
    { val: 5, label: 'Very Hard' },
  ];

  const ratingOptions = [
    { val: 1, label: 'Very Poor/Low' },
    { val: 2, label: 'Low' },
    { val: 3, label: 'Moderate' },
    { val: 4, label: 'Good' },
    { val: 5, label: 'Excellent' },
  ];

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff' }}>Workout Completed!</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Rate your effort and recovery to calibrate your next adapted session.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
          {/* 1. Difficulty */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Activity size={16} color="#38bdf8" />
              <span>How did this workout feel? (Perceived Difficulty)</span>
            </label>
            <div className="rating-group">
              {difficultyOptions.map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setDifficulty(opt.val)}
                  className={`rating-btn ${difficulty === opt.val ? 'active' : ''}`}
                >
                  <span className="rating-num">{opt.val}</span>
                  <span className="rating-label">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Energy */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Zap size={16} color="#f59e0b" />
              <span>Energy level during workout</span>
            </label>
            <div className="rating-group">
              {ratingOptions.map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setEnergy(opt.val)}
                  className={`rating-btn ${energy === opt.val ? 'active' : ''}`}
                >
                  <span className="rating-num">{opt.val}</span>
                  <span className="rating-label">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Recovery / Readiness */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <HeartPulse size={16} color="#10b981" />
              <span>Recovery & Physical Readiness</span>
            </label>
            <div className="rating-group">
              {ratingOptions.map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setRecovery(opt.val)}
                  className={`rating-btn ${recovery === opt.val ? 'active' : ''}`}
                >
                  <span className="rating-num">{opt.val}</span>
                  <span className="rating-label">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Notes */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={16} color="var(--text-secondary)" />
              <span>Session Notes (Optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. felt strong on squats, mild shoulder tightness on overhead press..."
              className="form-textarea"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={isSubmitting}>
              Back to Workout
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Adapting Program...' : 'Submit & Adapt Next Workout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
