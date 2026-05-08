/**
 * Role Isolation Engine
 * 
 * Provides hybrid isolated role architecture with:
 * - Isolated permission domains
 * - Isolated data visibility
 * - Isolated workflow boundaries
 * - Isolated module access
 * - Isolated analytics visibility
 * - Isolated cache/session scopes
 * - Isolated tenant/branch access
 * 
 * BUT allows:
 * - Controlled upward hierarchy
 * - Controlled delegated access
 * - Controlled impersonation
 * - Controlled escalation
 * - Controlled approval workflows
 */

import { modulePermissions, getAccessibleModulesByRole } from './module-permissions';

// Role hierarchy for controlled upward access
const ROLE_HIERARCHY: Record<string, string[]> = {
  super_admin: [],
  erp_admin: ['super_admin'],
  admin: ['erp_admin', 'super_admin'],
  root_admin: ['super_admin'],
  // C-level executives
  ceo: ['super_admin'],
  cto: ['super_admin'],
  cfo: ['super_admin'],
  cmo: ['super_admin'],
  ciso: ['super_admin'],
  cio: ['super_admin'],
  chro: ['super_admin'],
  coo: ['super_admin'],
  // Directors
  platform_architect: ['cto', 'super_admin'],
  data_director: ['cto', 'ceo', 'super_admin'],
  security_director: ['ciso', 'super_admin'],
  infrastructure_director: ['cto', 'super_admin'],
  governance_director: ['ceo', 'super_admin'],
  forensics_director: ['ciso', 'super_admin'],
  communications_director: ['cmo', 'super_admin'],
  // Managers
  sales_manager: ['ceo', 'coo', 'super_admin'],
  crm_manager: ['sales_manager', 'ceo', 'coo', 'super_admin'],
  hr_manager: ['chro', 'ceo', 'super_admin'],
  inventory_manager: ['coo', 'ceo', 'super_admin'],
  finance_manager: ['cfo', 'ceo', 'super_admin'],
  analytics_manager: ['data_director', 'cto', 'ceo', 'super_admin'],
  support_manager: ['communications_director', 'cmo', 'super_admin'],
  security_manager: ['security_director', 'ciso', 'super_admin'],
  ai_manager: ['data_director', 'cto', 'ceo', 'super_admin'],
  api_manager: ['platform_architect', 'cto', 'super_admin'],
  devops_manager: ['infrastructure_director', 'cto', 'super_admin'],
  engineering_manager: ['platform_architect', 'cto', 'ceo', 'super_admin'],
};

// Data isolation rules per role
const DATA_ISOLATION_RULES: Record<string, {
  tenantScope: 'all' | 'assigned' | 'own';
  branchScope: 'all' | 'assigned' | 'own';
  sensitiveData: 'full' | 'partial' | 'none';
  personalData: 'full' | 'partial' | 'none';
  financialData: 'full' | 'partial' | 'none';
}> = {
  super_admin: {
    tenantScope: 'all',
    branchScope: 'all',
    sensitiveData: 'full',
    personalData: 'full',
    financialData: 'full',
  },
  erp_admin: {
    tenantScope: 'all',
    branchScope: 'all',
    sensitiveData: 'full',
    personalData: 'partial',
    financialData: 'full',
  },
  admin: {
    tenantScope: 'assigned',
    branchScope: 'assigned',
    sensitiveData: 'partial',
    personalData: 'partial',
    financialData: 'partial',
  },
  root_admin: {
    tenantScope: 'all',
    branchScope: 'all',
    sensitiveData: 'full',
    personalData: 'full',
    financialData: 'full',
  },
  // C-level executives
  ceo: {
    tenantScope: 'all',
    branchScope: 'all',
    sensitiveData: 'full',
    personalData: 'partial',
    financialData: 'full',
  },
  cto: {
    tenantScope: 'all',
    branchScope: 'all',
    sensitiveData: 'full',
    personalData: 'none',
    financialData: 'partial',
  },
  cfo: {
    tenantScope: 'all',
    branchScope: 'all',
    sensitiveData: 'partial',
    personalData: 'none',
    financialData: 'full',
  },
  ciso: {
    tenantScope: 'all',
    branchScope: 'all',
    sensitiveData: 'full',
    personalData: 'partial',
    financialData: 'none',
  },
  // Default isolation for standard roles
  default: {
    tenantScope: 'assigned',
    branchScope: 'assigned',
    sensitiveData: 'none',
    personalData: 'partial',
    financialData: 'none',
  },
};

// Workflow isolation rules
const WORKFLOW_ISOLATION_RULES: Record<string, {
  canApprove: string[];
  canDelegate: string[];
  canEscalate: string[];
  canImpersonate: string[];
}> = {
  super_admin: {
    canApprove: ['all'],
    canDelegate: ['all'],
    canEscalate: ['all'],
    canImpersonate: ['all'],
  },
  erp_admin: {
    canApprove: ['erp', 'finance', 'operations'],
    canDelegate: ['sales', 'crm', 'hr'],
    canEscalate: ['super_admin'],
    canImpersonate: ['admin', 'sales_manager', 'crm_manager'],
  },
  admin: {
    canApprove: ['basic'],
    canDelegate: ['staff'],
    canEscalate: ['erp_admin', 'super_admin'],
    canImpersonate: [],
  },
  // Default workflow rules
  default: {
    canApprove: [],
    canDelegate: [],
    canEscalate: ['admin', 'erp_admin', 'super_admin'],
    canImpersonate: [],
  },
};

/**
 * Check if a role has upward hierarchy access to another role
 */
