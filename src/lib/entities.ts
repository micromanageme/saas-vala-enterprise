import { 
  Building2, FileText, DollarSign, Truck, 
  MessageSquare, TrendingUp, Users, Package,
  ShoppingCart, CheckCircle, Clock, AlertTriangle, XCircle
} from "lucide-react";

// Entity Types - Universal entity model
export type EntityType = 
  | 'customer'
  | 'invoice'
  | 'payment'
  | 'shipment'
  | 'support_ticket'
  | 'order'
  | 'product'
  | 'employee'
  | 'lead'
  | 'quote';

export type EntityStatus = 
  | 'active'
  | 'pending'
  | 'blocked'
  | 'delayed'
  | 'failed'
  | 'closed'
  | 'completed';

export interface EntityRelation {
  toEntityType: EntityType;
  toEntityId: string;
  relationType: 'parent' | 'child' | 'related';
  description: string;
}

export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  status: EntityStatus;
  icon: any;
  relations: EntityRelation[];
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Context-aware entity connections
export interface EntityContext {
  entity: Entity;
  relatedEntities: Entity[];
  activeWorkflow: string[];
  pendingActions: string[];
  kpis: {
    label: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
  }[];
}

// Get related entities for context-aware UI
export function getRelatedEntities(entityId: string, entityType: EntityType): Entity[] {
  // In a real app, this would query the database
  // For now, return mock data
  
  const relations: Record<EntityType, Entity[]> = {
    customer: [
      {
        id: 'INV-001',
        type: 'invoice',
        name: 'Invoice #INV-001',
        status: 'pending',
        icon: FileText,
        relations: [],
        metadata: { amount: 12500, dueDate: '2024-01-15' },
        createdAt: '2024-01-01',
        updatedAt: '2024-01-10',
      },
      {
        id: 'ORD-001',
        type: 'order',
        name: 'Order #ORD-001',
        status: 'active',
        icon: ShoppingCart,
        relations: [],
        metadata: { total: 15000, items: 5 },
        createdAt: '2024-01-01',
        updatedAt: '2024-01-08',
      },
      {
        id: 'SHP-001',
        type: 'shipment',
        name: 'Shipment #SHP-001',
        status: 'completed',
        icon: Truck,
        relations: [],
        metadata: { tracking: '1Z999AA10123456784', carrier: 'FedEx' },
        createdAt: '2024-01-05',
        updatedAt: '2024-01-07',
      },
      {
        id: 'TKT-001',
        type: 'support_ticket',
        name: 'Ticket #TKT-001',
        status: 'active',
        icon: MessageSquare,
        relations: [],
        metadata: { priority: 'high', category: 'Billing' },
        createdAt: '2024-01-10',
        updatedAt: '2024-01-11',
      },
    ],
    invoice: [
      {
        id: 'CUST-001',
        type: 'customer',
        name: 'Acme Corporation',
        status: 'active',
        icon: Building2,
        relations: [],
        metadata: { totalSpend: 45000, invoicesCount: 12 },
        createdAt: '2023-06-01',
        updatedAt: '2024-01-10',
      },
      {
        id: 'PAY-001',
        type: 'payment',
        name: 'Payment #PAY-001',
        status: 'pending',
        icon: DollarSign,
        relations: [],
        metadata: { amount: 12500, method: 'Wire Transfer' },
        createdAt: '2024-01-10',
        updatedAt: '2024-01-10',
      },
    ],
    payment: [
      {
        id: 'INV-001',
        type: 'invoice',
        name: 'Invoice #INV-001',
        status: 'pending',
        icon: FileText,
        relations: [],
        metadata: { amount: 12500, dueDate: '2024-01-15' },
        createdAt: '2024-01-01',
        updatedAt: '2024-01-10',
      },
      {
        id: 'CUST-001',
        type: 'customer',
        name: 'Acme Corporation',
        status: 'active',
        icon: Building2,
        relations: [],
        metadata: { totalSpend: 45000, invoicesCount: 12 },
        createdAt: '2023-06-01',
        updatedAt: '2024-01-10',
      },
    ],
    shipment: [
      {
        id: 'ORD-001',
        type: 'order',
        name: 'Order #ORD-001',
        status: 'active',
        icon: ShoppingCart,
        relations: [],
        metadata: { total: 15000, items: 5 },
        createdAt: '2024-01-01',
        updatedAt: '2024-01-08',
      },
      {
        id: 'CUST-001',
        type: 'customer',
        name: 'Acme Corporation',
        status: 'active',
        icon: Building2,
        relations: [],
        metadata: { totalSpend: 45000, invoicesCount: 12 },
        createdAt: '2023-06-01',
        updatedAt: '2024-01-10',
      },
    ],
    support_ticket: [
      {
        id: 'CUST-001',
        type: 'customer',
        name: 'Acme Corporation',
        status: 'active',
        icon: Building2,
        relations: [],
        metadata: { totalSpend: 45000, invoicesCount: 12 },
        createdAt: '2023-06-01',
        updatedAt: '2024-01-10',
      },
      {
        id: 'INV-001',
        type: 'invoice',
        name: 'Invoice #INV-001',
        status: 'pending',
        icon: FileText,
        relations: [],
        metadata: { amount: 12500, dueDate: '2024-01-15' },
        createdAt: '2024-01-01',
        updatedAt: '2024-01-10',
      },
    ],
    order: [
      {
        id: 'CUST-001',
        type: 'customer',
        name: 'Acme Corporation',
        status: 'active',
        icon: Building2,
        relations: [],
        metadata: { totalSpend: 45000, invoicesCount: 12 },
        createdAt: '2023-06-01',
        updatedAt: '2024-01-10',
      },
      {
        id: 'INV-001',
        type: 'invoice',
        name: 'Invoice #INV-001',
        status: 'pending',
        icon: FileText,
        relations: [],
        metadata: { amount: 12500, dueDate: '2024-01-15' },
        createdAt: '2024-01-01',
        updatedAt: '2024-01-10',
      },
      {
        id: 'SHP-001',
        type: 'shipment',
        name: 'Shipment #SHP-001',
        status: 'completed',
        icon: Truck,
        relations: [],
        metadata: { tracking: '1Z999AA10123456784', carrier: 'FedEx' },
        createdAt: '2024-01-05',
        updatedAt: '2024-01-07',
      },
    ],
    product: [
      {
        id: 'ORD-001',
        type: 'order',
        name: 'Order #ORD-001',
        status: 'active',
        icon: ShoppingCart,
        relations: [],
        metadata: { total: 15000, items: 5 },
        createdAt: '2024-01-01',
        updatedAt: '2024-01-08',
      },
    ],
    employee: [
      {
        id: 'TKT-002',
        type: 'support_ticket',
        name: 'Ticket #TKT-002',
        status: 'active',
        icon: MessageSquare,
        relations: [],
        metadata: { priority: 'medium', category: 'Technical' },
        createdAt: '2024-01-11',
        updatedAt: '2024-01-12',
      },
    ],
    lead: [
      {
        id: 'CUST-002',
        type: 'customer',
        name: 'TechStart Inc',
        status: 'pending',
        icon: Building2,
        relations: [],
        metadata: { potentialValue: 75000, source: 'Website' },
        createdAt: '2024-01-12',
        updatedAt: '2024-01-12',
      },
      {
        id: 'QT-001',
        type: 'quote',
        name: 'Quote #QT-001',
        status: 'pending',
        icon: FileText,
        relations: [],
        metadata: { amount: 75000, validUntil: '2024-02-01' },
        createdAt: '2024-01-12',
        updatedAt: '2024-01-12',
      },
    ],
    quote: [
      {
        id: 'CUST-002',
        type: 'customer',
        name: 'TechStart Inc',
        status: 'pending',
        icon: Building2,
        relations: [],
        metadata: { potentialValue: 75000, source: 'Website' },
        createdAt: '2024-01-12',
        updatedAt: '2024-01-12',
      },
      {
        id: 'LEAD-001',
        type: 'lead',
        name: 'Lead #LEAD-001',
        status: 'active',
        icon: Users,
        relations: [],
        metadata: { stage: 'Negotiation', probability: 75 },
        createdAt: '2024-01-10',
        updatedAt: '2024-01-12',
      },
    ],
  };

  return relations[entityType] || [];
}

