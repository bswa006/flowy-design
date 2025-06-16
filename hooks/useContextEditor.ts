import { Context } from "@/lib/contextMockData";
import { useCallback, useState } from "react";

export interface UseContextEditorReturn {
  editingId: string | null;
  expandedId: string | null;
  editedContext: Context | null;
  startEditing: (context: Context) => void;
  saveContext: (updatedContext: Context, onSave: (context: Context) => void) => void;
  cancelEditing: () => void;
  toggleInsights: (contextId: string) => void;
  updateEditedContext: (updates: Partial<Context>) => void;
  updateNestedField: (field: string, value: any, nested: string) => void;
}

export function useContextEditor(): UseContextEditorReturn {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editedContext, setEditedContext] = useState<Context | null>(null);

  const startEditing = useCallback((context: Context) => {
    setEditingId(context.id);
    setEditedContext(context);
    setExpandedId(null); // Close insights when editing
  }, []);

  const saveContext = useCallback((updatedContext: Context, onSave: (context: Context) => void) => {
    onSave(updatedContext);
    setEditingId(null);
    setEditedContext(null);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingId(null);
    setEditedContext(null);
  }, []);

  const toggleInsights = useCallback((contextId: string) => {
    if (editingId) return; // Don't toggle insights while editing
    setExpandedId(expandedId === contextId ? null : contextId);
  }, [editingId, expandedId]);

  const updateEditedContext = useCallback((updates: Partial<Context>) => {
    setEditedContext(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  const updateNestedField = useCallback((field: string, value: any, nested: string) => {
    setEditedContext(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [nested]: {
          ...(prev[nested as keyof Context] as any),
          [field]: value,
        },
      };
    });
  }, []);

  return {
    editingId,
    expandedId,
    editedContext,
    startEditing,
    saveContext,
    cancelEditing,
    toggleInsights,
    updateEditedContext,
    updateNestedField,
  };
} 