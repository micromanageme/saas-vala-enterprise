// @ts-nocheck
// Universal Action Engine - Every screen answers "What can I do right now?"
import type { EntityType, EntityState } from "./operational-state-machine";
import type { Priority } from "./system-priority-engine";

export type ActionCategory = 'primary' | 'secondary' | 'context' | 'system';

export interface Action {
  id: string;
  label: string;
  description: string;
  icon: string;
  category: ActionCategory;
  priority: Priority;
  requiresApproval: boolean;
  estimatedTime: string;
  context?: {
    entityType?: EntityType;
    currentState?: EntityState;
    requiredRole?: string[];
    conditions?: string[];
  };
  sideEffects?: string[];
}

export interface ActionContext {
  entityType: EntityType;
  entityId: string;
  currentState: EntityState;
  userRole: string;
  userPermissions: string[];
  metadata: Record<string, any>;
}

export interface AvailableActions {
  primary: Action[];
  secondary: Action[];
  context: Action[];
  system: Action[];
  totalCount: number;
}

// Action definitions for each entity type and state
export const actionDefinitions: Record<EntityType, Record<EntityState, Action[]>> = {
  order: {
    draft: [
      {
        id: 'order-submit',
        label: 'Submit Order',
        description: 'Submit order for approval',
        icon: 'Send',
        category: 'primary',
        priority: 'urgent',
        requiresApproval: false,
        estimatedTime: '2 min',
      },
      {
        id: 'order-save',
        label: 'Save Draft',
        description: 'Save order as draft',
        icon: 'Save',
        category: 'secondary',
        priority: 'normal',
        requiresApproval: false,
        estimatedTime: '1 min',
      },
      {
        id: 'order-cancel',
        label: 'Cancel',
        description: 'Cancel this order',
        icon: 'X',
        category: 'context',
        priority: 'normal',
        requiresApproval: false,
        estimatedTime: '1 min',
      },
    ],
    pending: [
      {
        id: 'order-approve',
        label: 'Approve Order',
        description: 'Approve order for processing',
        icon: 'CheckCircle',
        category: 'primary',
        priority: 'critical',
        requiresApproval: true,
        estimatedTime: '2 min',
      },
      {
        id: 'order-reject',
        label: 'Reject Order',
        description: 'Reject this order',
        icon: 'XCircle',
        category: 'primary',
        priority: 'urgent',
        requiresApproval: true,
        estimatedTime: '2 min',
      },
      {
        id: 'order-view',
        label: 'View Details',
        description: 'View order details',
        icon: 'Eye',
        category: 'context',
        priority: 'normal',
        requiresApproval: false,
        estimatedTime: '1 min',
      },
    ],
    approved: [
      {
        id: 'order-process',
        label: 'Process Order',
        description: 'Start processing the order',
        icon: 'Settings',
        category: 'primary',
        priority: 'urgent',
        requiresApproval: false,
        estimatedTime: '5 min',
      },
      {
        id: 'order-block',
        label: 'Block Order',
        description: 'Block order from processing',
        icon: 'Ban',
        category: 'secondary',
        priority: 'normal',
        requiresApproval: true,
        estimatedTime: '2 min',
      },
    ],
    processing: [
      {
        id: 'order-dispatch',
        label: 'Dispatch Order',
        description: 'Dispatch order to customer',
        icon: 'Truck',
        category: 'primary',
        priority: 'urgent',
        requiresApproval: false,
        estimatedTime: '10 min',
      },
      {
        id: 'order-fail',
        label: 'Mark Failed',
        description: 'Mark order as failed',
        icon: 'XCircle',
        category: 'secondary',
        priority: 'urgent',
        requiresApproval: true,
        estimatedTime: '2 min',
      },
      {
        id: 'order-delay',
        label: 'Mark Delayed',
        description: 'Mark order as delayed',
        icon: 'Clock',
        category: 'secondary',
        priority: 'normal',
        requiresApproval: false,
        estimatedTime: '1 min',
      },
    ],
    dispatched: [
      {
        id: 'order-deliver',
        label: 'Mark Delivered',
        description: 'Mark order as delivered',
        icon: 'CheckCircle',
        category: 'primary',
        priority: 'urgent',
        requiresApproval: false,
        estimatedTime: '2 min',
      },
      {
        id: 'order-delay',
        label: 'Mark Delayed',
        description: 'Mark delivery as delayed',
        icon: 'Clock',
        category: 'secondary',
        priority: 'normal',
        requiresApproval: false,
        estimatedTime: '1 min',
      },
      {
        id: 'order-track',
        label: 'Track Shipment',
        description: 'Track shipment status',
        icon: 'Navigation',
        category: 'context',
        priority: 'normal',
        requiresApproval: false,
        estimatedTime: '1 min',
      },
    ],
    delivered: [
      {
        id: 'order-view',
        label: 'View Details',
        description: 'View order details',
        icon: 'Eye',
        category: 'context',
        priority: 'normal',
        requiresApproval: false,
        estimatedTime: '1 min',
      },
      {
        id: 'order-create-new',
        label: 'Create New Order',
        description: 'Create a new order',
        icon: 'Plus',
        category: 'system',
        priority: 'normal',
        requiresApproval: false,
        estimatedTime: '5 min',
      },
    ],
    delayed: [
      {
        id: 'order-resume',
        label: 'Resume Processing',
        description: 'Resume order processing',
        icon: 'Play',
        category: 'primary',
        priority: 'urgent',
        requiresApproval: false,
        estimatedTime: '5 min',
      },
      {
        id: 'order-cancel',
        label: 'Cancel Order',
        description: 'Cancel delayed order',
        icon: 'XCircle',
        category: 'secondary',
        priority: 'urgent',
        requiresApproval: true,
        estimatedTime: '2 min',
      },
    ],
    cancelled: [
      {
        id: 'order-view',
        label: 'View Details',
        description: 'View cancelled order details',
        icon: 'Eye',
        category: 'context',
        priority: 'normal',
        requiresApproval: false,
        estimatedTime: '1 min',
      },
    ],
    failed: [
      {
        id: 'order-investigate',
        label: 'Investigate Failure',
        description: 'Investigate why order failed',
        icon: 'Search',
        category: 'primary',
        priority: 'critical',
        requiresApproval: false,
        estimatedTime: '15 min',
      },
      {
        id: 'order-retry',
        label: 'Retry Processing',
        description: 'Retry order processing',
        icon: 'RefreshCw',
        category: 'secondary',
        priority: 'urgent',
        requiresApproval: false,
        estimatedTime: '5 min',
      },
    ],
    blocked: [
      {
        id: 'order-unblock',
        label: 'Unblock Order',
        description: 'Unblock order for processing',
        icon: 'Unlock',
        category: 'primary',
        priority: 'critical',
        requiresApproval: true,
        estimatedTime: '2 min',
      },
      {
        id: 'order-cancel',
        label: 'Cancel Order',
        description: 'Cancel blocked order',
        icon: 'XCircle',
        category: 'secondary',
        priority: 'normal',
        requiresApproval: true,
        estimatedTime: '2 min',
      },
    ],
  },
  invoice: {
    draft: [
      {
        id: 'invoice-submit',
        label: 'Submit Invoice',
        description: 'Submit invoice for approval',
        icon: 'Send',
        category: 'primary',
        priority: 'urgent',
        requiresApproval: false,
        estimatedTime: '2 min',
      },
      {
        id: 'invoice-save',
        label: 'Save Draft',
        description: 'Save invoice as draft',
        icon: 'Save',
        category: 'secondary',
        priority: 'normal',
        requiresApproval: false,
        estimatedTime: '1 min',
      },
    ],
    pending: [
      {
        id: 'invoice-approve',
        label: 'Approve Invoice',
        description: 'Approve invoice to send',
        icon: 'CheckCircle',
        category: 'primary',
        priority: 'critical',
        requiresApproval: true,
        estimatedTime: '2 min',
      },
      {
        id: 'invoice-reject',
        label: 'Reject Invoice',
        description: 'Reject this invoice',
        icon: 'XCircle',
        category: 'primary',
        priority: 'urgent',
        requiresApproval: true,
        estimatedTime: '2 min',
      },
    ],
    approved: [
      {
        id: 'invoice-send',
        label: 'Send Invoice',
        description: 'Send invoice to customer',
        icon: 'Send',
        category: 'primary',
        priority: 'urgent',
        requiresApproval: false,
        estimatedTime: '2 min',
      },
      {
        id: 'invoice-block',
        label: 'Block Invoice',
        description: 'Block invoice from sending',
        icon: 'Ban',
        category: 'secondary',
        priority: 'normal',
        requiresApproval: true,
        estimatedTime: '2 min',
      },
    ],
    sent: [
      {
        id: 'invoice-receive-payment',
        label: 'Record Payment',
        description: 'Record payment received',
        icon: 'DollarSign',
        category: 'primary',
        priority: 'urgent',
        requiresApproval: false,
        estimatedTime: '3 min',
      },
      {
        id: 'invoice-mark-overdue',
        label: 'Mark Overdue',
        description: 'Mark invoice as overdue',
        icon: 'Clock',
        category: 'secondary',
        priority: 'normal',
        requiresApproval: false,
        estimatedTime: '1 min',
      },
      {
        id: 'invoice-send-reminder',
        label: 'Send Reminder',
        description: 'Send payment reminder',
        icon: 'Mail',
        category: 'context',
        priority: 'normal',
        requiresApproval: false,
        estimatedTime: '1 min',
      },
    ],
    paid: [
      {
        id: 'invoice-view',
        label: 'View Details',
        description: 'View invoice details',
        icon: 'Eye',
        category: 'context',
        priority: 'normal',
        requiresApproval: false,
        estimatedTime: '1 min',
      },
    ],
    overdue: [
      {
        id: 'invoice-receive-payment',
        label: 'Record Payment',
        description: 'Record payment received',
        icon: 'DollarSign',
        category: 'primary',
        priority: 'critical',
        requiresApproval: false,
        estimatedTime: '3 min',
      },
      {
        id: 'invoice-escalate',
        label: 'Escalate',
        description: 'Escalate to collections',
        icon: 'ArrowUp',
        category: 'secondary',
        priority: 'urgent',
        requiresApproval: true,
        estimatedTime: '2 min',
      },
      {
        id: 'invoice-cancel',
        label: 'Cancel Invoice',
        description: 'Cancel overdue invoice',
        icon: 'XCircle',
        category: 'secondary',
        priority: 'normal',
        requiresApproval: true,
        estimatedTime: '2 min',
      },
    ],
    blocked: [
      {
        id: 'invoice-unblock',
        label: 'Unblock Invoice',
        description: 'Unblock invoice',
        icon: 'Unlock',
        category: 'primary',
        priority: 'critical',
        requiresApproval: true,
        estimatedTime: '2 min',
      },
    ],
    // Add other states...
    cancelled: [],
    expired: [],
  },
  // Add other entity types...
  payment: {
    draft: [
      {
        id: 'payment-initiate',
        label: 'Initiate Payment',
        description: 'Initiate payment processing',
        icon: 'Play',
        category: 'primary',
        priority: 'urgent',
        requiresApproval: false,
        estimatedTime: '2 min',
      },
    ],
    pending: [
      {
        id: 'payment-process',
        label: 'Process Payment',
        description: 'Process the payment',
        icon: 'Settings',
        category: 'primary',
        priority: 'urgent',
        requiresApproval: false,
        estimatedTime: '2 min',
      },
      {
        id: 'payment-cancel',
        label: 'Cancel Payment',
        description: 'Cancel this payment',
        icon: 'XCircle',
        category: 'secondary',
        priority: 'normal',
        requiresApproval: false,
        estimatedTime: '1 min',
      },
    ],
    processing: [
      {
        id: 'payment-complete',
        label: 'Complete Payment',
        description: 'Mark payment as complete',
        icon: 'CheckCircle',
        category: 'primary',
        priority: 'urgent',
        requiresApproval: false,
        estimatedTime: '1 min',
      },
      {
        id: 'payment-fail',
        label: 'Mark Failed',
        description: 'Mark payment as failed',
        icon: 'XCircle',
        category: 'secondary',
        priority: 'urgent',
        requiresApproval: false,
        estimatedTime: '1 min',
      },
    ],
    completed: [
      {
        id: 'payment-view',
        label: 'View Details',
        description: 'View payment details',
        icon: 'Eye',
        category: 'context',
        priority: 'normal',
        requiresApproval: false,
        estimatedTime: '1 min',
      },
    ],
    failed: [
      {
        id: 'payment-retry',
        label: 'Retry Payment',
        description: 'Retry the payment',
        icon: 'RefreshCw',
        category: 'primary',
        priority: 'critical',
        requiresApproval: false,
        estimatedTime: '2 min',
      },
      {
        id: 'payment-investigate',
        label: 'Investigate',
        description: 'Investigate payment failure',
        icon: 'Search',
        category: 'secondary',
        priority: 'urgent',
        requiresApproval: false,
        estimatedTime: '10 min',
      },
    ],
    on_hold: [
      {
        id: 'payment-resume',
        label: 'Resume Payment',
        description: 'Resume payment processing',
        icon: 'Play',
        category: 'primary',
        priority: 'urgent',
        requiresApproval: true,
        estimatedTime: '2 min',
      },
      {
        id: 'payment-cancel',
        label: 'Cancel Payment',
        description: 'Cancel held payment',
        icon: 'XCircle',
        category: 'secondary',
        priority: 'normal',
        requiresApproval: true,
        estimatedTime: '2 min',
      },
    ],
    cancelled: [],
  },
  // Add placeholder for other entity types
  quote: {} as any,
  lead: {} as any,
  customer: {} as any,
  employee: {} as any,
  product: {} as any,
  vendor: {} as any,
  ticket: {} as any,
  contract: {} as any,
  shipment: {} as any,
};

