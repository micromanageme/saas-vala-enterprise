// Auto-Push System - Eliminate manual navigation by pushing tasks automatically
import { 
  getJourneysRequiringAttention,
  completeStep,
  type OperationalJourney,
  type BusinessEvent
} from "./operational-journey";

export interface AutoPushItem {
  id: string;
  type: 'journey_step' | 'recommendation' | 'alert' | 'workflow_update';
  title: string;
  description: string;
  action: string;
  priority: 'critical' | 'high' | 'normal' | 'low';
  journeyId?: string;
  entityId?: string;
  autoDismiss?: boolean;
  dismissAfter?: number; // seconds
  context?: {
    revenueImpact?: number;
    timeUntilDue?: string;
    relatedEntities?: string[];
  };
}

export interface PushNotification {
  id: string;
  item: AutoPushItem;
  pushedAt: string;
  viewed: boolean;
  actionTaken: boolean;
  dismissed: boolean;
}

// Auto-push queue
let pushQueue: AutoPushItem[] = [];
let pushHistory: PushNotification[] = [];

// Generate automatic push items based on current state
export function generateAutoPushItems(): AutoPushItem[] {
  const items: AutoPushItem[] = [];
  const { critical, high } = getJourneysRequiringAttention();

  // Push critical journey steps
  critical.forEach((journey) => {
    const currentStep = journey.steps[journey.currentStep];
    if (currentStep && !currentStep.autoAdvance) {
      items.push({
        id: `push-${journey.id}-${journey.currentStep}`,
        type: 'journey_step',
        title: journey.entity.name,
        description: currentStep.description,
        action: currentStep.action,
        priority: 'critical',
        journeyId: journey.id,
        entityId: journey.entity.id,
        autoDismiss: false,
        context: {
          revenueImpact: journey.revenueImpact?.amount,
          timeUntilDue: currentStep.estimatedTime,
        },
      });
    }
  });

  // Push high priority journey steps
  high.forEach((journey) => {
    const currentStep = journey.steps[journey.currentStep];
    if (currentStep && !currentStep.autoAdvance) {
      items.push({
        id: `push-${journey.id}-${journey.currentStep}`,
        type: 'journey_step',
        title: journey.entity.name,
        description: currentStep.description,
        action: currentStep.action,
        priority: 'high',
        journeyId: journey.id,
        entityId: journey.entity.id,
        autoDismiss: false,
        context: {
          revenueImpact: journey.revenueImpact?.amount,
          timeUntilDue: currentStep.estimatedTime,
        },
      });
    }
  });

  // Auto-advance steps that can be automated
  [...critical, ...high].forEach((journey) => {
    const currentStep = journey.steps[journey.currentStep];
    if (currentStep && currentStep.autoAdvance) {
      items.push({
        id: `auto-${journey.id}-${journey.currentStep}`,
        type: 'workflow_update',
        title: 'Workflow Progress',
        description: `${currentStep.title} completed automatically`,
        action: 'View',
        priority: 'normal',
        journeyId: journey.id,
        entityId: journey.entity.id,
        autoDismiss: true,
        dismissAfter: 5,
      });
    }
  });

  return items;
}

// Push item to user
export function pushToUser(item: AutoPushItem): void {
  pushQueue.push(item);
  
  const notification: PushNotification = {
    id: `notif-${Date.now()}-${item.id}`,
    item,
    pushedAt: new Date().toISOString(),
    viewed: false,
    actionTaken: false,
    dismissed: false,
  };
  
  pushHistory.unshift(notification);
  
  // Keep history manageable
  if (pushHistory.length > 100) {
    pushHistory = pushHistory.slice(0, 100);
  }
  
  // Auto-dismiss if configured
  if (item.autoDismiss && item.dismissAfter) {
    setTimeout(() => {
      dismissNotification(notification.id);
    }, item.dismissAfter * 1000);
  }
}

// Get pending push items
export function getPendingPushItems(): AutoPushItem[] {
  return pushQueue.filter(item => {
    const notification = pushHistory.find(n => n.item.id === item.id);
    return !notification || (!notification.viewed && !notification.dismissed);
  });
}

// Mark notification as viewed
export function markAsViewed(notificationId: string): void {
  const notification = pushHistory.find(n => n.id === notificationId);
  if (notification) {
    notification.viewed = true;
  }
}

// Mark action as taken
export function markActionTaken(notificationId: string): void {
  const notification = pushHistory.find(n => n.id === notificationId);
  if (notification) {
    notification.actionTaken = true;
    
    // If it's a journey step, complete it
    if (notification.item.journeyId) {
      completeStep(notification.item.journeyId);
    }
  }
}

