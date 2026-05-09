// @ts-nocheck
// Operational Journey Engine - Automatic workflow guidance without manual navigation
export type BusinessEvent = 
  | 'new_lead'
  | 'lead_followup_pending'
  | 'quotation_needed'
  | 'approval_pending'
  | 'invoice_ready'
  | 'payment_received'
  | 'payment_failed'
  | 'order_placed'
  | 'order_shipped'
  | 'inventory_low'
  | 'employee_absent'
  | 'payroll_due'
  | 'ticket_created'
  | 'ticket_escalated';

export interface JourneyStep {
  id: string;
  title: string;
  description: string;
  action: string;
  estimatedTime: string;
  priority: 'critical' | 'high' | 'normal';
  autoAdvance: boolean;
  conditions?: string[];
}

export interface OperationalJourney {
  id: string;
  event: BusinessEvent;
  entity: {
    type: string;
    id: string;
    name: string;
  };
  currentStep: number;
  steps: JourneyStep[];
  status: 'active' | 'paused' | 'completed' | 'blocked';
  startedAt: string;
  estimatedCompletion?: string;
  revenueImpact?: {
    amount: number;
    currency: string;
    type: 'positive' | 'negative' | 'neutral';
  };
}

// Journey definitions for each business event
export const journeyDefinitions: Record<BusinessEvent, OperationalJourney> = {
  new_lead: {
    id: 'journey-new-lead',
    event: 'new_lead',
    entity: { type: 'lead', id: 'LEAD-001', name: 'Acme Corp' },
    currentStep: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Review Lead',
        description: 'Review the new lead information',
        action: 'Review',
        estimatedTime: '2 min',
        priority: 'high',
        autoAdvance: false,
      },
      {
        id: 'step-2',
        title: 'Schedule Follow-up',
        description: 'Schedule a follow-up call with the prospect',
        action: 'Schedule',
        estimatedTime: '3 min',
        priority: 'high',
        autoAdvance: false,
      },
      {
        id: 'step-3',
        title: 'Send Introduction',
        description: 'Send introduction email with company overview',
        action: 'Send Email',
        estimatedTime: '2 min',
        priority: 'normal',
        autoAdvance: true,
      },
    ],
    status: 'active',
    startedAt: new Date().toISOString(),
    revenueImpact: { amount: 75000, currency: 'USD', type: 'positive' },
  },
  lead_followup_pending: {
    id: 'journey-followup',
    event: 'lead_followup_pending',
    entity: { type: 'lead', id: 'LEAD-002', name: 'TechStart Inc' },
    currentStep: 1,
    steps: [
      {
        id: 'step-1',
        title: 'Review Lead',
        description: 'Review the lead information',
        action: 'Review',
        estimatedTime: '2 min',
        priority: 'high',
        autoAdvance: false,
      },
      {
        id: 'step-2',
        title: 'Complete Follow-up',
        description: 'Complete the scheduled follow-up call',
        action: 'Complete Call',
        estimatedTime: '15 min',
        priority: 'critical',
        autoAdvance: false,
      },
      {
        id: 'step-3',
        title: 'Update Status',
        description: 'Update lead status based on call outcome',
        action: 'Update',
        estimatedTime: '1 min',
        priority: 'high',
        autoAdvance: true,
      },
    ],
    status: 'active',
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    revenueImpact: { amount: 50000, currency: 'USD', type: 'positive' },
  },
  quotation_needed: {
    id: 'journey-quotation',
    event: 'quotation_needed',
    entity: { type: 'opportunity', id: 'OPP-001', name: 'Enterprise Deal' },
    currentStep: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Review Requirements',
        description: 'Review customer requirements for quotation',
        action: 'Review',
        estimatedTime: '5 min',
        priority: 'high',
        autoAdvance: false,
      },
      {
        id: 'step-2',
        title: 'Generate Quote',
        description: 'Generate quotation with pricing',
        action: 'Generate',
        estimatedTime: '3 min',
        priority: 'critical',
        autoAdvance: false,
      },
      {
        id: 'step-3',
        title: 'Send to Customer',
        description: 'Send quotation to customer for review',
        action: 'Send',
        estimatedTime: '2 min',
        priority: 'high',
        autoAdvance: true,
      },
    ],
    status: 'active',
    startedAt: new Date().toISOString(),
    revenueImpact: { amount: 150000, currency: 'USD', type: 'positive' },
  },
  approval_pending: {
    id: 'journey-approval',
    event: 'approval_pending',
    entity: { type: 'quote', id: 'QT-001', name: 'Quote #001' },
    currentStep: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Review Request',
        description: 'Review the approval request details',
        action: 'Review',
        estimatedTime: '2 min',
        priority: 'critical',
        autoAdvance: false,
      },
      {
        id: 'step-2',
        title: 'Approve or Reject',
        description: 'Make approval decision',
        action: 'Decide',
        estimatedTime: '1 min',
        priority: 'critical',
        autoAdvance: false,
      },
      {
        id: 'step-3',
        title: 'Notify Requester',
        description: 'System will notify requester automatically',
        action: 'Auto',
        estimatedTime: '0 min',
        priority: 'normal',
        autoAdvance: true,
      },
    ],
    status: 'active',
    startedAt: new Date(Date.now() - 1800000).toISOString(),
    revenueImpact: { amount: 150000, currency: 'USD', type: 'positive' },
  },
  invoice_ready: {
    id: 'journey-invoice',
    event: 'invoice_ready',
    entity: { type: 'invoice', id: 'INV-001', name: 'Invoice #001' },
    currentStep: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Review Invoice',
        description: 'Review invoice details before sending',
        action: 'Review',
        estimatedTime: '2 min',
        priority: 'high',
        autoAdvance: false,
      },
      {
        id: 'step-2',
        title: 'Send Invoice',
        description: 'Send invoice to customer',
        action: 'Send',
        estimatedTime: '1 min',
        priority: 'critical',
        autoAdvance: false,
      },
      {
        id: 'step-3',
        title: 'Track Payment',
        description: 'Monitor payment status',
        action: 'Track',
        estimatedTime: 'Ongoing',
        priority: 'normal',
        autoAdvance: true,
      },
    ],
    status: 'active',
    startedAt: new Date().toISOString(),
    revenueImpact: { amount: 12500, currency: 'USD', type: 'positive' },
  },
  payment_received: {
    id: 'journey-payment',
    event: 'payment_received',
    entity: { type: 'payment', id: 'PAY-001', name: 'Payment #001' },
    currentStep: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Verify Payment',
        description: 'Verify payment details and amount',
        action: 'Verify',
        estimatedTime: '2 min',
        priority: 'high',
        autoAdvance: false,
      },
      {
        id: 'step-2',
        title: 'Reconcile',
        description: 'Reconcile payment with invoice',
        action: 'Reconcile',
        estimatedTime: '3 min',
        priority: 'high',
        autoAdvance: false,
      },
      {
        id: 'step-3',
        title: 'Update Status',
        description: 'Update order and customer status',
        action: 'Update',
        estimatedTime: '1 min',
        priority: 'normal',
        autoAdvance: true,
      },
    ],
    status: 'active',
    startedAt: new Date(Date.now() - 900000).toISOString(),
    revenueImpact: { amount: 12500, currency: 'USD', type: 'positive' },
  },
  payment_failed: {
    id: 'journey-failed-payment',
    event: 'payment_failed',
    entity: { type: 'payment', id: 'PAY-002', name: 'Payment #002' },
    currentStep: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Investigate Failure',
        description: 'Investigate why payment failed',
        action: 'Investigate',
        estimatedTime: '5 min',
        priority: 'critical',
        autoAdvance: false,
      },
      {
        id: 'step-2',
        title: 'Contact Customer',
        description: 'Contact customer to resolve payment issue',
        action: 'Contact',
        estimatedTime: '10 min',
        priority: 'critical',
        autoAdvance: false,
      },
      {
        id: 'step-3',
        title: 'Retry or Escalate',
        description: 'Retry payment or escalate to collections',
        action: 'Decide',
        estimatedTime: '2 min',
        priority: 'high',
        autoAdvance: false,
      },
    ],
    status: 'active',
    startedAt: new Date(Date.now() - 600000).toISOString(),
    revenueImpact: { amount: -25000, currency: 'USD', type: 'negative' },
  },
  order_placed: {
    id: 'journey-order',
    event: 'order_placed',
    entity: { type: 'order', id: 'ORD-001', name: 'Order #001' },
    currentStep: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Confirm Order',
        description: 'Confirm order details with customer',
        action: 'Confirm',
        estimatedTime: '3 min',
        priority: 'high',
        autoAdvance: false,
      },
      {
        id: 'step-2',
        title: 'Process Payment',
        description: 'Process payment for order',
        action: 'Process',
        estimatedTime: '2 min',
        priority: 'critical',
        autoAdvance: false,
      },
      {
        id: 'step-3',
        title: 'Schedule Shipment',
        description: 'Schedule shipment of order items',
        action: 'Schedule',
        estimatedTime: '5 min',
        priority: 'high',
        autoAdvance: false,
      },
    ],
    status: 'active',
    startedAt: new Date(Date.now() - 1200000).toISOString(),
    revenueImpact: { amount: 15000, currency: 'USD', type: 'positive' },
  },
  inventory_low: {
    id: 'journey-inventory',
    event: 'inventory_low',
    entity: { type: 'product', id: 'PROD-001', name: 'Product A' },
    currentStep: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Review Stock Level',
        description: 'Review current stock level and demand',
        action: 'Review',
        estimatedTime: '2 min',
        priority: 'high',
        autoAdvance: false,
      },
      {
        id: 'step-2',
        title: 'Create Reorder',
        description: 'Create reorder request for supplier',
        action: 'Create Reorder',
        estimatedTime: '3 min',
        priority: 'critical',
        autoAdvance: false,
      },
      {
        id: 'step-3',
        title: 'Approve or Delegate',
        description: 'Approve reorder or delegate to purchasing',
        action: 'Decide',
        estimatedTime: '1 min',
        priority: 'high',
        autoAdvance: false,
      },
    ],
    status: 'active',
    startedAt: new Date(Date.now() - 300000).toISOString(),
    revenueImpact: { amount: -5000, currency: 'USD', type: 'negative' },
  },
  employee_absent: {
    id: 'journey-absence',
    event: 'employee_absent',
    entity: { type: 'employee', id: 'EMP-001', name: 'John Doe' },
    currentStep: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Review Absence',
        description: 'Review absence request and reason',
        action: 'Review',
        estimatedTime: '2 min',
        priority: 'high',
        autoAdvance: false,
      },
      {
        id: 'step-2',
        title: 'Approve or Reject',
        description: 'Approve or reject absence request',
        action: 'Decide',
        estimatedTime: '1 min',
        priority: 'critical',
        autoAdvance: false,
      },
      {
        id: 'step-3',
        title: 'Arrange Coverage',
        description: 'Arrange work coverage if approved',
        action: 'Arrange',
        estimatedTime: '5 min',
        priority: 'high',
        autoAdvance: false,
      },
    ],
    status: 'active',
    startedAt: new Date(Date.now() - 2400000).toISOString(),
    revenueImpact: { amount: 0, currency: 'USD', type: 'neutral' },
  },
  payroll_due: {
    id: 'journey-payroll',
    event: 'payroll_due',
    entity: { type: 'payroll', id: 'PAYROLL-001', name: 'Monthly Payroll' },
    currentStep: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Review Payroll',
        description: 'Review payroll calculations and deductions',
        action: 'Review',
        estimatedTime: '10 min',
        priority: 'critical',
        autoAdvance: false,
      },
      {
        id: 'step-2',
        title: 'Approve Payroll',
        description: 'Approve payroll for processing',
        action: 'Approve',
        estimatedTime: '2 min',
        priority: 'critical',
        autoAdvance: false,
      },
      {
        id: 'step-3',
        title: 'Process Payments',
        description: 'System processes salary payments',
        action: 'Auto',
        estimatedTime: 'Auto',
        priority: 'normal',
        autoAdvance: true,
      },
    ],
    status: 'active',
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    revenueImpact: { amount: -45000, currency: 'USD', type: 'negative' },
  },
  ticket_created: {
    id: 'journey-ticket',
    event: 'ticket_created',
    entity: { type: 'ticket', id: 'TKT-001', name: 'Support Ticket' },
    currentStep: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Review Ticket',
        description: 'Review ticket details and priority',
        action: 'Review',
        estimatedTime: '3 min',
        priority: 'high',
        autoAdvance: false,
      },
      {
        id: 'step-2',
        title: 'Assign',
        description: 'Assign ticket to appropriate team member',
        action: 'Assign',
        estimatedTime: '2 min',
        priority: 'high',
        autoAdvance: false,
      },
      {
        id: 'step-3',
        title: 'Respond',
        description: 'Send initial response to customer',
        action: 'Respond',
        estimatedTime: '5 min',
        priority: 'high',
        autoAdvance: false,
      },
    ],
    status: 'active',
    startedAt: new Date(Date.now() - 600000).toISOString(),
    revenueImpact: { amount: 0, currency: 'USD', type: 'neutral' },
  },
  ticket_escalated: {
    id: 'journey-escalation',
    event: 'ticket_escalated',
    entity: { type: 'ticket', id: 'TKT-002', name: 'Escalated Ticket' },
    currentStep: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Review Escalation',
        description: 'Review why ticket was escalated',
        action: 'Review',
        estimatedTime: '5 min',
        priority: 'critical',
        autoAdvance: false,
      },
      {
        id: 'step-2',
        title: 'Investigate Issue',
        description: 'Investigate the underlying issue',
        action: 'Investigate',
        estimatedTime: '15 min',
        priority: 'critical',
        autoAdvance: false,
      },
      {
        id: 'step-3',
        title: 'Resolve',
        description: 'Resolve the issue and update customer',
        action: 'Resolve',
        estimatedTime: '10 min',
        priority: 'critical',
        autoAdvance: false,
      },
    ],
    status: 'active',
    startedAt: new Date(Date.now() - 900000).toISOString(),
    revenueImpact: { amount: -10000, currency: 'USD', type: 'negative' },
  },
};

