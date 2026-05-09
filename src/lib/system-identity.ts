// @ts-nocheck
// System Identity - Enterprise Operating System
export const SYSTEM_NAME = 'SaaS Vala';
export const SYSTEM_IDENTITY = 'Enterprise Operating System';
export const SYSTEM_TAGLINE = 'Command Center for Business Operations';

// Situational Modes
export type SituationalMode = 'executive' | 'operations' | 'focus' | 'analytics' | 'emergency';

export interface SituationalModeConfig {
  id: SituationalMode;
  name: string;
  description: string;
  icon: any;
  primaryFocus: string;
  whatToSee: string[];
  whatToDo: string[];
}

export const situationalModes: SituationalModeConfig[] = [
  {
    id: 'executive',
    name: 'Executive',
    description: 'Strategic overview',
    icon: null, // Will import icon
    primaryFocus: 'Business health and strategic decisions',
    whatToSee: ['KPIs', 'Trends', 'Critical alerts', 'Executive summary'],
    whatToDo: ['Approve', 'Escalate', 'Review', 'Decide'],
  },
  {
    id: 'operations',
    name: 'Operations',
    description: 'Daily execution',
    icon: null,
    primaryFocus: 'Workflow execution and task completion',
    whatToSee: ['Active workflows', 'Pending tasks', 'Team capacity', 'Bottlenecks'],
    whatToDo: ['Execute', 'Assign', 'Process', 'Complete'],
  },
  {
    id: 'focus',
    name: 'Focus',
    description: 'Deep work mode',
    icon: null,
    primaryFocus: 'Single operation with maximum efficiency',
    whatToSee: ['Current task', 'Related context', 'Next steps'],
    whatToDo: ['Complete', 'Move to next', 'Pause', 'Finish'],
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Data-driven insights',
    icon: null,
    primaryFocus: 'Performance analysis and optimization',
    whatToSee: ['Metrics', 'Charts', 'Reports', 'Forecasts'],
    whatToDo: ['Analyze', 'Compare', 'Export', 'Share'],
  },
  {
    id: 'emergency',
    name: 'Emergency',
    description: 'Critical response',
    icon: null,
    primaryFocus: 'Immediate problem resolution',
    whatToSee: ['Critical issues', 'Blocking problems', 'Escalations', 'Alerts'],
    whatToDo: ['Resolve', 'Escalate', 'Communicate', 'Mitigate'],
  },
];

// Operational Time Context
export type TimeContext = 'today' | 'pending_now' | 'overdue' | 'upcoming' | 'realtime';

export interface TimeContextItem {
  id: string;
  context: TimeContext;
  label: string;
  description: string;
  urgency: 'critical' | 'high' | 'normal' | 'low';
}

// Enterprise Memory - What system remembers
export interface EnterpriseMemory {
  lastOperation: string;
  lastWorkflowStep: string;
  recentApprovals: string[];
  activeOperations: string[];
  userPreferences: {
    defaultMode: SituationalMode;
    preferredTimeContext: TimeContext;
  };
}

// Operational Health Layer
export type HealthStatus = 'healthy' | 'warning' | 'critical' | 'blocked' | 'delayed';

export interface OperationalHealth {
  status: HealthStatus;
  score: number;
  issues: string[];
  recommendations: string[];
  lastUpdated: string;
}

// System-Driven Guidance
export interface SystemGuidance {
  nextRecommendedAction: string;
  pendingBottlenecks: string[];
  workflowSuggestions: string[];
  unresolvedProblems: string[];
  priority: 'critical' | 'high' | 'normal';
}

// Action Hierarchy
export type ActionPriority = 'primary' | 'secondary' | 'tertiary';

export interface ActionHierarchy {
  priority: ActionPriority;
  label: string;
  description: string;
  whenToShow: string[];
}