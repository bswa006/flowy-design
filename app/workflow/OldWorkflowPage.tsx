"use client";

import * as React from "react";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Context, initialContexts } from "@/lib/contextMockData";
import { MainCard } from "./MainCard";
import { EditableCard } from "./EditableCard";

declare global {
  interface Window {
    mercurySpaceDepth?: number;
  }
}

export default function OldWorkflowPage() {
  const [contexts, setContexts] = useState<Context[]>(initialContexts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editedContext, setEditedContext] = useState<Context | null>(null);

  const handleEdit = (contextId: string) => {
    setEditingId(contextId);
    setExpandedId(null);
    const ctx = contexts.find((c) => c.id === contextId);
    setEditedContext(ctx ? { ...ctx } : null);
  };

  const handleSave = (updatedContext: Context) => {
    setContexts((prev) =>
      prev.map((ctx) => (ctx.id === updatedContext.id ? updatedContext : ctx))
    );
    setEditingId(null);
    setEditedContext(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedContext(null);
  };

  const handleToggleInsights = (contextId: string) => {
    if (editingId) return;
    setExpandedId(expandedId === contextId ? null : contextId);
  };

  const getFocusLevel = (contextId: string): "focused" | "ambient" | "fog" => {
    if (editingId === contextId) return "focused";
    if (editingId && editingId !== contextId) return "fog";
    return "ambient";
  };

  const handleFieldChange = (
    field: string,
    value: string | number | boolean | string[],
    nested?: string
  ) => {
    setEditedContext((prev) => {
      if (!prev) return prev;
      if (nested) {
        return {
          ...prev,
          [nested]: {
            ...(prev[nested as keyof Context] as any),
            [field]: value,
          },
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  return (
    <div className="h-full">
      <header className="h-16 bg-gray-300 px-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Context</h1>
      </header>
      <div className="relative h-full overflow-y-auto">
        <div className="space-y-8 p-12">
          <AnimatePresence>
            {contexts.map((context, idx) =>
              editingId === context.id && editedContext ? (
                <EditableCard
                  key={context.id}
                  editedContext={editedContext}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  onFieldChange={handleFieldChange}
                />
              ) : (
                <MainCard
                  key={context.id}
                  context={context}
                  index={idx}
                  focusLevel={getFocusLevel(context.id)}
                  onEdit={() => handleEdit(context.id)}
                  onToggleInsights={() => handleToggleInsights(context.id)}
                  isExpanded={expandedId === context.id}
                />
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
