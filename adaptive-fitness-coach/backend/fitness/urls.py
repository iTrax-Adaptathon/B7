from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from fitness.views import (
    RegisterView, CustomLoginView, ProfileView,
    ExerciseListView, WorkoutPlanListView, WorkoutPlanDetailView,
    NextWorkoutView, WorkoutLogSubmissionView, LatestAdaptationView,
    CalculateAdaptationView, HistoryListView, ProgressAnalyticsView,
    DashboardStatsView
)

urlpatterns = [
    # Auth
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', CustomLoginView.as_view(), name='auth_login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='auth_refresh'),

    # Profile & Onboarding
    path('profile/', ProfileView.as_view(), name='profile_detail'),

    # Exercises
    path('exercises/', ExerciseListView.as_view(), name='exercise_list'),

    # Workouts & Next Workout
    path('workouts/', WorkoutPlanListView.as_view(), name='workout_list'),
    path('workouts/<int:pk>/', WorkoutPlanDetailView.as_view(), name='workout_detail'),
    path('next-workout/', NextWorkoutView.as_view(), name='next_workout'),

    # Logging & Adaptive Execution
    path('logs/', WorkoutLogSubmissionView.as_view(), name='workout_logs'),

    # Adaptation
    path('adaptation/latest/', LatestAdaptationView.as_view(), name='adaptation_latest'),
    path('adaptation/calculate/', CalculateAdaptationView.as_view(), name='adaptation_calculate'),

    # Analytics & History
    path('history/', HistoryListView.as_view(), name='history_list'),
    path('progress/', ProgressAnalyticsView.as_view(), name='progress_analytics'),
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
]