// Get active journeys for user
export function getActiveJourneys(userId?: string): OperationalJourney[] {
  // In a real app, this would query the database
  // For now, return a subset of journeys
  return Object.values(journeyDefinitions).filter(j => j.status === 'active').slice(0, 5);
}

// Get next journey step
export function getNextStep(journey: OperationalJourney): JourneyStep | null {
  if (journey.currentStep >= journey.steps.length) {
    return null;
  }
  return journey.steps[journey.currentStep];
}

// Complete current step and advance
export function completeStep(journeyId: string): OperationalJourney | null {
  const journey = Object.values(journeyDefinitions).find(j => j.id === journeyId);
  if (!journey) return null;

  journey.currentStep += 1;
  
  if (journey.currentStep >= journey.steps.length) {
    journey.status = 'completed';
  }

  return journey;
}

// Get journey priority based on revenue impact and urgency
export function getJourneyPriority(journey: OperationalJourney): 'critical' | 'high' | 'normal' {
  if (journey.revenueImpact?.type === 'negative' && journey.revenueImpact.amount < -10000) {
    return 'critical';
  }
  
  const currentStep = journey.steps[journey.currentStep];
  if (currentStep?.priority === 'critical') {
    return 'critical';
  }
  
  if (journey.revenueImpact?.type === 'negative') {
    return 'high';
  }
  
  return currentStep?.priority === 'high' ? 'high' : 'normal';
}

// Get journeys requiring attention
export function getJourneysRequiringAttention(): {
  critical: OperationalJourney[];
  high: OperationalJourney[];
  normal: OperationalJourney[];
} {
  const journeys = getActiveJourneys();
  
  return {
    critical: journeys.filter(j => getJourneyPriority(j) === 'critical'),
    high: journeys.filter(j => getJourneyPriority(j) === 'high'),
    normal: journeys.filter(j => getJourneyPriority(j) === 'normal'),
  };
}