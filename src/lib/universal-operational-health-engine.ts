// Universal Operational Health Engine - Enterprise always shows healthy/warning/blocked/failing/delayed/critical
import type { EntityType, EntityState } from "./operational-state-machine";
import type { Priority } from "./system-priority-engine";

export type HealthStatus = 'healthy' | 'warning' | 'blocked' | 'failing' | 'delayed' | 'critical';

export interface HealthMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  status: HealthStatus;
  trend: 'improving' | 'stable' | 'degrading';
  lastUpdated: string;
}

export interface EntityHealth {
  entityType: EntityType;
  entityId: string;
  name: string;
  status: HealthStatus;
  score: number; // 0-100
  metrics: HealthMetric[];
  issues: string[];
  recommendations: string[];
  lastAssessment: string;
}

export interface EnterpriseHealth {
  overallStatus: HealthStatus;
  overallScore: number;
  entityHealths: EntityHealth[];
  systemMetrics: {
    healthy: number;
    warning: number;
    blocked: number;
    failing: number;
    delayed: number;
    critical: number;
  };
  trends: {
    revenue: 'up' | 'stable' | 'down';
    operations: 'improving' | 'stable' | 'degrading';
    sla: 'passing' | 'at_risk' | 'breached';
  };
  alerts: string[];
}

// State to health status mapping
export function getStateHealthStatus(state: EntityState): HealthStatus {
  const blockedStates: EntityState[] = ['blocked', 'on_hold'];
  const failingStates: EntityState[] = ['failed', 'cancelled'];
  const delayedStates: EntityState[] = ['delayed', 'overdue'];
  const warningStates: EntityState[] = ['pending', 'expired'];
  const healthyStates: EntityState[] = ['draft', 'approved', 'processing', 'dispatched', 'delivered', 'completed', 'active', 'sent', 'paid', 'qualified', 'contacted', 'proposal', 'negotiation', 'converted', 'assigned', 'in_progress', 'resolved'];
  
  if (blockedStates.includes(state)) return 'blocked';
  if (failingStates.includes(state)) return 'failing';
  if (delayedStates.includes(state)) return 'delayed';
  if (warningStates.includes(state)) return 'warning';
  if (healthyStates.includes(state)) return 'healthy';
  
  return 'warning'; // Default
}

// Get health status color
export function getHealthStatusColor(status: HealthStatus): string {
  switch (status) {
    case 'healthy': return 'oklch(0.68 0.18 75)';
    case 'warning': return 'oklch(0.65 0.18 45)';
    case 'blocked': return 'oklch(0.6 0.2 10)';
    case 'failing': return 'oklch(0.6 0.2 15)';
    case 'delayed': return 'oklch(0.65 0.18 30)';
    case 'critical': return 'oklch(0.6 0.22 5)';
  }
}

// Get health status icon
export function getHealthStatusIcon(status: HealthStatus): string {
  switch (status) {
    case 'healthy': return '✅';
    case 'warning': return '⚠️';
    case 'blocked': return '🚫';
    case 'failing': return '❌';
    case 'delayed': return '⏰';
    case 'critical': return '🔴';
  }
}

// Get health status label
export function getHealthStatusLabel(status: HealthStatus): string {
  switch (status) {
    case 'healthy': return 'Healthy';
    case 'warning': return 'Warning';
    case 'blocked': return 'Blocked';
    case 'failing': return 'Failing';
    case 'delayed': return 'Delayed';
    case 'critical': return 'Critical';
  }
}

