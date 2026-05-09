// @ts-nocheck
// Universal Context Engine - Show ALL related operational context without opening modules
import type { EntityType, EntityState } from "./operational-state-machine";
import type { Priority } from "./system-priority-engine";

export interface ContextEntity {
  entityType: EntityType;
  entityId: string;
  name: string;
  state: EntityState;
  relationship: 'parent' | 'child' | 'peer' | 'related';
  relevanceScore: number; // 0-100
  metadata: Record<string, any>;
}

export interface ContextTimeline {
  id: string;
  entityType: EntityType;
  entityId: string;
  event: string;
  description: string;
  timestamp: string;
  actor: string;
  impact: string;
}

export interface ContextFinancial {
  totalValue: number;
  pendingAmount: number;
  overdueAmount: number;
  currency: string;
  breakdown: Array<{
    entityType: EntityType;
    amount: number;
  }>;
}

export interface ContextOperational {
  activeWorkflows: number;
  pendingActions: number;
  blockedItems: number;
  slaBreaches: number;
  nextAction: string;
  dueDate?: string;
  slaDeadline?: string;
}

export interface UniversalContext {
  primaryEntity: {
    entityType: EntityType;
    entityId: string;
    name: string;
    state: EntityState;
  };
  relatedEntities: ContextEntity[];
  timeline: ContextTimeline[];
  financial: ContextFinancial;
  operational: ContextOperational;
  actions: Array<{
    action: string;
    priority: Priority;
    description: string;
  }>;
  recommendations: string[];
  health: {
    status: 'healthy' | 'warning' | 'critical';
    score: number;
  };
}

// Entity relationship definitions
export const entityRelationships: Record<EntityType, EntityType[]> = {
  customer: ['order', 'invoice', 'payment', 'ticket', 'quote', 'contract'],
  employee: ['ticket', 'leave', 'performance', 'training', 'payroll'],
  order: ['customer', 'invoice', 'payment', 'product', 'shipment'],
  invoice: ['customer', 'order', 'payment', 'quote'],
  payment: ['invoice', 'customer', 'order', 'vendor'],
  product: ['order', 'invoice', 'vendor', 'shipment'],
  vendor: ['product', 'invoice', 'payment'],
  ticket: ['customer', 'employee', 'order'],
  quote: ['customer', 'lead', 'invoice', 'order'],
  lead: ['customer', 'quote', 'employee'],
  contract: ['customer', 'invoice', 'payment'],
  shipment: ['order', 'product', 'customer'],
};

// Get universal context for an entity
export function getUniversalContext(
  entityType: EntityType,
  entityId: string,
  entityName: string,
  currentState: EntityState
): UniversalContext {
  const relatedEntities = getRelatedEntities(entityType, entityId);
  const timeline = getContextTimeline(entityType, entityId);
  const financial = getContextFinancial(entityType, entityId, relatedEntities);
  const operational = getContextOperational(entityType, entityId, currentState);
  const actions = getContextActions(entityType, currentState);
  const recommendations = getContextRecommendations(entityType, currentState, operational);
  const health = getContextHealth(currentState, operational);

  return {
    primaryEntity: {
      entityType,
      entityId,
      name: entityName,
      state: currentState,
    },
    relatedEntities,
    timeline,
    financial,
    operational,
    actions,
    recommendations,
    health,
  };
}

// Get related entities
function getRelatedEntities(entityType: EntityType, entityId: string): ContextEntity[] {
  const relatedTypes = entityRelationships[entityType] || [];
  
  // In a real app, this would query the database
  // For now, return mock data
  return relatedTypes.slice(0, 5).map((type, index) => ({
    entityType: type,
    entityId: `${type.toUpperCase()}-${index + 1}`,
    name: `${type.charAt(0).toUpperCase() + type.slice(1)} #${index + 1}`,
    state: 'draft',
    relationship: 'related',
    relevanceScore: 80 - (index * 10),
    metadata: {},
  }));
}

// Get context timeline
function getContextTimeline(entityType: EntityType, entityId: string): ContextTimeline[] {
  // In a real app, this would query the timeline
  // For now, return mock data
  return [
    {
      id: '1',
      entityType,
      entityId,
      event: 'created',
      description: `${entityType} created`,
      timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
      actor: 'system',
      impact: 'entity initialized',
    },
    {
      id: '2',
      entityType,
      entityId,
      event: 'updated',
      description: `${entityType} updated`,
      timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
      actor: 'user',
      impact: 'details modified',
    },
    {
      id: '3',
      entityType,
      entityId,
      event: 'state_change',
      description: `State changed to draft`,
      timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
      actor: 'system',
      impact: 'workflow advanced',
    },
  ];
}

