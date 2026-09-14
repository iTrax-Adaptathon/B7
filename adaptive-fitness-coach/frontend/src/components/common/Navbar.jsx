import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity, LogOut, User, Dumbbell, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const { isAuthenticated, user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      style={{
        background: 'rgba(11, 15, 23, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          to={isAuthenticated ? '/dashboard' : '/'}
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <Activity size={22} />
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
              Adaptive<span style={{ color: 'var(--accent-cyan)' }}>Coach</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1 }}>
              Your workout adapts to you
            </span>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid var(--border-highlight)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-cyan)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}
                >
                  {(profile?.name || user?.username || 'U')[0].toUpperCase()}
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }} className="hide-mobile">
                  {profile?.name || user?.username}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Log out"
                style={{ padding: '0.4rem 0.75rem' }}
              >
                <LogOut size={16} />
                <span className="hide-mobile">Log Out</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <Sparkles size={16} />
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 640px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
};
