/**
 * SaaS Vala Enterprise - Unsaved Changes Navigation Guard
 * Prevents data loss by warning users before navigation when form has unsaved changes
 */

import { useEffect, useState, useCallback } from "react";

interface UseUnsavedChangesOptions {
  hasUnsavedChanges: boolean;
  message?: string;
}

export function useUnsavedChanges({ hasUnsavedChanges, message = "You have unsaved changes. Are you sure you want to leave?" }: UseUnsavedChangesOptions) {
  const [shouldBlock, setShouldBlock] = useState(false);

  useEffect(() => {
    setShouldBlock(hasUnsavedChanges);
  }, [hasUnsavedChanges]);

  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    if (shouldBlock) {
      e.preventDefault();
      e.returnValue = message;
      return message;
    }
  }, [shouldBlock, message]);

  useEffect(() => {
    if (shouldBlock) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }
  }, [shouldBlock, handleBeforeUnload]);

  return {
    setHasUnsavedChanges: (value: boolean) => setShouldBlock(value),
  };
}
