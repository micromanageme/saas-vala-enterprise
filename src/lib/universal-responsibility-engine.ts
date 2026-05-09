// @ts-nocheck
// Universal Responsibility Engine - Every task shows owner/team/escalation chain/due time
import type { EntityType, EntityState } from "./operational-state-machine";
import type { Priority } from "./system-priority-engine";

export interface Responsibility {
  id: string;
  entityType: EntityType;
  entityId: string;
  owner: {
    id: string;
    name: string;
    role: string;
    email: string;
  };
  team: {
    id: string;
    name: string;
    members: Array<{
      id: string;
      name: string;
      role: string;
    }>;
  };
  escalationChain: Array<{
    level: number;
    role: string;
    person: {
      id: string;
      name: string;
      email: string;
    };
    escalationTime?: string;
  }>;
  dueDate: string;
  priority: Priority;
  status: 'assigned' | 'in_progress' | 'completed' | 'overdue' | 'escalated';
  assignedAt: string;
  completedAt?: string;
  overdueSince?: string;
}

export interface ResponsibilityMatrix {
  entityType: EntityType;
  entityId: string;
  responsibilities: Responsibility[];
  primaryOwner: string;
  backupOwner?: string;
  teamMembers: string[];
  escalationPath: string[];
  nextEscalation: {
    level: number;
    person: string;
    timeUntil?: string;
  };
}

// Responsibility rules for each entity type
export const responsibilityRules: Record<EntityType, {
  defaultOwner: string;
  defaultTeam: string;
  escalationLevels: Array<{
    level: number;
    role: string;
    defaultPerson: string;
    escalationAfterHours: number;
  }>;
}> = {
  order: {
    defaultOwner: 'sales_rep',
    defaultTeam: 'sales',
    escalationLevels: [
      { level: 1, role: 'sales_manager', defaultPerson: 'sales_manager', escalationAfterHours: 24 },
      { level: 2, role: 'sales_director', defaultPerson: 'sales_director', escalationAfterHours: 48 },
      { level: 3, role: 'vp_sales', defaultPerson: 'vp_sales', escalationAfterHours: 72 },
    ],
  },
  invoice: {
    defaultOwner: 'accountant',
    defaultTeam: 'finance',
    escalationLevels: [
      { level: 1, role: 'finance_manager', defaultPerson: 'finance_manager', escalationAfterHours: 24 },
      { level: 2, role: 'cfo', defaultPerson: 'cfo', escalationAfterHours: 48 },
    ],
  },
  payment: {
    defaultOwner: 'accountant',
    defaultTeam: 'finance',
    escalationLevels: [
      { level: 1, role: 'finance_manager', defaultPerson: 'finance_manager', escalationAfterHours: 24 },
      { level: 2, role: 'cfo', defaultPerson: 'cfo', escalationAfterHours: 48 },
    ],
  },
  quote: {
    defaultOwner: 'sales_rep',
    defaultTeam: 'sales',
    escalationLevels: [
      { level: 1, role: 'sales_manager', defaultPerson: 'sales_manager', escalationAfterHours: 24 },
      { level: 2, role: 'sales_director', defaultPerson: 'sales_director', escalationAfterHours: 48 },
    ],
  },
  lead: {
    defaultOwner: 'sales_rep',
    defaultTeam: 'sales',
    escalationLevels: [
      { level: 1, role: 'sales_manager', defaultPerson: 'sales_manager', escalationAfterHours: 24 },
      { level: 2, role: 'sales_director', defaultPerson: 'sales_director', escalationAfterHours: 48 },
    ],
  },
  customer: {
    defaultOwner: 'account_manager',
    defaultTeam: 'customer_success',
    escalationLevels: [
      { level: 1, role: 'cs_manager', defaultPerson: 'cs_manager', escalationAfterHours: 24 },
      { level: 2, role: 'vp_cs', defaultPerson: 'vp_cs', escalationAfterHours: 48 },
    ],
  },
  employee: {
    defaultOwner: 'hr_manager',
    defaultTeam: 'hr',
    escalationLevels: [
      { level: 1, role: 'hr_director', defaultPerson: 'hr_director', escalationAfterHours: 24 },
      { level: 2, role: 'ceo', defaultPerson: 'ceo', escalationAfterHours: 48 },
    ],
  },
  product: {
    defaultOwner: 'product_manager',
    defaultTeam: 'product',
    escalationLevels: [
      { level: 1, role: 'vp_product', defaultPerson: 'vp_product', escalationAfterHours: 24 },
      { level: 2, role: 'cto', defaultPerson: 'cto', escalationAfterHours: 48 },
    ],
  },
  vendor: {
    defaultOwner: 'procurement_manager',
    defaultTeam: 'procurement',
    escalationLevels: [
      { level: 1, role: 'procurement_director', defaultPerson: 'procurement_director', escalationAfterHours: 24 },
      { level: 2, role: 'cfo', defaultPerson: 'cfo', escalationAfterHours: 48 },
    ],
  },
  ticket: {
    defaultOwner: 'support_agent',
    defaultTeam: 'support',
    escalationLevels: [
      { level: 1, role: 'support_manager', defaultPerson: 'support_manager', escalationAfterHours: 4 },
      { level: 2, role: 'cs_manager', defaultPerson: 'cs_manager', escalationAfterHours: 8 },
      { level: 3, role: 'vp_cs', defaultPerson: 'vp_cs', escalationAfterHours: 24 },
    ],
  },
  contract: {
    defaultOwner: 'legal_counsel',
    defaultTeam: 'legal',
    escalationLevels: [
      { level: 1, role: 'general_counsel', defaultPerson: 'general_counsel', escalationAfterHours: 24 },
      { level: 2, role: 'ceo', defaultPerson: 'ceo', escalationAfterHours: 48 },
    ],
  },
  shipment: {
    defaultOwner: 'logistics_coordinator',
    defaultTeam: 'logistics',
    escalationLevels: [
      { level: 1, role: 'logistics_manager', defaultPerson: 'logistics_manager', escalationAfterHours: 12 },
      { level: 2, role: 'operations_manager', defaultPerson: 'operations_manager', escalationAfterHours: 24 },
    ],
  },
};

