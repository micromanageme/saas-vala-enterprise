// @ts-nocheck
// Entity-Centric Design - System organized around entities, not modules
export type EntityType = 
  | 'customer'
  | 'employee'
  | 'order'
  | 'invoice'
  | 'payment'
  | 'product'
  | 'vendor'
  | 'ticket'
  | 'lead'
  | 'quote';

export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  status: 'active' | 'inactive' | 'blocked' | 'pending';
  metadata: Record<string, any>;
  relatedEntities: EntityRelation[];
  timeline: EntityEvent[];
  financialImpact?: {
    totalValue: number;
    pendingAmount: number;
    currency: string;
  };
  operationalHealth: {
    status: 'healthy' | 'warning' | 'critical';
    blockedBy?: string[];
    nextAction?: string;
  };
}

export interface EntityRelation {
  toEntityType: EntityType;
  toEntityId: string;
  relationType: 'parent' | 'child' | 'peer';
  description: string;
  count?: number;
}

export interface EntityEvent {
  id: string;
  type: 'created' | 'updated' | 'status_change' | 'financial' | 'operational';
  description: string;
  timestamp: string;
  impact?: string;
}

// Get entity-centric context
export interface EntityContext {
  entity: Entity;
  relatedEntities: Entity[];
  activeWorkflows: string[];
  pendingActions: string[];
  financialSummary: {
    total: number;
    pending: number;
    overdue: number;
  };
  operationalSummary: {
    healthy: number;
    warning: number;
    critical: number;
  };
}

// Entity-centric navigation structure
export interface EntityNavigation {
  entityType: EntityType;
  entities: Entity[];
  views: {
    overview: string;
    timeline: string;
    related: string;
    financial: string;
    operations: string;
  };
  quickActions: {
    label: string;
    action: string;
  }[];
}

// Entity type configurations
export const entityConfigs: Record<EntityType, {
  name: string;
  plural: string;
  icon: string;
  color: string;
  primaryWorkflows: string[];
  relatedEntityTypes: EntityType[];
  financialTracked: boolean;
  operationalTracked: boolean;
}> = {
  customer: {
    name: 'Customer',
    plural: 'Customers',
    icon: 'Building2',
    color: 'oklch(0.65 0.18 200)',
    primaryWorkflows: ['onboard', 'purchase', 'support', 'renewal'],
    relatedEntityTypes: ['order', 'invoice', 'payment', 'ticket'],
    financialTracked: true,
    operationalTracked: true,
  },
  employee: {
    name: 'Employee',
    plural: 'Employees',
    icon: 'User',
    color: 'oklch(0.68 0.18 45)',
    primaryWorkflows: ['onboard', 'assign', 'review', 'payroll'],
    relatedEntityTypes: ['ticket', 'leave', 'performance', 'training'],
    financialTracked: true,
    operationalTracked: true,
  },
  order: {
    name: 'Order',
    plural: 'Orders',
    icon: 'ShoppingCart',
    color: 'oklch(0.72 0.18 155)',
    primaryWorkflows: ['process', 'fulfill', 'ship', 'deliver'],
    relatedEntityTypes: ['customer', 'invoice', 'payment', 'product'],
    financialTracked: true,
    operationalTracked: true,
  },
  invoice: {
    name: 'Invoice',
    plural: 'Invoices',
    icon: 'FileText',
    color: 'oklch(0.75 0.15 280)',
    primaryWorkflows: ['create', 'send', 'collect', 'reconcile'],
    relatedEntityTypes: ['customer', 'order', 'payment', 'quote'],
    financialTracked: true,
    operationalTracked: true,
  },
  payment: {
    name: 'Payment',
    plural: 'Payments',
    icon: 'DollarSign',
    color: 'oklch(0.78 0.16 75)',
    primaryWorkflows: ['process', 'verify', 'reconcile', 'refund'],
    relatedEntityTypes: ['invoice', 'customer', 'order', 'vendor'],
    financialTracked: true,
    operationalTracked: false,
  },
  product: {
    name: 'Product',
    plural: 'Products',
    icon: 'Package',
    color: 'oklch(0.65 0.2 330)',
    primaryWorkflows: ['stock', 'price', 'promote', 'discontinue'],
    relatedEntityTypes: ['order', 'invoice', 'vendor'],
    financialTracked: true,
    operationalTracked: true,
  },
  vendor: {
    name: 'Vendor',
    plural: 'Vendors',
    icon: 'Truck',
    color: 'oklch(0.7 0.18 25)',
    primaryWorkflows: ['onboard', 'order', 'pay', 'evaluate'],
    relatedEntityTypes: ['product', 'invoice', 'payment'],
    financialTracked: true,
    operationalTracked: true,
  },
  ticket: {
    name: 'Support Ticket',
    plural: 'Support Tickets',
    icon: 'MessageSquare',
    color: 'oklch(0.5 0.15 270)',
    primaryWorkflows: ['assign', 'respond', 'resolve', 'close'],
    relatedEntityTypes: ['customer', 'employee', 'order'],
    financialTracked: false,
    operationalTracked: true,
  },
  lead: {
    name: 'Lead',
    plural: 'Leads',
    icon: 'Target',
    color: 'oklch(0.55 0.2 50)',
    primaryWorkflows: ['qualify', 'nurture', 'quote', 'convert'],
    relatedEntityTypes: ['customer', 'quote', 'employee'],
    financialTracked: true,
    operationalTracked: true,
  },
  quote: {
    name: 'Quote',
    plural: 'Quotes',
    icon: 'FileText',
    color: 'oklch(0.6 0.18 145)',
    primaryWorkflows: ['create', 'send', 'follow-up', 'convert'],
    relatedEntityTypes: ['customer', 'lead', 'invoice', 'order'],
    financialTracked: true,
    operationalTracked: true,
  },
};

