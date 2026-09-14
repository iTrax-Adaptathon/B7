import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutAPI, logAPI } from '../api/endpoints';
import { ExerciseCard } from '../components/workout/ExerciseCard';
import { PostWorkoutModal } from '../components/workout/PostWorkoutModal';
import { AdaptationResultModal } from '../components/workout/AdaptationResultModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { CheckCircle2, Flame, Clock, Sparkles, ArrowRight, Shield } from 'lucide-react';

export const WorkoutPage = () => {
  const navigate = useNavigate();

  const [workout, setWorkout] = useState(null);
  const [exercisesState, setExercisesState] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adaptationResult, setAdaptationResult] = useState(null);
  const [nextWorkoutData, setNextWorkoutData] = useState(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Load next active workout
  useEffect(() => {
    const loadWorkout = async () => {
      try {
        const res = await workoutAPI.getNextWorkout();
        const activePlan = res.data.workout;

        if (activePlan && activePlan.workout_exercises) {
          setWorkout(activePlan);

          // Initialize exercise execution states
          const initialMap = {};
          activePlan.workout_exercises.forEach((we) => {
            const exId = we.exercise.id;
            const targetSetsCount = we.target_sets || 3;
            const setsArray = [];

            for (let i = 0; i < targetSetsCount; i++) {
              setsArray.push({
                weight: we.suggested_weight !== null && we.suggested_weight !== undefined ? we.suggested_weight : 10,
                reps: we.target_reps || 10,
                duration: we.target_duration_seconds || 30,
                completed: false,
              });
            }

            initialMap[exId] = {
              sets: setsArray,
              rpe: 7.0,
            };
          });

          setExercisesState(initialMap);
        }
      } catch (err) {
        console.error('Failed to load active workout', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkout();
  }, []);

  // Workout duration timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExerciseUpdate = (exId, updatedData) => {
    setExercisesState((prev) => ({
      ...prev,
      [exId]: updatedData,
    }));
  };

  const handleFinishWorkoutClick = () => {
    setIsPostModalOpen(true);
  };

  const handleModalSubmit = async (feedbackData) => {
    setIsSubmitting(true);
    try {
      // Build structured payload for backend
      const formattedExercises = workout.workout_exercises.map((we) => {
        const exState = exercisesState[we.exercise.id] || { sets: [], rpe: 7.0 };
        const completedSets = exState.sets.filter((s) => s.completed);
        const actualSetsCount = completedSets.length > 0 ? completedSets.length : exState.sets.length;

        // Calculate average actual weight & reps
        const sumWeight = exState.sets.reduce((acc, s) => acc + (s.weight || 0), 0);
        const avgWeight = exState.sets.length ? sumWeight / exState.sets.length : we.suggested_weight;

        const sumReps = exState.sets.reduce((acc, s) => acc + (s.reps || 0), 0);
        const avgReps = exState.sets.length ? Math.round(sumReps / exState.sets.length) : we.target_reps;

        const sumDur = exState.sets.reduce((acc, s) => acc + (s.duration || 0), 0);
        const avgDur = exState.sets.length ? Math.round(sumDur / exState.sets.length) : we.target_duration_seconds;

        return {
          exercise_id: we.exercise.id,
          planned_sets: we.target_sets,
          planned_reps: we.target_reps,
          planned_duration: we.target_duration_seconds,
          planned_weight: we.suggested_weight,
          actual_sets: actualSetsCount,
          actual_reps: we.exercise.is_bodyweight ? (we.target_duration_seconds ? null : avgReps) : avgReps,
          actual_duration: we.target_duration_seconds ? avgDur : null,
          actual_weight: we.exercise.is_bodyweight ? null : avgWeight,
          rpe: exState.rpe || 7.0,
        };
      });

      const submissionPayload = {
        workout_plan_id: workout.id,
        workout_name: workout.name,
        difficulty_rating: feedbackData.difficulty_rating,
        energy_rating: feedbackData.energy_rating,
        recovery_rating: feedbackData.recovery_rating,
        notes: feedbackData.notes,
        exercises: formattedExercises,
      };

      const res = await logAPI.submitWorkout(submissionPayload);

      setIsPostModalOpen(false);
      setAdaptationResult(res.data.adaptation_result);
      setNextWorkoutData(res.data.next_workout);
      setIsResultModalOpen(true);
    } catch (err) {
      console.error('Failed to submit workout', err);
      alert('Error submitting workout. Please check your network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Assembling your personalized session..." />;
  }

  if (!workout) {
    return (
      <div className="page-wrapper">
        <EmptyState
          title="No Workout Generated"
          description="You don't have an active workout yet. Generate one to get moving."
          actionText="Go to Dashboard"
          onAction={() => navigate('/dashboard')}
        />
      </div>
    );
  }

  const totalSets = Object.values(exercisesState).reduce(
    (acc, ex) => acc + (ex.sets?.length || 0),
    0
  );
  const completedSetsCount = Object.values(exercisesState).reduce(
    (acc, ex) => acc + (ex.sets?.filter((s) => s.completed).length || 0),
    0
  );

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Workout Header Bar */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span className="badge badge-neutral" style={{ color: 'var(--accent-cyan)' }}>
              Active Workout
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {workout.focus}
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem', color: '#ffffff' }}>{workout.name}</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Timer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
            <Clock size={18} />
            <span>{formatTimer(timerSeconds)}</span>
          </div>

          <button
            type="button"
            onClick={handleFinishWorkoutClick}
            className="btn btn-primary"
          >
            <CheckCircle2 size={18} />
            <span>Finish Workout</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-full)', padding: '3px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', padding: '0 0.5rem 0.3rem' }}>
          <span>Overall Set Completion</span>
          <span>{completedSetsCount} of {totalSets} sets done ({totalSets ? Math.round((completedSetsCount / totalSets) * 100) : 0}%)</span>
        </div>
        <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${totalSets ? (completedSetsCount / totalSets) * 100 : 0}%`,
              background: 'linear-gradient(90deg, #38bdf8, #10b981)',
              borderRadius: '4px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      {/* Exercise Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {workout.workout_exercises?.map((we) => (
          <ExerciseCard
            key={we.id}
            workoutExercise={we}
            exerciseData={exercisesState[we.exercise.id] || { sets: [], rpe: 7.0 }}
            onExerciseUpdate={handleExerciseUpdate}
          />
        ))}
      </div>

      {/* Bottom Floating/Sticky Action Bar */}
      <div
        style={{
          position: 'sticky',
          bottom: '20px',
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--border-highlight)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Flame size={20} color="#f59e0b" />
          <span style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600 }}>
            {completedSetsCount === totalSets ? 'All sets completed! Ready to adapt.' : `${totalSets - completedSetsCount} sets remaining`}
          </span>
        </div>

        <button
          type="button"
          onClick={handleFinishWorkoutClick}
          className="btn btn-primary"
        >
          <span>Complete & Submit Session</span>
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Post Workout Rating Modal */}
      <PostWorkoutModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSubmit={handleModalSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Immediate Adaptation Result Modal */}
      <AdaptationResultModal
        isOpen={isResultModalOpen}
        adaptationResult={adaptationResult}
        nextWorkout={nextWorkoutData}
        onClose={() => setIsResultModalOpen(false)}
      />
    </div>
  );
};
