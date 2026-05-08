import {
  ShoppingCart, UserPlus, DollarSign, Truck, CheckCircle,
  AlertTriangle, Clock, XCircle, TrendingUp, ArrowRight,
  FileText, Users, Package, ClipboardCheck, Target
} from "lucide-react";

// Operational States
export type OperationalState = 'healthy' | 'blocked' | 'pending' | 'delayed' | 'failed' | 'critical';

export interface OperationalStateBadge {
  state: OperationalState;
  count: number;
  trend?: 'up' | 'down' | 'stable';
}

// Operation Types - Business Operations, not Modules
export type OperationType = 
  | 'sell'           // Complete sales cycle
  | 'hire'           // Complete hiring cycle
  | 'pay'            // Complete payment cycle
  | 'ship'           // Complete shipping cycle
  | 'procure'        // Complete procurement cycle
  | 'produce'        // Complete production cycle
  | 'support'        // Complete support cycle
  | 'analyze';       // Complete analytics cycle

export interface Operation {
  id: OperationType;
  name: string;
  description: string;
  icon: any;
  color: string;
  workflowSteps: string[];
  states: OperationalStateBadge[];
  priority: 'urgent' | 'high' | 'normal' | 'low';
}

export const operations: Operation[] = [
  {
    id: 'sell',
    name: 'Sell',
    description: 'Complete sales operations',
    icon: ShoppingCart,
    color: 'oklch(0.7 0.18 200)',
    workflowSteps: ['Lead', 'Opportunity', 'Quote', 'Order', 'Invoice', 'Payment'],
    states: [
      { state: 'pending', count: 23, trend: 'up' },
      { state: 'delayed', count: 5, trend: 'down' },
      { state: 'failed', count: 2, trend: 'stable' },
    ],
    priority: 'urgent',
  },
  {
    id: 'hire',
    name: 'Hire',
    description: 'Complete hiring operations',
    icon: UserPlus,
    color: 'oklch(0.68 0.18 45)',
    workflowSteps: ['Job Requisition', 'Candidate', 'Interview', 'Offer', 'Onboarding'],
    states: [
      { state: 'pending', count: 8, trend: 'stable' },
      { state: 'blocked', count: 3, trend: 'up' },
    ],
    priority: 'high',
  },
  {
    id: 'pay',
    name: 'Pay',
    description: 'Complete payment operations',
    icon: DollarSign,
    color: 'oklch(0.72 0.18 155)',
    workflowSteps: ['Invoice', 'Approval', 'Payment', 'Reconciliation'],
    states: [
      { state: 'pending', count: 45, trend: 'up' },
      { state: 'critical', count: 8, trend: 'up' },
      { state: 'delayed', count: 12, trend: 'down' },
    ],
    priority: 'urgent',
  },
  {
    id: 'ship',
    name: 'Ship',
    description: 'Complete shipping operations',
    icon: Truck,
    color: 'oklch(0.78 0.16 75)',
    workflowSteps: ['Order', 'Picking', 'Packing', 'Shipping', 'Delivery'],
    states: [
      { state: 'pending', count: 67, trend: 'up' },
      { state: 'delayed', count: 9, trend: 'stable' },
      { state: 'healthy', count: 234, trend: 'up' },
    ],
    priority: 'high',
  },
  {
    id: 'procure',
    name: 'Procure',
    description: 'Complete procurement operations',
    icon: Package,
    color: 'oklch(0.65 0.2 280)',
    workflowSteps: ['Requisition', 'Quote', 'PO', 'Receipt', 'Invoice'],
    states: [
      { state: 'pending', count: 15, trend: 'stable' },
      { state: 'blocked', count: 4, trend: 'down' },
    ],
    priority: 'normal',
  },
  {
    id: 'produce',
    name: 'Produce',
    description: 'Complete production operations',
    icon: ClipboardCheck,
    color: 'oklch(0.6 0.22 330)',
    workflowSteps: ['Order', 'Planning', 'Production', 'QC', 'Delivery'],
    states: [
      { state: 'pending', count: 12, trend: 'up' },
      { state: 'delayed', count: 6, trend: 'up' },
      { state: 'healthy', count: 89, trend: 'stable' },
    ],
    priority: 'high',
  },
  {
    id: 'support',
    name: 'Support',
    description: 'Complete support operations',
    icon: FileText,
    color: 'oklch(0.5 0.15 270)',
    workflowSteps: ['Ticket', 'Assignment', 'Resolution', 'Feedback'],
    states: [
      { state: 'pending', count: 34, trend: 'up' },
      { state: 'critical', count: 5, trend: 'stable' },
      { state: 'failed', count: 1, trend: 'down' },
    ],
    priority: 'urgent',
  },
  {
    id: 'analyze',
    name: 'Analyze',
    description: 'Complete analytics operations',
    icon: TrendingUp,
    color: 'oklch(0.55 0.2 50)',
    workflowSteps: ['Data', 'Insight', 'Action', 'Impact'],
    states: [
      { state: 'healthy', count: 12, trend: 'up' },
    ],
    priority: 'normal',
  },
];

