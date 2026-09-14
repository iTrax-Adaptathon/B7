import apiClient from './client';

export const authAPI = {
  register: (data) => apiClient.post('/auth/register/', data),
  login: (data) => apiClient.post('/auth/login/', data),
  refresh: (refresh) => apiClient.post('/auth/refresh/', { refresh }),
};

export const profileAPI = {
  getProfile: () => apiClient.get('/profile/'),
  updateProfile: (data) => apiClient.patch('/profile/', data),
};

export const exerciseAPI = {
  getExercises: (params) => apiClient.get('/exercises/', { params }),
};

export const workoutAPI = {
  getWorkouts: () => apiClient.get('/workouts/'),
  getWorkoutDetail: (id) => apiClient.get(`/workouts/${id}/`),
  getNextWorkout: () => apiClient.get('/next-workout/'),
  generateWorkout: () => apiClient.post('/workouts/'),
};

export const logAPI = {
  getLogs: () => apiClient.get('/logs/'),
  submitWorkout: (data) => apiClient.post('/logs/', data),
};

export const adaptationAPI = {
  getLatest: () => apiClient.get('/adaptation/latest/'),
  calculate: () => apiClient.post('/adaptation/calculate/'),
};

export const analyticsAPI = {
  getHistory: (params) => apiClient.get('/history/', { params }),
  getProgress: () => apiClient.get('/progress/'),
  getDashboardStats: () => apiClient.get('/dashboard/stats/'),
};