// Calculate entity health score
export function calculateEntityHealthScore(entity: {
  type: EntityType;
  state: EntityState;
  metadata?: any;
}): {
  score: number;
  status: HealthStatus;
  issues: string[];
} {
  let score = 100;
  const issues: string[] = [];
  
  const status = getStateHealthStatus(entity.state);
  
  // Deduct based on state
  switch (status) {
    case 'critical':
      score -= 50;
      issues.push('Critical state detected');
      break;
    case 'failing':
      score -= 40;
      issues.push('Entity in failing state');
      break;
    case 'blocked':
      score -= 35;
      issues.push('Entity is blocked');
      break;
    case 'delayed':
      score -= 25;
      issues.push('Entity is delayed');
      break;
    case 'warning':
      score -= 15;
      issues.push('Entity needs attention');
      break;
  }
  
  // Check for overdue
  if (entity.metadata?.dueDate) {
    const isOverdue = new Date(entity.metadata.dueDate) < new Date();
    if (isOverdue) {
      score -= 20;
      issues.push('Item is overdue');
    }
  }
  
  // Check for SLA risk
  if (entity.metadata?.slaDeadline) {
    const hoursUntil = (new Date(entity.metadata.slaDeadline).getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntil > 0 && hoursUntil < 24) {
      score -= 15;
      issues.push('SLA deadline approaching');
    }
    if (hoursUntil <= 0) {
      score -= 30;
      issues.push('SLA deadline breached');
    }
  }
  
  // Check for revenue impact
  if (entity.metadata?.revenueImpact && entity.metadata.revenueImpact < -10000) {
    score -= 20;
    issues.push('Significant revenue impact');
  }
  
  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));
  
  // Update status based on score
  if (score < 40) {
    return { score, status: 'critical', issues };
  } else if (score < 60) {
    return { score, status: 'failing', issues };
  } else if (score < 75) {
    return { score, status: 'warning', issues };
  } else {
    return { score, status: 'healthy', issues };
  }
}