// Get available actions for a context
export function getAvailableActions(context: ActionContext): AvailableActions {
  const actions = actionDefinitions[context.entityType]?.[context.currentState] || [];
  
  const availableActions = actions.filter(action => {
    // Check role requirements
    if (action.context?.requiredRole && 
        !action.context.requiredRole.some(role => context.userRole === role)) {
      return false;
    }
    
    // Check permissions
    if (action.context?.conditions) {
      // In a real app, check conditions
    }
    
    return true;
  });

  return {
    primary: availableActions.filter(a => a.category === 'primary'),
    secondary: availableActions.filter(a => a.category === 'secondary'),
    context: availableActions.filter(a => a.category === 'context'),
    system: availableActions.filter(a => a.category === 'system'),
    totalCount: availableActions.length,
  };
}

// Get primary action (the most important action)
export function getPrimaryAction(context: ActionContext): Action | null {
  const actions = getAvailableActions(context);
  return actions.primary.length > 0 ? actions.primary[0] : null;
}

// Get next recommended action
export function getNextAction(context: ActionContext): Action | null {
  const actions = getAvailableActions(context);
  
  // Return highest priority action
  const allActions = [...actions.primary, ...actions.secondary, ...actions.context];
  
  const priorityOrder = ['critical', 'urgent', 'normal', 'low'];
  allActions.sort((a, b) => {
    const priorityA = priorityOrder.indexOf(a.priority);
    const priorityB = priorityOrder.indexOf(b.priority);
    return priorityA - priorityB;
  });
  
  return allActions.length > 0 ? allActions[0] : null;
}

