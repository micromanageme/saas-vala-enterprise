// @ts-nocheck
// Operational Focus State - Single-task execution mode with only relevant workflow visible
import type { OperationalJourney } from "./operational-journey";

export type FocusMode = 'focused' | 'expanded' | 'minimal';

export interface FocusState {
  journeyId: string | null;
  mode: FocusMode;
  visibleSections: string[];
  hiddenSections: string[];
  context: {
    entity: {
      type: string;
      id: string;
      name: string;
    } | null;
    workflowStep: number;
    relatedEntities: string[];
    nextAction: string;
  };
}

// Get focus state for a specific journey
export function getFocusState(journey: OperationalJourney): FocusState {
  const currentStep = journey.steps[journey.currentStep];
  
  return {
    journeyId: journey.id,
    mode: 'focused',
    visibleSections: [
      'current-task',
      'entity-context',
      'workflow-progress',
      'next-action',
    ],
    hiddenSections: [
      'other-workflows',
      'analytics',
      'secondary-tools',
      'navigation',
    ],
    context: {
      entity: journey.entity,
      workflowStep: journey.currentStep,
      relatedEntities: [journey.entity.id], // Would expand to related entities in real implementation
      nextAction: currentStep?.action || '',
    },
  };
}

// Get visible sections based on focus mode
export function getVisibleSections(mode: FocusMode): string[] {
  switch (mode) {
    case 'focused':
      return [
        'current-task',
        'entity-context',
        'workflow-progress',
        'next-action',
      ];
    case 'expanded':
      return [
        'current-task',
        'entity-context',
        'workflow-progress',
        'next-action',
        'related-items',
        'history',
      ];
    case 'minimal':
      return [
        'current-task',
        'next-action',
      ];
    default:
      return [];
  }
}

// Enter focus mode for a journey
export function enterFocusMode(journeyId: string): FocusState {
  // In a real implementation, this would load the journey
  // For now, return a placeholder
  return {
    journeyId,
    mode: 'focused',
    visibleSections: getVisibleSections('focused'),
    hiddenSections: [],
    context: {
      entity: null,
      workflowStep: 0,
      relatedEntities: [],
      nextAction: '',
    },
  };
}

// Exit focus mode
export function exitFocusMode(): FocusState {
  return {
    journeyId: null,
    mode: 'expanded',
    visibleSections: getVisibleSections('expanded'),
    hiddenSections: [],
    context: {
      entity: null,
      workflowStep: 0,
      relatedEntities: [],
      nextAction: '',
    },
  };
}

// Switch focus mode
export function switchFocusMode(mode: FocusMode): string[] {
  return getVisibleSections(mode);
}

// Check if currently in focus mode
export function isInFocusMode(state: FocusState): boolean {
  return state.journeyId !== null && state.mode === 'focused';
}

// Get focus mode label
export function getFocusModeLabel(mode: FocusMode): string {
  const labels = {
    focused: 'Focused Mode',
    expanded: 'Expanded View',
    minimal: 'Minimal View',
  };
  return labels[mode];
}

// Get focus mode description
export function getFocusModeDescription(mode: FocusMode): string {
  const descriptions = {
    focused: 'Single-task execution with only relevant workflow visible',
    expanded: 'Full context with related items and history',
    minimal: 'Essential information only for quick completion',
  };
  return descriptions[mode];
}

// Focus context sections
export interface FocusSection {
  id: string;
  title: string;
  content: any;
  priority: 'primary' | 'secondary' | 'tertiary';
}

// Get focus sections for current state
export function getFocusSections(state: FocusState): FocusSection[] {
  const sections: FocusSection[] = [];

  if (state.visibleSections.includes('current-task')) {
    sections.push({
      id: 'current-task',
      title: 'Current Task',
      content: null, // Would be populated with actual content
      priority: 'primary',
    });
  }

  if (state.visibleSections.includes('entity-context')) {
    sections.push({
      id: 'entity-context',
      title: 'Context',
      content: null,
      priority: 'primary',
    });
  }

  if (state.visibleSections.includes('workflow-progress')) {
    sections.push({
      id: 'workflow-progress',
      title: 'Progress',
      content: null,
      priority: 'secondary',
    });
  }

  if (state.visibleSections.includes('next-action')) {
    sections.push({
      id: 'next-action',
      title: 'Next Action',
      content: null,
      priority: 'primary',
    });
  }

  if (state.visibleSections.includes('related-items')) {
    sections.push({
      id: 'related-items',
      title: 'Related Items',
      content: null,
      priority: 'tertiary',
    });
  }

  if (state.visibleSections.includes('history')) {
    sections.push({
      id: 'history',
      title: 'History',
      content: null,
      priority: 'tertiary',
    });
  }

  // Sort by priority
  const priorityOrder = { primary: 0, secondary: 1, tertiary: 2 };
  sections.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return sections;
}

// Auto-enter focus mode for critical tasks
export function shouldAutoEnterFocus(journey: OperationalJourney): boolean {
  const currentStep = journey.steps[journey.currentStep];
  return currentStep?.priority === 'critical' || false;
}

// Get recommended focus mode based on task complexity
export function getRecommendedFocusMode(journey: OperationalJourney): FocusMode {
  const currentStep = journey.steps[journey.currentStep];
  
  if (currentStep?.priority === 'critical') {
    return 'focused';
  }
  
  if (journey.steps.length <= 3) {
    return 'minimal';
  }
  
  return 'expanded';
}

// Focus state persistence
const FOCUS_STATE_KEY = 'operational-focus-state';

export function saveFocusState(state: FocusState): void {
  try {
    localStorage.setItem(FOCUS_STATE_KEY, JSON.stringify(state));
  } catch (e) {
    // Ignore errors
  }
}

export function loadFocusState(): FocusState | null {
  try {
    const saved = localStorage.getItem(FOCUS_STATE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // Ignore errors
  }
  return null;
}

export function clearFocusState(): void {
  try {
    localStorage.removeItem(FOCUS_STATE_KEY);
  } catch (e) {
    // Ignore errors
  }
}