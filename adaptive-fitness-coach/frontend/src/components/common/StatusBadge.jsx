import React from 'react';
import { TrendingUp, PauseCircle, ShieldAlert } from 'lucide-react';

export const StatusBadge = ({ status = 'HOLD', size = 'md' }) => {
  const norm = (status || 'HOLD').toUpperCase();

  const config = {
    PROGRESS: {
      label: 'PROGRESS',
      className: 'badge badge-progress',
      icon: TrendingUp,
      color: '#10b981',
      glow: '0 0 10px rgba(16, 185, 129, 0.4)'
    },
    HOLD: {
      label: 'HOLD',
      className: 'badge badge-hold',
      icon: PauseCircle,
      color: '#f59e0b',
      glow: '0 0 10px rgba(245, 158, 11, 0.4)'
    },
    BACK_OFF: {
      label: 'BACK OFF',
      className: 'badge badge-backoff',
      icon: ShieldAlert,
      color: '#f43f5e',
      glow: '0 0 10px rgba(244, 63, 94, 0.4)'
    }
  };

  const current = config[norm] || config.HOLD;
  const Icon = current.icon;

  const fontSizes = {
    sm: '0.7rem',
    md: '0.8rem',
    lg: '0.95rem'
  };

  return (
    <span
      className={current.className}
      style={{
        fontSize: fontSizes[size] || fontSizes.md,
        boxShadow: current.glow,
      }}
    >
      <Icon size={size === 'lg' ? 18 : 14} />
      <span>{current.label}</span>
    </span>
  );
};
