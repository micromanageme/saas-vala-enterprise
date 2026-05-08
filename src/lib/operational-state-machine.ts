// Operational State Machine - Every entity must exist in clear state
export type EntityState = 
  | 'draft'
  | 'pending'
  | 'approved'
  | 'processing'
  | 'dispatched'
  | 'delivered'
  | 'delayed'
  | 'cancelled'
  | 'failed'
  | 'completed'
  | 'blocked'
  | 'expired'
  | 'on_hold';

export type EntityType = 
  | 'order'
  | 'invoice'
  | 'payment'
  | 'quote'
  | 'lead'
  | 'customer'
  | 'employee'
  | 'product'
  | 'vendor'
  | 'ticket'
  | 'contract'
  | 'shipment';

export interface StateTransition {
  from: EntityState;
  to: EntityState;
  action: string;
  requiresApproval: boolean;
  automaticConditions?: string[];
  sideEffects?: string[];
}

export interface StateMachineConfig {
  entityType: EntityType;
  initialState: EntityState;
  validStates: EntityState[];
  transitions: StateTransition[];
  terminalStates: EntityState[];
  blockedStates: EntityState[];
  stateMetadata: Record<EntityState, {
    label: string;
    description: string;
    color: string;
    icon: string;
    requiresAction: boolean;
    isTerminal: boolean;
    isBlocked: boolean;
  }>;
}

