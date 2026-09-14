import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Activity, Sparkles, TrendingUp, Sliders, ShieldCheck,
  Zap, ArrowRight, CheckCircle2, Dumbbell, Flame, HeartPulse, RefreshCw
} from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  const cycleSteps = [
    {
      step: '01',
      title: 'Track Performance',
      desc: 'Log real sets, reps, actual weights, hold times, and rate your workout difficulty & energy.',
      icon: Dumbbell,
      color: '#38bdf8',
    },
    {
      step: '02',
      title: 'Analyze Recovery',
      desc: 'Our multi-signal engine processes strain, RPE, and physical readiness across rolling sessions.',
      icon: HeartPulse,
      color: '#818cf8',
    },
    {
      step: '03',
      title: 'Adapt Program',
      desc: 'Calculates a 0–100 adaptation score and selects PROGRESS, HOLD, or BACK OFF with safety overrides.',
      icon: Sparkles,
      color: '#f59e0b',
    },
    {
      step: '04',
      title: 'Consistent Progress',
      desc: 'Next workout targets automatically adjust with smart progression and strict equipment filtering.',
      icon: TrendingUp,
      color: '#10b981',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '5rem 1.5rem 4rem',
          textAlign: 'center',
          overflow: 'hidden',
          background: 'radial-gradient(circle at 50% 20%, rgba(56, 189, 248, 0.12) 0%, transparent 60%)',
        }}
      >
        <div style={{ maxWidth: '840px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid var(--border-highlight)',
              color: 'var(--accent-cyan)',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={16} />
            <span>Next-Generation Adaptive Strength Engine</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
              lineHeight: 1.1,
              marginBottom: '1.25rem',
              color: '#ffffff',
            }}
          >
            Your workout <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>adapts to you.</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              maxWidth: '680px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6,
            }}
          >
            Fixed workout programs fail when life, fatigue, or recovery shifts. Track your performance, tell us how you feel, and get a workout plan that continuously adapts to your progress.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={isAuthenticated ? '/dashboard' : '/register'} className="btn btn-primary btn-lg">
              <Sparkles size={20} />
              <span>{isAuthenticated ? 'Go to Dashboard' : 'Get Started'}</span>
              <ArrowRight size={18} />
            </Link>
            {!isAuthenticated && (
              <Link to="/login" className="btn btn-secondary btn-lg">
                Log In
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Visual Adaptation Cycle Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '0.5rem' }}>
            The Adaptive Cycle
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Track → Analyze → Adapt → Progress
          </p>
        </div>

        <div className="grid-4">
          {cycleSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="glass-card glass-card-interactive"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: 'var(--radius-md)',
                      background: `rgba(${step.color === '#38bdf8' ? '56, 189, 248' : step.color === '#10b981' ? '16, 185, 129' : step.color === '#f59e0b' ? '245, 158, 11' : '129, 140, 248'}, 0.15)`,
                      color: step.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                    {step.step}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.4rem' }}>
                    {step.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Highlights */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem', width: '100%' }}>
        <div className="grid-3">
          <div className="glass-card">
            <div style={{ color: 'var(--accent-cyan)', marginBottom: '0.75rem' }}>
              <ShieldCheck size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.4rem' }}>
              Strict Equipment Filtering
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Only have dumbbells or bodyweight? Incompatible barbell and machine exercises are filtered out before workout generation.
            </p>
          </div>

          <div className="glass-card">
            <div style={{ color: '#10b981', marginBottom: '0.75rem' }}>
              <Sliders size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.4rem' }}>
              Configurable Progression
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Select fixed jumps (+1.25kg, +2.5kg, +5kg) or percentage scaling (+2.5%, +5%, +7.5%) tailored to your strength capacity.
            </p>
          </div>

          <div className="glass-card">
            <div style={{ color: '#f59e0b', marginBottom: '0.75rem' }}>
              <RefreshCw size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.4rem' }}>
              Transparent Explanations
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Every adaptation comes with a plain-English explanation generated directly from your performance and recovery signals.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: 'auto',
          borderTop: '1px solid var(--border-color)',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
        }}
      >
        <p>© 2026 Adaptive Fitness Coach. All rights reserved.</p>
        <p style={{ marginTop: '0.4rem', fontSize: '0.75rem', maxWidth: '600px', margin: '0.4rem auto 0' }}>
          This application provides general fitness guidance, not medical advice. Always listen to your body and consult a healthcare professional.
        </p>
      </footer>
    </div>
  );
};