// Get entity health
export function getEntityHealth(entity: {
  type: EntityType;
  id: string;
  name: string;
  state: EntityState;
  metadata?: any;
}): EntityHealth {
  const { score, status, issues } = calculateEntityHealthScore(entity);
  
  const metrics: HealthMetric[] = [
    {
      id: 'health-score',
      name: 'Health Score',
      value: score,
      target: 80,
      status,
      trend: 'stable',
      lastUpdated: new Date().toISOString(),
    },
  ];
  
  // Add specific metrics based on entity type
  if (entity.metadata?.revenueImpact) {
    metrics.push({
      id: 'revenue-impact',
      name: 'Revenue Impact',
      value: entity.metadata.revenueImpact,
      target: 0,
      status: entity.metadata.revenueImpact < 0 ? 'warning' : 'healthy',
      trend: 'stable',
      lastUpdated: new Date().toISOString(),
    });
  }
  
  if (entity.metadata?.dueDate) {
    const daysUntil = Math.ceil((new Date(entity.metadata.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    metrics.push({
      id: 'days-until-due',
      name: 'Days Until Due',
      value: daysUntil,
      target: 7,
      status: daysUntil < 0 ? 'delayed' : daysUntil < 3 ? 'warning' : 'healthy',
      trend: 'stable',
      lastUpdated: new Date().toISOString(),
    });
  }
  
  const recommendations = getHealthRecommendations(status, entity);
  
  return {
    entityType: entity.type,
    entityId: entity.id,
    name: entity.name,
    status,
    score,
    metrics,
    issues,
    recommendations,
    lastAssessment: new Date().toISOString(),
  };
}

// Get health recommendations
function getHealthRecommendations(status: HealthStatus, entity: any): string[] {
  const recommendations: string[] = [];
  
  switch (status) {
    case 'critical':
      recommendations.push('Immediate action required');
      recommendations.push('Escalate to management');
      recommendations.push('Assess impact on operations');
      break;
    case 'failing':
      recommendations.push('Investigate root cause');
      recommendations.push('Implement corrective action');
      recommendations.push('Monitor closely');
      break;
    case 'blocked':
      recommendations.push('Resolve blocking issues');
      recommendations.push('Review dependencies');
      recommendations.push('Update stakeholders');
      break;
    case 'delayed':
      recommendations.push('Identify delay cause');
      recommendations.push('Recovery plan needed');
      recommendations.push('Communicate with stakeholders');
      break;
    case 'warning':
      recommendations.push('Review and address');
      recommendations.push('Prevent escalation');
      recommendations.push('Monitor progress');
      break;
    case 'healthy':
      recommendations.push('Continue normal operations');
      recommendations.push('Maintain current performance');
      break;
  }
  
  return recommendations;
}

// Calculate enterprise health
export function calculateEnterpriseHealth(entities: Array<{
  type: EntityType;
  id: string;
  name: string;
  state: EntityState;
  metadata?: any;
}>): EnterpriseHealth {
  const entityHealths = entities.map(entity => getEntityHealth(entity));
  
  const totalScore = entityHealths.reduce((sum, h) => sum + h.score, 0);
  const overallScore = Math.round(totalScore / entityHealths.length);
  
  const systemMetrics = {
    healthy: entityHealths.filter(h => h.status === 'healthy').length,
    warning: entityHealths.filter(h => h.status === 'warning').length,
    blocked: entityHealths.filter(h => h.status === 'blocked').length,
    failing: entityHealths.filter(h => h.status === 'failing').length,
    delayed: entityHealths.filter(h => h.status === 'delayed').length,
    critical: entityHealths.filter(h => h.status === 'critical').length,
  };
  
  // Determine overall status
  let overallStatus: HealthStatus;
  if (systemMetrics.critical > 0 || overallScore < 40) {
    overallStatus = 'critical';
  } else if (systemMetrics.failing > 0 || overallScore < 60) {
    overallStatus = 'failing';
  } else if (systemMetrics.blocked > 0 || overallScore < 75) {
    overallStatus = 'blocked';
  } else if (systemMetrics.delayed > 0 || overallScore < 85) {
    overallStatus = 'delayed';
  } else if (systemMetrics.warning > 0 || overallScore < 95) {
    overallStatus = 'warning';
  } else {
    overallStatus = 'healthy';
  }
  
  // Generate alerts
  const alerts: string[] = [];
  if (systemMetrics.critical > 0) {
    alerts.push(`${systemMetrics.critical} critical issues require immediate attention`);
  }
  if (systemMetrics.failing > 0) {
    alerts.push(`${systemMetrics.failing} entities are failing`);
  }
  if (systemMetrics.blocked > 0) {
    alerts.push(`${systemMetrics.blocked} workflows are blocked`);
  }
  if (systemMetrics.delayed > 0) {
    alerts.push(`${systemMetrics.delayed} items are delayed`);
  }
  
  return {
    overallStatus,
    overallScore,
    entityHealths,
    systemMetrics,
    trends: {
      revenue: 'stable',
      operations: 'stable',
      sla: 'passing',
    },
    alerts,
  };
}

// Get entities by health status
export function getEntitiesByHealthStatus(
  entities: EntityHealth[],
  status: HealthStatus
): EntityHealth[] {
  return entities.filter(entity => entity.status === status);
}

// Get critical entities
export function getCriticalEntities(entities: EntityHealth[]): EntityHealth[] {
  return getEntitiesByHealthStatus(entities, 'critical');
}

// Get failing entities
export function getFailingEntities(entities: EntityHealth[]): EntityHealth[] {
  return getEntitiesByHealthStatus(entities, 'failing');
}

// Get blocked entities
export function getBlockedEntities(entities: EntityHealth[]): EntityHealth[] {
  return getEntitiesByHealthStatus(entities, 'blocked');
}

// Sort entities by health score
export function sortByHealthScore(entities: EntityHealth[]): EntityHealth[] {
  return [...entities].sort((a, b) => a.score - b.score);
}

// Get worst performing entities
export function getWorstPerformingEntities(entities: EntityHealth[], n: number = 10): EntityHealth[] {
  const sorted = sortByHealthScore(entities);
  return sorted.slice(0, n);
}

// Get health trend for entity
export function getHealthTrend(
  currentScore: number,
  previousScore: number
): 'improving' | 'stable' | 'degrading' {
  const diff = currentScore - previousScore;
  if (diff > 5) return 'improving';
  if (diff < -5) return 'degrading';
  return 'stable';
}

// Get health summary
export function getHealthSummary(health: EnterpriseHealth): {
  status: HealthStatus;
  score: number;
  message: string;
  color: string;
} {
  const { overallStatus, overallScore } = health;
  
  let message: string;
  switch (overallStatus) {
    case 'healthy':
      message = `Enterprise operating normally (${overallScore}% health)`;
      break;
    case 'warning':
      message = `Some issues detected (${overallScore}% health)`;
      break;
    case 'delayed':
      message = `Delays impacting operations (${overallScore}% health)`;
      break;
    case 'blocked':
      message = `Workflows blocked (${overallScore}% health)`;
      break;
    case 'failing':
      message = `Multiple failures detected (${overallScore}% health)`;
      break;
    case 'critical':
      message = `Critical issues require immediate attention (${overallScore}% health)`;
      break;
  }
  
  return {
    status: overallStatus,
    score: overallScore,
    message,
    color: getHealthStatusColor(overallStatus),
  };
}

// Check if health is acceptable
export function isHealthAcceptable(health: EnterpriseHealth): boolean {
  return health.overallScore >= 70 && health.systemMetrics.critical === 0;
}

// Get health improvement actions
export function getHealthImprovementActions(health: EnterpriseHealth): Array<{
  action: string;
  priority: Priority;
  target: string;
}> {
  const actions: Array<{
    action: string;
    priority: Priority;
    target: string;
  }> = [];
  
  if (health.systemMetrics.critical > 0) {
    actions.push({
      action: 'Address critical issues',
      priority: 'critical',
      target: 'all',
    });
  }
  
  if (health.systemMetrics.failing > 0) {
    actions.push({
      action: 'Investigate failures',
      priority: 'urgent',
      target: 'failing_entities',
    });
  }
  
  if (health.systemMetrics.blocked > 0) {
    actions.push({
      action: 'Resolve blocks',
      priority: 'urgent',
      target: 'blocked_entities',
    });
  }
  
  if (health.systemMetrics.delayed > 0) {
    actions.push({
      action: 'Address delays',
      priority: 'normal',
      target: 'delayed_entities',
    });
  }
  
  if (health.systemMetrics.warning > 0) {
    actions.push({
      action: 'Review warnings',
      priority: 'normal',
      target: 'warning_entities',
    });
  }
  
  return actions;
}

// Monitor health changes
export function monitorHealthChanges(
  currentHealth: EnterpriseHealth,
  previousHealth: EnterpriseHealth
): {
  statusChanged: boolean;
  scoreChanged: boolean;
  newIssues: string[];
  resolvedIssues: string[];
} {
  const statusChanged = currentHealth.overallStatus !== previousHealth.overallStatus;
  const scoreChanged = currentHealth.overallScore !== previousHealth.overallScore;
  const scoreDiff = currentHealth.overallScore - previousHealth.overallScore;
  
  const newIssues: string[] = [];
  const resolvedIssues: string[] = [];
  
  if (scoreDiff < 0) {
    newIssues.push('Health score decreased');
  } else if (scoreDiff > 0) {
    resolvedIssues.push('Health score improved');
  }
  
  if (currentHealth.systemMetrics.critical > previousHealth.systemMetrics.critical) {
    newIssues.push('New critical issues appeared');
  }
  
  if (currentHealth.systemMetrics.critical < previousHealth.systemMetrics.critical) {
    resolvedIssues.push('Critical issues resolved');
  }
  
  return {
    statusChanged,
    scoreChanged,
    newIssues,
    resolvedIssues,
  };
}