// State machine configurations for each entity type
export const stateMachineConfigs: Record<EntityType, StateMachineConfig> = {
  order: {
    entityType: 'order',
    initialState: 'draft',
    validStates: ['draft', 'pending', 'approved', 'processing', 'dispatched', 'delivered', 'delayed', 'cancelled', 'failed', 'blocked'],
    transitions: [
      { from: 'draft', to: 'pending', action: 'submit', requiresApproval: false },
      { from: 'pending', to: 'approved', action: 'approve', requiresApproval: true },
      { from: 'pending', to: 'cancelled', action: 'cancel', requiresApproval: false },
      { from: 'approved', to: 'processing', action: 'process', requiresApproval: false },
      { from: 'approved', to: 'blocked', action: 'block', requiresApproval: true },
      { from: 'processing', to: 'dispatched', action: 'dispatch', requiresApproval: false },
      { from: 'processing', to: 'failed', action: 'fail', requiresApproval: false },
      { from: 'processing', to: 'delayed', action: 'delay', requiresApproval: false },
      { from: 'dispatched', to: 'delivered', action: 'deliver', requiresApproval: false },
      { from: 'dispatched', to: 'delayed', action: 'delay', requiresApproval: false },
      { from: 'delayed', to: 'dispatched', action: 'resume', requiresApproval: false },
      { from: 'delayed', to: 'cancelled', action: 'cancel', requiresApproval: true },
      { from: 'blocked', to: 'approved', action: 'unblock', requiresApproval: true },
      { from: 'blocked', to: 'cancelled', action: 'cancel', requiresApproval: true },
    ],
    terminalStates: ['delivered', 'cancelled', 'failed'],
    blockedStates: ['blocked'],
    stateMetadata: {
      draft: { label: 'Draft', description: 'Order being created', color: 'oklch(0.6 0.1 270)', icon: 'FileText', requiresAction: true, isTerminal: false, isBlocked: false },
      pending: { label: 'Pending', description: 'Awaiting approval', color: 'oklch(0.65 0.18 45)', icon: 'Clock', requiresAction: true, isTerminal: false, isBlocked: false },
      approved: { label: 'Approved', description: 'Approved for processing', color: 'oklch(0.65 0.18 145)', icon: 'CheckCircle', requiresAction: false, isTerminal: false, isBlocked: false },
      processing: { label: 'Processing', description: 'Being processed', color: 'oklch(0.7 0.18 200)', icon: 'Settings', requiresAction: false, isTerminal: false, isBlocked: false },
      dispatched: { label: 'Dispatched', description: 'Shipped to customer', color: 'oklch(0.72 0.18 155)', icon: 'Truck', requiresAction: false, isTerminal: false, isBlocked: false },
      delivered: { label: 'Delivered', description: 'Successfully delivered', color: 'oklch(0.68 0.18 75)', icon: 'CheckCircle', requiresAction: false, isTerminal: true, isBlocked: false },
      delayed: { label: 'Delayed', description: 'Delivery delayed', color: 'oklch(0.65 0.18 30)', icon: 'AlertTriangle', requiresAction: true, isTerminal: false, isBlocked: false },
      cancelled: { label: 'Cancelled', description: 'Order cancelled', color: 'oklch(0.5 0.1 270)', icon: 'XCircle', requiresAction: false, isTerminal: true, isBlocked: false },
      failed: { label: 'Failed', description: 'Processing failed', color: 'oklch(0.6 0.2 15)', icon: 'XCircle', requiresAction: true, isTerminal: true, isBlocked: false },
      blocked: { label: 'Blocked', description: 'Blocked from processing', color: 'oklch(0.6 0.2 10)', icon: 'Ban', requiresAction: true, isTerminal: false, isBlocked: true },
    },
  },
  invoice: {
    entityType: 'invoice',
    initialState: 'draft',
    validStates: ['draft', 'pending', 'approved', 'sent', 'paid', 'overdue', 'expired', 'cancelled', 'blocked'],
    transitions: [
      { from: 'draft', to: 'pending', action: 'submit', requiresApproval: false },
      { from: 'pending', to: 'approved', action: 'approve', requiresApproval: true },
      { from: 'pending', to: 'cancelled', action: 'cancel', requiresApproval: false },
      { from: 'approved', to: 'sent', action: 'send', requiresApproval: false },
      { from: 'approved', to: 'blocked', action: 'block', requiresApproval: true },
      { from: 'sent', to: 'paid', action: 'receive_payment', requiresApproval: false },
      { from: 'sent', to: 'overdue', action: 'mark_overdue', requiresApproval: false, automaticConditions: ['due_date_passed'] },
      { from: 'sent', to: 'expired', action: 'expire', requiresApproval: false, automaticConditions: ['expiry_date_passed'] },
      { from: 'overdue', to: 'paid', action: 'receive_payment', requiresApproval: false },
      { from: 'overdue', to: 'cancelled', action: 'cancel', requiresApproval: true },
      { from: 'blocked', to: 'approved', action: 'unblock', requiresApproval: true },
      { from: 'blocked', to: 'cancelled', action: 'cancel', requiresApproval: true },
    ],
    terminalStates: ['paid', 'cancelled', 'expired'],
    blockedStates: ['blocked'],
    stateMetadata: {
      draft: { label: 'Draft', description: 'Invoice being created', color: 'oklch(0.6 0.1 270)', icon: 'FileText', requiresAction: true, isTerminal: false, isBlocked: false },
      pending: { label: 'Pending', description: 'Awaiting approval', color: 'oklch(0.65 0.18 45)', icon: 'Clock', requiresAction: true, isTerminal: false, isBlocked: false },
      approved: { label: 'Approved', description: 'Approved to send', color: 'oklch(0.65 0.18 145)', icon: 'CheckCircle', requiresAction: false, isTerminal: false, isBlocked: false },
      sent: { label: 'Sent', description: 'Sent to customer', color: 'oklch(0.7 0.18 200)', icon: 'Send', requiresAction: false, isTerminal: false, isBlocked: false },
      paid: { label: 'Paid', description: 'Payment received', color: 'oklch(0.68 0.18 75)', icon: 'CheckCircle', requiresAction: false, isTerminal: true, isBlocked: false },
      overdue: { label: 'Overdue', description: 'Payment overdue', color: 'oklch(0.65 0.18 30)', icon: 'AlertTriangle', requiresAction: true, isTerminal: false, isBlocked: false },
      expired: { label: 'Expired', description: 'Invoice expired', color: 'oklch(0.5 0.1 270)', icon: 'XCircle', requiresAction: false, isTerminal: true, isBlocked: false },
      cancelled: { label: 'Cancelled', description: 'Invoice cancelled', color: 'oklch(0.5 0.1 270)', icon: 'XCircle', requiresAction: false, isTerminal: true, isBlocked: false },
      blocked: { label: 'Blocked', description: 'Blocked from sending', color: 'oklch(0.6 0.2 10)', icon: 'Ban', requiresAction: true, isTerminal: false, isBlocked: true },
    },
  },
  payment: {
    entityType: 'payment',
    initialState: 'draft',
    validStates: ['draft', 'pending', 'processing', 'completed', 'failed', 'cancelled', 'on_hold'],
    transitions: [
      { from: 'draft', to: 'pending', action: 'initiate', requiresApproval: false },
      { from: 'pending', to: 'processing', action: 'process', requiresApproval: false },
      { from: 'pending', to: 'cancelled', action: 'cancel', requiresApproval: false },
      { from: 'processing', to: 'completed', action: 'complete', requiresApproval: false },
      { from: 'processing', to: 'failed', action: 'fail', requiresApproval: false },
      { from: 'processing', to: 'on_hold', action: 'hold', requiresApproval: true },
      { from: 'on_hold', to: 'processing', action: 'resume', requiresApproval: true },
      { from: 'on_hold', to: 'cancelled', action: 'cancel', requiresApproval: true },
      { from: 'failed', to: 'pending', action: 'retry', requiresApproval: false },
      { from: 'failed', to: 'cancelled', action: 'cancel', requiresApproval: true },
    ],
    terminalStates: ['completed', 'cancelled'],
    blockedStates: ['on_hold'],
    stateMetadata: {
      draft: { label: 'Draft', description: 'Payment being created', color: 'oklch(0.6 0.1 270)', icon: 'FileText', requiresAction: true, isTerminal: false, isBlocked: false },
      pending: { label: 'Pending', description: 'Awaiting processing', color: 'oklch(0.65 0.18 45)', icon: 'Clock', requiresAction: false, isTerminal: false, isBlocked: false },
      processing: { label: 'Processing', description: 'Payment processing', color: 'oklch(0.7 0.18 200)', icon: 'Settings', requiresAction: false, isTerminal: false, isBlocked: false },
      completed: { label: 'Completed', description: 'Payment successful', color: 'oklch(0.68 0.18 75)', icon: 'CheckCircle', requiresAction: false, isTerminal: true, isBlocked: false },
      failed: { label: 'Failed', description: 'Payment failed', color: 'oklch(0.6 0.2 15)', icon: 'XCircle', requiresAction: true, isTerminal: false, isBlocked: false },
      cancelled: { label: 'Cancelled', description: 'Payment cancelled', color: 'oklch(0.5 0.1 270)', icon: 'XCircle', requiresAction: false, isTerminal: true, isBlocked: false },
      on_hold: { label: 'On Hold', description: 'Payment on hold', color: 'oklch(0.65 0.18 30)', icon: 'Pause', requiresAction: true, isTerminal: false, isBlocked: true },
    },
  },
  quote: {
    entityType: 'quote',
    initialState: 'draft',
    validStates: ['draft', 'pending', 'approved', 'sent', 'accepted', 'rejected', 'expired', 'cancelled'],
    transitions: [
      { from: 'draft', to: 'pending', action: 'submit', requiresApproval: false },
      { from: 'pending', to: 'approved', action: 'approve', requiresApproval: true },
      { from: 'pending', to: 'cancelled', action: 'cancel', requiresApproval: false },
      { from: 'approved', to: 'sent', action: 'send', requiresApproval: false },
      { from: 'sent', to: 'accepted', action: 'accept', requiresApproval: false },
      { from: 'sent', to: 'rejected', action: 'reject', requiresApproval: false },
      { from: 'sent', to: 'expired', action: 'expire', requiresApproval: false, automaticConditions: ['expiry_date_passed'] },
      { from: 'accepted', to: 'completed', action: 'convert_to_order', requiresApproval: false },
      { from: 'rejected', to: 'cancelled', action: 'cancel', requiresApproval: false },
      { from: 'expired', to: 'cancelled', action: 'cancel', requiresApproval: false },
    ],
    terminalStates: ['accepted', 'rejected', 'expired', 'cancelled'],
    blockedStates: [],
    stateMetadata: {
      draft: { label: 'Draft', description: 'Quote being created', color: 'oklch(0.6 0.1 270)', icon: 'FileText', requiresAction: true, isTerminal: false, isBlocked: false },
      pending: { label: 'Pending', description: 'Awaiting approval', color: 'oklch(0.65 0.18 45)', icon: 'Clock', requiresAction: true, isTerminal: false, isBlocked: false },
      approved: { label: 'Approved', description: 'Approved to send', color: 'oklch(0.65 0.18 145)', icon: 'CheckCircle', requiresAction: false, isTerminal: false, isBlocked: false },
      sent: { label: 'Sent', description: 'Sent to customer', color: 'oklch(0.7 0.18 200)', icon: 'Send', requiresAction: false, isTerminal: false, isBlocked: false },
      accepted: { label: 'Accepted', description: 'Quote accepted', color: 'oklch(0.68 0.18 75)', icon: 'CheckCircle', requiresAction: true, isTerminal: true, isBlocked: false },
      rejected: { label: 'Rejected', description: 'Quote rejected', color: 'oklch(0.6 0.2 15)', icon: 'XCircle', requiresAction: false, isTerminal: true, isBlocked: false },
      expired: { label: 'Expired', description: 'Quote expired', color: 'oklch(0.5 0.1 270)', icon: 'XCircle', requiresAction: false, isTerminal: true, isBlocked: false },
      cancelled: { label: 'Cancelled', description: 'Quote cancelled', color: 'oklch(0.5 0.1 270)', icon: 'XCircle', requiresAction: false, isTerminal: true, isBlocked: false },
    },
  },
  lead: {
    entityType: 'lead',
    initialState: 'draft',
    validStates: ['draft', 'pending', 'qualified', 'contacted', 'proposal', 'negotiation', 'converted', 'lost', 'on_hold'],
    transitions: [
      { from: 'draft', to: 'pending', action: 'submit', requiresApproval: false },
      { from: 'pending', to: 'qualified', action: 'qualify', requiresApproval: false },
      { from: 'pending', to: 'lost', action: 'disqualify', requiresApproval: false },
      { from: 'qualified', to: 'contacted', action: 'contact', requiresApproval: false },
      { from: 'contacted', to: 'proposal', action: 'send_proposal', requiresApproval: false },
      { from: 'contacted', to: 'lost', action: 'mark_lost', requiresApproval: false },
      { from: 'proposal', to: 'negotiation', action: 'negotiate', requiresApproval: false },
      { from: 'proposal', to: 'lost', action: 'mark_lost', requiresApproval: false },
      { from: 'negotiation', to: 'converted', action: 'convert', requiresApproval: false },
      { from: 'negotiation', to: 'lost', action: 'mark_lost', requiresApproval: false },
      { from: 'negotiation', to: 'on_hold', action: 'hold', requiresApproval: true },
      { from: 'on_hold', to: 'negotiation', action: 'resume', requiresApproval: true },
      { from: 'on_hold', to: 'lost', action: 'mark_lost', requiresApproval: true },
    ],
    terminalStates: ['converted', 'lost'],
    blockedStates: ['on_hold'],
    stateMetadata: {
      draft: { label: 'Draft', description: 'Lead being created', color: 'oklch(0.6 0.1 270)', icon: 'FileText', requiresAction: true, isTerminal: false, isBlocked: false },
      pending: { label: 'Pending', description: 'Awaiting qualification', color: 'oklch(0.65 0.18 45)', icon: 'Clock', requiresAction: true, isTerminal: false, isBlocked: false },
      qualified: { label: 'Qualified', description: 'Lead qualified', color: 'oklch(0.65 0.18 145)', icon: 'CheckCircle', requiresAction: true, isTerminal: false, isBlocked: false },
      contacted: { label: 'Contacted', description: 'Contacted lead', color: 'oklch(0.7 0.18 200)', icon: 'MessageSquare', requiresAction: true, isTerminal: false, isBlocked: false },
      proposal: { label: 'Proposal', description: 'Proposal sent', color: 'oklch(0.72 0.18 155)', icon: 'FileText', requiresAction: true, isTerminal: false, isBlocked: false },
      negotiation: { label: 'Negotiation', description: 'In negotiation', color: 'oklch(0.75 0.15 280)', icon: 'Scale', requiresAction: true, isTerminal: false, isBlocked: false },
      converted: { label: 'Converted', description: 'Converted to customer', color: 'oklch(0.68 0.18 75)', icon: 'CheckCircle', requiresAction: false, isTerminal: true, isBlocked: false },
      lost: { label: 'Lost', description: 'Lead lost', color: 'oklch(0.5 0.1 270)', icon: 'XCircle', requiresAction: false, isTerminal: true, isBlocked: false },
      on_hold: { label: 'On Hold', description: 'Lead on hold', color: 'oklch(0.65 0.18 30)', icon: 'Pause', requiresAction: true, isTerminal: false, isBlocked: true },
    },
  },
  customer: {
    entityType: 'customer',
    initialState: 'draft',
    validStates: ['draft', 'pending', 'active', 'inactive', 'blocked', 'on_hold'],
    transitions: [
      { from: 'draft', to: 'pending', action: 'submit', requiresApproval: false },
      { from: 'pending', to: 'active', action: 'activate', requiresApproval: true },
      { from: 'pending', to: 'blocked', action: 'block', requiresApproval: true },
      { from: 'active', to: 'inactive', action: 'deactivate', requiresApproval: true },
      { from: 'active', to: 'blocked', action: 'block', requiresApproval: true },
      { from: 'active', to: 'on_hold', action: 'hold', requiresApproval: true },
      { from: 'inactive', to: 'active', action: 'reactivate', requiresApproval: true },
      { from: 'on_hold', to: 'active', action: 'resume', requiresApproval: true },
      { from: 'blocked', to: 'active', action: 'unblock', requiresApproval: true },
      { from: 'blocked', to: 'inactive', action: 'deactivate', requiresApproval: true },
    ],
    terminalStates: [],
    blockedStates: ['blocked', 'on_hold'],
    stateMetadata: {
      draft: { label: 'Draft', description: 'Customer being created', color: 'oklch(0.6 0.1 270)', icon: 'FileText', requiresAction: true, isTerminal: false, isBlocked: false },
      pending: { label: 'Pending', description: 'Awaiting activation', color: 'oklch(0.65 0.18 45)', icon: 'Clock', requiresAction: true, isTerminal: false, isBlocked: false },
      active: { label: 'Active', description: 'Customer active', color: 'oklch(0.68 0.18 75)', icon: 'CheckCircle', requiresAction: false, isTerminal: false, isBlocked: false },
      inactive: { label: 'Inactive', description: 'Customer inactive', color: 'oklch(0.5 0.1 270)', icon: 'XCircle', requiresAction: false, isTerminal: false, isBlocked: false },
      blocked: { label: 'Blocked', description: 'Customer blocked', color: 'oklch(0.6 0.2 10)', icon: 'Ban', requiresAction: true, isTerminal: false, isBlocked: true },
      on_hold: { label: 'On Hold', description: 'Account on hold', color: 'oklch(0.65 0.18 30)', icon: 'Pause', requiresAction: true, isTerminal: false, isBlocked: true },
    },
  },
  ticket: {
    entityType: 'ticket',
    initialState: 'draft',
    validStates: ['draft', 'pending', 'assigned', 'in_progress', 'resolved', 'closed', 'escalated', 'cancelled'],
    transitions: [
      { from: 'draft', to: 'pending', action: 'submit', requiresApproval: false },
      { from: 'pending', to: 'assigned', action: 'assign', requiresApproval: false },
      { from: 'pending', to: 'cancelled', action: 'cancel', requiresApproval: false },
      { from: 'assigned', to: 'in_progress', action: 'start', requiresApproval: false },
      { from: 'assigned', to: 'escalated', action: 'escalate', requiresApproval: true },
      { from: 'in_progress', to: 'resolved', action: 'resolve', requiresApproval: false },
      { from: 'in_progress', to: 'escalated', action: 'escalate', requiresApproval: true },
      { from: 'resolved', to: 'closed', action: 'close', requiresApproval: false },
      { from: 'resolved', to: 'in_progress', action: 'reopen', requiresApproval: false },
      { from: 'escalated', to: 'in_progress', action: 'deescalate', requiresApproval: true },
      { from: 'escalated', to: 'resolved', action: 'resolve', requiresApproval: false },
      { from: 'escalated', to: 'cancelled', action: 'cancel', requiresApproval: true },
    ],
    terminalStates: ['closed', 'cancelled'],
    blockedStates: [],
    stateMetadata: {
      draft: { label: 'Draft', description: 'Ticket being created', color: 'oklch(0.6 0.1 270)', icon: 'FileText', requiresAction: true, isTerminal: false, isBlocked: false },
      pending: { label: 'Pending', description: 'Awaiting assignment', color: 'oklch(0.65 0.18 45)', icon: 'Clock', requiresAction: true, isTerminal: false, isBlocked: false },
      assigned: { label: 'Assigned', description: 'Ticket assigned', color: 'oklch(0.65 0.18 145)', icon: 'User', requiresAction: true, isTerminal: false, isBlocked: false },
      in_progress: { label: 'In Progress', description: 'Being worked on', color: 'oklch(0.7 0.18 200)', icon: 'Settings', requiresAction: false, isTerminal: false, isBlocked: false },
      resolved: { label: 'Resolved', description: 'Issue resolved', color: 'oklch(0.68 0.18 75)', icon: 'CheckCircle', requiresAction: true, isTerminal: false, isBlocked: false },
      closed: { label: 'Closed', description: 'Ticket closed', color: 'oklch(0.5 0.1 270)', icon: 'CheckCircle', requiresAction: false, isTerminal: true, isBlocked: false },
      escalated: { label: 'Escalated', description: 'Escalated to higher level', color: 'oklch(0.6 0.2 15)', icon: 'AlertTriangle', requiresAction: true, isTerminal: false, isBlocked: false },
      cancelled: { label: 'Cancelled', description: 'Ticket cancelled', color: 'oklch(0.5 0.1 270)', icon: 'XCircle', requiresAction: false, isTerminal: true, isBlocked: false },
    },
  },
  // Add more entity types as needed
  employee: {
    entityType: 'employee',
    initialState: 'draft',
    validStates: ['draft', 'pending', 'active', 'inactive', 'on_leave', 'terminated'],
    transitions: [
      { from: 'draft', to: 'pending', action: 'submit', requiresApproval: false },
      { from: 'pending', to: 'active', action: 'activate', requiresApproval: true },
      { from: 'pending', to: 'cancelled', action: 'cancel', requiresApproval: false },
      { from: 'active', to: 'on_leave', action: 'request_leave', requiresApproval: true },
      { from: 'active', to: 'inactive', action: 'deactivate', requiresApproval: true },
      { from: 'on_leave', to: 'active', action: 'return', requiresApproval: false },
      { from: 'on_leave', to: 'inactive', action: 'deactivate', requiresApproval: true },
      { from: 'inactive', to: 'active', action: 'reactivate', requiresApproval: true },
      { from: 'active', to: 'terminated', action: 'terminate', requiresApproval: true },
      { from: 'inactive', to: 'terminated', action: 'terminate', requiresApproval: true },
    ],
    terminalStates: ['terminated'],
    blockedStates: ['on_leave'],
    stateMetadata: {
      draft: { label: 'Draft', description: 'Employee being created', color: 'oklch(0.6 0.1 270)', icon: 'FileText', requiresAction: true, isTerminal: false, isBlocked: false },
      pending: { label: 'Pending', description: 'Awaiting activation', color: 'oklch(0.65 0.18 45)', icon: 'Clock', requiresAction: true, isTerminal: false, isBlocked: false },
      active: { label: 'Active', description: 'Employee active', color: 'oklch(0.68 0.18 75)', icon: 'CheckCircle', requiresAction: false, isTerminal: false, isBlocked: false },
      inactive: { label: 'Inactive', description: 'Employee inactive', color: 'oklch(0.5 0.1 270)', icon: 'XCircle', requiresAction: false, isTerminal: false, isBlocked: false },
      on_leave: { label: 'On Leave', description: 'Employee on leave', color: 'oklch(0.65 0.18 30)', icon: 'Pause', requiresAction: false, isTerminal: false, isBlocked: true },
      terminated: { label: 'Terminated', description: 'Employee terminated', color: 'oklch(0.5 0.1 270)', icon: 'XCircle', requiresAction: false, isTerminal: true, isBlocked: false },
    },
  },
  product: {
    entityType: 'product',
    initialState: 'draft',
    validStates: ['draft', 'pending', 'active', 'inactive', 'discontinued', 'blocked'],
    transitions: [
      { from: 'draft', to: 'pending', action: 'submit', requiresApproval: false },
      { from: 'pending', to: 'active', action: 'activate', requiresApproval: true },
      { from: 'pending', to: 'cancelled', action: 'cancel', requiresApproval: false },
      { from: 'active', to: 'inactive', action: 'deactivate', requiresApproval: true },
      { from: 'active', to: 'discontinued', action: 'discontinue', requiresApproval: true },
      { from: 'active', to: 'blocked', action: 'block', requiresApproval: true },
      { from: 'inactive', to: 'active', action: 'reactivate', requiresApproval: true },
      { from: 'blocked', to: 'active', action: 'unblock', requiresApproval: true },
      { from: 'blocked', to: 'discontinued', action: 'discontinue', requiresApproval: true },
    ],
    terminalStates: ['discontinued'],
    blockedStates: ['blocked'],
    stateMetadata: {
      draft: { label: 'Draft', description: 'Product being created', color: 'oklch(0.6 0.1 270)', icon: 'FileText', requiresAction: true, isTerminal: false, isBlocked: false },
      pending: { label: 'Pending', description: 'Awaiting activation', color: 'oklch(0.65 0.18 45)', icon: 'Clock', requiresAction: true, isTerminal: false, isBlocked: false },
      active: { label: 'Active', description: 'Product active', color: 'oklch(0.68 0.18 75)', icon: 'CheckCircle', requiresAction: false, isTerminal: false, isBlocked: false },
      inactive: { label: 'Inactive', description: 'Product inactive', color: 'oklch(0.5 0.1 270)', icon: 'XCircle', requiresAction: false, isTerminal: false, isBlocked: false },
      discontinued: { label: 'Discontinued', description: 'Product discontinued', color: 'oklch(0.5 0.1 270)', icon: 'XCircle', requiresAction: false, isTerminal: true, isBlocked: false },
      blocked: { label: 'Blocked', description: 'Product blocked', color: 'oklch(0.6 0.2 10)', icon: 'Ban', requiresAction: true, isTerminal: false, isBlocked: true },
    },
  },
  vendor: {
    entityType: 'vendor',
    initialState: 'draft',
    validStates: ['draft', 'pending', 'active', 'inactive', 'blocked', 'on_hold'],
    transitions: [
      { from: 'draft', to: 'pending', action: 'submit', requiresApproval: false },
      { from: 'pending', to: 'active', action: 'activate', requiresApproval: true },
      { from: 'pending', to: 'blocked', action: 'block', requiresApproval: true },
      { from: 'active', to: 'inactive', action: 'deactivate', requiresApproval: true },
      { from: 'active', to: 'blocked', action: 'block', requiresApproval: true },
      { from: 'active', to: 'on_hold', action: 'hold', requiresApproval: true },
      { from: 'inactive', to: 'active', action: 'reactivate', requiresApproval: true },
      { from: 'on_hold', to: 'active', action: 'resume', requiresApproval: true },
      { from: 'blocked', to: 'active', action: 'unblock', requiresApproval: true },
      { from: 'blocked', to: 'inactive', action: 'deactivate', requiresApproval: true },
    ],
    terminalStates: [],
    blockedStates: ['blocked', 'on_hold'],
    stateMetadata: {
      draft: { label: 'Draft', description: 'Vendor being created', color: 'oklch(0.6 0.1 270)', icon: 'FileText', requiresAction: true, isTerminal: false, isBlocked: false },
      pending: { label: 'Pending', description: 'Awaiting activation', color: 'oklch(0.65 0.18 45)', icon: 'Clock', requiresAction: true, isTerminal: false, isBlocked: false },
      active: { label: 'Active', description: 'Vendor active', color: 'oklch(0.68 0.18 75)', icon: 'CheckCircle', requiresAction: false, isTerminal: false, isBlocked: false },
      inactive: { label: 'Inactive', description: 'Vendor inactive', color: 'oklch(0.5 0.1 270)', icon: 'XCircle', requiresAction: false, isTerminal: false, isBlocked: false },
      blocked: { label: 'Blocked', description: 'Vendor blocked', color: 'oklch(0.6 0.2 10)', icon: 'Ban', requiresAction: true, isTerminal: false, isBlocked: true },
      on_hold: { label: 'On Hold', description: 'Vendor on hold', color: 'oklch(0.65 0.18 30)', icon: 'Pause', requiresAction: true, isTerminal: false, isBlocked: true },
    },
  },
  shipment: {
    entityType: 'shipment',
    initialState: 'draft',
    validStates: ['draft', 'pending', 'picked', 'shipped', 'in_transit', 'delivered', 'delayed', 'cancelled', 'failed'],
    transitions: [
      { from: 'draft', to: 'pending', action: 'schedule', requiresApproval: false },
      { from: 'pending', to: 'picked', action: 'pick', requiresApproval: false },
      { from: 'pending', to: 'cancelled', action: 'cancel', requiresApproval: false },
      { from: 'picked', to: 'shipped', action: 'ship', requiresApproval: false },
      { from: 'shipped', to: 'in_transit', action: 'transit', requiresApproval: false },
      { from: 'in_transit', to: 'delivered', action: 'deliver', requiresApproval: false },
      { from: 'in_transit', to: 'delayed', action: 'delay', requiresApproval: false },
      { from: 'delayed', to: 'in_transit', action: 'resume', requiresApproval: false },
      { from: 'delayed', to: 'failed', action: 'fail', requiresApproval: true },
      { from: 'delayed', to: 'cancelled', action: 'cancel', requiresApproval: true },
      { from: 'in_transit', to: 'failed', action: 'fail', requiresApproval: false },
    ],
    terminalStates: ['delivered', 'cancelled', 'failed'],
    blockedStates: [],
    stateMetadata: {
      draft: { label: 'Draft', description: 'Shipment being created', color: 'oklch(0.6 0.1 270)', icon: 'FileText', requiresAction: true, isTerminal: false, isBlocked: false },
      pending: { label: 'Pending', description: 'Awaiting pickup', color: 'oklch(0.65 0.18 45)', icon: 'Clock', requiresAction: false, isTerminal: false, isBlocked: false },
      picked: { label: 'Picked', description: 'Items picked', color: 'oklch(0.65 0.18 145)', icon: 'Package', requiresAction: false, isTerminal: false, isBlocked: false },
      shipped: { label: 'Shipped', description: 'Shipment shipped', color: 'oklch(0.7 0.18 200)', icon: 'Truck', requiresAction: false, isTerminal: false, isBlocked: false },
      in_transit: { label: 'In Transit', description: 'In transit', color: 'oklch(0.72 0.18 155)', icon: 'Navigation', requiresAction: false, isTerminal: false, isBlocked: false },
      delivered: { label: 'Delivered', description: 'Successfully delivered', color: 'oklch(0.68 0.18 75)', icon: 'CheckCircle', requiresAction: false, isTerminal: true, isBlocked: false },
      delayed: { label: 'Delayed', description: 'Shipment delayed', color: 'oklch(0.65 0.18 30)', icon: 'AlertTriangle', requiresAction: true, isTerminal: false, isBlocked: false },
      cancelled: { label: 'Cancelled', description: 'Shipment cancelled', color: 'oklch(0.5 0.1 270)', icon: 'XCircle', requiresAction: false, isTerminal: true, isBlocked: false },
      failed: { label: 'Failed', description: 'Shipment failed', color: 'oklch(0.6 0.2 15)', icon: 'XCircle', requiresAction: true, isTerminal: true, isBlocked: false },
    },
  },
  contract: {
    entityType: 'contract',
    initialState: 'draft',
    validStates: ['draft', 'pending', 'approved', 'active', 'expired', 'terminated', 'cancelled', 'renewed'],
    transitions: [
      { from: 'draft', to: 'pending', action: 'submit', requiresApproval: false },
      { from: 'pending', to: 'approved', action: 'approve', requiresApproval: true },
      { from: 'pending', to: 'cancelled', action: 'cancel', requiresApproval: false },
      { from: 'approved', to: 'active', action: 'activate', requiresApproval: false },
      { from: 'active', to: 'expired', action: 'expire', requiresApproval: false, automaticConditions: ['end_date_passed'] },
      { from: 'active', to: 'terminated', action: 'terminate', requiresApproval: true },
      { from: 'active', to: 'renewed', action: 'renew', requiresApproval: true },
      { from: 'expired', to: 'renewed', action: 'renew', requiresApproval: true },
      { from: 'renewed', to: 'active', action: 'activate', requiresApproval: false },
    ],
    terminalStates: ['expired', 'terminated', 'cancelled'],
    blockedStates: [],
    stateMetadata: {
      draft: { label: 'Draft', description: 'Contract being created', color: 'oklch(0.6 0.1 270)', icon: 'FileText', requiresAction: true, isTerminal: false, isBlocked: false },
      pending: { label: 'Pending', description: 'Awaiting approval', color: 'oklch(0.65 0.18 45)', icon: 'Clock', requiresAction: true, isTerminal: false, isBlocked: false },
      approved: { label: 'Approved', description: 'Contract approved', color: 'oklch(0.65 0.18 145)', icon: 'CheckCircle', requiresAction: false, isTerminal: false, isBlocked: false },
      active: { label: 'Active', description: 'Contract active', color: 'oklch(0.68 0.18 75)', icon: 'CheckCircle', requiresAction: false, isTerminal: false, isBlocked: false },
      expired: { label: 'Expired', description: 'Contract expired', color: 'oklch(0.5 0.1 270)', icon: 'XCircle', requiresAction: false, isTerminal: true, isBlocked: false },
      terminated: { label: 'Terminated', description: 'Contract terminated', color: 'oklch(0.5 0.1 270)', icon: 'XCircle', requiresAction: false, isTerminal: true, isBlocked: false },
      cancelled: { label: 'Cancelled', description: 'Contract cancelled', color: 'oklch(0.5 0.1 270)', icon: 'XCircle', requiresAction: false, isTerminal: true, isBlocked: false },
      renewed: { label: 'Renewed', description: 'Contract renewed', color: 'oklch(0.65 0.18 145)', icon: 'RefreshCw', requiresAction: true, isTerminal: false, isBlocked: false },
    },
  },
};