// Create responsibility for an entity
export function createResponsibility(
  entityType: EntityType,
  entityId: string,
  customOwner?: string,
  customTeam?: string,
  dueDate?: Date
): Responsibility {
  const rules = responsibilityRules[entityType];
  const now = new Date();
  
  // Calculate due date (default: 3 days from now)
  const calculatedDueDate = dueDate || new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  
  // Build escalation chain
  const escalationChain = rules.escalationLevels.map(level => ({
    level: level.level,
    role: level.role,
    person: {
      id: level.defaultPerson,
      name: level.defaultPerson,
      email: `${level.defaultPerson}@company.com`,
    },
  }));
  
  // Build team
  const team = {
    id: customTeam || rules.defaultTeam,
    name: customTeam || rules.defaultTeam,
    members: [
      {
        id: customOwner || rules.defaultOwner,
        name: customOwner || rules.defaultOwner,
        role: 'primary',
      },
    ],
  };
  
  return {
    id: `resp-${entityType}-${entityId}`,
    entityType,
    entityId,
    owner: {
      id: customOwner || rules.defaultOwner,
      name: customOwner || rules.defaultOwner,
      role: rules.defaultOwner,
      email: `${customOwner || rules.defaultOwner}@company.com`,
    },
    team,
    escalationChain,
    dueDate: calculatedDueDate.toISOString(),
    priority: 'normal',
    status: 'assigned',
    assignedAt: now.toISOString(),
  };
}

// Get responsibility matrix for an entity
export function getResponsibilityMatrix(
  entityType: EntityType,
  entityId: string,
  responsibilities: Responsibility[]
): ResponsibilityMatrix {
  const entityResponsibilities = responsibilities.filter(r => r.entityId === entityId);
  const primaryOwner = entityResponsibilities[0]?.owner.name || 'unassigned';
  const backupOwner = entityResponsibilities[1]?.owner.name;
  const teamMembers = entityResponsibilities.map(r => r.team.members).flat();
  const escalationPath = entityResponsibilities[0]?.escalationChain.map(e => e.person.name) || [];
  
  // Calculate next escalation
  const nextEscalation = {
    level: 0,
    person: '',
    timeUntil: '',
  };
  
  if (entityResponsibilities[0]) {
    const resp = entityResponsibilities[0];
    const now = new Date();
    const assignedAt = new Date(resp.assignedAt);
    
    for (const level of resp.escalationChain) {
      const escalationTime = new Date(assignedAt.getTime() + responsibilityRules[entityType].escalationLevels[level.level - 1].escalationAfterHours * 60 * 60 * 1000);
      if (escalationTime > now) {
        nextEscalation.level = level.level;
        nextEscalation.person = level.person.name;
        nextEscalation.timeUntil = `${Math.ceil((escalationTime.getTime() - now.getTime()) / (1000 * 60 * 60))} hours`;
        break;
      }
    }
  }
  
  return {
    entityType,
    entityId,
    responsibilities: entityResponsibilities,
    primaryOwner,
    backupOwner,
    teamMembers: [...new Set(teamMembers.map(m => m.name))],
    escalationPath,
    nextEscalation,
  };
}

