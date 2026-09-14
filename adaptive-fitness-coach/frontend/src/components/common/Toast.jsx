import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'info', onClose }) => {
  if (!message) return null;

  const icons = {
    success: <CheckCircle2 size={18} color="#10b981" />,
    error: <AlertCircle size={18} color="#f43f5e" />,
    info: <Info size={18} color="#38bdf8" />,
  };

  const borders = {
    success: 'rgba(16, 185, 129, 0.4)',
    error: 'rgba(244, 63, 94, 0.4)',
    info: 'rgba(56, 189, 248, 0.4)',
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        background: '#162235',
        border: `1px solid ${borders[type] || borders.info}`,
        borderRadius: 'var(--radius-md)',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
        zIndex: 9999,
        maxWidth: '400px',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      {icons[type] || icons.info}
      <span style={{ fontSize: '0.9rem', color: '#f8fafc', flex: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