// Get state machine config for entity type
export function getStateMachineConfig(entityType: EntityType): StateMachineConfig {
  return stateMachineConfigs[entityType];
}

// Check if transition is valid
export function isValidTransition(
  entityType: EntityType,
  fromState: EntityState,
  toState: EntityState
): boolean {
  const config = getStateMachineConfig(entityType);
  return config.transitions.some(t => t.from === fromState && t.to === toState);
}

// Get transition details
export function getTransition(
  entityType: EntityType,
  fromState: EntityState,
  toState: EntityState
): StateTransition | null {
  const config = getStateMachineConfig(entityType);
  return config.transitions.find(t => t.from === fromState && t.to === toState) || null;
}

// Get valid transitions from current state
export function getValidTransitions(
  entityType: EntityType,
  currentState: EntityState
): StateTransition[] {
  const config = getStateMachineConfig(entityType);
  return config.transitions.filter(t => t.from === currentState);
}

// Get state metadata
export function getStateMetadata(
  entityType: EntityType,
  state: EntityState
): StateMachineConfig['stateMetadata'][EntityState] | null {
  const config = getStateMachineConfig(entityType);
  return config.stateMetadata[state] || null;
}

// Check if state is terminal
export function isTerminalState(entityType: EntityType, state: EntityState): boolean {
  const config = getStateMachineConfig(entityType);
  return config.terminalStates.includes(state);
}

