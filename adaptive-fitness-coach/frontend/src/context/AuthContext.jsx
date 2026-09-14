import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, profileAPI } from '../api/endpoints';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfileData = async () => {
    try {
      const res = await profileAPI.getProfile();
      setProfile(res.data);
      return res.data;
    } catch (err) {
      console.error('Failed to load profile', err);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          await fetchProfileData();
        } catch (e) {
          console.error('Session restore failed', e);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();

    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (username, password) => {
    const res = await authAPI.login({ username, password });
    const { access, refresh, user: userData } = res.data;

    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user', JSON.stringify(userData || { username }));

    setUser(userData || { username });
    const prof = await fetchProfileData();
    return { user: userData, profile: prof };
  };

  const register = async (username, email, password, name) => {
    const res = await authAPI.register({ username, email, password, name });
    const { tokens, user: userData } = res.data;

    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('user', JSON.stringify(userData));

    setUser(userData);
    const prof = await fetchProfileData();
    return { user: userData, profile: prof };
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    return await fetchProfileData();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
