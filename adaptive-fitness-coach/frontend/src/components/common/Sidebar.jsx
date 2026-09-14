import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, History, LineChart, UserCog, Shield } from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/workout', label: 'Current Workout', icon: Dumbbell },
    { to: '/history', label: 'History', icon: History },
    { to: '/progress', label: 'Progress & Trends', icon: LineChart },
    { to: '/profile', label: 'Profile & Settings', icon: UserCog },
  ];

  return (
    <aside
      className="sidebar-wrapper"
      style={{
        width: '260px',
        background: 'rgba(15, 23, 42, 0.45)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem 1rem',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <p
          style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
            padding: '0 0.75rem 0.5rem',
          }}
        >
          Navigation
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link-item ${isActive ? 'active' : ''}`
              }
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: isActive ? '#38bdf8' : 'var(--text-secondary)',
                background: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                border: isActive ? '1px solid var(--border-highlight)' : '1px solid transparent',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.92rem',
                transition: 'all 0.15s ease',
              })}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Safety Disclaimer */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          lineHeight: '1.4',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', fontWeight: 600 }}>
          <Shield size={14} color="#38bdf8" />
          <span>Safety Notice</span>
        </div>
        This app provides general fitness guidance, not medical advice. Stop if you experience pain and seek professional care.
      </div>

      <style>{`
        .nav-link-item:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          color: var(--text-primary) !important;
        }
        @media (max-width: 768px) {
          .sidebar-wrapper {
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid var(--border-color) !important;
            padding: 0.75rem 1rem !important;
          }
          .sidebar-wrapper > div:first-child {
            flex-direction: row !important;
            overflow-x: auto !important;
          }
          .sidebar-wrapper p {
            display: none !important;
          }
          .sidebar-wrapper > div:last-child {
            display: none !important;
          }
        }
      `}</style>
    </aside>
  );
};
