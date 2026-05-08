// Universal Attention Engine - Automatically surface bottlenecks, failures, pending approvals, revenue risks, SLA risks
import type { EntityType, EntityState } from "./operational-state-machine";
import type { Priority } from "./system-priority-engine";

export type AttentionType = 
  | 'bottleneck'
  | 'failure'
  | 'pending_approval'
  | 'revenue_risk'
  | 'sla_risk'
  | 'sla_breach'
  | 'blocked_workflow'
  | 'overdue'
  | 'escalation_needed'
  | 'capacity_issue'
  | 'compliance_risk';

export interface AttentionItem {
  id: string;
  type: AttentionType;
  title: string;
  description: string;
  priority: Priority;
  entityType: EntityType;
  entityId: string;
  state: EntityState;
  impact: {
    revenue?: number;
    customers?: number;
    operations?: number;
    sla?: boolean;
  };
  context: {
    blockedBy?: string[];
    blocking?: string[];
    dueDate?: string;
    slaDeadline?: string;
    owner?: string;
    team?: string;
  };
  actions: {
    primary: string;
    secondary?: string;
  };
  autoEscalate: boolean;
  escalationChain?: string[];
}

export interface AttentionSummary {
  critical: AttentionItem[];
  urgent: AttentionItem[];
  normal: AttentionItem[];
  total: number;
  byType: Record<AttentionType, number>;
  revenueAtRisk: number;
  slaBreaches: number;
  blockedOperations: number;
}

// Attention detection rules
export const attentionRules: Array<{
  type: AttentionType;
  condition: (entity: any) => boolean;
  priority: Priority;
  autoEscalate: boolean;
}> = [
  {
    type: 'bottleneck',
    condition: (entity) => entity.state === 'blocked' && entity.blockedBy?.length > 0,
    priority: 'critical',
    autoEscalate: true,
  },
  {
    type: 'failure',
    condition: (entity) => entity.state === 'failed',
    priority: 'critical',
    autoEscalate: true,
  },
  {
    type: 'pending_approval',
    condition: (entity) => entity.state === 'pending' && entity.requiresApproval,
    priority: 'urgent',
    autoEscalate: false,
  },
  {
    type: 'revenue_risk',
    condition: (entity) => {
      const impact = entity.revenueImpact || 0;
      return impact < -10000 || (entity.state === 'overdue' && impact < 0);
    },
    priority: 'critical',
    autoEscalate: true,
  },
  {
    type: 'sla_risk',
    condition: (entity) => {
      if (!entity.slaDeadline) return false;
      const timeUntil = new Date(entity.slaDeadline).getTime() - Date.now();
      return timeUntil < 24 * 60 * 60 * 1000 && timeUntil > 0; // Within 24 hours
    },
    priority: 'urgent',
    autoEscalate: true,
  },
  {
    type: 'sla_breach',
    condition: (entity) => {
      if (!entity.slaDeadline) return false;
      return new Date(entity.slaDeadline).getTime() < Date.now();
    },
    priority: 'critical',
    autoEscalate: true,
  },
  {
    type: 'blocked_workflow',
    condition: (entity) => entity.state === 'blocked',
    priority: 'urgent',
    autoEscalate: false,
  },
  {
    type: 'overdue',
    condition: (entity) => {
      if (!entity.dueDate) return false;
      return new Date(entity.dueDate).getTime() < Date.now();
    },
    priority: 'urgent',
    autoEscalate: false,
  },
  {
    type: 'escalation_needed',
    condition: (entity) => entity.escalationCount >= 2,
    priority: 'critical',
    autoEscalate: true,
  },
  {
    type: 'capacity_issue',
    condition: (entity) => entity.state === 'on_hold' && entity.reason === 'capacity',
    priority: 'normal',
    autoEscalate: false,
  },
  {
    type: 'compliance_risk',
    condition: (entity) => entity.complianceRequired && !entity.complianceMet,
    priority: 'urgent',
    autoEscalate: true,
  },
];

// Detect attention items for an entity
export function detectAttentionItems(entity: {
  id: string;
  type: EntityType;
  state: EntityState;
  metadata?: any;
}): AttentionItem[] {
  const items: AttentionItem[] = [];

  attentionRules.forEach(rule => {
    if (rule.condition(entity)) {
      items.push(createAttentionItem(entity, rule));
    }
  });

  return items;
}

// Create attention item from entity and rule
function createAttentionItem(entity: any, rule: any): AttentionItem {
  const impact = entity.revenueImpact || 0;
  
  return {
    id: `attention-${entity.id}-${rule.type}`,
    type: rule.type,
    title: getAttentionTitle(rule.type, entity),
    description: getAttentionDescription(rule.type, entity),
    priority: rule.priority,
    entityType: entity.type,
    entityId: entity.id,
    state: entity.state,
    impact: {
      revenue: impact !== 0 ? impact : undefined,
      sla: rule.type === 'sla_risk' || rule.type === 'sla_breach',
    },
    context: {
      blockedBy: entity.blockedBy,
      dueDate: entity.dueDate,
      slaDeadline: entity.slaDeadline,
      owner: entity.owner,
      team: entity.team,
    },
    actions: getAttentionActions(rule.type, entity),
    autoEscalate: rule.autoEscalate,
    escalationChain: entity.escalationChain,
  };
}

