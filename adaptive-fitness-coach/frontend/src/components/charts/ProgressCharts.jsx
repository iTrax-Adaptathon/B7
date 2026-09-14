import React, { useState } from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { TrendingUp, Activity, Calendar, Shield } from 'lucide-react';

export const ProgressCharts = ({ data }) => {
  const { weight_history = {}, session_trends = [], decision_counts = {}, score_trend = [] } = data || {};
  const exerciseKeys = Object.keys(weight_history);
  const [selectedExercise, setSelectedExercise] = useState(exerciseKeys[0] || '');

  const activeWeightData = (selectedExercise && weight_history[selectedExercise]) || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. Weight Progression Chart */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>Working Weight Progression</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Adapted load progression tracked session-over-session.
            </p>
          </div>
          {exerciseKeys.length > 0 && (
            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '180px' }}
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
            >
              {exerciseKeys.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          )}
        </div>

        {activeWeightData.length > 0 ? (
          <div>
            {/* SVG Line Chart */}
            <div style={{ width: '100%', height: '220px', position: 'relative' }}>
              <svg viewBox="0 0 500 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Gridlines */}
                <line x1="40" y1="30" x2="480" y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
                <line x1="40" y1="90" x2="480" y2="90" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
                <line x1="40" y1="150" x2="480" y2="150" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />

                {(() => {
                  const weights = activeWeightData.map((d) => d.weight);
                  const minW = Math.max(0, Math.min(...weights) - 5);
                  const maxW = Math.max(...weights) + 5;
                  const range = maxW - minW || 10;

                  const points = activeWeightData.map((d, idx) => {
                    const x = activeWeightData.length === 1
                      ? 260
                      : 40 + (idx / (activeWeightData.length - 1)) * 440;
                    const y = 160 - ((d.weight - minW) / range) * 130;
                    return { x, y, ...d };
                  });

                  const pathD = points.length === 1
                    ? `M 40,${points[0].y} L 480,${points[0].y}`
                    : points.reduce((acc, p, i) => (i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`), '');

                  const areaD = points.length === 1
                    ? `M 40,${points[0].y} L 480,${points[0].y} L 480,180 L 40,180 Z`
                    : `${pathD} L ${points[points.length - 1].x},180 L ${points[0].x},180 Z`;

                  return (
                    <>
                      <path d={areaD} fill="url(#weightGrad)" />
                      <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="3" />
                      {points.map((p, idx) => (
                        <g key={idx}>
                          <circle cx={p.x} cy={p.y} r="5" fill="#0b0f17" stroke="#38bdf8" strokeWidth="2.5" />
                          <text x={p.x} y={p.y - 10} fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="600">
                            {p.weight}kg
                          </text>
                          <text x={p.x} y="195" fill="var(--text-muted)" fontSize="9" textAnchor="middle">
                            {p.date}
                          </text>
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>
            </div>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>
            No weighted exercise data recorded yet.
          </p>
        )}
      </div>

      {/* 2. RPE vs Recovery Trends */}
      <div className="glass-card">
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>Strain (RPE) vs. Recovery Readiness</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Monitoring the balance between exertion and physical readiness.
          </p>
        </div>

        {session_trends.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {session_trends.slice(-6).map((s, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr 1fr',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.85rem' }}>{s.workout_name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.date}</div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '2px' }}>
                    <span style={{ color: '#f59e0b' }}>Avg RPE: {s.avg_rpe || (s.difficulty * 2)}/10</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, ((s.avg_rpe || s.difficulty * 2) / 10) * 100)}%`,
                        background: '#f59e0b',
                        borderRadius: '3px',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '2px' }}>
                    <span style={{ color: '#10b981' }}>Recovery: {s.recovery || 3}/5</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${((s.recovery || 3) / 5) * 100}%`,
                        background: '#10b981',
                        borderRadius: '3px',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>
            Complete your first workout to track exertion and recovery metrics.
          </p>
        )}
      </div>

      {/* 3. Adaptation Decisions Distribution */}
      <div className="glass-card">
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>Adaptation Engine Decision Distribution</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Historical breakdown of PROGRESS, HOLD, and BACK OFF calibrations.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--color-progress-bg)', border: '1px solid var(--color-progress-border)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-progress)', fontWeight: 700 }}>PROGRESS</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>{decision_counts.PROGRESS || 0}</div>
          </div>
          <div style={{ background: 'var(--color-hold-bg)', border: '1px solid var(--color-hold-border)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-hold)', fontWeight: 700 }}>HOLD</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b' }}>{decision_counts.HOLD || 0}</div>
          </div>
          <div style={{ background: 'var(--color-backoff-bg)', border: '1px solid var(--color-backoff-border)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-backoff)', fontWeight: 700 }}>BACK OFF</span>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f43f5e' }}>{decision_counts.BACK_OFF || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