// Get context financial
function getContextFinancial(
  entityType: EntityType,
  entityId: string,
  relatedEntities: ContextEntity[]
): ContextFinancial {
  // In a real app, this would calculate actual financials
  const financialEntityTypes = ['customer', 'order', 'invoice', 'payment', 'quote', 'contract'];
  
  if (!financialEntityTypes.includes(entityType)) {
    return {
      totalValue: 0,
      pendingAmount: 0,
      overdueAmount: 0,
      currency: 'USD',
      breakdown: [],
    };
  }

  return {
    totalValue: 50000,
    pendingAmount: 12500,
    overdueAmount: 0,
    currency: 'USD',
    breakdown: relatedEntities
      .filter(e => financialEntityTypes.includes(e.entityType))
      .map(e => ({
        entityType: e.entityType,
        amount: Math.floor(Math.random() * 10000),
      })),
  };
}

// Get context operational
function getContextOperational(
  entityType: EntityType,
  entityId: string,
  currentState: EntityState
): ContextOperational {
  // In a real app, this would query operational status
  return {
    activeWorkflows: 2,
    pendingActions: 3,
    blockedItems: currentState === 'blocked' ? 1 : 0,
    slaBreaches: 0,
    nextAction: currentState === 'draft' ? 'Submit for approval' : 'Process next step',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    slaDeadline: new Date(Date.now() + 86400000 * 7).toISOString(),
  };
}

// Get context actions
function getContextActions(entityType: EntityType, currentState: EntityState): Array<{
  action: string;
  priority: Priority;
  description: string;
}> {
  // In a real app, this would use the Universal Action Engine
  const actions: Array<{
    action: string;
    priority: Priority;
    description: string;
  }> = [];

  if (currentState === 'draft') {
    actions.push({
      action: 'Submit',
      priority: 'urgent',
      description: 'Submit for approval',
    });
    actions.push({
      action: 'Save',
      priority: 'normal',
      description: 'Save as draft',
    });
  } else if (currentState === 'pending') {
    actions.push({
      action: 'Approve',
      priority: 'critical',
      description: 'Approve for processing',
    });
    actions.push({
      action: 'Reject',
      priority: 'urgent',
      description: 'Reject this item',
    });
  } else if (currentState === 'blocked') {
    actions.push({
      action: 'Unblock',
      priority: 'critical',
      description: 'Remove block',
    });
    actions.push({
      action: 'Escalate',
      priority: 'urgent',
      description: 'Escalate issue',
    });
  }

  return actions;
}

// Get context recommendations
function getContextRecommendations(
  entityType: EntityType,
  currentState: EntityState,
  operational: ContextOperational
): string[] {
  const recommendations: string[] = [];

  if (currentState === 'draft') {
    recommendations.push('Complete required fields before submitting');
    recommendations.push('Review related entities for dependencies');
  } else if (currentState === 'pending') {
    recommendations.push('Review approval requirements');
    recommendations.push('Check for blocking dependencies');
  } else if (currentState === 'blocked') {
    recommendations.push('Resolve blocking issues immediately');
    recommendations.push('Update stakeholders on resolution timeline');
  } else if (operational.slaBreaches > 0) {
    recommendations.push('Address SLA breaches urgently');
    recommendations.push('Escalate if resolution is delayed');
  }

  if (operational.pendingActions > 5) {
    recommendations.push('Consider delegating pending actions');
  }

  return recommendations;
}

// Get context health
function getContextHealth(currentState: EntityState, operational: ContextOperational): {
  status: 'healthy' | 'warning' | 'critical';
  score: number;
} {
  let score = 100;

  if (currentState === 'blocked' || currentState === 'failed') {
    score -= 50;
  } else if (currentState === 'delayed' || currentState === 'overdue') {
    score -= 30;
  } else if (currentState === 'pending') {
    score -= 15;
  }

  if (operational.blockedItems > 0) {
    score -= 20;
  }

  if (operational.slaBreaches > 0) {
    score -= 30;
  }

  if (operational.pendingActions > 10) {
    score -= 10;
  }

  score = Math.max(0, Math.min(100, score));

  let status: 'healthy' | 'warning' | 'critical';
  if (score < 50) {
    status = 'critical';
  } else if (score < 75) {
    status = 'warning';
  } else {
    status = 'healthy';
  }

  return { status, score };
}

// Get context summary
export function getContextSummary(context: UniversalContext): {
  totalRelatedEntities: number;
  activeWorkflows: number;
  pendingActions: number;
  financialImpact: number;
  healthStatus: string;
  nextAction: string;
} {
  return {
    totalRelatedEntities: context.relatedEntities.length,
    activeWorkflows: context.operational.activeWorkflows,
    pendingActions: context.operational.pendingActions,
    financialImpact: context.financial.totalValue,
    healthStatus: context.health.status,
    nextAction: context.operational.nextAction,
  };
}