// Get attention title
function getAttentionTitle(type: AttentionType, entity: any): string {
  const titles: Record<AttentionType, string> = {
    bottleneck: `Workflow Blocked: ${entity.name}`,
    failure: `Processing Failed: ${entity.name}`,
    pending_approval: `Approval Required: ${entity.name}`,
    revenue_risk: `Revenue Risk: ${entity.name}`,
    sla_risk: `SLA Risk: ${entity.name}`,
    blocked_workflow: `Workflow Blocked: ${entity.name}`,
    overdue: `Overdue: ${entity.name}`,
    escalation_needed: `Escalation Required: ${entity.name}`,
    capacity_issue: `Capacity Issue: ${entity.name}`,
    compliance_risk: `Compliance Risk: ${entity.name}`,
    sla_breach: `SLA Breach: ${entity.name}`,
  };
  return titles[type];
}

// Get attention description
function getAttentionDescription(type: AttentionType, entity: any): string {
  const descriptions: Record<AttentionType, string> = {
    bottleneck: `Blocked by: ${entity.blockedBy?.join(', ') || 'unknown'}`,
    failure: `Processing failed and requires investigation`,
    pending_approval: `Awaiting approval from ${entity.approver || 'manager'}`,
    revenue_risk: `Revenue at risk: $${Math.abs(entity.revenueImpact || 0).toLocaleString()}`,
    sla_risk: `SLA deadline approaching: ${new Date(entity.slaDeadline).toLocaleDateString()}`,
    blocked_workflow: `Workflow is blocked from progressing`,
    overdue: `Overdue by: ${getTimeOverdue(entity.dueDate)}`,
    escalation_needed: `Item has been escalated ${entity.escalationCount} times`,
    capacity_issue: `Awaiting capacity availability`,
    compliance_risk: `Compliance requirements not met`,
    sla_breach: `SLA deadline missed: ${new Date(entity.slaDeadline).toLocaleDateString()}`,
  };
  return descriptions[type];
}

// Get attention actions
function getAttentionActions(type: AttentionType, entity: any): {
  primary: string;
  secondary?: string;
} {
  const actions: Record<AttentionType, { primary: string; secondary?: string }> = {
    bottleneck: {
      primary: 'Resolve Block',
      secondary: 'Escalate',
    },
    failure: {
      primary: 'Investigate',
      secondary: 'Retry',
    },
    pending_approval: {
      primary: 'Approve',
      secondary: 'Reject',
    },
    revenue_risk: {
      primary: 'Mitigate Risk',
      secondary: 'Escalate',
    },
    sla_risk: {
      primary: 'Resolve',
      secondary: 'Escalate',
    },
    blocked_workflow: {
      primary: 'Unblock',
    },
    overdue: {
      primary: 'Process',
      secondary: 'Escalate',
    },
    escalation_needed: {
      primary: 'Handle',
      secondary: 'Escalate Further',
    },
    capacity_issue: {
      primary: 'Wait',
      secondary: 'Reassign',
    },
    compliance_risk: {
      primary: 'Resolve',
      secondary: 'Escalate',
    },
    sla_breach: {
      primary: 'Investigate',
      secondary: 'Report',
    },
  };
  return actions[type];
}

// Get time overdue
function getTimeOverdue(dueDate: string): string {
  const overdue = Date.now() - new Date(dueDate).getTime();
  const days = Math.floor(overdue / (1000 * 60 * 60 * 24));
  const hours = Math.floor(overdue / (1000 * 60 * 60));
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return 'Less than an hour';
}

// Scan all entities for attention items
export function scanForAttentionItems(entities: Array<{
  id: string;
  type: EntityType;
  state: EntityState;
  metadata?: any;
}>): AttentionItem[] {
  const items: AttentionItem[] = [];
  
  entities.forEach(entity => {
    const entityItems = detectAttentionItems(entity);
    items.push(...entityItems);
  });
  
  return items;
}

// Get attention summary
export function getAttentionSummary(items: AttentionItem[]): AttentionSummary {
  const critical = items.filter(i => i.priority === 'critical');
  const urgent = items.filter(i => i.priority === 'urgent');
  const normal = items.filter(i => i.priority === 'normal');
  
  const byType: Record<AttentionType, number> = {
    bottleneck: 0,
    failure: 0,
    pending_approval: 0,
    revenue_risk: 0,
    sla_risk: 0,
    blocked_workflow: 0,
    overdue: 0,
    escalation_needed: 0,
    capacity_issue: 0,
    compliance_risk: 0,
    sla_breach: 0,
  };
  
  items.forEach(item => {
    byType[item.type]++;
  });
  
  const revenueAtRisk = items.reduce((sum, item) => sum + (item.impact.revenue || 0), 0);
  const slaBreaches = items.filter(i => i.type === 'sla_breach').length;
  const blockedOperations = items.filter(i => i.type === 'bottleneck' || i.type === 'blocked_workflow').length;
  
  return {
    critical,
    urgent,
    normal,
    total: items.length,
    byType,
    revenueAtRisk,
    slaBreaches,
    blockedOperations,
  };
}

