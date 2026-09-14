import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../api/endpoints';
import { ProgressCharts } from '../components/charts/ProgressCharts';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { LineChart, Activity, TrendingUp, Sparkles } from 'lucide-react';

export const ProgressPage = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await analyticsAPI.getProgress();
        setData(res.data);
      } catch (err) {
        console.error('Failed to load progress analytics', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (isLoading) {
    return <LoadingSpinner text="Computing performance progression charts..." />;
  }

  const hasData = data && data.total_sessions > 0;

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <span style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          Adaptive Analytics
        </span>
        <h1 style={{ fontSize: '2rem', color: '#ffffff', marginTop: '0.15rem' }}>
          Progress & Performance Trends
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Track load adaptations, strain capacity, and recovery trends across your training cycle.
        </p>
      </div>

      {hasData ? (
        <ProgressCharts data={data} />
      ) : (
        <EmptyState
          icon={LineChart}
          title="No Progress Analytics Yet"
          description="Log and complete workout sessions to start generating real-time progression graphs."
        />
      )}
    </div>
  );
};