// Check if action is available
export function isActionAvailable(actionId: string, context: ActionContext): boolean {
  const actions = getAvailableActions(context);
  const allActions = [...actions.primary, ...actions.secondary, ...actions.context, ...actions.system];
  return allActions.some(a => a.id === actionId);
}

// Execute action
export function executeAction(actionId: string, context: ActionContext): {
  success: boolean;
  message: string;
  sideEffects?: string[];
} {
  const actions = getAvailableActions(context);
  const allActions = [...actions.primary, ...actions.secondary, ...actions.context, ...actions.system];
  const action = allActions.find(a => a.id === actionId);
  
  if (!action) {
    return {
      success: false,
      message: 'Action not available',
    };
  }
  
  if (action.requiresApproval && !context.userPermissions.includes('approve')) {
    return {
      success: false,
      message: 'Approval required',
    };
  }
  
  // In a real app, execute the action
  return {
    success: true,
    message: `Action "${action.label}" executed successfully`,
    sideEffects: action.sideEffects,
  };
}

// Get action count by category
export function getActionCountByCategory(context: ActionContext): {
  primary: number;
  secondary: number;
  context: number;
  system: number;
} {
  const actions = getAvailableActions(context);
  return {
    primary: actions.primary.length,
    secondary: actions.secondary.length,
    context: actions.context.length,
    system: actions.system.length,
  };
}

