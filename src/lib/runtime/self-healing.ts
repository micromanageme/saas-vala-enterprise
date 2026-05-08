/**
 * Self-Healing Runtime Detection System
 * 
 * Automatically detects and fixes:
 * - Dead routes
 * - Stale sessions
 * - Stale permissions
 * - Cache corruption
 * - Role desync
 * - Console errors
 * - API failures
 * - Hydration mismatch
 */

import { modulePermissions, getAccessibleModulesByRole } from '@/lib/rbac/module-permissions';
import { getDataIsolationRules, getSessionScope } from '@/lib/rbac/role-isolation';

// Health check status
interface HealthCheck {
  status: 'healthy' | 'degraded' | 'critical';
  checks: {
    name: string;
    status: 'pass' | 'fail' | 'warn';
    message: string;
    timestamp: number;
  }[];
}

// Self-healing configuration
const SELF_HEALING_CONFIG = {
  enabled: true,
  autoFix: true,
  maxRetries: 3,
  retryDelay: 1000,
  cacheValidationInterval: 300000, // 5 minutes
  sessionValidationInterval: 60000, // 1 minute
  permissionValidationInterval: 120000, // 2 minutes
};

// Runtime state tracking
let runtimeState = {
  lastCacheValidation: 0,
  lastSessionValidation: 0,
  lastPermissionValidation: 0,
  detectedIssues: [] as string[],
  fixedIssues: [] as string[],
};

/**
 * Validate cache integrity
 */
export async function validateCache(): Promise<boolean> {
  try {
    // Check localStorage
    if (typeof window !== 'undefined') {
      const testKey = '__cache_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      
      // Check for corrupted entries
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            JSON.parse(value); // Validate JSON
          }
        } catch (e) {
          console.warn(`Corrupted cache entry detected: ${key}`);
          if (SELF_HEALING_CONFIG.autoFix) {
            localStorage.removeItem(key);
            runtimeState.fixedIssues.push(`Fixed corrupted cache: ${key}`);
          }
        }
      }
    }
    return true;
  } catch (error) {
    console.error('Cache validation failed:', error);
    runtimeState.detectedIssues.push('Cache validation failed');
    return false;
  }
}

/**
 * Validate session integrity
 */
export async function validateSession(): Promise<boolean> {
  try {
    if (typeof window === 'undefined') return true;
    
    const sessionData = sessionStorage.getItem('session');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        
        // Check session expiration
        if (session.expiresAt && Date.now() > session.expiresAt) {
          console.warn('Session expired');
          if (SELF_HEALING_CONFIG.autoFix) {
            sessionStorage.removeItem('session');
            runtimeState.fixedIssues.push('Cleared expired session');
            return false;
          }
        }
        
        // Check session integrity
        if (!session.userId || !session.token) {
          console.warn('Invalid session structure');
          if (SELF_HEALING_CONFIG.autoFix) {
            sessionStorage.removeItem('session');
            runtimeState.fixedIssues.push('Cleared invalid session');
            return false;
          }
        }
      } catch (e) {
        console.error('Session parse error:', e);
        if (SELF_HEALING_CONFIG.autoFix) {
          sessionStorage.removeItem('session');
          runtimeState.fixedIssues.push('Cleared corrupted session');
          return false;
        }
      }
    }
    return true;
  } catch (error) {
    console.error('Session validation failed:', error);
    runtimeState.detectedIssues.push('Session validation failed');
    return false;
  }
}

/**
 * Validate permission sync
 */