// Check if state is blocked
export function isBlockedState(entityType: EntityType, state: EntityState): boolean {
  const config = getStateMachineConfig(entityType);
  return config.blockedStates.includes(state);
}

// Get all entities in blocked state
export function getEntitiesInBlockedState(entityType: EntityType): string[] {
  // In a real app, this would query the database
  return [];
}

// Transition entity to new state
export function transitionState(
  entityType: EntityType,
  entityId: string,
  toState: EntityState,
  context?: {
    userId?: string;
    reason?: string;
    metadata?: Record<string, any>;
  }
): {
  success: boolean;
  fromState?: EntityState;
  toState: EntityState;
  requiresApproval: boolean;
  error?: string;
} {
  // In a real app, this would:
  // 1. Load current entity state
  // 2. Validate transition
  // 3. Check approval requirements
  // 4. Execute transition
  // 5. Record state change in timeline
  // 6. Trigger side effects
  // 7. Notify relevant parties
  
  const config = getStateMachineConfig(entityType);
  const transition = getTransition(entityType, config.initialState, toState);
  
  if (!transition) {
    return {
      success: false,
      toState,
      requiresApproval: false,
      error: 'Invalid transition',
    };
  }
  
  return {
    success: true,
    fromState: config.initialState,
    toState,
    requiresApproval: transition.requiresApproval,
  };
}

// Get state health indicator
export function getStateHealth(entityType: EntityType, state: EntityState): {
  status: 'healthy' | 'warning' | 'critical' | 'blocked';
  color: string;
} {
  const metadata = getStateMetadata(entityType, state);
  
  if (!metadata) {
    return { status: 'warning', color: 'oklch(0.65 0.18 45)' };
  }
  
  if (metadata.isBlocked) {
    return { status: 'blocked', color: metadata.color };
  }
  
  if (state === 'failed' || state === 'cancelled' || state === 'expired') {
    return { status: 'critical', color: metadata.color };
  }
  
  if (state === 'delayed' || state === 'overdue' || state === 'on_hold') {
    return { status: 'warning', color: metadata.color };
  }
  
  return { status: 'healthy', color: metadata.color };
}