// Dismiss notification
export function dismissNotification(notificationId: string): void {
  const notification = pushHistory.find(n => n.id === notificationId);
  if (notification) {
    notification.dismissed = true;
  }
}

// Get push history
export function getPushHistory(limit: number = 20): PushNotification[] {
  return pushHistory.slice(0, limit);
}

// Clear push queue
export function clearPushQueue(): void {
  pushQueue = [];
}

// Simulate automatic push based on business events
export function simulateBusinessEvent(event: BusinessEvent, entityId: string): AutoPushItem | null {
  const eventMessages: Record<BusinessEvent, { title: string; description: string; action: string; priority: 'critical' | 'high' | 'normal' }> = {
    new_lead: {
      title: 'New Lead Received',
      description: 'A new lead has been added to the system',
      action: 'Review Lead',
      priority: 'high',
    },
    lead_followup_pending: {
      title: 'Follow-up Required',
      description: 'A lead requires follow-up',
      action: 'Contact Lead',
      priority: 'high',
    },
    quotation_needed: {
      title: 'Quotation Needed',
      description: 'A quotation needs to be generated',
      action: 'Create Quote',
      priority: 'high',
    },
    approval_pending: {
      title: 'Approval Required',
      description: 'An item requires your approval',
      action: 'Approve',
      priority: 'critical',
    },
    invoice_ready: {
      title: 'Invoice Ready',
      description: 'An invoice is ready to be sent',
      action: 'Send Invoice',
      priority: 'high',
    },
    payment_received: {
      title: 'Payment Received',
      description: 'A payment has been received',
      action: 'View Payment',
      priority: 'normal',
    },
    payment_failed: {
      title: 'Payment Failed',
      description: 'A payment has failed',
      action: 'Investigate',
      priority: 'critical',
    },
    order_placed: {
      title: 'New Order',
      description: 'A new order has been placed',
      action: 'Process Order',
      priority: 'high',
    },
    order_shipped: {
      title: 'Order Shipped',
      description: 'An order has been shipped',
      action: 'Track Shipment',
      priority: 'normal',
    },
    inventory_low: {
      title: 'Low Inventory',
      description: 'Inventory is running low',
      action: 'Reorder',
      priority: 'high',
    },
    employee_absent: {
      title: 'Employee Absence',
      description: 'An employee has reported absence',
      action: 'Review',
      priority: 'normal',
    },
    payroll_due: {
      title: 'Payroll Due',
      description: 'Payroll processing is due',
      action: 'Process Payroll',
      priority: 'critical',
    },
    ticket_created: {
      title: 'Support Ticket',
      description: 'A new support ticket has been created',
      action: 'View Ticket',
      priority: 'high',
    },
    ticket_escalated: {
      title: 'Ticket Escalated',
      description: 'A ticket has been escalated',
      action: 'Handle Escalation',
      priority: 'critical',
    },
  };

  const message = eventMessages[event];
  if (!message) return null;

  return {
    id: `event-${event}-${entityId}-${Date.now()}`,
    type: 'alert',
    title: message.title,
    description: message.description,
    action: message.action,
    priority: message.priority,
    entityId,
    autoDismiss: event === 'payment_received' || event === 'order_shipped',
    dismissAfter: 10,
  };
}

// Initialize auto-push system
export function initializeAutoPush(): void {
  // Generate initial push items
  const items = generateAutoPushItems();
  items.forEach(item => pushToUser(item));
}

// Get next recommended action for user
export function getNextRecommendedAction(): AutoPushItem | null {
  const pending = getPendingPushItems();
  if (pending.length === 0) return null;
  
  // Return highest priority item
  const priorityOrder = ['critical', 'high', 'normal', 'low'];
  pending.sort((a, b) => {
    const priorityA = priorityOrder.indexOf(a.priority);
    const priorityB = priorityOrder.indexOf(b.priority);
    return priorityA - priorityB;
  });
  
  return pending[0];
}

// Check if user has pending items
export function hasPendingItems(): boolean {
  return getPendingPushItems().length > 0;
}

// Get pending count by priority
export function getPendingCount(): {
  critical: number;
  high: number;
  normal: number;
  low: number;
  total: number;
} {
  const pending = getPendingPushItems();
  
  return {
    critical: pending.filter(p => p.priority === 'critical').length,
    high: pending.filter(p => p.priority === 'high').length,
    normal: pending.filter(p => p.priority === 'normal').length,
    low: pending.filter(p => p.priority === 'low').length,
    total: pending.length,
  };
}
