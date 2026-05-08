// Operational Time Context - Temporal awareness for operations
export type TimeContext = 'today' | 'pending_now' | 'overdue' | 'upcoming' | 'realtime';

export interface TimeContextItem {
  id: string;
  context: TimeContext;
  label: string;
  description: string;
  urgency: 'critical' | 'high' | 'normal' | 'low';
  timestamp: string;
  operation: string;
}

export interface TimeContextSummary {
  today: {
    count: number;
    items: TimeContextItem[];
  };
  pendingNow: {
    count: number;
    items: TimeContextItem[];
  };
  overdue: {
    count: number;
    items: TimeContextItem[];
  };
  upcoming: {
    count: number;
    items: TimeContextItem[];
  };
  realtime: {
    count: number;
    items: TimeContextItem[];
  };
}

// Classify an item into its time context
export function classifyTimeContext(
  item: { dueDate?: string; createdAt: string; isUrgent?: boolean }
): TimeContext {
  const now = new Date();
  const dueDate = item.dueDate ? new Date(item.dueDate) : null;
  const createdAt = new Date(item.createdAt);
  
  // Realtime - happening right now
  if (item.isUrgent) {
    return 'realtime';
  }
  
  // Overdue
  if (dueDate && dueDate < now) {
    return 'overdue';
  }
  
  // Pending now - due within 24 hours
  if (dueDate) {
    const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursUntilDue <= 24 && hoursUntilDue > 0) {
      return 'pending_now';
    }
  }
  
  // Upcoming - due within next 7 days
  if (dueDate) {
    const daysUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (daysUntilDue <= 7 && daysUntilDue > 1) {
      return 'upcoming';
    }
  }
  
  // Today - created or due today
  const isToday = 
    createdAt.toDateString() === now.toDateString() ||
    (dueDate && dueDate.toDateString() === now.toDateString());
  
  if (isToday) {
    return 'today';
  }
  
  return 'today';
}

// Get time context label
export function getTimeContextLabel(context: TimeContext): string {
  const labels = {
    today: 'Today',
    pending_now: 'Pending Now',
    overdue: 'Overdue',
    upcoming: 'Upcoming',
    realtime: 'Realtime',
  };
  return labels[context];
}

// Get time context color
export function getTimeContextColor(context: TimeContext): string {
  const colors = {
    today: 'oklch(0.6 0.18 145)',
    pending_now: 'oklch(0.7 0.18 45)',
    overdue: 'oklch(0.6 0.18 15)',
    upcoming: 'oklch(0.65 0.15 200)',
    realtime: 'oklch(0.6 0.2 10)',
  };
  return colors[context];
}

// Get time context urgency
export function getTimeContextUrgency(context: TimeContext): 'critical' | 'high' | 'normal' | 'low' {
  const urgencyMap = {
    realtime: 'critical',
    overdue: 'critical',
    pending_now: 'high',
    today: 'normal',
    upcoming: 'low',
  };
  return urgencyMap[context];
}

// Sort items by time context priority
export function sortByTimeContextPriority(items: TimeContextItem[]): TimeContextItem[] {
  const priorityOrder: TimeContext[] = ['realtime', 'overdue', 'pending_now', 'today', 'upcoming'];
  
  return items.sort((a, b) => {
    const priorityA = priorityOrder.indexOf(a.context);
    const priorityB = priorityOrder.indexOf(b.context);
    
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    
    // Same priority, sort by timestamp
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });
}

// Get time context summary for operations
export function getTimeContextSummary(items: TimeContextItem[]): TimeContextSummary {
  const summary: TimeContextSummary = {
    today: { count: 0, items: [] },
    pendingNow: { count: 0, items: [] },
    overdue: { count: 0, items: [] },
    upcoming: { count: 0, items: [] },
    realtime: { count: 0, items: [] },
  };
  
  items.forEach(item => {
    switch (item.context) {
      case 'today':
        summary.today.count++;
        summary.today.items.push(item);
        break;
      case 'pending_now':
        summary.pendingNow.count++;
        summary.pendingNow.items.push(item);
        break;
      case 'overdue':
        summary.overdue.count++;
        summary.overdue.items.push(item);
        break;
      case 'upcoming':
        summary.upcoming.count++;
        summary.upcoming.items.push(item);
        break;
      case 'realtime':
        summary.realtime.count++;
        summary.realtime.items.push(item);
        break;
    }
  });
  
  return summary;
}

// Get most urgent time context
export function getMostUrgentContext(summary: TimeContextSummary): TimeContext | null {
  if (summary.realtime.count > 0) return 'realtime';
  if (summary.overdue.count > 0) return 'overdue';
  if (summary.pendingNow.count > 0) return 'pending_now';
  if (summary.today.count > 0) return 'today';
  if (summary.upcoming.count > 0) return 'upcoming';
  return null;
}

// Get relative time string
export function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// Get time until due string
export function getTimeUntilDue(dueDate: string): string {
  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due.getTime() - now.getTime();
  
  if (diffMs < 0) {
    const diffMins = Math.floor(Math.abs(diffMs) / 60000);
    const diffHours = Math.floor(Math.abs(diffMs) / 3600000);
    const diffDays = Math.floor(Math.abs(diffMs) / 86400000);
    
    if (diffMins < 60) return `${diffMins}m overdue`;
    if (diffHours < 24) return `${diffHours}h overdue`;
    return `${diffDays}d overdue`;
  }
  
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) return `Due in ${diffMins}m`;
  if (diffHours < 24) return `Due in ${diffHours}h`;
  if (diffDays < 7) return `Due in ${diffDays}d`;
  return `Due ${due.toLocaleDateString()}`;
}
