// @ts-nocheck
// Universal Operational Timeline - Chronological visibility of what happened/who changed it/impact
import type { EntityType, EntityState } from "./operational-state-machine";
import type { Priority } from "./system-priority-engine";

export type TimelineEventType = 
  | 'created'
  | 'updated'
  | 'state_changed'
  | 'assigned'
  | 'escalated'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'cancelled'
  | 'failed'
  | 'commented'
  | 'attached'
  | 'notified'
  | 'reviewed'
  | 'custom';

export interface TimelineEvent {
  id: string;
  entityType: EntityType;
  entityId: string;
  eventType: TimelineEventType;
  description: string;
  timestamp: string;
  actor: {
    id: string;
    name: string;
    role: string;
  };
  changes: {
    field: string;
    from: any;
    to: any;
  }[];
  impact: {
    type: 'operational' | 'financial' | 'compliance' | 'sla' | 'none';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    affectedEntities: Array<{
      entityType: EntityType;
      entityId: string;
    }>;
  };
  metadata: Record<string, any>;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
  }>;
}

export interface TimelineFilter {
  entityType?: EntityType;
  entityId?: string;
  eventType?: TimelineEventType;
  actorId?: string;
  startDate?: Date;
  endDate?: Date;
  impactType?: string;
}

export interface TimelineSummary {
  totalEvents: number;
  byType: Record<TimelineEventType, number>;
  byActor: Record<string, number>;
  timeRange: {
    earliest: string;
    latest: string;
  };
  highImpactEvents: number;
  recentActivity: {
    last24Hours: number;
    last7Days: number;
    last30Days: number;
  };
}

// Event type configurations
export const eventTypeConfigs: Record<TimelineEventType, {
  name: string;
  icon: string;
  color: string;
  impact: 'operational' | 'financial' | 'compliance' | 'sla' | 'none';
}> = {
  created: {
    name: 'Created',
    icon: 'Plus',
    color: 'oklch(0.68 0.18 75)',
    impact: 'operational',
  },
  updated: {
    name: 'Updated',
    icon: 'Edit',
    color: 'oklch(0.65 0.18 145)',
    impact: 'operational',
  },
  state_changed: {
    name: 'State Changed',
    icon: 'RefreshCw',
    color: 'oklch(0.7 0.18 200)',
    impact: 'operational',
  },
  assigned: {
    name: 'Assigned',
    icon: 'User',
    color: 'oklch(0.68 0.18 45)',
    impact: 'operational',
  },
  escalated: {
    name: 'Escalated',
    icon: 'ArrowUp',
    color: 'oklch(0.65 0.18 30)',
    impact: 'operational',
  },
  approved: {
    name: 'Approved',
    icon: 'CheckCircle',
    color: 'oklch(0.68 0.18 75)',
    impact: 'operational',
  },
  rejected: {
    name: 'Rejected',
    icon: 'XCircle',
    color: 'oklch(0.6 0.2 15)',
    impact: 'operational',
  },
  completed: {
    name: 'Completed',
    icon: 'CheckCircle',
    color: 'oklch(0.68 0.18 75)',
    impact: 'operational',
  },
  cancelled: {
    name: 'Cancelled',
    icon: 'XCircle',
    color: 'oklch(0.5 0.1 270)',
    impact: 'operational',
  },
  failed: {
    name: 'Failed',
    icon: 'XCircle',
    color: 'oklch(0.6 0.2 15)',
    impact: 'operational',
  },
  commented: {
    name: 'Commented',
    icon: 'MessageSquare',
    color: 'oklch(0.65 0.18 145)',
    impact: 'none',
  },
  attached: {
    name: 'Attached',
    icon: 'Paperclip',
    color: 'oklch(0.65 0.18 145)',
    impact: 'none',
  },
  notified: {
    name: 'Notified',
    icon: 'Bell',
    color: 'oklch(0.65 0.18 45)',
    impact: 'operational',
  },
  reviewed: {
    name: 'Reviewed',
    icon: 'Eye',
    color: 'oklch(0.65 0.18 145)',
    impact: 'operational',
  },
  custom: {
    name: 'Custom',
    icon: 'Settings',
    color: 'oklch(0.65 0.18 270)',
    impact: 'none',
  },
};

