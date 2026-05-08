/**
 * SaaS Vala Enterprise - Route Protection
 * Client-side route protection using TanStack Router
 */

import { redirect } from '@tanstack/react-router';
import { useAuth } from '@/lib/hooks/useAuth';
import { hasModuleAccess } from '@/lib/rbac/module-permissions';

export function checkAuth(isAuthenticated: boolean, isLoading: boolean) {
  if (isLoading) {
    return { authorized: false, loading: true };
  }

  if (!isAuthenticated) {
    throw redirect({ to: '/welcome' });
  }

  return { authorized: true, loading: false };
}

export function checkModuleAccess(
  roles: string[],
  isSuperAdmin: boolean,
  moduleUrl: string,
  isLoading: boolean
) {
  if (isLoading) {
    return { authorized: false, loading: true };
  }

  if (!isSuperAdmin && !roles.some((role) => hasModuleAccess(role, moduleUrl))) {
    throw redirect({ to: '/dashboard' });
  }

  return { authorized: true, loading: false };
}
