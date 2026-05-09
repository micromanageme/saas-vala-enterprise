// @ts-nocheck
// User Level Adapter - Design for all user levels
export type UserLevel = 'beginner' | 'operator' | 'executive';

export interface UserLevelConfig {
  id: UserLevel;
  name: string;
  description: string;
  uiComplexity: 'minimal' | 'balanced' | 'advanced';
  features: {
    showAdvancedMetrics: boolean;
    showWorkflowDetails: boolean;
    showSystemSettings: boolean;
    showDebugInfo: boolean;
    showGuidance: boolean;
    showShortcuts: boolean;
  };
  defaultView: 'simple' | 'detailed' | 'executive';
  helpLevel: 'extensive' | 'moderate' | 'minimal';
}

export const userLevelConfigs: Record<UserLevel, UserLevelConfig> = {
  beginner: {
    id: 'beginner',
    name: 'Beginner',
    description: 'New users learning the system',
    uiComplexity: 'minimal',
    features: {
      showAdvancedMetrics: false,
      showWorkflowDetails: false,
      showSystemSettings: false,
      showDebugInfo: false,
      showGuidance: true,
      showShortcuts: false,
    },
    defaultView: 'simple',
    helpLevel: 'extensive',
  },
  operator: {
    id: 'operator',
    name: 'Operator',
    description: 'Daily users executing operations',
    uiComplexity: 'balanced',
    features: {
      showAdvancedMetrics: true,
      showWorkflowDetails: true,
      showSystemSettings: false,
      showDebugInfo: false,
      showGuidance: true,
      showShortcuts: true,
    },
    defaultView: 'detailed',
    helpLevel: 'moderate',
  },
  executive: {
    id: 'executive',
    name: 'Executive',
    description: 'Leaders needing strategic overview',
    uiComplexity: 'advanced',
    features: {
      showAdvancedMetrics: true,
      showWorkflowDetails: true,
      showSystemSettings: true,
      showDebugInfo: false,
      showGuidance: true,
      showShortcuts: true,
    },
    defaultView: 'executive',
    helpLevel: 'minimal',
  },
};

// Detect user level based on behavior
export function detectUserLevel(behavior: {
  daysActive: number;
  operationsCompleted: number;
  featuresUsed: string[];
  averageSessionTime: number;
}): UserLevel {
  // New user
  if (behavior.daysActive < 3) {
    return 'beginner';
  }

  // Executive - strategic use, less frequency
  if (
    behavior.daysActive >= 30 &&
    behavior.averageSessionTime < 15 &&
    behavior.featuresUsed.includes('analytics')
  ) {
    return 'executive';
  }

  // Operator - frequent use, operational features
  if (
    behavior.operationsCompleted >= 50 &&
    behavior.featuresUsed.some(f => ['sell', 'pay', 'ship', 'hire'].includes(f))
  ) {
    return 'operator';
  }

  // Default to operator for active users
  if (behavior.daysActive >= 7) {
    return 'operator';
  }

  return 'beginner';
}

// Get UI adaptations for user level
export function getUIAdaptations(userLevel: UserLevel) {
  const config = userLevelConfigs[userLevel];

  return {
    // What to show/hide
    showAdvancedMetrics: config.features.showAdvancedMetrics,
    showWorkflowDetails: config.features.showWorkflowDetails,
    showSystemSettings: config.features.showSystemSettings,
    showDebugInfo: config.features.showDebugInfo,
    showGuidance: config.features.showGuidance,
    showShortcuts: config.features.showShortcuts,

    // How to present information
    defaultView: config.defaultView,
    helpLevel: config.helpLevel,
    uiComplexity: config.uiComplexity,

    // Action recommendations
    primaryActionCount: userLevel === 'beginner' ? 1 : 3,
    secondaryActionCount: userLevel === 'beginner' ? 2 : 5,
    showTooltips: userLevel === 'beginner',
    showWalkthroughs: userLevel === 'beginner',
    showKeyboardShortcuts: userLevel !== 'beginner',
    showQuickActions: userLevel !== 'beginner',
  };
}

// Adapt content for user level
export function adaptContentForLevel<T>(
  content: {
    simple: T;
    detailed: T;
    executive: T;
  },
  userLevel: UserLevel
): T {
  const config = userLevelConfigs[userLevel];

  switch (config.defaultView) {
    case 'simple':
      return content.simple;
    case 'detailed':
      return content.detailed;
    case 'executive':
      return content.executive;
    default:
      return content.detailed;
  }
}

// Get help text for user level
export function getHelpText(userLevel: UserLevel, context: string): string {
  const config = userLevelConfigs[userLevel];

  if (config.helpLevel === 'extensive') {
    return `Here's how to ${context}: Step-by-step guidance will appear here. Click "Show me how" for a walkthrough.`;
  }

  if (config.helpLevel === 'moderate') {
    return `${context}: Use the action buttons below or press ⌘K for quick access.`;
  }

  return `${context}`;
}

