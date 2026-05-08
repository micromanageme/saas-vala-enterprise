// Business Operating Logic - The core operational intelligence, not more UI
import type { EntityType, EntityState } from "./operational-state-machine";
import type { Priority } from "./system-priority-engine";
import type { AttentionType } from "./universal-attention-engine";

export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    eventType: string;
    conditions: Record<string, any>;
  };
  actions: Array<{
    type: 'transition' | 'notify' | 'escalate' | 'calculate' | 'create' | 'update';
    target: string;
    parameters: Record<string, any>;
  }>;
  enabled: boolean;
}

export interface BusinessInvariant {
  id: string;
  name: string;
  description: string;
  check: (context: BusinessContext) => Promise<boolean> | boolean;
  violationAction: string;
  severity: 'error' | 'warning' | 'info';
}

export interface BusinessContext {
  entityId: string;
  entityType: EntityType;
  currentState: EntityState;
  metadata: Record<string, any>;
  relatedEntities: Array<{
    entityType: EntityType;
    entityId: string;
    state: EntityState;
  }>;
  financialContext: {
    totalValue: number;
    pendingAmount: number;
    overdueAmount: number;
  };
  operationalContext: {
    slaDeadline?: string;
    dueDate?: string;
    owner: string;
    team: string;
  };
}

export interface BusinessLogicResult {
  success: boolean;
  actionsTaken: string[];
  sideEffects: string[];
  violations: Array<{
    invariant: string;
    severity: string;
    message: string;
  }>;
  nextStates: Array<{
    entityType: EntityType;
    entityId: string;
    fromState: EntityState;
    toState: EntityState;
  }>;
}

// Business rules - the core operational intelligence
export const businessRules: BusinessRule[] = [
  {
    id: 'auto-approve-low-value-orders',
    name: 'Auto-approve Low Value Orders',
    description: 'Orders below $1000 are auto-approved',
    trigger: {
      eventType: 'order_submitted',
      conditions: {
        value: { max: 1000 },
        customerTier: { not: 'new' },
      },
    },
    actions: [
      {
        type: 'transition',
        target: 'order',
        parameters: { toState: 'approved' },
      },
      {
        type: 'notify',
        target: 'customer',
        parameters: { message: 'Order approved' },
      },
    ],
    enabled: true,
  },
  {
    id: 'auto-escalate-overdue-invoices',
    name: 'Auto-escalate Overdue Invoices',
    description: 'Invoices overdue by 30 days are auto-escalated',
    trigger: {
      eventType: 'daily_check',
      conditions: {
        daysOverdue: { min: 30 },
      },
    },
    actions: [
      {
        type: 'escalate',
        target: 'invoice',
        parameters: { level: 'collections' },
      },
      {
        type: 'notify',
        target: 'manager',
        parameters: { alert: 'Overdue invoice' },
      },
    ],
    enabled: true,
  },
  {
    id: 'auto-block-high-risk-customers',
    name: 'Auto-block High Risk Customers',
    description: 'Customers with 3+ failed payments are auto-blocked',
    trigger: {
      eventType: 'payment_failed',
      conditions: {
        failedPaymentCount: { min: 3 },
      },
    },
    actions: [
      {
        type: 'transition',
        target: 'customer',
        parameters: { toState: 'blocked' },
      },
      {
        type: 'notify',
        target: 'finance_team',
        parameters: { alert: 'Customer blocked' },
      },
    ],
    enabled: true,
  },
  {
    id: 'auto-create-follow-up-tasks',
    name: 'Auto-create Follow-up Tasks',
    description: 'Create follow-up task when lead is created',
    trigger: {
      eventType: 'lead_created',
      conditions: {},
    },
    actions: [
      {
        type: 'create',
        target: 'task',
        parameters: {
          type: 'follow_up',
          dueInHours: 24,
          assignTo: 'sales_rep',
        },
      },
    ],
    enabled: true,
  },
  {
    id: 'auto-update-inventory',
    name: 'Auto-update Inventory',
    description: 'Update inventory when order is delivered',
    trigger: {
      eventType: 'order_delivered',
      conditions: {},
    },
    actions: [
      {
        type: 'update',
        target: 'product',
        parameters: { action: 'decrement_stock' },
      },
    ],
    enabled: true,
  },
  {
    id: 'auto-trigger-renewal-reminders',
    name: 'Auto-trigger Renewal Reminders',
    description: 'Send renewal reminder 30 days before contract expires',
    trigger: {
      eventType: 'daily_check',
      conditions: {
        daysUntilExpiry: { max: 30, min: 29 },
      },
    },
    actions: [
      {
        type: 'notify',
        target: 'customer',
        parameters: { type: 'renewal_reminder' },
      },
      {
        type: 'create',
        target: 'task',
        parameters: {
          type: 'renewal_review',
          assignTo: 'account_manager',
        },
      },
    ],
    enabled: true,
  },
  {
    id: 'auto-calculate-commission',
    name: 'Auto-calculate Commission',
    description: 'Calculate commission when deal closes',
    trigger: {
      eventType: 'deal_closed',
      conditions: {},
    },
    actions: [
      {
        type: 'calculate',
        target: 'commission',
        parameters: { formula: 'standard_tier' },
      },
      {
        type: 'update',
        target: 'employee',
        parameters: { field: 'pending_commission' },
      },
    ],
    enabled: true,
  },
  {
    id: 'auto-escalate-sla-breaches',
    name: 'Auto-escalate SLA Breaches',
    description: 'Escalate SLA breaches to management',
    trigger: {
      eventType: 'sla_breach',
      conditions: {},
    },
    actions: [
      {
        type: 'escalate',
        target: 'ticket',
        parameters: { level: 'management' },
      },
      {
        type: 'notify',
        target: 'manager',
        parameters: { alert: 'SLA breach' },
      },
    ],
    enabled: true,
  },
];