// Attention Items - Things needing user action
export interface AttentionItem {
  id: string;
  type: 'urgent' | 'warning' | 'info';
  title: string;
  description: string;
  operation: OperationType;
  action: string;
  due?: string;
  entity?: string;
}

export const attentionItems: AttentionItem[] = [
  {
    id: '1',
    type: 'urgent',
    title: 'Payment Overdue',
    description: 'Invoice #INV-2024-0042 is 7 days overdue',
    operation: 'pay',
    action: 'Contact Customer',
    due: '2 hours ago',
    entity: 'Acme Corp',
  },
  {
    id: '2',
    type: 'urgent',
    title: 'Order Blocked',
    description: 'Order #ORD-2024-0891 cannot ship - out of stock',
    operation: 'ship',
    action: 'Allocate Stock',
    due: 'Today',
    entity: 'Order #0891',
  },
  {
    id: '3',
    type: 'warning',
    title: 'Offer Expiring',
    description: 'Offer for Senior Developer expires tomorrow',
    operation: 'hire',
    action: 'Follow Up',
    due: 'Tomorrow',
    entity: 'John Smith',
  },
  {
    id: '4',
    type: 'urgent',
    title: 'Critical Support Ticket',
    description: 'System down for Enterprise client',
    operation: 'support',
    action: 'Escalate',
    due: '30 min ago',
    entity: 'Enterprise Inc',
  },
  {
    id: '5',
    type: 'warning',
    title: 'Production Delay',
    description: 'Batch #BATCH-2024-156 delayed due to material shortage',
    operation: 'produce',
    action: 'Approve Substitute',
    due: 'In 2 days',
    entity: 'Batch #156',
  },
];

// KPIs for operational health
export interface OperationalKPI {
  id: string;
  name: string;
  value: string;
  change: string;
  direction: 'up' | 'down';
  trend: 'positive' | 'negative' | 'neutral';
  operation: OperationType;
}

export const operationalKPIs: OperationalKPI[] = [
  {
    id: '1',
    name: 'Revenue Today',
    value: '$45,230',
    change: '+12%',
    direction: 'up',
    trend: 'positive',
    operation: 'sell',
  },
  {
    id: '2',
    name: 'Pending Approvals',
    value: '23',
    change: '+5',
    direction: 'up',
    trend: 'negative',
    operation: 'pay',
  },
  {
    id: '3',
    name: 'On-Time Delivery',
    value: '94.2%',
    change: '-1.1%',
    direction: 'down',
    trend: 'negative',
    operation: 'ship',
  },
  {
    id: '4',
    name: 'Open Tickets',
    value: '34',
    change: '-8',
    direction: 'down',
    trend: 'positive',
    operation: 'support',
  },
  {
    id: '5',
    name: 'Positions Filled',
    value: '12',
    change: '+3',
    direction: 'up',
    trend: 'positive',
    operation: 'hire',
  },
];

// Get operational state color
export function getStateColor(state: OperationalState): string {
  const colors = {
    healthy: 'oklch(0.6 0.18 145)',
    blocked: 'oklch(0.6 0.18 25)',
    pending: 'oklch(0.7 0.15 45)',
    delayed: 'oklch(0.7 0.18 55)',
    failed: 'oklch(0.6 0.18 15)',
    critical: 'oklch(0.6 0.2 10)',
  };
  return colors[state];
}

// Get operation by ID
export function getOperation(operationId: OperationType): Operation | undefined {
  return operations.find(op => op.id === operationId);
}