// Escalate responsibility
export function escalateResponsibility(
  responsibilityId: string,
  responsibilities: Responsibility[],
  toLevel: number
): Responsibility | null {
  const responsibility = responsibilities.find(r => r.id === responsibilityId);
  if (!responsibility) return null;
  
  const rules = responsibilityRules[responsibility.entityType];
  const targetLevel = rules.escalationLevels.find(l => l.level === toLevel);
  if (!targetLevel) return null;
  
  // Update to new owner
  responsibility.owner = {
    id: targetLevel.defaultPerson,
    name: targetLevel.defaultPerson,
    role: targetLevel.role,
    email: `${targetLevel.defaultPerson}@company.com`,
  };
  responsibility.status = 'escalated';
  responsibility.escalationChain.find(e => e.level === toLevel)!.escalationTime = new Date().toISOString();
  
  return responsibility;
}

// Reassign responsibility
export function reassignResponsibility(
  responsibilityId: string,
  responsibilities: Responsibility[],
  newOwnerId: string,
  newOwnerName: string,
  newOwnerRole: string
): Responsibility | null {
  const responsibility = responsibilities.find(r => r.id === responsibilityId);
  if (!responsibility) return null;
  
  responsibility.owner = {
    id: newOwnerId,
    name: newOwnerName,
    role: newOwnerRole,
    email: `${newOwnerId}@company.com`,
  };
  responsibility.status = 'assigned';
  responsibility.assignedAt = new Date().toISOString();
  
  return responsibility;
}

// Check if responsibility is overdue
export function isResponsibilityOverdue(responsibility: Responsibility): boolean {
  return new Date(responsibility.dueDate) < new Date();
}

// Get overdue responsibilities
export function getOverdueResponsibilities(responsibilities: Responsibility[]): Responsibility[] {
  return responsibilities.filter(r => isResponsibilityOverdue(r));
}

// Update responsibility status
export function updateResponsibilityStatus(
  responsibilityId: string,
  responsibilities: Responsibility[],
  status: 'assigned' | 'in_progress' | 'completed' | 'overdue' | 'escalated'
): Responsibility | null {
  const responsibility = responsibilities.find(r => r.id === responsibilityId);
  if (!responsibility) return null;
  
  responsibility.status = status;
  
  if (status === 'completed') {
    responsibility.completedAt = new Date().toISOString();
  }
  
  if (status === 'overdue') {
    responsibility.overdueSince = new Date().toISOString();
  }
  
  return responsibility;
}

// Get responsibilities by owner
export function getResponsibilitiesByOwner(responsibilities: Responsibility[], ownerId: string): Responsibility[] {
  return responsibilities.filter(r => r.owner.id === ownerId);
}

// Get responsibilities by team
export function getResponsibilitiesByTeam(responsibilities: Responsibility[], teamId: string): Responsibility[] {
  return responsibilities.filter(r => r.team.id === teamId);
}

// Get responsibilities by priority
export function getResponsibilitiesByPriority(responsibilities: Responsibility[], priority: Priority): Responsibility[] {
  return responsibilities.filter(r => r.priority === priority);
}

// Get responsibilities by status
export function getResponsibilitiesByStatus(
  responsibilities: Responsibility[],
  status: 'assigned' | 'in_progress' | 'completed' | 'overdue' | 'escalated'
): Responsibility[] {
  return responsibilities.filter(r => r.status === status);
}

// Get responsibility workload
export function getResponsibilityWorkload(responsibilities: Responsibility[]): Array<{
  ownerId: string;
  ownerName: string;
  total: number;
  inProgress: number;
  overdue: number;
  completed: number;
}> {
  const workload: Map<string, {
    ownerId: string;
    ownerName: string;
    total: number;
    inProgress: number;
    overdue: number;
    completed: number;
  }> = new Map();
  
  responsibilities.forEach(resp => {
    const key = resp.owner.id;
    const existing = workload.get(key) || {
      ownerId: resp.owner.id,
      ownerName: resp.owner.name,
      total: 0,
      inProgress: 0,
      overdue: 0,
      completed: 0,
    };
    
    existing.total++;
    if (resp.status === 'in_progress') existing.inProgress++;
    if (resp.status === 'overdue') existing.overdue++;
    if (resp.status === 'completed') existing.completed++;
    
    workload.set(key, existing);
  });
  
  return Array.from(workload.values());
}

