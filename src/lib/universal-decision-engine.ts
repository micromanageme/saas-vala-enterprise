// @ts-nocheck
// Universal Decision Engine - Every role instantly knows approve/reject/escalate/assign/follow-up
import type { EntityType, EntityState } from "./operational-state-machine";
import type { Priority } from "./system-priority-engine";

export type DecisionType = 
  | 'approve'
  | 'reject'
  | 'escalate'
  | 'assign'
  | 'follow_up'
  | 'defer'
  | 'delegate'
  | 'close'
  | 'reopen'
  | 'modify';

export type UserRole = 'admin' | 'manager' | 'operator' | 'executive' | 'support';

export interface DecisionContext {
  entityType: EntityType;
  entityId: string;
  currentState: EntityState;
  userRole: UserRole;
  userPermissions: string[];
  metadata: {
    value?: number;
    riskLevel?: 'low' | 'medium' | 'high' | 'critical';
    dueDate?: string;
    slaDeadline?: string;
    owner?: string;
    team?: string;
    escalationCount?: number;
    approvalChain?: string[];
    complianceRequired?: boolean;
  };
}

export interface DecisionOption {
  type: DecisionType;
  label: string;
  description: string;
  available: boolean;
  requiresPermission?: string;
  requiresApproval?: boolean;
  estimatedTime?: string;
  sideEffects?: string[];
  conditions?: string[];
}

export interface DecisionResult {
  decision: DecisionType;
  approved: boolean;
  reason: string;
  nextSteps: string[];
  notifications: string[];
  stateTransition?: {
    from: EntityState;
    to: EntityState;
  };
}