// Get entity context by ID
export function getEntityContext(entityId: string, entityType: EntityType): EntityContext {
  // In a real app, this would query the database
  // For now, return mock data
  
  const config = entityConfigs[entityType];
  
  return {
    entity: {
      id: entityId,
      type: entityType,
      name: `${config.name} #${entityId}`,
      status: 'active',
      metadata: {},
      relatedEntities: [],
      timeline: [],
      financialImpact: config.financialTracked ? {
        totalValue: 50000,
        pendingAmount: 12500,
        currency: 'USD',
      } : undefined,
      operationalHealth: {
        status: 'healthy',
      },
    },
    relatedEntities: [],
    activeWorkflows: config.primaryWorkflows,
    pendingActions: ['Review', 'Update', 'Approve'],
    financialSummary: config.financialTracked ? {
      total: 50000,
      pending: 12500,
      overdue: 0,
    } : {
      total: 0,
      pending: 0,
      overdue: 0,
    },
    operationalSummary: {
      healthy: 5,
      warning: 0,
      critical: 0,
    },
  };
}

// Get entity navigation structure
export function getEntityNavigation(entityType: EntityType): EntityNavigation {
  const config = entityConfigs[entityType];
  
  return {
    entityType,
    entities: [], // Would be populated from database
    views: {
      overview: `/${entityType}/overview`,
      timeline: `/${entityType}/timeline`,
      related: `/${entityType}/related`,
      financial: config.financialTracked ? `/${entityType}/financial` : '',
      operations: config.operationalTracked ? `/${entityType}/operations` : '',
    },
    quickActions: config.primaryWorkflows.map(workflow => ({
      label: workflow.charAt(0).toUpperCase() + workflow.slice(1),
      action: workflow,
    })),
  };
}

// Get entity-centric route
export function getEntityRoute(entityType: EntityType, entityId: string, view: 'overview' | 'timeline' | 'related' | 'financial' | 'operations' = 'overview'): string {
  return `/${entityType}/${entityId}/${view}`;
}

// Get entity-related entities
export function getRelatedEntities(entity: Entity): Entity[] {
  // In a real app, this would query related entities
  // For now, return empty array
  return [];
}

// Get entity timeline
export function getEntityTimeline(entityId: string, entityType: EntityType): EntityEvent[] {
  // In a real app, this would query the timeline
  // For now, return mock data
  return [
    {
      id: '1',
      type: 'created',
      description: `${entityType} created`,
      timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
    {
      id: '2',
      type: 'updated',
      description: `${entityType} updated`,
      timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: '3',
      type: 'status_change',
      description: `Status changed to active`,
      timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
  ];
}

// Get entity financial summary
export function getEntityFinancialSummary(entityId: string, entityType: EntityType): {
  total: number;
  pending: number;
  overdue: number;
  currency: string;
} | null {
  const config = entityConfigs[entityType];
  
  if (!config.financialTracked) {
    return null;
  }
  
  return {
    total: 50000,
    pending: 12500,
    overdue: 0,
    currency: 'USD',
  };
}

// Get entity operational health
export function getEntityOperationalHealth(entity: Entity): {
  status: 'healthy' | 'warning' | 'critical';
  blockedBy: string[];
  nextAction: string;
} {
  return {
    status: entity.operationalHealth.status,
    blockedBy: entity.operationalHealth.blockedBy || [],
    nextAction: entity.operationalHealth.nextAction || 'No action required',
  };
}

// Search entities across all types
export function searchEntities(query: string, types?: EntityType[]): Array<{
  entity: Entity;
  type: EntityType;
}> {
  // In a real app, this would search the database
  // For now, return empty array
  return [];
}

// Get entities requiring attention
export function getEntitiesRequiringAttention(): Array<{
  entity: Entity;
  type: EntityType;
  priority: 'critical' | 'high' | 'normal';
  reason: string;
}> {
  // In a real app, this would query entities with issues
  // For now, return empty array
  return [];
}

// Entity-centric sidebar navigation
export interface EntitySidebarSection {
  type: EntityType;
  label: string;
  count: number;
  icon: string;
  color: string;
}

export function getEntitySidebarSections(): EntitySidebarSection[] {
  return Object.entries(entityConfigs).map(([type, config]) => ({
    type: type as EntityType,
    label: config.plural,
    count: 0, // Would be populated from database
    icon: config.icon,
    color: config.color,
  }));
}

// Get entity-specific actions
export function getEntityActions(entityType: EntityType): Array<{
  label: string;
  action: string;
  icon: string;
  priority: 'primary' | 'secondary';
}> {
  const config = entityConfigs[entityType];
  
  return config.primaryWorkflows.slice(0, 4).map((workflow, idx) => ({
    label: workflow.charAt(0).toUpperCase() + workflow.slice(1),
    action: workflow,
    icon: config.icon,
    priority: idx === 0 ? 'primary' as const : 'secondary' as const,
  }));
}