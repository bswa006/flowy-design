import { useCallback } from "react";

import { MercuryFocusLevel } from "@/lib/mercury-utils";

export interface UseContextFocusReturn {
  getFocusLevel: (contextId: string) => MercuryFocusLevel;
}

export interface UseContextFocusProps {
  editingId: string | null;
}

export function useContextFocus({
  editingId,
}: UseContextFocusProps): UseContextFocusReturn {
  const getFocusLevel = useCallback(
    (contextId: string): MercuryFocusLevel => {
      if (editingId === contextId) return "focused";
      if (editingId && editingId !== contextId) return "fog";
      return "ambient";
    },
    [editingId]
  );

  return {
    getFocusLevel,
  };
}
