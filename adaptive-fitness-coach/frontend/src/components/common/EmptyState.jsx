import React from 'react';
import { Activity, Dumbbell, Calendar, HelpCircle } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Dumbbell,
  title = 'No Data Found',
  description = 'Complete your workouts to see adaptive tracking and analytics here.',
  actionText,
  onAction,
}) => {
  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3rem 2rem',
        gap: '1rem',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(56, 189, 248, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-cyan)',
        }}
      >
        <Icon size={32} />
      </div>
      <div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', fontSize: '0.9rem' }}>
          {description}
        </p>
      </div>
      {actionText && onAction && (
        <button className="btn btn-primary btn-sm" onClick={onAction} style={{ marginTop: '0.5rem' }}>
          {actionText}
        </button>
      )}
    </div>
  );
};