// Decision rules for each role and context
export const decisionRules: Record<UserRole, Record<EntityState, DecisionOption[]>> = {
  admin: {
    draft: [
      {
        type: 'approve',
        label: 'Approve',
        description: 'Approve for next stage',
        available: true,
        estimatedTime: '1 min',
      },
      {
        type: 'reject',
        label: 'Reject',
        description: 'Reject this item',
        available: true,
        estimatedTime: '1 min',
      },
      {
        type: 'assign',
        label: 'Assign',
        description: 'Assign to team member',
        available: true,
        estimatedTime: '2 min',
      },
      {
        type: 'defer',
        label: 'Defer',
        description: 'Defer for later',
        available: true,
        estimatedTime: '1 min',
      },
    ],
    pending: [
      {
        type: 'approve',
        label: 'Approve',
        description: 'Approve pending item',
        available: true,
        estimatedTime: '1 min',
      },
      {
        type: 'reject',
        label: 'Reject',
        description: 'Reject pending item',
        available: true,
        estimatedTime: '1 min',
      },
      {
        type: 'escalate',
        label: 'Escalate',
        description: 'Escalate to higher level',
        available: true,
        estimatedTime: '2 min',
      },
    ],
    approved: [
      {
        type: 'assign',
        label: 'Assign',
        description: 'Assign for processing',
        available: true,
        estimatedTime: '2 min',
      },
      {
        type: 'escalate',
        label: 'Escalate',
        description: 'Escalate if needed',
        available: true,
        estimatedTime: '2 min',
      },
    ],
    processing: [
      {
        type: 'assign',
        label: 'Reassign',
        description: 'Reassign to different person',
        available: true,
        estimatedTime: '2 min',
      },
      {
        type: 'escalate',
        label: 'Escalate',
        description: 'Escalate issues',
        available: true,
        estimatedTime: '2 min',
      },
    ],
    blocked: [
      {
        type: 'approve',
        label: 'Unblock',
        description: 'Remove block',
        available: true,
        requiresPermission: 'unblock',
        estimatedTime: '2 min',
      },
      {
        type: 'escalate',
        label: 'Escalate',
        description: 'Escalate block',
        available: true,
        estimatedTime: '2 min',
      },
    ],
    failed: [
      {
        type: 'reopen',
        label: 'Retry',
        description: 'Retry processing',
        available: true,
        estimatedTime: '5 min',
      },
      {
        type: 'escalate',
        label: 'Escalate',
        description: 'Escalate failure',
        available: true,
        estimatedTime: '2 min',
      },
    ],
    // Default for other states
    delayed: [
      {
        type: 'assign',
        label: 'Reassign',
        description: 'Reassign to expedite',
        available: true,
        estimatedTime: '2 min',
      },
      {
        type: 'escalate',
        label: 'Escalate',
        description: 'Escalate delay',
        available: true,
        estimatedTime: '2 min',
      },
    ],
    cancelled: [],
    delivered: [],
    completed: [],
    expired: [],
    on_hold: [
      {
        type: 'approve',
        label: 'Resume',
        description: 'Resume processing',
        available: true,
        estimatedTime: '1 min',
      },
    ],
  },
  manager: {
    draft: [
      {
        type: 'approve',
        label: 'Approve',
        description: 'Approve for next stage',
        available: true,
        requiresApproval: true,
        estimatedTime: '2 min',
      },
      {
        type: 'reject',
        label: 'Reject',
        description: 'Reject this item',
        available: true,
        estimatedTime: '1 min',
      },
      {
        type: 'assign',
        label: 'Assign',
        description: 'Assign to team member',
        available: true,
        estimatedTime: '2 min',
      },
    ],
    pending: [
      {
        type: 'approve',
        label: 'Approve',
        description: 'Approve pending item',
        available: true,
        estimatedTime: '2 min',
      },
      {
        type: 'reject',
        label: 'Reject',
        description: 'Reject pending item',
        available: true,
        estimatedTime: '1 min',
      },
      {
        type: 'escalate',
        label: 'Escalate',
        description: 'Escalate to executive',
        available: true,
        requiresPermission: 'escalate_to_executive',
        estimatedTime: '2 min',
      },
    ],
    approved: [
      {
        type: 'assign',
        label: 'Assign',
        description: 'Assign for processing',
        available: true,
        estimatedTime: '2 min',
      },
    ],
    processing: [
      {
        type: 'assign',
        label: 'Reassign',
        description: 'Reassign to different person',
        available: true,
        estimatedTime: '2 min',
      },
    ],
    blocked: [
      {
        type: 'escalate',
        label: 'Escalate',
        description: 'Escalate block',
        available: true,
        estimatedTime: '2 min',
      },
    ],
    failed: [
      {
        type: 'escalate',
        label: 'Escalate',
        description: 'Escalate failure',
        available: true,
        estimatedTime: '2 min',
      },
    ],
    delayed: [
      {
        type: 'assign',
        label: 'Reassign',
        description: 'Reassign to expedite',
        available: true,
        estimatedTime: '2 min',
      },
    ],
    cancelled: [],
    delivered: [],
    completed: [],
    expired: [],
    on_hold: [
      {
        type: 'approve',
        label: 'Resume',
        description: 'Resume processing',
        available: true,
        estimatedTime: '1 min',
      },
    ],
  },
  operator: {
    draft: [
      {
        type: 'assign',
        label: 'Assign',
        description: 'Assign to team member',
        available: true,
        estimatedTime: '2 min',
      },
    ],
    pending: [],
    approved: [
      {
        type: 'assign',
        label: 'Assign',
        description: 'Assign for processing',
        available: true,
        estimatedTime: '2 min',
      },
    ],
    processing: [
      {
        type: 'assign',
        label: 'Reassign',
        description: 'Reassign to different person',
        available: true,
        estimatedTime: '2 min',
      },
    ],
    blocked: [],
    failed: [],
    delayed: [
      {
        type: 'follow_up',
        label: 'Follow Up',
        description: 'Follow up on delay',
        available: true,
        estimatedTime: '5 min',
      },
    ],
    cancelled: [],
    delivered: [],
    completed: [],
    expired: [],
    on_hold: [],
  },
  executive: {
    draft: [],
    pending: [
      {
        type: 'approve',
        label: 'Approve',
        description: 'Executive approval',
        available: true,
        estimatedTime: '1 min',
      },
      {
        type: 'reject',
        label: 'Reject',
        description: 'Executive rejection',
        available: true,
        estimatedTime: '1 min',
      },
    ],
    approved: [],
    processing: [],
    blocked: [
      {
        type: 'approve',
        label: 'Unblock',
        description: 'Executive unblock',
        available: true,
        estimatedTime: '1 min',
      },
    ],
    failed: [
      {
        type: 'escalate',
        label: 'Escalate',
        description: 'Escalate to board',
        available: true,
        estimatedTime: '2 min',
      },
    ],
    delayed: [
      {
        type: 'escalate',
        label: 'Escalate',
        description: 'Escalate delay',
        available: true,
        estimatedTime: '2 min',
      },
    ],
    cancelled: [],
    delivered: [],
    completed: [],
    expired: [],
    on_hold: [
      {
        type: 'approve',
        label: 'Resume',
        description: 'Executive resume',
        available: true,
        estimatedTime: '1 min',
      },
    ],
  },
  support: {
    draft: [],
    pending: [],
    approved: [],
    processing: [
      {
        type: 'follow_up',
        label: 'Follow Up',
        description: 'Follow up on status',
        available: true,
        estimatedTime: '5 min',
      },
    ],
    blocked: [],
    failed: [
      {
        type: 'follow_up',
        label: 'Investigate',
        description: 'Investigate failure',
        available: true,
        estimatedTime: '10 min',
      },
    ],
    delayed: [
      {
        type: 'follow_up',
        label: 'Follow Up',
        description: 'Follow up on delay',
        available: true,
        estimatedTime: '5 min',
      },
    ],
    cancelled: [],
    delivered: [],
    completed: [],
    expired: [],
    on_hold: [],
  },
};

