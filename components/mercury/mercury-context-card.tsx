"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Context } from "@/lib/contextMockData";
import { cn } from "@/lib/utils";
import { getMercuryFocusClasses, getMercuryAnimationClasses, MERCURY_EASING, MERCURY_DURATIONS, MercuryFocusLevel } from "@/lib/mercury-utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  CircleCheck,
  Edit,
  Save,
  X
} from "lucide-react";
import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MercuryEditableField } from "./mercury-editable-field";
import { MercuryWYSIWYGEditor } from "./mercury-wysiwyg-editor";

interface MercuryContextCardProps {
  intent: string; // Required Mercury prop
  context: Context;
  index: number;
  isEditing: boolean;
  isExpanded: boolean;
  focusLevel: MercuryFocusLevel;
  onEdit: () => void;
  onSave: (updatedContext: Context) => void;
  onCancel: () => void;
  onToggleInsights: () => void;
}

const INSIGHT_STYLES = {
  keyPainPoint: {
    label: "Key Pain Point",
    pillClass: "bg-orange-400",
  },
  desiredFeature: {
    label: "Desired Feature",
    pillClass: "bg-emerald-800",
  },
} as const;

export function MercuryContextCard({
  intent,
  context,
  index,
  isEditing,
  isExpanded,
  focusLevel,
  onEdit,
  onSave,
  onCancel,
  onToggleInsights,
}: MercuryContextCardProps) {
  const [editedContext, setEditedContext] = useState<Context>(context);

  // Update local state when context changes
  useEffect(() => {
    setEditedContext(context);
  }, [context]);

  const updateField = useCallback((field: string, value: any, nested?: string) => {
    setEditedContext((prev) => {
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
  }, []);

  const handleSave = useCallback(() => {
    onSave(editedContext);
  }, [editedContext, onSave]);

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  }, [onEdit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isEditing) {
        onToggleInsights();
      }
    }
    if (e.key === 'Escape' && isEditing) {
      onCancel();
    }
  }, [isEditing, onToggleInsights, onCancel]);

  // Memoize focus classes for performance
  const focusClasses = useMemo(() => getMercuryFocusClasses(focusLevel), [focusLevel]);

  // Memoize formatted date
  const formattedDate = useMemo(() => 
    new Date(context.upload.recorded_on).toLocaleDateString(), 
    [context.upload.recorded_on]
  );



  return (
    <motion.div
      data-intent={intent}
      className={cn(
        "mercury-module relative group flex",
        getMercuryAnimationClasses(true)
      )}
      role="region"
      aria-label={`${intent} context card ${index + 1}`}
      layout
      transition={{ duration: MERCURY_DURATIONS.slowest, ease: MERCURY_EASING }}
    >
      {/* Main card */}
      <motion.div
        className="relative"
        layout
        transition={{ duration: MERCURY_DURATIONS.slowest, ease: MERCURY_EASING }}
      >
        {/* Number badge */}
        <div 
          className="absolute -top-4 -left-4 w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-semibold text-base border border-gray-200 shadow-sm z-10"
          aria-label={`Context ${index + 1}`}
        >
          {index + 1}
        </div>

        {/* Card content */}
        <motion.div
          className={cn(
            "max-w-lg mx-auto bg-white rounded-2xl shadow-md border border-gray-100 relative transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
            focusClasses,
            !isEditing && "cursor-pointer hover:shadow-lg"
          )}
          layout
          style={{
            height: isEditing ? "80vh" : "auto",
            minHeight: isEditing ? "auto" : "220px",
            width: isEditing ? "600px" : "400px",
            overflow: isEditing ? "hidden" : "visible",
          }}
          animate={{
            width: isEditing ? 600 : 400,
          }}
          transition={{ duration: MERCURY_DURATIONS.slowest, ease: MERCURY_EASING }}
          onClick={!isEditing ? (e) => {
            e.stopPropagation();
            onToggleInsights();
          } : undefined}
          onKeyDown={handleKeyDown}
          tabIndex={focusLevel !== "fog" ? 0 : -1}
          role="button"
          aria-expanded={isExpanded}
          aria-label={`Context: ${context.upload.file_name}. ${isExpanded ? 'Collapse' : 'Expand'} insights`}
        >
          {/* Edit/Save buttons */}
          <AnimatePresence>
            {!isEditing && focusLevel !== "fog" && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleEditClick}
                className="absolute top-4 right-4 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors opacity-0 group-hover:opacity-100 z-20 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
                title="Edit context"
                aria-label="Edit context"
              >
                <Edit className="w-4 h-4" />
              </motion.button>
            )}

            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-4 right-4 flex space-x-2 z-20"
                role="group"
                aria-label="Edit actions"
              >
                <button
                  onClick={handleSave}
                  className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                  title="Save changes"
                  aria-label="Save changes"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={onCancel}
                  className="w-8 h-8 bg-slate-400 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500/40"
                  title="Cancel editing"
                  aria-label="Cancel editing"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`${isEditing ? "h-full flex flex-col" : "p-8"}`}>
            {!isEditing ? (
              /* Compact View */
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-gray-500 font-medium truncate">
                    {context.upload.original_name}
                  </div>
                  <div className="text-xs text-gray-400 font-medium">
                    {formattedDate}
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900 mb-1 truncate">
                  {context.upload.file_name}
                </div>
                <div className="text-base text-gray-700 mb-2 truncate">
                  {context.upload.description}
                </div>
                <div className="text-gray-700 text-base leading-relaxed mb-4 line-clamp-4">
                  {context.upload.summary}
                </div>
                {context.upload.is_checkpoint && (
                  <div className="flex items-center gap-2 mt-2">
                    <CircleCheck className="w-5 h-5 text-emerald-700" />
                    <span className="text-emerald-700 font-semibold text-sm">
                      Checkpoint
                    </span>
                  </div>
                )}
              </div>
            ) : (
              /* Expanded Edit View with Scrollable Content */
              <>
                {/* Fixed Header */}
                <div className="p-6 pb-4 border-b border-slate-200/60">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
                    <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                    <span>Edit Context</span>
                  </h3>
                </div>

                {/* Scrollable Content */}
                <motion.div
                  className="flex-1 overflow-y-auto p-6 space-y-6 mercury-scroll"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#cbd5e1 #f1f5f9",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: MERCURY_DURATIONS.slow, delay: 0.2 }}
                >
                  <div className="grid grid-cols-2 gap-6">
                    <MercuryEditableField
                      intent={`${intent}-file-name`}
                      label="File Name"
                      value={editedContext.upload.file_name}
                      onChange={(value) => updateField("file_name", value, "upload")}
                    />
                    <MercuryEditableField
                      intent={`${intent}-priority`}
                      label="Priority Score (0-100)"
                      type="number"
                      min={0}
                      max={100}
                      value={editedContext.priority_score.toString()}
                      onChange={(value) => updateField("priority_score", parseInt(value) || 0)}
                    />
                  </div>

                  <MercuryEditableField
                    intent={`${intent}-original-name`}
                    label="Original Name"
                    value={editedContext.upload.original_name}
                    onChange={(value) => updateField("original_name", value, "upload")}
                  />

                  <MercuryEditableField
                    intent={`${intent}-description`}
                    label="Description"
                    type="textarea"
                    rows={2}
                    value={editedContext.upload.description}
                    onChange={(value) => updateField("description", value, "upload")}
                  />

                  <MercuryEditableField
                    intent={`${intent}-upload-summary`}
                    label="Upload Summary"
                    type="textarea"
                    rows={3}
                    value={editedContext.upload.summary}
                    onChange={(value) => updateField("summary", value, "upload")}
                  />

                  <MercuryEditableField
                    intent={`${intent}-main-summary`}
                    label="Main Summary"
                    type="textarea"
                    rows={3}
                    value={editedContext.summary}
                    onChange={(value) => updateField("summary", value)}
                  />

                  <div className="mercury-field-group">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Text Content
                    </label>
                    <MercuryWYSIWYGEditor
                      intent={`${intent}-text-content`}
                      value={editedContext.text_content}
                      onChange={(value) => updateField("text_content", value)}
                      placeholder="Enter the main text content..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <MercuryEditableField
                      intent={`${intent}-tags`}
                      label="Tags (comma-separated)"
                      value={editedContext.tags?.join(", ") || ""}
                      onChange={(value) =>
                        updateField(
                          "tags",
                          value
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter(Boolean)
                        )
                      }
                      placeholder="tag1, tag2, tag3"
                    />
                    <MercuryEditableField
                      intent={`${intent}-participants`}
                      label="Participants (comma-separated)"
                      value={editedContext.upload.participants?.join(", ") || ""}
                      onChange={(value) =>
                        updateField(
                          "participants",
                          value
                            .split(",")
                            .map((p) => p.trim())
                            .filter(Boolean),
                          "upload"
                        )
                      }
                      placeholder="Person 1, Person 2, Person 3"
                    />
                  </div>

                  <motion.div
                    className="flex items-center space-x-6 pt-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: MERCURY_DURATIONS.normal, delay: 0.4 }}
                  >
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editedContext.is_checkpoint}
                        onChange={(e) => updateField("is_checkpoint", e.target.checked)}
                        className="w-4 h-4 rounded border-2 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/40"
                        aria-describedby="checkpoint-help"
                      />
                      <span className="text-sm font-semibold text-slate-700">
                        Is Checkpoint
                      </span>
                      <span id="checkpoint-help" className="sr-only">
                        Mark this context as a checkpoint
                      </span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editedContext.is_invalidated}
                        onChange={(e) => updateField("is_invalidated", e.target.checked)}
                        className="w-4 h-4 rounded border-2 border-slate-300 text-red-600 focus:ring-2 focus:ring-red-500/40"
                        aria-describedby="invalidated-help"
                      />
                      <span className="text-sm font-semibold text-slate-700">
                        Is Invalidated
                      </span>
                      <span id="invalidated-help" className="sr-only">
                        Mark this context as invalidated
                      </span>
                    </label>
                  </motion.div>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
} 