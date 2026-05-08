// System-Wide Priority Engine - Universal prioritization across all workflows
export type Priority = 'critical' | 'urgent' | 'normal' | 'low';

export interface PriorityRule {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  conditions: {
    entityType?: string;
    state?: string;
    revenueImpact?: {
      min?: number;
      max?: number;
      type?: 'positive' | 'negative';
    };
    timeSinceCreation?: {
      hours?: number;
      days?: number;
    };
    timeUntilDue?: {
      hours?: number;
      days?: number;
    };
    slaRisk?: boolean;
    revenueRisk?: boolean;
    customerImpact?: boolean;
  };
  weight: number; // Higher weight takes precedence
}

export interface PriorityScore {
  priority: Priority;
  score: number; // 0-100
  reasons: string[];
  appliedRules: string[];
}

export interface PrioritizedItem {
  id: string;
  type: string;
  title: string;
  priorityScore: PriorityScore;
  metadata?: Record<string, any>;
}

// Priority rules configuration
export const priorityRules: PriorityRule[] = [
  {
    id: 'critical-revenue-loss',
    name: 'Critical Revenue Loss',
    description: 'Items with significant negative revenue impact',
    priority: 'critical',
    conditions: {
      revenueImpact: {
        type: 'negative',
        max: -10000,
      },
    },
    weight: 100,
  },
  {
    id: 'critical-sla-risk',
    name: 'SLA Risk',
    description: 'Items at risk of SLA breach',
    priority: 'critical',
    conditions: {
      slaRisk: true,
    },
    weight: 95,
  },
  {
    id: 'critical-customer-impact',
    name: 'Customer Impact',
    description: 'Items affecting key customers',
    priority: 'critical',
    conditions: {
      customerImpact: true,
    },
    weight: 90,
  },
  {
    id: 'critical-blocked-state',
    name: 'Blocked State',
    description: 'Entities in blocked state',
    priority: 'critical',
    conditions: {
      state: 'blocked',
    },
    weight: 85,
  },
  {
    id: 'urgent-overdue',
    name: 'Overdue Items',
    description: 'Items past their due date',
    priority: 'urgent',
    conditions: {
      timeUntilDue: {
        hours: 0,
      },
    },
    weight: 80,
  },
  {
    id: 'urgent-due-soon',
    name: 'Due Soon',
    description: 'Items due within 24 hours',
    priority: 'urgent',
    conditions: {
      timeUntilDue: {
        hours: 24,
      },
    },
    weight: 75,
  },
  {
    id: 'urgent-failed-state',
    name: 'Failed State',
    description: 'Entities in failed state',
    priority: 'urgent',
    conditions: {
      state: 'failed',
    },
    weight: 70,
  },
  {
    id: 'urgent-high-revenue',
    name: 'High Revenue Opportunity',
    description: 'Items with significant positive revenue impact',
    priority: 'urgent',
    conditions: {
      revenueImpact: {
        type: 'positive',
        min: 50000,
      },
    },
    weight: 65,
  },
  {
    id: 'normal-pending-state',
    name: 'Pending State',
    description: 'Entities in pending state',
    priority: 'normal',
    conditions: {
      state: 'pending',
    },
    weight: 50,
  },
  {
    id: 'normal-approval-required',
    name: 'Approval Required',
    description: 'Items requiring approval',
    priority: 'normal',
    conditions: {
      state: 'pending',
    },
    weight: 45,
  },
  {
    id: 'low-draft-state',
    name: 'Draft State',
    description: 'Entities in draft state',
    priority: 'low',
    conditions: {
      state: 'draft',
    },
    weight: 20,
  },
  {
    id: 'low-low-revenue',
    name: 'Low Revenue Impact',
    description: 'Items with minimal revenue impact',
    priority: 'low',
    conditions: {
      revenueImpact: {
        min: -1000,
        max: 1000,
      },
    },
    weight: 15,
  },
];

// Calculate priority score for an item
export function calculatePriorityScore(item: {
  entityType?: string;
  state?: string;
  revenueImpact?: number;
  createdAt?: string;
  dueDate?: string;
  slaRisk?: boolean;
  revenueRisk?: boolean;
  customerImpact?: boolean;
}): PriorityScore {
  let score = 0;
  const reasons: string[] = [];
  const appliedRules: string[] = [];

  priorityRules.forEach(rule => {
    if (matchesRule(item, rule)) {
      const ruleScore = getScoreForPriority(rule.priority);
      score = Math.max(score, ruleScore);
      reasons.push(rule.description);
      appliedRules.push(rule.id);
    }
  });

  // Apply time-based degradation
  if (item.createdAt) {
    const age = Date.now() - new Date(item.createdAt).getTime();
    const ageInHours = age / (1000 * 60 * 60);
    
    if (ageInHours > 24 && score < 70) {
      score = Math.min(score + 20, 70);
      reasons.push('Aging item');
    }
  }

  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));

  return {
    priority: getPriorityFromScore(score),
    score,
    reasons,
    appliedRules,
  };
}