// Get available decisions for a context
export function getAvailableDecisions(context: DecisionContext): DecisionOption[] {
  const roleDecisions = decisionRules[context.userRole];
  const stateDecisions = roleDecisions[context.currentState] || [];
  
  // Filter based on permissions
  return stateDecisions.filter(decision => {
    if (decision.requiresPermission && !context.userPermissions.includes(decision.requiresPermission)) {
      return false;
    }
    
    // Additional context-based filtering
    if (decision.type === 'approve' && context.metadata.riskLevel === 'critical' && context.userRole !== 'executive') {
      return false;
    }
    
    return true;
  });
}

// Get recommended decision
export function getRecommendedDecision(context: DecisionContext): DecisionOption | null {
  const decisions = getAvailableDecisions(context);
  
  if (decisions.length === 0) return null;
  
  // Priority-based recommendation
  const priority: Record<DecisionType, number> = {
    approve: 100,
    reject: 90,
    escalate: 80,
    assign: 70,
    follow_up: 60,
    reopen: 50,
    defer: 40,
    delegate: 30,
    close: 20,
    modify: 10,
  };
  
  // Sort by priority
  const sorted = [...decisions].sort((a, b) => {
    const priorityA = priority[a.type] || 0;
    const priorityB = priority[b.type] || 0;
    return priorityB - priorityA;
  });
  
  return sorted[0];
}

// Execute a decision
export function executeDecision(
  decision: DecisionType,
  context: DecisionContext
): DecisionResult {
  const decisions = getAvailableDecisions(context);
  const selectedDecision = decisions.find(d => d.type === decision);
  
  if (!selectedDecision || !selectedDecision.available) {
    return {
      decision,
      approved: false,
      reason: 'Decision not available for current context',
      nextSteps: [],
      notifications: [],
    };
  }
  
  if (selectedDecision.requiresPermission && !context.userPermissions.includes(selectedDecision.requiresPermission)) {
    return {
      decision,
      approved: false,
      reason: `Requires permission: ${selectedDecision.requiresPermission}`,
      nextSteps: [],
      notifications: [],
    };
  }
  
  // Execute the decision
  const result: DecisionResult = {
    decision,
    approved: true,
    reason: `Decision ${decision} executed successfully`,
    nextSteps: [],
    notifications: [],
  };
  
  // Add side effects
  if (selectedDecision.sideEffects) {
    result.notifications.push(...selectedDecision.sideEffects);
  }
  
  // Add state transition based on decision
  const stateTransition = getStateTransition(decision, context.currentState);
  if (stateTransition) {
    result.stateTransition = stateTransition;
    result.nextSteps.push(`Transition from ${stateTransition.from} to ${stateTransition.to}`);
  }
  
  // Add role-specific notifications
  if (decision === 'approve') {
    result.notifications.push('Notify requester of approval');
    result.nextSteps.push('Process next steps');
  } else if (decision === 'reject') {
    result.notifications.push('Notify requester of rejection');
    result.nextSteps.push('Update item status');
  } else if (decision === 'escalate') {
    result.notifications.push('Notify escalation target');
    result.nextSteps.push('Track escalation');
  } else if (decision === 'assign') {
    result.notifications.push('Notify assignee');
    result.nextSteps.push('Monitor progress');
  }
  
  return result;
}

// Get state transition for decision
function getStateTransition(decision: DecisionType, currentState: EntityState): {
  from: EntityState;
  to: EntityState;
} | null {
  const transitions: Record<DecisionType, Partial<Record<EntityState, EntityState>>> = {
    approve: {
      pending: 'approved',
      draft: 'pending',
      blocked: 'approved',
      on_hold: 'approved',
    },
    reject: {
      pending: 'cancelled',
      draft: 'cancelled',
    },
    escalate: {
      processing: 'blocked',
      failed: 'blocked',
      delayed: 'blocked',
    },
    assign: {},
    follow_up: {},
    defer: {},
    delegate: {},
    close: {
      processing: 'completed',
    },
    reopen: {
      failed: 'processing',
      completed: 'processing',
    },
    modify: {},
  };
  
  const toState = transitions[decision]?.[currentState];
  if (toState) {
    return { from: currentState, to: toState };
  }
  
  return null;
}