// Business invariants - rules that must always be true
export const businessInvariants: BusinessInvariant[] = [
  {
    id: 'order-total-must-match-invoice',
    name: 'Order Total Must Match Invoice',
    description: 'Invoice total must equal order total',
    check: async (context) => {
      const invoiceTotal = context.financialContext.totalValue;
      const orderTotal = context.metadata.orderTotal || 0;
      return Math.abs(invoiceTotal - orderTotal) < 0.01;
    },
    violationAction: 'block_invoice_creation',
    severity: 'error',
  },
  {
    id: 'customer-cannot-exceed-credit-limit',
    name: 'Customer Cannot Exceed Credit Limit',
    description: 'Customer outstanding balance cannot exceed credit limit',
    check: async (context) => {
      const outstanding = context.financialContext.pendingAmount + context.financialContext.overdueAmount;
      const creditLimit = context.metadata.creditLimit || 0;
      return outstanding <= creditLimit;
    },
    violationAction: 'block_order',
    severity: 'error',
  },
  {
    id: 'inventory-must-be-available',
    name: 'Inventory Must Be Available',
    description: 'Cannot create order if insufficient inventory',
    check: async (context) => {
      const requiredQuantity = context.metadata.requiredQuantity || 0;
      const availableStock = context.metadata.availableStock || 0;
      return availableStock >= requiredQuantity;
    },
    violationAction: 'block_order',
    severity: 'error',
  },
  {
    id: 'approval-chain-must-be-followed',
    name: 'Approval Chain Must Be Followed',
    description: 'High-value orders require executive approval',
    check: async (context) => {
      const orderValue = context.financialContext.totalValue;
      const hasExecutiveApproval = context.metadata.executiveApproval || false;
      if (orderValue > 10000) {
        return hasExecutiveApproval;
      }
      return true;
    },
    violationAction: 'require_approval',
    severity: 'warning',
  },
  {
    id: 'sla-must-not-be-breached',
    name: 'SLA Must Not Be Breached',
    description: 'SLA deadlines must be met',
    check: async (context) => {
      if (!context.operationalContext.slaDeadline) return true;
      const now = new Date();
      const deadline = new Date(context.operationalContext.slaDeadline);
      return now < deadline;
    },
    violationAction: 'escalate',
    severity: 'error',
  },
];