export function hasHierarchyAccess(currentRole: string, targetRole: string): boolean {
  const hierarchy = ROLE_HIERARCHY[currentRole];
  if (!hierarchy) return false;
  return hierarchy.includes(targetRole) || hierarchy.some(r => hasHierarchyAccess(r, targetRole));
}

/**
 * Get data isolation rules for a role
 */
export function getDataIsolationRules(role: string) {
  return DATA_ISOLATION_RULES[role] || DATA_ISOLATION_RULES.default;
}

/**
 * Get workflow isolation rules for a role
 */
export function getWorkflowIsolationRules(role: string) {
  return WORKFLOW_ISOLATION_RULES[role] || WORKFLOW_ISOLATION_RULES.default;
}

/**
 * Check if a role can access data for a specific tenant
 */
export function canAccessTenant(role: string, tenantId: string, assignedTenants: string[]): boolean {
  const rules = getDataIsolationRules(role);
  if (rules.tenantScope === 'all') return true;
  if (rules.tenantScope === 'assigned') return assignedTenants.includes(tenantId);
  return false;
}

/**
 * Check if a role can access data for a specific branch
 */
export function canAccessBranch(role: string, branchId: string, assignedBranches: string[]): boolean {
  const rules = getDataIsolationRules(role);
  if (rules.branchScope === 'all') return true;
  if (rules.branchScope === 'assigned') return assignedBranches.includes(branchId);
  return false;
}

/**
 * Check if a role can view sensitive data
 */
export function canViewSensitiveData(role: string, dataType: 'sensitive' | 'personal' | 'financial'): boolean {
  const rules = getDataIsolationRules(role);
  switch (dataType) {
    case 'sensitive': return rules.sensitiveData !== 'none';
    case 'personal': return rules.personalData !== 'none';
    case 'financial': return rules.financialData !== 'none';
    default: return false;
  }
}

/**
 * Check if a role can approve a workflow
 */
export function canApproveWorkflow(role: string, workflowType: string): boolean {
  const rules = getWorkflowIsolationRules(role);
  return rules.canApprove.includes('all') || rules.canApprove.includes(workflowType);
}

/**
 * Check if a role can delegate a workflow
 */
export function canDelegateWorkflow(role: string, targetRole: string): boolean {
  const rules = getWorkflowIsolationRules(role);
  return rules.canDelegate.includes('all') || rules.canDelegate.includes(targetRole);
}

/**
 * Check if a role can escalate a workflow
 */
export function canEscalateWorkflow(role: string, targetRole: string): boolean {
  const rules = getWorkflowIsolationRules(role);
  return rules.canEscalate.includes('all') || rules.canEscalate.includes(targetRole);
}

/**
 * Check if a role can impersonate another user
 */
export function canImpersonateUser(role: string, targetRole: string): boolean {
  const rules = getWorkflowIsolationRules(role);
  return rules.canImpersonate.includes('all') || rules.canImpersonate.includes(targetRole);
}

/**
 * Filter data based on role isolation rules
 */
export function filterDataByRole<T extends { tenantId?: string; branchId?: string }>(
  data: T[],
  role: string,
  userContext: {
    assignedTenants: string[];
    assignedBranches: string[];
  }
): T[] {
  return data.filter(item => {
    if (item.tenantId && !canAccessTenant(role, item.tenantId, userContext.assignedTenants)) {
      return false;
    }
    if (item.branchId && !canAccessBranch(role, item.branchId, userContext.assignedBranches)) {
      return false;
    }
    return true;
  });
}

/**
 * Get isolated analytics visibility for a role
 */
export function getAnalyticsVisibility(role: string) {
  const rules = getDataIsolationRules(role);
  return {
    canViewRevenue: rules.financialData === 'full',
    canViewUserMetrics: rules.personalData !== 'none',
    canViewSystemMetrics: rules.sensitiveData !== 'none',
    canViewCrossTenant: rules.tenantScope === 'all',
  };
}

/**
 * Get isolated module access for a role
 */
export function getModuleAccess(role: string) {
  const accessibleUrls = getAccessibleModulesByRole(role);
  return {
    accessibleUrls,
    hasAccess: (url: string) => accessibleUrls.includes(url),
  };
}

/**
 * Validate role-based data access
 */
export function validateDataAccess(
  role: string,
  action: 'read' | 'write' | 'delete',
  resourceType: string,
  resource: any
): { allowed: boolean; reason?: string } {
  // Check module access
  const moduleAccess = getModuleAccess(role);
  if (!moduleAccess.hasAccess(`/${resourceType}`)) {
    return { allowed: false, reason: 'Module access denied' };
  }

  // Check data isolation
  if (!canViewSensitiveData(role, resourceType === 'financial' ? 'financial' : 'sensitive')) {
    return { allowed: false, reason: 'Sensitive data access denied' };
  }

  // Check write/delete permissions
  if (action === 'write' || action === 'delete') {
    const rules = getWorkflowIsolationRules(role);
    if (rules.canApprove.length === 0 && action === 'delete') {
      return { allowed: false, reason: 'Delete permission denied' };
    }
  }

  return { allowed: true };
}

/**
 * Create isolated cache key for a role
 */
export function createIsolatedCacheKey(role: string, baseKey: string, tenantId?: string, branchId?: string): string {
  const parts = [role, baseKey];
  if (tenantId) parts.push(`tenant:${tenantId}`);
  if (branchId) parts.push(`branch:${branchId}`);
  return parts.join(':');
}

/**
 * Get session isolation scope
 */
export function getSessionScope(role: string) {
  const rules = getDataIsolationRules(role);
  return {
    tenantScope: rules.tenantScope,
    branchScope: rules.branchScope,
    isolated: role === 'super_admin' || role === 'root_admin',
  };
}