// Get entity context for context-aware UI
export function getEntityContext(entityId: string, entityType: EntityType): EntityContext {
  const relatedEntities = getRelatedEntities(entityId, entityType);
  
  // Define workflow based on entity type
  const workflows: Record<EntityType, string[]> = {
    customer: ['Lead', 'Opportunity', 'Quote', 'Order', 'Invoice', 'Payment'],
    invoice: ['Created', 'Sent', 'Viewed', 'Approved', 'Paid', 'Reconciled'],
    payment: ['Initiated', 'Processing', 'Completed', 'Reconciled'],
    shipment: ['Order', 'Picking', 'Packing', 'Shipped', 'Delivered'],
    support_ticket: ['Created', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
    order: ['Created', 'Confirmed', 'Processing', 'Shipped', 'Delivered'],
    product: ['Created', 'Stocked', 'Available', 'Low Stock', 'Out of Stock'],
    employee: ['Hired', 'Onboarding', 'Active', 'Review', 'Promotion'],
    lead: ['New', 'Qualified', 'Proposal', 'Negotiation', 'Won/Lost'],
    quote: ['Created', 'Sent', 'Followed Up', 'Accepted', 'Converted'],
  };

  // Define pending actions based on entity type
  const pendingActions: Record<EntityType, string[]> = {
    customer: ['Send Invoice', 'Follow Up', 'Schedule Meeting'],
    invoice: ['Send Reminder', 'Apply Payment', 'Write Off'],
    payment: ['Process Refund', 'Reconcile', 'Verify'],
    shipment: ['Track Delivery', 'Update Status', 'Handle Returns'],
    support_ticket: ['Respond', 'Escalate', 'Close'],
    order: ['Process', 'Ship', 'Cancel'],
    product: ['Restock', 'Update Pricing', 'Discontinue'],
    employee: ['Review Performance', 'Assign Tasks', 'Schedule Training'],
    lead: ['Call', 'Send Proposal', 'Schedule Demo'],
    quote: ['Follow Up', 'Send Revision', 'Convert to Order'],
  };

  // Define KPIs based on entity type
  const kpis: Record<EntityType, { label: string; value: string; trend: 'up' | 'down' | 'stable' }[]> = {
    customer: [
      { label: 'Total Spend', value: '$45,000', trend: 'up' },
      { label: 'Invoices', value: '12', trend: 'stable' },
      { label: 'Last Order', value: '7 days ago', trend: 'stable' },
    ],
    invoice: [
      { label: 'Amount', value: '$12,500', trend: 'stable' },
      { label: 'Days Overdue', value: '5', trend: 'up' },
      { label: 'Payment Status', value: 'Pending', trend: 'stable' },
    ],
    payment: [
      { label: 'Amount', value: '$12,500', trend: 'stable' },
      { label: 'Method', value: 'Wire', trend: 'stable' },
      { label: 'Status', value: 'Processing', trend: 'stable' },
    ],
    shipment: [
      { label: 'Status', value: 'In Transit', trend: 'stable' },
      { label: 'ETA', value: '2 days', trend: 'stable' },
      { label: 'Carrier', value: 'FedEx', trend: 'stable' },
    ],
    support_ticket: [
      { label: 'Priority', value: 'High', trend: 'stable' },
      { label: 'Age', value: '2 days', trend: 'up' },
      { label: 'Assignee', value: 'John', trend: 'stable' },
    ],
    order: [
      { label: 'Total', value: '$15,000', trend: 'stable' },
      { label: 'Items', value: '5', trend: 'stable' },
      { label: 'Status', value: 'Processing', trend: 'stable' },
    ],
    product: [
      { label: 'Stock', value: '150', trend: 'down' },
      { label: 'Price', value: '$500', trend: 'stable' },
      { label: 'Sales', value: '23/month', trend: 'up' },
    ],
    employee: [
      { label: 'Performance', value: '4.5/5', trend: 'stable' },
      { label: 'Tasks', value: '8', trend: 'down' },
      { label: 'Tenure', value: '2 years', trend: 'stable' },
    ],
    lead: [
      { label: 'Value', value: '$75,000', trend: 'stable' },
      { label: 'Probability', value: '75%', trend: 'up' },
      { label: 'Stage', value: 'Negotiation', trend: 'stable' },
    ],
    quote: [
      { label: 'Amount', value: '$75,000', trend: 'stable' },
      { label: 'Valid Until', value: 'Feb 1', trend: 'stable' },
      { label: 'Status', value: 'Sent', trend: 'stable' },
    ],
  };

  return {
    entity: {
      id: entityId,
      type: entityType,
      name: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} #${entityId}`,
      status: 'active',
      icon: FileText,
      relations: [],
      metadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    relatedEntities,
    activeWorkflow: workflows[entityType],
    pendingActions: pendingActions[entityType],
    kpis: kpis[entityType],
  };
}

// Get status color
export function getStatusColor(status: EntityStatus): string {
  const colors = {
    active: 'oklch(0.6 0.18 145)',
    pending: 'oklch(0.7 0.15 45)',
    blocked: 'oklch(0.6 0.18 25)',
    delayed: 'oklch(0.7 0.18 55)',
    failed: 'oklch(0.6 0.18 15)',
    closed: 'oklch(0.5 0.1 270)',
    completed: 'oklch(0.6 0.18 145)',
  };
  return colors[status];
}

// Get status icon
export function getStatusIcon(status: EntityStatus) {
  const icons = {
    active: CheckCircle,
    pending: Clock,
    blocked: XCircle,
    delayed: AlertTriangle,
    failed: XCircle,
    closed: CheckCircle,
    completed: CheckCircle,
  };
  return icons[status];
}
