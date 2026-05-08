// System-Driven Guidance - Intelligent recommendations and next actions
export type GuidancePriority = 'critical' | 'high' | 'normal' | 'low';

export interface SystemGuidance {
  nextRecommendedAction: {
    id: string;
    title: string;
    description: string;
    action: string;
    reason: string;
    priority: GuidancePriority;
    estimatedTime: string;
  };
  pendingBottlenecks: Array<{
    id: string;
    operation: string;
    description: string;
    impact: string;
    blocking: number;
    priority: GuidancePriority;
  }>;
  workflowSuggestions: Array<{
    id: string;
    operation: string;
    suggestion: string;
    benefit: string;
    confidence: number;
  }>;
  unresolvedProblems: Array<{
    id: string;
    problem: string;
    severity: GuidancePriority;
    age: string;
    affectedOperations: string[];
  }>;
  priority: GuidancePriority;
}

// Generate system guidance based on current state
export function generateSystemGuidance(
  operations: any[],
  attentionItems: any[],
  userContext: any
): SystemGuidance {
  // Find most critical action
  const criticalItems = attentionItems.filter(item => item.type === 'urgent');
  const nextAction = criticalItems.length > 0 ? {
    id: criticalItems[0].id,
    title: criticalItems[0].title,
    description: criticalItems[0].description,
    action: criticalItems[0].action,
    reason: 'This is the most time-sensitive item requiring immediate attention',
    priority: 'critical' as GuidancePriority,
    estimatedTime: '5 minutes',
  } : {
    id: 'default',
    title: 'Review Operations',
    description: 'Check the status of active operations',
    action: 'Review',
    reason: 'Regular review helps maintain operational health',
    priority: 'normal' as GuidancePriority,
    estimatedTime: '10 minutes',
  };

  // Identify bottlenecks
  const bottlenecks = operations
    .filter(op => op.states.some((s: any) => s.state === 'blocked' || s.state === 'critical'))
    .map(op => {
      const blockedState = op.states.find((s: any) => s.state === 'blocked' || s.state === 'critical');
      return {
        id: `${op.id}-bottleneck`,
        operation: op.name,
        description: `${op.name} has ${blockedState?.count} ${blockedState?.state} items`,
        impact: 'Delaying downstream operations',
        blocking: blockedState?.count || 0,
        priority: (blockedState?.state === 'critical' ? 'critical' : 'high') as GuidancePriority,
      };
    });

  // Generate workflow suggestions
  const suggestions = [
    {
      id: 'suggestion-1',
      operation: 'sell',
      suggestion: 'Follow up on pending quotes',
      benefit: 'Increase conversion rate by 15%',
      confidence: 0.85,
    },
    {
      id: 'suggestion-2',
      operation: 'pay',
      suggestion: 'Review pending payments',
      benefit: 'Improve cash flow',
      confidence: 0.92,
    },
    {
      id: 'suggestion-3',
      operation: 'ship',
      suggestion: 'Optimize shipping routes',
      benefit: 'Reduce delivery time by 10%',
      confidence: 0.78,
    },
  ];

  // Identify unresolved problems
  const problems = [
    {
      id: 'problem-1',
      problem: 'Payment processing delay',
      severity: 'high' as GuidancePriority,
      age: '2 days',
      affectedOperations: ['pay', 'ship'],
    },
    {
      id: 'problem-2',
      problem: 'Stock shortage for popular product',
      severity: 'critical' as GuidancePriority,
      age: '1 day',
      affectedOperations: ['ship', 'sell'],
    },
  ];

  // Calculate overall priority
  const hasCritical = criticalItems.length > 0 || bottlenecks.some(b => b.priority === 'critical');
  const hasHigh = bottlenecks.some(b => b.priority === 'high');
  
  const overallPriority: GuidancePriority = hasCritical 
    ? 'critical' 
    : hasHigh 
    ? 'high' 
    : 'normal';

  return {
    nextRecommendedAction: nextAction,
    pendingBottlenecks: bottlenecks,
    workflowSuggestions: suggestions,
    unresolvedProblems: problems,
    priority: overallPriority,
  };
}

// Get guidance priority color
export function getGuidancePriorityColor(priority: GuidancePriority): string {
  const colors = {
    critical: 'oklch(0.6 0.2 10)',
    high: 'oklch(0.65 0.18 45)',
    normal: 'oklch(0.6 0.18 145)',
    low: 'oklch(0.6 0.1 270)',
  };
  return colors[priority];
}

// Get guidance priority icon
export function getGuidancePriorityIcon(priority: GuidancePriority): string {
  const icons = {
    critical: '⚠️',
    high: '🔶',
    normal: '🔵',
    low: '⚪',
  };
  return icons[priority];
}

// Calculate operational health score
export function calculateOperationalHealth(guidance: SystemGuidance): {
  score: number;
  status: 'healthy' | 'warning' | 'critical';
  factors: string[];
} {
  let score = 100;
  const factors: string[] = [];

  // Deduct for critical issues
  guidance.unresolvedProblems.forEach(problem => {
    if (problem.severity === 'critical') {
      score -= 20;
      factors.push(problem.problem);
    } else if (problem.severity === 'high') {
      score -= 10;
      factors.push(problem.problem);
    }
  });

  // Deduct for bottlenecks
  guidance.pendingBottlenecks.forEach(bottleneck => {
    const deduction = bottleneck.priority === 'critical' ? 15 : 8;
    score -= deduction;
    factors.push(`${bottleneck.operation}: ${bottleneck.description}`);
  });

  // Deduct for critical priority
  if (guidance.priority === 'critical') {
    score -= 5;
  } else if (guidance.priority === 'high') {
    score -= 2;
  }

  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));

  // Determine status
  let status: 'healthy' | 'warning' | 'critical';
  if (score >= 80) {
    status = 'healthy';
  } else if (score >= 50) {
    status = 'warning';
  } else {
    status = 'critical';
  }

  return { score, status, factors };
}

// Get recommended next steps based on context
export function getNextSteps(context: {
  currentOperation?: string;
  currentTime: string;
  userRole: string;
}): Array<{
  step: string;
  reason: string;
  priority: GuidancePriority;
}> {
  const steps: Array<{
    step: string;
    reason: string;
    priority: GuidancePriority;
  }> = [];

  // Context-aware recommendations
  if (context.currentOperation === 'sell') {
    steps.push({
      step: 'Follow up on pending leads',
      reason: 'Leads go cold after 24 hours',
      priority: 'high',
    });
    steps.push({
      step: 'Review overdue quotes',
      reason: 'Quotes expire after 7 days',
      priority: 'normal',
    });
  }

  if (context.currentOperation === 'pay') {
    steps.push({
      step: 'Approve pending invoices',
      reason: 'Vendors require timely payment',
      priority: 'high',
    });
  }

  // Time-based recommendations
  const hour = new Date(context.currentTime).getHours();
  if (hour >= 9 && hour <= 11) {
    steps.push({
      step: 'Review daily KPIs',
      reason: 'Morning review sets daily priorities',
      priority: 'normal',
    });
  }

  if (hour >= 16 && hour <= 18) {
    steps.push({
      step: 'Complete pending approvals',
      reason: 'End-of-day processing',
      priority: 'high',
    });
  }

  // Role-based recommendations
  if (context.userRole === 'admin' || context.userRole === 'super_admin') {
    steps.push({
      step: 'Review system health',
      reason: 'Administrative oversight required',
      priority: 'normal',
    });
  }

  return steps.slice(0, 5); // Limit to top 5
}
