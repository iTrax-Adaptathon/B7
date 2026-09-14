import React from 'react';

export const LoadingSpinner = ({ text = 'Loading...', size = 'md' }) => {
  const sizeMap = {
    sm: '20px',
    md: '36px',
    lg: '54px',
  };

  const dim = sizeMap[size] || sizeMap.md;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      gap: '1rem',
      minHeight: size === 'lg' ? '300px' : 'auto',
    }}>
      <div
        style={{
          width: dim,
          height: dim,
          border: '3px solid rgba(56, 189, 248, 0.15)',
          borderTop: '3px solid #38bdf8',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      {text && <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{text}</span>}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