// Get items requiring escalation
export function getItemsRequiringEscalation(items: AttentionItem[]): AttentionItem[] {
  return items.filter(item => item.autoEscalate);
}

// Get revenue risk items
export function getRevenueRiskItems(items: AttentionItem[]): AttentionItem[] {
  return items.filter(item => item.type === 'revenue_risk');
}

// Get SLA risk items
export function getSlaRiskItems(items: AttentionItem[]): AttentionItem[] {
  return items.filter(item => item.type === 'sla_risk' || item.type === 'sla_breach');
}

// Get bottleneck items
export function getBottleneckItems(items: AttentionItem[]): AttentionItem[] {
  return items.filter(item => item.type === 'bottleneck');
}

// Get pending approval items
export function getPendingApprovalItems(items: AttentionItem[]): AttentionItem[] {
  return items.filter(item => item.type === 'pending_approval');
}

// Get failure items
export function getFailureItems(items: AttentionItem[]): AttentionItem[] {
  return items.filter(item => item.type === 'failure');
}

// Sort attention items by priority
export function sortAttentionItemsByPriority(items: AttentionItem[]): AttentionItem[] {
  const priorityOrder = ['critical', 'urgent', 'normal', 'low'];
  return [...items].sort((a, b) => {
    const priorityA = priorityOrder.indexOf(a.priority);
    const priorityB = priorityOrder.indexOf(b.priority);
    return priorityA - priorityB;
  });
}

// Get top attention items
export function getTopAttentionItems(items: AttentionItem[], n: number = 10): AttentionItem[] {
  const sorted = sortAttentionItemsByPriority(items);
  return sorted.slice(0, n);
}

// Escalate attention item
export function escalateAttentionItem(itemId: string): {
  success: boolean;
  escalatedTo?: string;
  message: string;
} {
  // In a real app, this would:
  // 1. Load the attention item
  // 2. Follow escalation chain
  // 3. Notify next level
  // 4. Record escalation
  
  return {
    success: true,
    escalatedTo: 'manager',
    message: 'Item escalated successfully',
  };
}

// Dismiss attention item
export function dismissAttentionItem(itemId: string, reason: string): {
  success: boolean;
  message: string;
} {
  // In a real app, this would:
  // 1. Mark item as dismissed
  // 2. Record reason
  // 3. Update history
  
  return {
    success: true,
    message: 'Attention item dismissed',
  };
}

// Get attention item by ID
export function getAttentionItemById(itemId: string, items: AttentionItem[]): AttentionItem | null {
  return items.find(item => item.id === itemId) || null;
}

// Check if entity has attention items
export function hasAttentionItems(entityId: string, items: AttentionItem[]): boolean {
  return items.some(item => item.entityId === entityId);
}

// Get attention items for entity
export function getAttentionItemsForEntity(entityId: string, items: AttentionItem[]): AttentionItem[] {
  return items.filter(item => item.entityId === entityId);
}

// Get attention items by type
export function getAttentionItemsByType(type: AttentionType, items: AttentionItem[]): AttentionItem[] {
  return items.filter(item => item.type === type);
}

// Get attention items by priority
export function getAttentionItemsByPriority(priority: Priority, items: AttentionItem[]): AttentionItem[] {
  return items.filter(item => item.priority === priority);
}

// Auto-escalate items
export function autoEscalateItems(items: AttentionItem[]): AttentionItem[] {
  return items.filter(item => item.autoEscalate);
}

// Get attention dashboard data
export function getAttentionDashboardData(items: AttentionItem[]): {
  summary: AttentionSummary;
  topItems: AttentionItem[];
  revenueRisk: number;
  slaBreaches: number;
  bottlenecks: number;
  pendingApprovals: number;
  failures: number;
  autoEscalateCount: number;
} {
  const summary = getAttentionSummary(items);
  const topItems = getTopAttentionItems(items, 10);
  const revenueRisk = Math.abs(summary.revenueAtRisk);
  const slaBreaches = summary.slaBreaches;
  const bottlenecks = summary.blockedOperations;
  const pendingApprovals = summary.byType.pending_approval;
  const failures = summary.byType.failure;
  const autoEscalateCount = getItemsRequiringEscalation(items).length;
  
  return {
    summary,
    topItems,
    revenueRisk,
    slaBreaches,
    bottlenecks,
    pendingApprovals,
    failures,
    autoEscalateCount,
  };
}