// Get decision summary
export function getDecisionSummary(context: DecisionContext): {
  availableDecisions: number;
  recommendedDecision: string | null;
  canApprove: boolean;
  canReject: boolean;
  canEscalate: boolean;
  requiresApproval: boolean;
} {
  const decisions = getAvailableDecisions(context);
  const recommended = getRecommendedDecision(context);
  
  return {
    availableDecisions: decisions.length,
    recommendedDecision: recommended?.label || null,
    canApprove: decisions.some(d => d.type === 'approve'),
    canReject: decisions.some(d => d.type === 'reject'),
    canEscalate: decisions.some(d => d.type === 'escalate'),
    requiresApproval: decisions.some(d => d.requiresApproval),
  };
}

// Check if decision requires approval
export function decisionRequiresApproval(decision: DecisionType, context: DecisionContext): boolean {
  const decisions = getAvailableDecisions(context);
  const selectedDecision = decisions.find(d => d.type === decision);
  return selectedDecision?.requiresApproval || false;
}

// Get decision urgency
export function getDecisionUrgency(context: DecisionContext): Priority {
  if (context.metadata.slaDeadline) {
    const hoursUntil = (new Date(context.metadata.slaDeadline).getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntil < 0) return 'critical';
    if (hoursUntil < 24) return 'urgent';
  }
  
  if (context.metadata.dueDate) {
    const hoursUntil = (new Date(context.metadata.dueDate).getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntil < 0) return 'urgent';
    if (hoursUntil < 24) return 'normal';
  }
  
  if (context.metadata.riskLevel === 'critical') return 'critical';
  if (context.metadata.riskLevel === 'high') return 'urgent';
  
  return 'normal';
}

// Get decision timeline
export function getDecisionTimeline(context: DecisionContext): {
  dueIn?: string;
  slaDueIn?: string;
  recommendedBy?: string;
  criticalPath: boolean;
} {
  const timeline: {
    dueIn?: string;
    slaDueIn?: string;
    recommendedBy?: string;
    criticalPath: boolean;
  } = {
    criticalPath: false,
  };
  
  if (context.metadata.dueDate) {
    const hoursUntil = (new Date(context.metadata.dueDate).getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntil > 0) {
      timeline.dueIn = `${Math.ceil(hoursUntil)} hours`;
    } else {
      timeline.dueIn = 'Overdue';
      timeline.criticalPath = true;
    }
  }
  
  if (context.metadata.slaDeadline) {
    const hoursUntil = (new Date(context.metadata.slaDeadline).getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntil > 0) {
      timeline.slaDueIn = `${Math.ceil(hoursUntil)} hours`;
    } else {
      timeline.slaDueIn = 'SLA Breached';
      timeline.criticalPath = true;
    }
  }
  
  if (context.metadata.escalationCount && context.metadata.escalationCount >= 2) {
    timeline.criticalPath = true;
  }
  
  return timeline;
}

// Batch get decisions for multiple contexts
export function batchGetDecisions(contexts: DecisionContext[]): Map<string, DecisionOption[]> {
  const resultMap = new Map<string, DecisionResult>();
  const decisionsMap = new Map<string, DecisionOption[]>();
  
  contexts.forEach(context => {
    const key = `${context.entityType}-${context.entityId}`;
    decisionsMap.set(key, getAvailableDecisions(context));
  });
  
  return decisionsMap;
}

// Get decision statistics
export function getDecisionStatistics(contexts: DecisionContext[]): {
  totalContexts: number;
  avgDecisionsAvailable: number;
  mostCommonDecision: DecisionType;
  urgentDecisions: number;
  requiresApproval: number;
} {
  let totalDecisions = 0;
  const decisionCounts: Record<DecisionType, number> = {} as Record<DecisionType, number>;
  let urgentCount = 0;
  let approvalCount = 0;
  
  contexts.forEach(context => {
    const decisions = getAvailableDecisions(context);
    totalDecisions += decisions.length;
    
    decisions.forEach(decision => {
      decisionCounts[decision.type] = (decisionCounts[decision.type] || 0) + 1;
      if (decision.requiresApproval) approvalCount++;
    });
    
    if (getDecisionUrgency(context) === 'critical' || getDecisionUrgency(context) === 'urgent') {
      urgentCount++;
    }
  });
  
  const mostCommonDecision = Object.entries(decisionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as DecisionType || 'approve';
  
  return {
    totalContexts: contexts.length,
    avgDecisionsAvailable: Math.round(totalDecisions / contexts.length),
    mostCommonDecision,
    urgentDecisions: urgentCount,
    requiresApproval: approvalCount,
  };
}