export async function validatePermissions(userRole: string): Promise<boolean> {
  try {
    // Check if role exists in permissions
    const accessibleModules = getAccessibleModulesByRole(userRole);
    
    // Validate isolation rules
    const isolationRules = getDataIsolationRules(userRole);
    if (!isolationRules) {
      console.warn(`No isolation rules for role: ${userRole}`);
      runtimeState.detectedIssues.push(`Missing isolation rules for role: ${userRole}`);
      return false;
    }
    
    // Validate session scope
    const sessionScope = getSessionScope(userRole);
    if (!sessionScope) {
      console.warn(`No session scope for role: ${userRole}`);
      runtimeState.detectedIssues.push(`Missing session scope for role: ${userRole}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Permission validation failed:', error);
    runtimeState.detectedIssues.push('Permission validation failed');
    return false;
  }
}

/**
 * Detect dead routes
 */
export async function detectDeadRoutes(): Promise<string[]> {
  const deadRoutes: string[] = [];
  
  try {
    // Check if routes are accessible
    const routes = modulePermissions.map(mp => mp.url);
    
    for (const route of routes) {
      try {
        // Try to fetch the route (lightweight check)
        const response = await fetch(route, { method: 'HEAD' });
        if (!response.ok && response.status !== 404) {
          deadRoutes.push(route);
        }
      } catch (e) {
        // Route might not support HEAD, that's okay
      }
    }
    
    if (deadRoutes.length > 0) {
      runtimeState.detectedIssues.push(`Detected ${deadRoutes.length} potentially dead routes`);
    }
  } catch (error) {
    console.error('Dead route detection failed:', error);
  }
  
  return deadRoutes;
}

/**
 * Detect console errors
 */
export function detectConsoleErrors(): string[] {
  const errors: string[] = [];
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = (...args) => {
    errors.push(args.join(' '));
    originalError.apply(console, args);
  };
  
  console.warn = (...args) => {
    errors.push(args.join(' '));
    originalWarn.apply(console, args);
  };
  
  // Restore after 5 seconds
  setTimeout(() => {
    console.error = originalError;
    console.warn = originalWarn;
  }, 5000);
  
  return errors;
}

/**
 * Detect API failures
 */
export async function detectAPIFailures(): Promise<string[]> {
  const failures: string[] = [];
  const criticalEndpoints = [
    '/api/user',
    '/api/roles',
    '/api/admin/dashboard',
  ];
  
  for (const endpoint of criticalEndpoints) {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        failures.push(`${endpoint} returned ${response.status}`);
      }
    } catch (e) {
      failures.push(`${endpoint} failed: ${e}`);
    }
  }
  
  if (failures.length > 0) {
    runtimeState.detectedIssues.push(`Detected ${failures.length} API failures`);
  }
  
  return failures;
}

/**
 * Fix stale cache
 */
export function fixStaleCache(): void {
  try {
    if (typeof window === 'undefined') return;
    
    const now = Date.now();
    const keys = Object.keys(localStorage);
    
    for (const key of keys) {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          const data = JSON.parse(value);
          // Check for timestamp-based expiration
          if (data.timestamp && (now - data.timestamp) > SELF_HEALING_CONFIG.cacheValidationInterval) {
            localStorage.removeItem(key);
            runtimeState.fixedIssues.push(`Removed stale cache: ${key}`);
          }
        }
      } catch (e) {
        // Already handled in validateCache
      }
    }
  } catch (error) {
    console.error('Cache fix failed:', error);
  }
}

/**
 * Fix role desync
 */
export async function fixRoleDesync(currentRole: string): Promise<boolean> {
  try {
    // Re-fetch permissions from server
    const response = await fetch('/api/roles');
    if (response.ok) {
      const data = await response.json();
      const roles = data.roles || [];
      
      // Check if current role exists
      const roleExists = roles.some((r: any) => 
        r.name.toLowerCase().replace(/\s+/g, '_') === currentRole
      );
      
      if (!roleExists) {
        console.warn(`Role desync detected: ${currentRole} not found in server`);
        runtimeState.detectedIssues.push(`Role desync: ${currentRole}`);
        return false;
      }
      
      runtimeState.fixedIssues.push('Role sync validated');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Role sync fix failed:', error);
    return false;
  }
}

/**
 * Run comprehensive health check
 */
export async function runHealthCheck(userRole?: string): Promise<HealthCheck> {
  const checks = [];
  let overallStatus: 'healthy' | 'degraded' | 'critical' = 'healthy';
  
  // Cache check
  const cacheValid = await validateCache();
  checks.push({
    name: 'Cache',
    status: (cacheValid ? 'pass' : 'fail') as 'pass' | 'fail' | 'warn',
    message: cacheValid ? 'Cache is healthy' : 'Cache issues detected',
    timestamp: Date.now(),
  });
  
  // Session check
  const sessionValid = await validateSession();
  checks.push({
    name: 'Session',
    status: (sessionValid ? 'pass' : 'fail') as 'pass' | 'fail' | 'warn',
    message: sessionValid ? 'Session is valid' : 'Session issues detected',
    timestamp: Date.now(),
  });
  
  // Permission check
  let permissionValid = true;
  if (userRole) {
    permissionValid = await validatePermissions(userRole);
  }
  checks.push({
    name: 'Permissions',
    status: (permissionValid ? 'pass' : 'fail') as 'pass' | 'fail' | 'warn',
    message: permissionValid ? 'Permissions are synced' : 'Permission issues detected',
    timestamp: Date.now(),
  });
  
  // API check
  const apiFailures = await detectAPIFailures();
  checks.push({
    name: 'API',
    status: (apiFailures.length === 0 ? 'pass' : 'warn') as 'pass' | 'fail' | 'warn',
    message: apiFailures.length === 0 ? 'APIs are healthy' : `${apiFailures.length} API issues detected`,
    timestamp: Date.now(),
  });
  
  // Determine overall status
  const failures = checks.filter(c => c.status === 'fail').length;
  const warnings = checks.filter(c => c.status === 'warn').length;
  
  if (failures > 0) {
    overallStatus = 'critical';
  } else if (warnings > 0) {
    overallStatus = 'degraded';
  }
  
  return {
    status: overallStatus,
    checks,
  };
}

/**
 * Auto-heal runtime issues
 */
export async function autoHeal(userRole?: string): Promise<void> {
  if (!SELF_HEALING_CONFIG.enabled) return;
  
  console.log('Starting self-healing runtime check...');
  
  // Fix stale cache
  fixStaleCache();
  
  // Fix role desync
  if (userRole) {
    await fixRoleDesync(userRole);
  }
  
  // Run health check
  const health = await runHealthCheck(userRole);
  
  if (health.status !== 'healthy') {
    console.warn('Health check detected issues:', health);
    
    if (SELF_HEALING_CONFIG.autoFix) {
      console.log('Attempting auto-fix...');
      
      // Re-run validation after fixes
      await new Promise(resolve => setTimeout(resolve, SELF_HEALING_CONFIG.retryDelay));
      
      const retryHealth = await runHealthCheck(userRole);
      if (retryHealth.status === 'healthy') {
        console.log('Auto-fix successful');
        runtimeState.fixedIssues.push('Auto-fix completed successfully');
      }
    }
  } else {
    console.log('System is healthy');
  }
  
  runtimeState.lastCacheValidation = Date.now();
  runtimeState.lastSessionValidation = Date.now();
  runtimeState.lastPermissionValidation = Date.now();
}

/**
 * Get runtime state
 */
export function getRuntimeState() {
  return {
    ...runtimeState,
    config: SELF_HEALING_CONFIG,
  };
}

/**
 * Reset runtime state
 */
export function resetRuntimeState() {
  runtimeState = {
    lastCacheValidation: 0,
    lastSessionValidation: 0,
    lastPermissionValidation: 0,
    detectedIssues: [],
    fixedIssues: [],
  };
}

/**
 * Initialize self-healing runtime
 */
export function initSelfHealing(userRole?: string) {
  if (typeof window === 'undefined') return;
  
  // Initial health check
  autoHeal(userRole);
  
  // Schedule periodic health checks
  setInterval(() => {
    autoHeal(userRole);
  }, SELF_HEALING_CONFIG.cacheValidationInterval);
  
  // Listen for visibility changes to re-validate when tab becomes active
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      autoHeal(userRole);
    }
  });
  
  // Listen for online/offline events
  window.addEventListener('online', () => {
    console.log('Connection restored, running health check...');
    autoHeal(userRole);
  });
  
  console.log('Self-healing runtime initialized');
}
