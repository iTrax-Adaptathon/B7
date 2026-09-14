import React, { useState, useEffect } from 'react';
import { analyticsAPI, exerciseAPI } from '../api/endpoints';
import { StatusBadge } from '../components/common/StatusBadge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { History, Calendar, Dumbbell, Activity, Filter, ChevronDown, ChevronUp } from 'lucide-react';

export const HistoryPage = () => {
  const [sessions, setSessions] = useState([]);
  const [exercisesList, setExercisesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSessionId, setExpandedSessionId] = useState(null);

  // Filters
  const [selectedDecision, setSelectedDecision] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [searchWorkout, setSearchWorkout] = useState('');

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (selectedDecision) params.decision = selectedDecision;
      if (selectedExercise) params.exercise_id = selectedExercise;
      if (searchWorkout) params.workout_name = searchWorkout;

      const [resSessions, resExercises] = await Promise.all([
        analyticsAPI.getHistory(params),
        exerciseAPI.getExercises(),
      ]);

      setSessions(resSessions.data);
      setExercisesList(resExercises.data);
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [selectedDecision, selectedExercise]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  const toggleExpand = (id) => {
    setExpandedSessionId(expandedSessionId === id ? null : id);
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Workout Logs
        </span>
        <h1 style={{ fontSize: '2rem', color: '#ffffff', marginTop: '0.15rem' }}>
          Workout History & Performance Logs
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Review your logged sessions, exercise performance, and engine adaptation decisions.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 200px' }}>
            <input
              type="text"
              placeholder="Search by workout name..."
              value={searchWorkout}
              onChange={(e) => setSearchWorkout(e.target.value)}
              className="form-input"
            />
          </div>

          <div style={{ minWidth: '160px' }}>
            <select
              value={selectedDecision}
              onChange={(e) => setSelectedDecision(e.target.value)}
              className="form-select"
            >
              <option value="">All Decisions</option>
              <option value="PROGRESS">PROGRESS</option>
              <option value="HOLD">HOLD</option>
              <option value="BACK_OFF">BACK OFF</option>
            </select>
          </div>

          <div style={{ minWidth: '180px' }}>
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="form-select"
            >
              <option value="">All Exercises</option>
              {exercisesList.map((ex) => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-secondary">
            <Filter size={16} /> Filter
          </button>
        </form>
      </div>

      {/* Sessions List */}
      {isLoading ? (
        <LoadingSpinner text="Retrieving workout history..." />
      ) : sessions.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {sessions.map((s) => {
            const isExpanded = expandedSessionId === s.id;
            return (
              <div key={s.id} className="glass-card" style={{ padding: '1.25rem' }}>
                <div
                  onClick={() => toggleExpand(s.id)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.3rem' }}>
                      <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>{s.workout_name}</h3>
                      {s.adaptation_decision && (
                        <StatusBadge status={s.adaptation_decision} size="sm" />
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={14} /> {new Date(s.started_at).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>Difficulty: <strong>{s.difficulty_rating}/5</strong></span>
                      <span>•</span>
                      <span>Energy: <strong>{s.energy_rating}/5</strong></span>
                      <span>•</span>
                      <span>Recovery: <strong>{s.recovery_rating}/5</strong></span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>
                      {s.exercise_logs?.length || 0} Exercises
                    </span>
                    {isExpanded ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                  </div>
                </div>

                {/* Expanded Exercise Logs Table */}
                {isExpanded && (
                  <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    {s.notes && (
                      <div style={{ marginBottom: '1rem', padding: '0.6rem 0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <strong>Notes:</strong> {s.notes}
                      </div>
                    )}

                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
                            <th style={{ padding: '0.6rem 0.75rem' }}>Exercise</th>
                            <th style={{ padding: '0.6rem 0.75rem' }}>Planned Target</th>
                            <th style={{ padding: '0.6rem 0.75rem' }}>Actual Performance</th>
                            <th style={{ padding: '0.6rem 0.75rem' }}>RPE</th>
                          </tr>
                        </thead>
                        <tbody>
                          {s.exercise_logs?.map((log) => (
                            <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                              <td style={{ padding: '0.75rem', fontWeight: 600, color: '#ffffff' }}>
                                {log.exercise_name}
                              </td>
                              <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>
                                {log.is_bodyweight
                                  ? (log.planned_duration ? `${log.planned_sets} × ${log.planned_duration}s` : `${log.planned_sets} × ${log.planned_reps || 10}`)
                                  : `${log.planned_sets} × ${log.planned_reps || 10} @ ${log.planned_weight || 10}kg`}
                              </td>
                              <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                                {log.is_bodyweight
                                  ? (log.actual_duration ? `${log.actual_sets} × ${log.actual_duration}s` : `${log.actual_sets} × ${log.actual_reps || 10}`)
                                  : `${log.actual_sets} × ${log.actual_reps || 10} @ ${log.actual_weight || 10}kg`}
                              </td>
                              <td style={{ padding: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>
                                {log.rpe || '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No Workout Sessions Found"
          description="Try adjusting your filters or complete a new workout session."
        />
      )}
    </div>
  );
};
