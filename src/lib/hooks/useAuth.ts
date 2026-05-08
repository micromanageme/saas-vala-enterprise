/**
 * SaaS Vala Enterprise - Auth Hook
 * Client-side authentication state management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  token: string | null;
  roles: string[];
  permissions: string[];
  isSuperAdmin: boolean;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    token: null,
    roles: [],
    permissions: [],
    isSuperAdmin: false,
  });

  // Fetch current user
  const { data: userData, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await fetch('/api/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      return response.json();
    },
    enabled: !!localStorage.getItem('accessToken'),
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      return response.json();
    },
    onSuccess: (data: any) => {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      return response.json();
    },
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      queryClient.clear();
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        roles: [],
        permissions: [],
        isSuperAdmin: false,
      });
    },
  });

  // Refresh token mutation
  const refreshMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      return response.json();
    },
    onSuccess: (data: any) => {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    },
  });

  useEffect(() => {
    if (userData) {
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: userData.user,
        token: localStorage.getItem('accessToken'),
        roles: userData.roles,
        permissions: userData.permissions,
        isSuperAdmin: userData.isSuperAdmin,
      });
    } else if (userError) {
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        roles: [],
        permissions: [],
        isSuperAdmin: false,
      });
    }
  }, [userData, userError]);

  return {
    ...authState,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    refresh: refreshMutation.mutateAsync,
    isLoading: authState.isLoading || userLoading,
  };
}