// Get context by relationship type
export function getContextByRelationship(
  context: UniversalContext,
  relationship: 'parent' | 'child' | 'peer' | 'related'
): ContextEntity[] {
  return context.relatedEntities.filter(e => e.relationship === relationship);
}

// Get high relevance entities
export function getHighRelevanceEntities(context: UniversalContext, threshold: number = 70): ContextEntity[] {
  return context.relatedEntities.filter(e => e.relevanceScore >= threshold);
}

// Get context by entity type
export function getContextByEntityType(context: UniversalContext, entityType: EntityType): ContextEntity[] {
  return context.relatedEntities.filter(e => e.entityType === entityType);
}

// Sort context entities by relevance
export function sortContextByRelevance(entities: ContextEntity[]): ContextEntity[] {
  return [...entities].sort((a, b) => b.relevanceScore - a.relevanceScore);
}

// Get context timeline by date range
export function getContextTimelineByDateRange(
  context: UniversalContext,
  startDate: Date,
  endDate: Date
): ContextTimeline[] {
  return context.timeline.filter(event => {
    const eventDate = new Date(event.timestamp);
    return eventDate >= startDate && eventDate <= endDate;
  });
}

// Get recent timeline events
export function getRecentTimelineEvents(context: UniversalContext, limit: number = 10): ContextTimeline[] {
  return context.timeline
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

// Get context actions by priority
export function getContextActionsByPriority(
  context: UniversalContext,
  priority: Priority
): Array<{
  action: string;
  priority: Priority;
  description: string;
}> {
  return context.actions.filter(a => a.priority === priority);
}

// Get critical context actions
export function getCriticalContextActions(context: UniversalContext): Array<{
  action: string;
  priority: Priority;
  description: string;
}> {
  return getContextActionsByPriority(context, 'critical');
}

// Check if context has issues
export function contextHasIssues(context: UniversalContext): boolean {
  return (
    context.health.status === 'critical' ||
    context.operational.blockedItems > 0 ||
    context.operational.slaBreaches > 0 ||
    context.relatedEntities.some(e => e.state === 'blocked' || e.state === 'failed')
  );
}

// Get context issues
export function getContextIssues(context: UniversalContext): string[] {
  const issues: string[] = [];

  if (context.health.status === 'critical') {
    issues.push('Critical health status');
  }

  if (context.operational.blockedItems > 0) {
    issues.push(`${context.operational.blockedItems} blocked items`);
  }

  if (context.operational.slaBreaches > 0) {
    issues.push(`${context.operational.slaBreaches} SLA breaches`);
  }

  context.relatedEntities.forEach(entity => {
    if (entity.state === 'blocked') {
      issues.push(`Related entity ${entity.name} is blocked`);
    }
    if (entity.state === 'failed') {
      issues.push(`Related entity ${entity.name} has failed`);
    }
  });

  return issues;
}

// Batch get context for multiple entities
export function batchGetContext(
  entities: Array<{
    entityType: EntityType;
    entityId: string;
    name: string;
    state: EntityState;
  }>
): Map<string, UniversalContext> {
  const contextMap = new Map<string, UniversalContext>();

  entities.forEach(entity => {
    const key = `${entity.entityType}-${entity.entityId}`;
    contextMap.set(key, getUniversalContext(entity.entityType, entity.entityId, entity.name, entity.state));
  });

  return contextMap;
}

// Get context comparison between two entities
export function compareContexts(
  context1: UniversalContext,
  context2: UniversalContext
): {
  similarities: string[];
  differences: string[];
  sharedEntities: ContextEntity[];
} {
  const similarities: string[] = [];
  const differences: string[] = [];
  const sharedEntities: ContextEntity[] = [];

  // Compare health
  if (context1.health.status === context2.health.status) {
    similarities.push(`Both have ${context1.health.status} health status`);
  } else {
    differences.push(`Different health status: ${context1.health.status} vs ${context2.health.status}`);
  }

  // Compare financial impact
  if (Math.abs(context1.financial.totalValue - context2.financial.totalValue) < 1000) {
    similarities.push('Similar financial impact');
  } else {
    differences.push('Different financial impact');
  }

  // Find shared related entities
  context1.relatedEntities.forEach(entity1 => {
    const shared = context2.relatedEntities.find(entity2 => 
      entity2.entityId === entity1.entityId && entity2.entityType === entity1.entityType
    );
    if (shared) {
      sharedEntities.push(shared);
    }
  });

  return {
    similarities,
    differences,
    sharedEntities,
  };
}