// Execute business logic for a context
export async function executeBusinessLogic(context: BusinessContext): Promise<BusinessLogicResult> {
  const result: BusinessLogicResult = {
    success: true,
    actionsTaken: [],
    sideEffects: [],
    violations: [],
    nextStates: [],
  };

  // Check invariants first
  for (const invariant of businessInvariants) {
    const passed = await invariant.check(context);
    if (!passed) {
      result.violations.push({
        invariant: invariant.id,
        severity: invariant.severity,
        message: `Invariant violated: ${invariant.description}`,
      });
      
      if (invariant.severity === 'error') {
        result.success = false;
      }
    }
  }

  // If invariants failed, stop processing
  if (!result.success) {
    return result;
  }

  // Apply matching business rules
  for (const rule of businessRules) {
    if (!rule.enabled) continue;
    
    if (matchesRule(context, rule)) {
      for (const action of rule.actions) {
        const actionResult = await executeAction(action, context);
        result.actionsTaken.push(`${action.type}: ${action.target}`);
        if (actionResult.sideEffects) {
          result.sideEffects.push(...actionResult.sideEffects);
        }
        if (actionResult.nextState) {
          result.nextStates.push(actionResult.nextState);
        }
      }
    }
  }

  return result;
}

// Check if context matches a business rule
function matchesRule(context: BusinessContext, rule: BusinessRule): boolean {
  const trigger = rule.trigger;
  const conditions = trigger.conditions;

  // Check each condition
  for (const [key, condition] of Object.entries(conditions)) {
    const contextValue = getContextValue(context, key);
    
    if (condition.max !== undefined && contextValue > condition.max) {
      return false;
    }
    if (condition.min !== undefined && contextValue < condition.min) {
      return false;
    }
    if (condition.not !== undefined && contextValue === condition.not) {
      return false;
    }
    if (condition.eq !== undefined && contextValue !== condition.eq) {
      return false;
    }
  }

  return true;
}