// Get team workload
export function getTeamWorkload(responsibilities: Responsibility[]): Array<{
  teamId: string;
  teamName: string;
  total: number;
  inProgress: number;
  overdue: number;
  completed: number;
}> {
  const workload: Map<string, {
    teamId: string;
    teamName: string;
    total: number;
    inProgress: number;
    overdue: number;
    completed: number;
  }> = new Map();
  
  responsibilities.forEach(resp => {
    const key = resp.team.id;
    const existing = workload.get(key) || {
      teamId: resp.team.id,
      teamName: resp.team.name,
      total: 0,
      inProgress: 0,
      overdue: 0,
      completed: 0,
    };
    
    existing.total++;
    if (resp.status === 'in_progress') existing.inProgress++;
    if (resp.status === 'overdue') existing.overdue++;
    if (resp.status === 'completed') existing.completed++;
    
    workload.set(key, existing);
  });
  
  return Array.from(workload.values());
}

// Auto-escalate overdue responsibilities
export function autoEscalateOverdue(responsibilities: Responsibility[]): Responsibility[] {
  const escalated: Responsibility[] = [];
  
  responsibilities.forEach(resp => {
    if (isResponsibilityOverdue(resp) && resp.status !== 'completed') {
      const result = escalateResponsibility(resp.id, responsibilities, 1);
      if (result) {
        escalated.push(result);
      }
    }
  });
  
  return escalated;
}

// Get responsibility summary
export function getResponsibilitySummary(responsibilities: Responsibility[]): {
  total: number;
  assigned: number;
  inProgress: number;
  completed: number;
  overdue: number;
  escalated: number;
  completionRate: number;
} {
  return {
    total: responsibilities.length,
    assigned: responsibilities.filter(r => r.status === 'assigned').length,
    inProgress: responsibilities.filter(r => r.status === 'in_progress').length,
    completed: responsibilities.filter(r => r.status === 'completed').length,
    overdue: responsibilities.filter(r => r.status === 'overdue').length,
    escalated: responsibilities.filter(r => r.status === 'escalated').length,
    completionRate: responsibilities.length > 0
      ? Math.round((responsibilities.filter(r => r.status === 'completed').length / responsibilities.length) * 100)
      : 0,
  };
}

// Get pending escalations
export function getPendingEscalations(responsibilities: Responsibility[]): Array<{
  responsibilityId: string;
  currentLevel: number;
  nextLevel: number;
  timeUntilEscalation: string;
  owner: string;
}> {
  const pending: Array<{
    responsibilityId: string;
    currentLevel: number;
    nextLevel: number;
    timeUntilEscalation: string;
    owner: string;
  }> = [];
  
  responsibilities.forEach(resp => {
    const rules = responsibilityRules[resp.entityType];
    const now = new Date();
    const assignedAt = new Date(resp.assignedAt);
    
    // Find next escalation level
    for (let i = 0; i < resp.escalationChain.length; i++) {
      const level = resp.escalationChain[i];
      const escalationTime = new Date(assignedAt.getTime() + rules.escalationLevels[i].escalationAfterHours * 60 * 60 * 1000);
      
      if (escalationTime > now && !level.escalationTime) {
        const nextLevel = resp.escalationChain[i + 1];
        if (nextLevel) {
          pending.push({
            responsibilityId: resp.id,
            currentLevel: level.level,
            nextLevel: nextLevel.level,
            timeUntilEscalation: `${Math.ceil((escalationTime.getTime() - now.getTime()) / (1000 * 60 * 60))} hours`,
            owner: resp.owner.name,
          });
        }
        break;
      }
    }
  });
  
  return pending;
}

// Batch create responsibilities
export function batchCreateResponsibilities(
  entities: Array<{
    entityType: EntityType;
    entityId: string;
    customOwner?: string;
    customTeam?: string;
    dueDate?: Date;
  }>
): Responsibility[] {
  return entities.map(entity => createResponsibility(
    entity.entityType,
    entity.entityId,
    entity.customOwner,
    entity.customTeam,
    entity.dueDate
  ));
}