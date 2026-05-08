import { createContext, useContext, useState, ReactNode } from "react";

export type ViewMode = 'executive' | 'operator';

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>('operator');

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'executive' ? 'operator' : 'executive');
  };

  return (
    <ViewModeContext.Provider value={{ viewMode, setViewMode, toggleViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
}

// Helper to determine if executive features should be shown
export function shouldShowExecutiveFeatures(viewMode: ViewMode, userRoles: string[]): boolean {
  return viewMode === 'executive' && userRoles.some(r => ['admin', 'super_admin', 'executive'].includes(r));
}

// Helper to determine if operator features should be shown
export function shouldShowOperatorFeatures(viewMode: ViewMode): boolean {
  return viewMode === 'operator';
}