// Create timeline event
export function createTimelineEvent(
  entityType: EntityType,
  entityId: string,
  eventType: TimelineEventType,
  description: string,
  actor: {
    id: string;
    name: string;
    role: string;
  },
  changes?: Array<{
    field: string;
    from: any;
    to: any;
  }>,
  impact?: {
    type: 'operational' | 'financial' | 'compliance' | 'sla' | 'none';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    affectedEntities?: Array<{
      entityType: EntityType;
      entityId: string;
    }>;
  },
  metadata?: Record<string, any>
): TimelineEvent {
  const config = eventTypeConfigs[eventType];
  
  return {
    id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    entityType,
    entityId,
    eventType,
    description,
    timestamp: new Date().toISOString(),
    actor,
    changes: changes || [],
    impact: impact || {
      type: config.impact,
      severity: 'low',
      description: 'No impact',
      affectedEntities: [],
    },
    metadata: metadata || {},
  };
}

// Get timeline for an entity
export function getEntityTimeline(
  entityType: EntityType,
  entityId: string,
  events: TimelineEvent[]
): TimelineEvent[] {
  return events
    .filter(e => e.entityType === entityType && e.entityId === entityId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Get timeline by filter
export function getTimelineByFilter(filter: TimelineFilter, events: TimelineEvent[]): TimelineEvent[] {
  let filtered = [...events];
  
  if (filter.entityType) {
    filtered = filtered.filter(e => e.entityType === filter.entityType);
  }
  
  if (filter.entityId) {
    filtered = filtered.filter(e => e.entityId === filter.entityId);
  }
  
  if (filter.eventType) {
    filtered = filtered.filter(e => e.eventType === filter.eventType);
  }
  
  if (filter.actorId) {
    filtered = filtered.filter(e => e.actor.id === filter.actorId);
  }
  
  if (filter.startDate) {
    filtered = filtered.filter(e => new Date(e.timestamp) >= filter.startDate!);
  }
  
  if (filter.endDate) {
    filtered = filtered.filter(e => new Date(e.timestamp) <= filter.endDate!);
  }
  
  if (filter.impactType) {
    filtered = filtered.filter(e => e.impact.type === filter.impactType);
  }
  
  return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Get timeline summary
export function getTimelineSummary(events: TimelineEvent[]): TimelineSummary {
  const byType: Record<string, number> = {};
  const byActor: Record<string, number> = {};
  
  let earliest = new Date();
  let latest = new Date(0);
  
  const now = new Date();
  const last24Hours = now.getTime() - 24 * 60 * 60 * 1000;
  const last7Days = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  const last30Days = now.getTime() - 30 * 24 * 60 * 60 * 1000;
  
  let last24HoursCount = 0;
  let last7DaysCount = 0;
  let last30DaysCount = 0;
  let highImpactCount = 0;
  
  events.forEach(event => {
    // Count by type
    byType[event.eventType] = (byType[event.eventType] || 0) + 1;
    
    // Count by actor
    byActor[event.actor.id] = (byActor[event.actor.id] || 0) + 1;
    
    // Track time range
    const eventTime = new Date(event.timestamp);
    if (eventTime < earliest) earliest = eventTime;
    if (eventTime > latest) latest = eventTime;
    
    // Count recent activity
    if (eventTime.getTime() > last24Hours) last24HoursCount++;
    if (eventTime.getTime() > last7Days) last7DaysCount++;
    if (eventTime.getTime() > last30Days) last30DaysCount++;
    
    // Count high impact
    if (event.impact.severity === 'high' || event.impact.severity === 'critical') {
      highImpactCount++;
    }
  });
  
  return {
    totalEvents: events.length,
    byType: byType as Record<TimelineEventType, number>,
    byActor,
    timeRange: {
      earliest: earliest.toISOString(),
      latest: latest.toISOString(),
    },
    highImpactEvents: highImpactCount,
    recentActivity: {
      last24Hours: last24HoursCount,
      last7Days: last7DaysCount,
      last30Days: last30DaysCount,
    },
  };
}

// Get recent events
export function getRecentEvents(events: TimelineEvent[], limit: number = 20): TimelineEvent[] {
  return events
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

// Get high impact events
export function getHighImpactEvents(events: TimelineEvent[]): TimelineEvent[] {
  return events.filter(e => e.impact.severity === 'high' || e.impact.severity === 'critical');
}

// Get state change events
export function getStateChangeEvents(events: TimelineEvent[]): TimelineEvent[] {
  return events.filter(e => e.eventType === 'state_changed');
}

// Get events by actor
export function getEventsByActor(events: TimelineEvent[], actorId: string): TimelineEvent[] {
  return events.filter(e => e.actor.id === actorId);
}

// Get events by impact type
export function getEventsByImpactType(
  events: TimelineEvent[],
  impactType: 'operational' | 'financial' | 'compliance' | 'sla' | 'none'
): TimelineEvent[] {
  return events.filter(e => e.impact.type === impactType);
}

// Get timeline for related entities
export function getRelatedEntityTimeline(
  primaryEntityType: EntityType,
  primaryEntityId: string,
  relatedEntityIds: Array<{ entityType: EntityType; entityId: string }>,
  events: TimelineEvent[]
): TimelineEvent[] {
  const allIds = [
    { entityType: primaryEntityType, entityId: primaryEntityId },
    ...relatedEntityIds,
  ];
  
  return events
    .filter(e => allIds.some(id => e.entityType === id.entityType && e.entityId === id.entityId))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Get event trail for a specific change
export function getEventTrail(
  entityId: string,
  field: string,
  events: TimelineEvent[]
): TimelineEvent[] {
  return events
    .filter(e => e.entityId === entityId && e.changes.some(c => c.field === field))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

// Get event by ID
export function getEventById(eventId: string, events: TimelineEvent[]): TimelineEvent | null {
  return events.find(e => e.id === eventId) || null;
}

// Add comment to timeline
export function addComment(
  entityType: EntityType,
  entityId: string,
  comment: string,
  actor: {
    id: string;
    name: string;
    role: string;
  },
  events: TimelineEvent[]
): TimelineEvent {
  const event = createTimelineEvent(
    entityType,
    entityId,
    'commented',
    comment,
    actor,
    undefined,
    undefined,
    { comment }
  );
  
  events.push(event);
  return event;
}

// Add attachment to timeline
export function addAttachment(
  entityType: EntityType,
  entityId: string,
  attachment: {
    id: string;
    name: string;
    url: string;
  },
  actor: {
    id: string;
    name: string;
    role: string;
  },
  events: TimelineEvent[]
): TimelineEvent {
  const event = createTimelineEvent(
    entityType,
    entityId,
    'attached',
    `Attached ${attachment.name}`,
    actor,
    undefined,
    undefined,
    { attachment }
  );
  
  event.attachments = [attachment];
  events.push(event);
  return event;
}

// Record state change
export function recordStateChange(
  entityType: EntityType,
  entityId: string,
  fromState: EntityState,
  toState: EntityState,
  actor: {
    id: string;
    name: string;
    role: string;
  },
  events: TimelineEvent[]
): TimelineEvent {
  const event = createTimelineEvent(
    entityType,
    entityId,
    'state_changed',
    `State changed from ${fromState} to ${toState}`,
    actor,
    [{ field: 'state', from: fromState, to: toState }],
    {
      type: 'operational',
      severity: 'medium',
      description: 'Entity state transition',
      affectedEntities: [],
    },
    { fromState, toState }
  );
  
  events.push(event);
  return event;
}

// Get event statistics
export function getEventStatistics(events: TimelineEvent[]): {
  totalEvents: number;
  eventsPerDay: number;
  mostActiveActor: string;
  mostCommonEventType: TimelineEventType;
  averageImpactScore: number;
} {
  if (events.length === 0) {
    return {
      totalEvents: 0,
      eventsPerDay: 0,
      mostActiveActor: 'none',
      mostCommonEventType: 'custom',
      averageImpactScore: 0,
    };
  }
  
  const byActor: Record<string, number> = {};
  const byType: Record<string, number> = {};
  const impactScores: number[] = [];
  
  const now = new Date();
  const earliest = new Date(Math.min(...events.map(e => new Date(e.timestamp).getTime())));
  const daysSinceStart = Math.max(1, (now.getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24));
  
  events.forEach(event => {
    byActor[event.actor.id] = (byActor[event.actor.id] || 0) + 1;
    byType[event.eventType] = (byType[event.eventType] || 0) + 1;
    
    const impactScore = event.impact.severity === 'critical' ? 4 : 
                       event.impact.severity === 'high' ? 3 : 
                       event.impact.severity === 'medium' ? 2 : 1;
    impactScores.push(impactScore);
  });
  
  const mostActiveActor = Object.entries(byActor).sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';
  const mostCommonEventType = Object.entries(byType).sort((a, b) => b[1] - a[1])[0]?.[0] as TimelineEventType || 'custom';
  const averageImpactScore = impactScores.reduce((sum, score) => sum + score, 0) / impactScores.length;
  
  return {
    totalEvents: events.length,
    eventsPerDay: Math.round(events.length / daysSinceStart),
    mostActiveActor,
    mostCommonEventType,
    averageImpactScore: Math.round(averageImpactScore * 100) / 100,
  };
}

// Export timeline to CSV
export function exportTimelineToCSV(events: TimelineEvent[]): string {
  const headers = ['ID', 'Entity Type', 'Entity ID', 'Event Type', 'Description', 'Timestamp', 'Actor', 'Impact Type', 'Impact Severity'];
  const rows = events.map(event => [
    event.id,
    event.entityType,
    event.entityId,
    event.eventType,
    event.description,
    event.timestamp,
    event.actor.name,
    event.impact.type,
    event.impact.severity,
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}