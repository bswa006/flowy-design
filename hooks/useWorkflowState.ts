import { useState, useCallback } from 'react';
import { Context } from '@/lib/contextMockData';

export function useWorkflowState(initialContexts: Context[]) {
  const [contexts, setContexts] = useState<Context[]>(initialContexts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const handleEdit = useCallback((contextId: string) => {
    setEditingId(contextId);
    setExpandedIds(new Set()); // Close all insights when editing
  }, []);

  const handleSave = useCallback((updatedContext: Context) => {
    setContexts((prev) =>
      prev.map((ctx) => (ctx.id === updatedContext.id ? updatedContext : ctx))
    );
    setEditingId(null);
  }, []);

  const handleCancel = useCallback(() => {
    setEditingId(null);
  }, []);

  const handleToggleInsights = useCallback((contextId: string) => {
    if (editingId) return; // Don't toggle insights while editing
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(contextId)) {
        newSet.delete(contextId);
      } else {
        newSet.add(contextId);
      }
      return newSet;
    });
  }, [editingId]);

  const getFocusLevel = useCallback((contextId: string): 'focused' | 'ambient' | 'fog' => {
    if (editingId === contextId) return 'focused';
    if (editingId && editingId !== contextId) return 'fog';
    if (expandedIds.has(contextId)) return 'focused';
    return 'ambient';
  }, [editingId, expandedIds]);

  return {
    contexts,
    editingId,
    expandedIds,
    handleEdit,
    handleSave,
    handleCancel,
    handleToggleInsights,
    getFocusLevel,
  };
}