// Check if item matches a priority rule
function matchesRule(item: any, rule: PriorityRule): boolean {
  const conditions = rule.conditions;

  if (conditions.entityType && item.entityType !== conditions.entityType) {
    return false;
  }

  if (conditions.state && item.state !== conditions.state) {
    return false;
  }

  if (conditions.revenueImpact) {
    const impact = item.revenueImpact || 0;
    if (conditions.revenueImpact.min !== undefined && impact < conditions.revenueImpact.min) {
      return false;
    }
    if (conditions.revenueImpact.max !== undefined && impact > conditions.revenueImpact.max) {
      return false;
    }
    if (conditions.revenueImpact.type && 
      ((conditions.revenueImpact.type === 'positive' && impact < 0) ||
       (conditions.revenueImpact.type === 'negative' && impact >= 0))) {
      return false;
    }
  }

  if (conditions.timeSinceCreation) {
    if (!item.createdAt) return false;
    
    const age = Date.now() - new Date(item.createdAt).getTime();
    const ageInHours = age / (1000 * 60 * 60);
    const ageInDays = age / (1000 * 60 * 60 * 24);

    if (conditions.timeSinceCreation.hours !== undefined && ageInHours < conditions.timeSinceCreation.hours) {
      return false;
    }
    if (conditions.timeSinceCreation.days !== undefined && ageInDays < conditions.timeSinceCreation.days) {
      return false;
    }
  }

  if (conditions.timeUntilDue) {
    if (!item.dueDate) return false;
    
    const timeUntil = new Date(item.dueDate).getTime() - Date.now();
    const hoursUntil = timeUntil / (1000 * 60 * 60);
    const daysUntil = timeUntil / (1000 * 60 * 60 * 24);

    if (conditions.timeUntilDue.hours !== undefined && hoursUntil > conditions.timeUntilDue.hours) {
      return false;
    }
    if (conditions.timeUntilDue.days !== undefined && daysUntil > conditions.timeUntilDue.days) {
      return false;
    }
  }

  if (conditions.slaRisk && !item.slaRisk) {
    return false;
  }

  if (conditions.revenueRisk && !item.revenueRisk) {
    return false;
  }

  if (conditions.customerImpact && !item.customerImpact) {
    return false;
  }

  return true;
}

// Get score for priority level
function getScoreForPriority(priority: Priority): number {
  switch (priority) {
    case 'critical': return 90;
    case 'urgent': return 70;
    case 'normal': return 50;
    case 'low': return 20;
  }
}

// Get priority from score
function getPriorityFromScore(score: number): Priority {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'urgent';
  if (score >= 40) return 'normal';
  return 'low';
}

// Prioritize a list of items
export function prioritizeItems(items: Array<{
  id: string;
  type: string;
  title: string;
  metadata?: any;
}>): PrioritizedItem[] {
  return items
    .map(item => ({
      ...item,
      priorityScore: calculatePriorityScore(item.metadata || {}),
    }))
    .sort((a, b) => b.priorityScore.score - a.priorityScore.score);
}

// Get priority color
export function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case 'critical': return 'oklch(0.6 0.2 10)';
    case 'urgent': return 'oklch(0.65 0.18 30)';
    case 'normal': return 'oklch(0.65 0.18 145)';
    case 'low': return 'oklch(0.6 0.1 270)';
  }
}

// Get priority icon
export function getPriorityIcon(priority: Priority): string {
  switch (priority) {
    case 'critical': return '⚠️';
    case 'urgent': return '🔶';
    case 'normal': return '🔵';
    case 'low': return '⚪';
  }
}

// Get priority label
export function getPriorityLabel(priority: Priority): string {
  switch (priority) {
    case 'critical': return 'Critical';
    case 'urgent': return 'Urgent';
    case 'normal': return 'Normal';
    case 'low': return 'Low';
  }
}

// Filter items by priority
export function filterByPriority(items: PrioritizedItem[], priority: Priority): PrioritizedItem[] {
  return items.filter(item => item.priorityScore.priority === priority);
}

// Get priority distribution
export function getPriorityDistribution(items: PrioritizedItem[]): {
  critical: number;
  urgent: number;
  normal: number;
  low: number;
} {
  return {
    critical: items.filter(i => i.priorityScore.priority === 'critical').length,
    urgent: items.filter(i => i.priorityScore.priority === 'urgent').length,
    normal: items.filter(i => i.priorityScore.priority === 'normal').length,
    low: items.filter(i => i.priorityScore.priority === 'low').length,
  };
}

// Get top N items by priority
export function getTopItems(items: PrioritizedItem[], n: number): PrioritizedItem[] {
  return items.slice(0, n);
}

// Check if item requires immediate attention
export function requiresImmediateAttention(item: PrioritizedItem): boolean {
  return item.priorityScore.priority === 'critical';
}

// Get items requiring immediate attention
export function getItemsRequiringAttention(items: PrioritizedItem[]): PrioritizedItem[] {
  return items.filter(item => requiresImmediateAttention(item));
}

// Sort items by priority (descending)
export function sortByPriority(items: PrioritizedItem[]): PrioritizedItem[] {
  return [...items].sort((a, b) => b.priorityScore.score - a.priorityScore.score);
}

// Get priority threshold
export function getPriorityThreshold(priority: Priority): number {
  switch (priority) {
    case 'critical': return 80;
    case 'urgent': return 60;
    case 'normal': return 40;
    case 'low': return 0;
  }
}

// Check if score meets priority threshold
export function meetsPriorityThreshold(score: number, priority: Priority): boolean {
  return score >= getPriorityThreshold(priority);
}

// Recalculate priority for an item
export function recalculatePriority(itemId: string, metadata: any): PriorityScore {
  return calculatePriorityScore(metadata);
}

// Batch prioritize items
export function batchPrioritize(items: Array<{
  id: string;
  type: string;
  title: string;
  metadata?: any;
}>): Map<string, PriorityScore> {
  const resultMap = new Map<string, PriorityScore>();
  
  items.forEach(item => {
    resultMap.set(item.id, calculatePriorityScore(item.metadata || {}));
  });
  
  return resultMap;
}
