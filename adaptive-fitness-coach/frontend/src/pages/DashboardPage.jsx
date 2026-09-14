import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI, workoutAPI } from '../api/endpoints';
import { StatusBadge } from '../components/common/StatusBadge';
import { StatCard } from '../components/common/StatCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import {
  Play, Dumbbell, Activity, Calendar, HeartPulse, Sparkles,
  Zap, ArrowRight, ShieldCheck, Flame, Cpu, RefreshCw
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const loadDashboardData = async () => {
    try {
      const res = await analyticsAPI.getDashboardStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await workoutAPI.generateWorkout();
      await loadDashboardData();
    } catch (err) {
      console.error('Failed to regenerate workout', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading your adaptive dashboard..." />;
  }

  const displayName = profile?.name || stats?.user_name || user?.username || 'Athlete';
  const nextWorkout = stats?.next_workout;
  const trainingStatus = stats?.training_status || stats?.latest_adaptation?.decision || 'PROGRESS';
  const latestAdapt = stats?.latest_adaptation;
  const latestSession = stats?.latest_session;

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Greeting & Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Adaptive Training Hub
          </span>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)', color: '#ffffff', marginTop: '0.15rem' }}>
            {getGreeting()}, {displayName}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Goal: <strong style={{ color: '#ffffff' }}>{stats?.fitness_goal}</strong>
          </p>
        </div>

        {/* Training Status Badge */}
        <div className="glass-card" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Training Status
            </span>
            <div style={{ marginTop: '0.2rem' }}>
              <StatusBadge status={trainingStatus} size="md" />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Next Workout Banner */}
      {nextWorkout ? (
        <div
          className="glass-card glow-active"
          style={{
            background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
            border: '1px solid var(--border-highlight)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="badge badge-neutral" style={{ color: 'var(--accent-cyan)' }}>
                  <Sparkles size={12} /> Today's Personalized Workout
                </span>
                <span className="badge badge-neutral">
                  {nextWorkout.estimated_duration} mins
                </span>
              </div>

              <h2 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '0.4rem' }}>
                {nextWorkout.name}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                Focus: <strong style={{ color: '#ffffff' }}>{nextWorkout.focus}</strong> • {nextWorkout.workout_exercises?.length || 0} Adapted Exercises
              </p>

              {/* Exercise Preview Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {nextWorkout.workout_exercises?.map((we, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.8rem',
                      padding: '0.35rem 0.65rem',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {we.exercise?.name} {we.suggested_weight ? `(${we.suggested_weight}kg)` : ''}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to="/workout" className="btn btn-primary btn-lg">
                  <Play size={20} fill="#ffffff" />
                  <span>Start Workout</span>
                </Link>
                <button
                  type="button"
                  onClick={handleRegenerate}
                  className="btn btn-secondary btn-lg"
                  disabled={isRegenerating}
                  title="Generate alternative adapted routine"
                >
                  <RefreshCw size={18} className={isRegenerating ? 'animate-spin' : ''} />
                  <span>{isRegenerating ? 'Regenerating...' : 'Regenerate'}</span>
                </button>
              </div>
            </div>

            {/* Adaptation Score Mini Gauge */}
            {latestAdapt && (
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  minWidth: '220px',
                  textAlign: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
                  <Cpu size={15} />
                  <span>Adaptation Score</span>
                </div>
                <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', margin: '0.25rem 0' }}>
                  {latestAdapt.adaptation_score}<span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>/100</span>
                </div>
                <StatusBadge status={latestAdapt.decision} size="sm" />
              </div>
            )}
          </div>
        </div>
      ) : (
        <EmptyState
          title="No Active Workout Plan"
          description="Generate your first tailored workout routine based on your available equipment and goals."
          actionText="Generate Workout"
          onAction={handleRegenerate}
        />
      )}

      {/* Adaptation Engine Insight Card */}
      {latestAdapt && (
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Cpu size={18} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Why your workout adapted
            </h3>
          </div>
          <p style={{ color: '#f8fafc', fontSize: '0.95rem', lineHeight: 1.5 }}>
            "{latestAdapt.explanation}"
          </p>
        </div>
      )}

      {/* Key Metric Stats Grid */}
      <div className="grid-4">
        <StatCard
          title="This Week"
          value={`${stats?.weekly_workouts || 0} / ${stats?.target_days_per_week || 3}`}
          subtitle="Workouts completed"
          icon={Calendar}
          color="#38bdf8"
        />
        <StatCard
          title="Avg Exertion"
          value={stats?.average_difficulty ? `${stats.average_difficulty} / 5` : '—'}
          subtitle="Perceived workout strain"
          icon={Flame}
          color="#f59e0b"
        />
        <StatCard
          title="Avg Recovery"
          value={stats?.average_recovery ? `${stats.average_recovery} / 5` : '—'}
          subtitle="Physical readiness level"
          icon={HeartPulse}
          color="#10b981"
        />
        <StatCard
          title="Equipment Mode"
          value={stats?.gym_access ? 'Full Gym' : `${stats?.available_equipment?.length || 0} Items`}
          subtitle={stats?.gym_access ? 'All machines & free weights' : (stats?.available_equipment?.slice(0, 2).join(', ') || 'Bodyweight')}
          icon={Dumbbell}
          color="#818cf8"
        />
      </div>

      {/* Equipment & Recent Activity Section */}
      <div className="grid-2">
        {/* Equipment Summary */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} color="var(--accent-cyan)" /> Available Equipment
            </h3>
            <Link to="/profile" style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
              Edit
            </Link>
          </div>

          {stats?.gym_access ? (
            <div style={{ padding: '0.85rem 1rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.25)', fontSize: '0.9rem', color: '#10b981' }}>
              ✓ Full Gym Access Enabled (Barbells, Dumbbells, Machines, Cables, Cardio)
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {stats?.available_equipment && stats.available_equipment.length > 0 ? (
                stats.available_equipment.map((eq, i) => (
                  <span key={i} className="badge badge-neutral" style={{ fontSize: '0.8rem' }}>
                    {eq}
                  </span>
                ))
              ) : (
                <span className="badge badge-neutral">No Equipment (Bodyweight Only)</span>
              )}
            </div>
          )}
        </div>

        {/* Latest Completed Session */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} color="#10b981" /> Recent Activity
            </h3>
            <Link to="/history" style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
              View History
            </Link>
          </div>

          {latestSession ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>{latestSession.workout_name}</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(latestSession.started_at).toLocaleDateString()}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <span>Difficulty: <strong>{latestSession.difficulty_rating}/5</strong></span>
                <span>Recovery: <strong>{latestSession.recovery_rating}/5</strong></span>
                <span>Exercises: <strong>{latestSession.exercise_logs?.length || 0}</strong></span>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No workouts completed yet. Start your first session to calibrate your history.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
