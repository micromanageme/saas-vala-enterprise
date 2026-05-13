// @ts-nocheck
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

const isBrowser = typeof window !== 'undefined';

function getStoredToken(key: 'accessToken' | 'refreshToken') {
  if (!isBrowser) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function clearStoredTokens() {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('refreshToken');
  } catch {}
}

export function useAuth() {
  const queryClient = useQueryClient();
  const [accessToken, setAccessToken] = useState<string | null>(() => getStoredToken('accessToken'));
  const [refreshToken, setRefreshToken] = useState<string | null>(() => getStoredToken('refreshToken'));
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: isBrowser,
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
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      return response.json();
    },
    enabled: !!accessToken,
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
      if (isBrowser) {
        window.localStorage.setItem('accessToken', data.accessToken);
        window.localStorage.setItem('refreshToken', data.refreshToken);
      }
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken ?? ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      return response.json();
    },
    onSuccess: () => {
      clearStoredTokens();
      setAccessToken(null);
      setRefreshToken(null);
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
          Authorization: `Bearer ${refreshToken ?? ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      return response.json();
    },
    onSuccess: (data: any) => {
      if (isBrowser) {
        window.localStorage.setItem('accessToken', data.accessToken);
        window.localStorage.setItem('refreshToken', data.refreshToken);
      }
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
    },
  });

  useEffect(() => {
    setAccessToken(getStoredToken('accessToken'));
    setRefreshToken(getStoredToken('refreshToken'));
  }, []);

  useEffect(() => {
    if (userData) {
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: userData.user,
        token: accessToken,
        roles: userData.roles,
        permissions: userData.permissions,
        isSuperAdmin: userData.isSuperAdmin,
      });
    } else if (userError) {
      clearStoredTokens();
      setAccessToken(null);
      setRefreshToken(null);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        roles: [],
        permissions: [],
        isSuperAdmin: false,
      });
    } else if (!accessToken) {
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
  }, [accessToken, userData, userError]);

  return {
    ...authState,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    refresh: refreshMutation.mutateAsync,
    isLoading: authState.isLoading || userLoading,
  };
}