// Get actions requiring approval
export function getActionsRequiringApproval(context: ActionContext): Action[] {
  const actions = getAvailableActions(context);
  const allActions = [...actions.primary, ...actions.secondary, ...actions.context, ...actions.system];
  return allActions.filter(a => a.requiresApproval);
}

// Sort actions by priority
export function sortActionsByPriority(actions: Action[]): Action[] {
  const priorityOrder = ['critical', 'urgent', 'normal', 'low'];
  return [...actions].sort((a, b) => {
    const priorityA = priorityOrder.indexOf(a.priority);
    const priorityB = priorityOrder.indexOf(b.priority);
    return priorityA - priorityB;
  });
}

// Get action by ID
export function getActionById(actionId: string, context: ActionContext): Action | null {
  const actions = getAvailableActions(context);
  const allActions = [...actions.primary, ...actions.secondary, ...actions.context, ...actions.system];
  return allActions.find(a => a.id === actionId) || null;
}

// Get quick actions (top 3 actions)
export function getQuickActions(context: ActionContext, limit: number = 3): Action[] {
  const actions = getAvailableActions(context);
  const allActions = sortActionsByPriority([...actions.primary, ...actions.secondary]);
  return allActions.slice(0, limit);
}

// Check if context has any actions
export function hasActions(context: ActionContext): boolean {
  const actions = getAvailableActions(context);
  return actions.totalCount > 0;
}

// Get action summary
export function getActionSummary(context: ActionContext): {
  canDo: string;
  totalActions: number;
  primaryAction: string | null;
  requiresApproval: boolean;
} {
  const actions = getAvailableActions(context);
  const primaryAction = getPrimaryAction(context);
  const requiresApproval = getActionsRequiringApproval(context).length > 0;
  
  return {
    canDo: primaryAction ? primaryAction.label : 'No actions available',
    totalActions: actions.totalCount,
    primaryAction: primaryAction?.label || null,
    requiresApproval,
  };
}