// Get feature visibility
export function getFeatureVisibility(userLevel: UserLevel, feature: keyof UserLevelConfig['features']): boolean {
  return userLevelConfigs[userLevel].features[feature];
}

// Adapt action buttons for user level
export function adaptActionsForLevel<T>(
  actions: T[],
  userLevel: UserLevel,
  maxPrimary?: number,
  maxSecondary?: number
): {
  primary: T[];
  secondary: T[];
} {
  const config = userLevelConfigs[userLevel];
  const primaryCount = maxPrimary || config.primaryActionCount;
  const secondaryCount = maxSecondary || config.secondaryActionCount;

  return {
    primary: actions.slice(0, primaryCount),
    secondary: actions.slice(primaryCount, primaryCount + secondaryCount),
  };
}

// Get dashboard layout for user level
export function getDashboardLayout(userLevel: UserLevel) {
  const config = userLevelConfigs[userLevel];

  switch (config.defaultView) {
    case 'simple':
      return {
        sections: ['nextAction', 'performance'],
        showKPIs: false,
        showDetails: false,
        maxCards: 4,
      };
    case 'detailed':
      return {
        sections: ['nextAction', 'performance', 'operations'],
        showKPIs: true,
        showDetails: true,
        maxCards: 8,
      };
    case 'executive':
      return {
        sections: ['health', 'performance', 'trends'],
        showKPIs: true,
        showDetails: false,
        maxCards: 6,
      };
    default:
      return {
        sections: ['nextAction', 'performance', 'operations'],
        showKPIs: true,
        showDetails: true,
        maxCards: 8,
      };
  }
}

// Track user behavior for level detection
export interface UserBehaviorTracker {
  recordOperation(operation: string): void;
  recordFeatureUse(feature: string): void;
  recordSession(duration: number): void;
  getUserLevel(): UserLevel;
  getBehavior(): {
    daysActive: number;
    operationsCompleted: number;
    featuresUsed: string[];
    averageSessionTime: number;
  };
}

export function createUserBehaviorTracker(): UserBehaviorTracker {
  const STORAGE_KEY = 'user-behavior';

  const getBehavior = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // Ignore errors
    }
    
    return {
      firstSeen: new Date().toISOString(),
      daysActive: 0,
      operationsCompleted: 0,
      featuresUsed: [] as string[],
      sessions: [] as Array<{ date: string; duration: number }>,
    };
  };

  const saveBehavior = (behavior: any) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(behavior));
    } catch (e) {
      // Ignore errors
    }
  };

  const recordOperation = (operation: string) => {
    const behavior = getBehavior();
    behavior.operationsCompleted += 1;
    if (!behavior.featuresUsed.includes(operation)) {
      behavior.featuresUsed.push(operation);
    }
    saveBehavior(behavior);
  };

  const recordFeatureUse = (feature: string) => {
    const behavior = getBehavior();
    if (!behavior.featuresUsed.includes(feature)) {
      behavior.featuresUsed.push(feature);
    }
    saveBehavior(behavior);
  };

  const recordSession = (duration: number) => {
    const behavior = getBehavior();
    const today = new Date().toDateString();
    
    // Check if this is a new day
    const lastSession = behavior.sessions[behavior.sessions.length - 1];
    if (lastSession && lastSession.date !== today) {
      behavior.daysActive += 1;
    }
    
    behavior.sessions.push({ date: today, duration });
    saveBehavior(behavior);
  };

  const getUserLevel = () => {
    const behavior = getBehavior();
    
    const firstSeen = new Date(behavior.firstSeen);
    const now = new Date();
    const daysSinceFirstSeen = Math.floor((now.getTime() - firstSeen.getTime()) / (1000 * 60 * 60 * 24));
    
    const averageSessionTime = behavior.sessions.length > 0
      ? behavior.sessions.reduce((sum: number, s: any) => sum + s.duration, 0) / behavior.sessions.length
      : 0;

    return detectUserLevel({
      daysActive: behavior.daysActive,
      operationsCompleted: behavior.operationsCompleted,
      featuresUsed: behavior.featuresUsed,
      averageSessionTime,
    });
  };

  const getBehaviorData = () => {
    const behavior = getBehavior();
    const averageSessionTime = behavior.sessions.length > 0
      ? behavior.sessions.reduce((sum: number, s: any) => sum + s.duration, 0) / behavior.sessions.length
      : 0;

    return {
      daysActive: behavior.daysActive,
      operationsCompleted: behavior.operationsCompleted,
      featuresUsed: behavior.featuresUsed,
      averageSessionTime,
    };
  };

  return {
    recordOperation,
    recordFeatureUse,
    recordSession,
    getUserLevel,
    getBehavior: getBehaviorData,
  };
}