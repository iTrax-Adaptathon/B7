import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = '#38bdf8' }) => {
  return (
    <div className="glass-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
      {Icon && (
        <div
          style={{
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            background: `rgba(${color === '#38bdf8' ? '56, 189, 248' : '99, 102, 241'}, 0.12)`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={24} />
        </div>
      )}
      <div style={{ flex: 1 }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </p>
        <h3 style={{ fontSize: '1.6rem', marginTop: '0.15rem', color: '#ffffff' }}>
          {value !== null && value !== undefined ? value : '—'}
        </h3>
        {subtitle && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.2rem' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