// Get value from context
function getContextValue(context: BusinessContext, key: string): any {
  switch (key) {
    case 'value':
      return context.financialContext.totalValue;
    case 'daysOverdue':
      if (!context.operationalContext.dueDate) return 0;
      return Math.floor((Date.now() - new Date(context.operationalContext.dueDate).getTime()) / (1000 * 60 * 60 * 24));
    case 'failedPaymentCount':
      return context.metadata.failedPaymentCount || 0;
    case 'daysUntilExpiry':
      if (!context.metadata.expiryDate) return 0;
      return Math.floor((new Date(context.metadata.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    case 'requiredQuantity':
      return context.metadata.requiredQuantity || 0;
    case 'availableStock':
      return context.metadata.availableStock || 0;
    case 'customerTier':
      return context.metadata.customerTier;
    default:
      return context.metadata[key];
  }
}

// Execute a business action
async function executeAction(
  action: BusinessRule['actions'][0],
  context: BusinessContext
): Promise<{
  sideEffects: string[];
  nextState?: {
    entityType: EntityType;
    entityId: string;
    fromState: EntityState;
    toState: EntityState;
  };
}> {
  const sideEffects: string[] = [];

  switch (action.type) {
    case 'transition':
      sideEffects.push(`Transitioned ${action.target} to ${action.parameters.toState}`);
      if (action.target === context.entityType) {
        return {
          sideEffects,
          nextState: {
            entityType: context.entityType,
            entityId: context.entityId,
            fromState: context.currentState,
            toState: action.parameters.toState as EntityState,
          },
        };
      }
      break;
      
    case 'notify':
      sideEffects.push(`Notified ${action.target}: ${action.parameters.message || action.parameters.alert}`);
      break;
      
    case 'escalate':
      sideEffects.push(`Escalated ${action.target} to ${action.parameters.level}`);
      break;
      
    case 'calculate':
      sideEffects.push(`Calculated ${action.target} using ${action.parameters.formula}`);
      break;
      
    case 'create':
      sideEffects.push(`Created ${action.target}: ${action.parameters.type}`);
      break;
      
    case 'update':
      sideEffects.push(`Updated ${action.target}: ${action.parameters.field}`);
      break;
  }

  return { sideEffects };
}

// Get business intelligence summary
export function getBusinessIntelligenceSummary(contexts: BusinessContext[]): {
  totalEntities: number;
  byState: Record<EntityState, number>;
  byType: Record<EntityType, number>;
  financialSummary: {
    totalValue: number;
    pendingAmount: number;
    overdueAmount: number;
  };
  operationalHealth: {
    healthy: number;
    warning: number;
    critical: number;
  };
} {
  const totalEntities = contexts.length;
  const byState: Record<string, number> = {};
  const byType: Record<string, number> = {};
  
  let totalValue = 0;
  let pendingAmount = 0;
  let overdueAmount = 0;
  
  let healthy = 0;
  let warning = 0;
  let critical = 0;

  contexts.forEach(context => {
    byState[context.currentState] = (byState[context.currentState] || 0) + 1;
    byType[context.entityType] = (byType[context.entityType] || 0) + 1;
    
    totalValue += context.financialContext.totalValue;
    pendingAmount += context.financialContext.pendingAmount;
    overdueAmount += context.financialContext.overdueAmount;
    
    if (context.currentState === 'blocked' || context.currentState === 'failed') {
      critical++;
    } else if (context.currentState === 'delayed' || context.currentState === 'overdue') {
      warning++;
    } else {
      healthy++;
    }
  });

  return {
    totalEntities,
    byState: byState as Record<EntityState, number>,
    byType: byType as Record<EntityType, number>,
    financialSummary: {
      totalValue,
      pendingAmount,
      overdueAmount,
    },
    operationalHealth: {
      healthy,
      warning,
      critical,
    },
  };
}

// Enable/disable business rule
export function setBusinessRuleEnabled(ruleId: string, enabled: boolean): void {
  const rule = businessRules.find(r => r.id === ruleId);
  if (rule) {
    rule.enabled = enabled;
  }
}

// Get enabled business rules
export function getEnabledBusinessRules(): BusinessRule[] {
  return businessRules.filter(rule => rule.enabled);
}

// Get business rule by ID
export function getBusinessRuleById(ruleId: string): BusinessRule | null {
  return businessRules.find(rule => rule.id === ruleId) || null;
}

// Validate business context against invariants
export async function validateBusinessContext(context: BusinessContext): Promise<{
  valid: boolean;
  violations: Array<{
    invariant: string;
    severity: string;
    message: string;
  }>;
}> {
  const violations: Array<{
    invariant: string;
    severity: string;
    message: string;
  }> = [];

  for (const invariant of businessInvariants) {
    const passed = await invariant.check(context);
    if (!passed) {
      violations.push({
        invariant: invariant.id,
        severity: invariant.severity,
        message: `Invariant violated: ${invariant.description}`,
      });
    }
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

// Get recommended actions based on business logic
export function getRecommendedActions(context: BusinessContext): Array<{
  action: string;
  reason: string;
  priority: Priority;
}> {
  const recommendations: Array<{
    action: string;
    reason: string;
    priority: Priority;
  }> = [];

  // Check for blocked state
  if (context.currentState === 'blocked') {
    recommendations.push({
      action: 'Resolve block',
      reason: 'Entity is blocked from processing',
      priority: 'critical',
    });
  }

  // Check for overdue
  if (context.operationalContext.dueDate) {
    const isOverdue = new Date(context.operationalContext.dueDate) < new Date();
    if (isOverdue) {
      recommendations.push({
        action: 'Process immediately',
        reason: 'Item is overdue',
        priority: 'urgent',
      });
    }
  }

  // Check for SLA risk
  if (context.operationalContext.slaDeadline) {
    const hoursUntil = (new Date(context.operationalContext.slaDeadline).getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntil > 0 && hoursUntil < 24) {
      recommendations.push({
        action: 'Prioritize',
        reason: 'SLA deadline approaching',
        priority: 'urgent',
      });
    }
  }

  // Check for high value
  if (context.financialContext.totalValue > 50000) {
    recommendations.push({
      action: 'Review carefully',
      reason: 'High value item',
      priority: 'normal',
    });
  }

  return recommendations;
}
