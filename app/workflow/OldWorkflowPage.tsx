"use client";

import * as React from "react";
import {
  CircleCheck,
  Edit,
  X,
  Save,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Context, initialContexts } from "@/lib/contextMockData";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/mercury/mercury-dashboard-card";

declare global {
  interface Window {
    mercurySpaceDepth?: number;
  }
}

interface WYSIWYGEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function WYSIWYGEditor({ value, onChange, placeholder }: WYSIWYGEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML;
    onChange(newContent);
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput({ currentTarget: editorRef.current } as any);
  };

  const ToolbarButton = ({
    onClick,
    icon: Icon,
    title,
    isActive = false,
  }: {
    onClick: () => void;
    icon: any;
    title: string;
    isActive?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-all duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-105 active:scale-95 ${
        isActive
          ? "bg-blue-500 text-white shadow-md"
          : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-800"
      }`}
    >
      <Icon className="w-3 h-3" />
    </button>
  );

  return (
    <div className="mercury-wysiwyg-editor bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-xl overflow-hidden">
      {/* Compact Mercury Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-transparent">
        <div className="flex items-center space-x-1">
          {/* Text Formatting */}
          <div className="flex items-center space-x-1">
            <ToolbarButton
              onClick={() => execCommand("bold")}
              icon={Bold}
              title="Bold"
            />
            <ToolbarButton
              onClick={() => execCommand("italic")}
              icon={Italic}
              title="Italic"
            />
            <ToolbarButton
              onClick={() => execCommand("underline")}
              icon={Underline}
              title="Underline"
            />
          </div>

          <div className="w-px h-4 bg-slate-300 mx-2" />

          {/* Lists */}
          <div className="flex items-center space-x-1">
            <ToolbarButton
              onClick={() => execCommand("insertUnorderedList")}
              icon={List}
              title="Bullet List"
            />
            <ToolbarButton
              onClick={() => execCommand("insertOrderedList")}
              icon={ListOrdered}
              title="Numbered List"
            />
          </div>
        </div>

        {/* Clear Formatting */}
        <ToolbarButton
          onClick={() => execCommand("removeFormat")}
          icon={RotateCcw}
          title="Clear Formatting"
        />
      </div>

      {/* Editor Content */}
      <div
        ref={editorRef}
        contentEditable
        className={`min-h-32 p-4 focus:outline-none text-slate-800 leading-relaxed ${
          isFocused ? "bg-white/90" : "bg-white/60"
        } transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]`}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        suppressContentEditableWarning={true}
        style={{
          fontSize: "14px",
          lineHeight: "1.5",
        }}
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
}

// Mercury Editable Field Component
interface EditableFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "textarea" | "number";
  rows?: number;
  placeholder?: string;
  min?: number;
  max?: number;
}

function EditableField({
  label,
  value,
  onChange,
  type = "text",
  rows = 3,
  placeholder,
  min,
  max,
}: EditableFieldProps) {
  return (
    <motion.div
      className="mercury-field-group"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="w-full p-3 bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/60 transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:bg-white/80 text-slate-800 font-medium resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          className="w-full p-3 bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/60 transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:bg-white/80 text-slate-800 font-medium"
        />
      )}
    </motion.div>
  );
}

// Mercury Editable Card Component
interface MercuryContextCardProps {
  context: Context;
  index: number;
  isEditing: boolean;
  isExpanded: boolean;
  focusLevel: "focused" | "ambient" | "fog";
  onEdit: () => void;
  onSave: (updatedContext: Context) => void;
  onCancel: () => void;
  onToggleInsights: () => void;
}

const INSIGHT_STYLES = {
  keyPainPoint: {
    label: "Key Pain Point",
    pillClass: "bg-orange-400",
    // borderClass: "border-emerald-100",
  },
  desiredFeature: {
    label: "Desired Feature",
    pillClass: "bg-emerald-800",
    // borderClass: "border-blue-100",
  },
};

function MercuryContextCard({
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

  const updateField = (field: string, value: any, nested?: string) => {
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
  };

  const handleSave = () => {
    onSave(editedContext);
  };

  // Mercury focus classes
  const getFocusClasses = () => {
    switch (focusLevel) {
      case "focused":
        return "scale-[1.02] z-30 opacity-100 shadow-2xl shadow-blue-500/20 ring-1 ring-blue-300/40";
      case "ambient":
        return "scale-100 z-10 opacity-90";
      case "fog":
        return "scale-[0.98] z-0 opacity-40 pointer-events-none blur-[0.5px]";
    }
  };

  return (
    <motion.div
      className="relative group flex"
      layout
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Main card */}
      <motion.div
        className="relative"
        layout
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Number badge */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-semibold text-base border border-gray-200 shadow-sm z-10">
          {index + 1}
        </div>

        {/* Card content */}
        <motion.div
          className={`max-w-lg mx-auto bg-white rounded-2xl shadow-md border border-gray-100 relative transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${getFocusClasses()} ${
            !isEditing ? "cursor-pointer hover:shadow-lg" : ""
          }`}
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
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Edit/Save buttons */}
          <AnimatePresence>
            {!isEditing && focusLevel !== "fog" && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="absolute top-4 right-4 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors opacity-0 group-hover:opacity-100 z-20"
                title="Edit"
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
              >
                <button
                  onClick={handleSave}
                  className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-colors"
                  title="Save"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={onCancel}
                  className="w-8 h-8 bg-slate-400 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-500 transition-colors"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`${isEditing ? "h-full flex flex-col" : "p-8"}`}>
            {!isEditing ? (
              /* Compact View */
              <div onClick={onToggleInsights}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-gray-500 font-medium truncate">
                    {context.upload.original_name}
                  </div>
                  <div className="text-xs text-gray-400 font-medium">
                    {new Date(context.upload.recorded_on).toLocaleDateString()}
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
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="grid grid-cols-2 gap-6">
                    <EditableField
                      label="File Name"
                      value={editedContext.upload.file_name}
                      onChange={(value) =>
                        updateField("file_name", value, "upload")
                      }
                    />
                    <EditableField
                      label="Priority Score (0-100)"
                      type="number"
                      min={0}
                      max={100}
                      value={editedContext.priority_score.toString()}
                      onChange={(value) =>
                        updateField("priority_score", parseInt(value) || 0)
                      }
                    />
                  </div>

                  <EditableField
                    label="Original Name"
                    value={editedContext.upload.original_name}
                    onChange={(value) =>
                      updateField("original_name", value, "upload")
                    }
                  />

                  <EditableField
                    label="Description"
                    type="textarea"
                    rows={2}
                    value={editedContext.upload.description}
                    onChange={(value) =>
                      updateField("description", value, "upload")
                    }
                  />

                  <EditableField
                    label="Upload Summary"
                    type="textarea"
                    rows={3}
                    value={editedContext.upload.summary}
                    onChange={(value) =>
                      updateField("summary", value, "upload")
                    }
                  />

                  <EditableField
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
                    <WYSIWYGEditor
                      value={editedContext.text_content}
                      onChange={(value) => updateField("text_content", value)}
                      placeholder="Enter the main text content..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <EditableField
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
                    <EditableField
                      label="Participants (comma-separated)"
                      value={
                        editedContext.upload.participants?.join(", ") || ""
                      }
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
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editedContext.is_checkpoint}
                        onChange={(e) =>
                          updateField("is_checkpoint", e.target.checked)
                        }
                        className="w-4 h-4 rounded border-2 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/40"
                      />
                      <span className="text-sm font-semibold text-slate-700">
                        Is Checkpoint
                      </span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editedContext.is_invalidated}
                        onChange={(e) =>
                          updateField("is_invalidated", e.target.checked)
                        }
                        className="w-4 h-4 rounded border-2 border-slate-300 text-red-600 focus:ring-2 focus:ring-red-500/40"
                      />
                      <span className="text-sm font-semibold text-slate-700">
                        Is Invalidated
                      </span>
                    </label>
                  </motion.div>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Insights cards and arrows */}
      <AnimatePresence>
        {isExpanded && !isEditing && (
          <motion.div
            className="flex items-center ml-8 relative z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Insights column */}
            <div className="flex flex-col gap-y-4">
              {/* Key Pain Points as individual cards */}
              {Array.isArray(context.extracted_metadata?.key_pain_points) &&
                context.extracted_metadata.key_pain_points.map(
                  (point: string, i: number) => (
                    <Tooltip key={"pain-" + i}>
                      <TooltipTrigger
                        asChild
                        className="flex items-center cursor-pointer"
                      >
                        <div
                          className={`relative max-w-xs bg-white rounded-lg shadow-md px-3 py-2 flex items-center gap-2`}
                        >
                          <span
                            className={`w-fit h-fit p-1 text-xs ${INSIGHT_STYLES.keyPainPoint.pillClass} rounded-full`}
                          />
                          <div className="text-gray-900 text-xs font-medium">
                            {point}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        sideOffset={0}
                        className="bg-gray-800 text-white rounded-lg text-xs font-normal opacity-100"
                      >
                        key pain point
                      </TooltipContent>
                    </Tooltip>
                  )
                )}
              {/* Desired Features as individual cards */}
              {Array.isArray(context.extracted_metadata?.desired_features) &&
                context.extracted_metadata.desired_features.map(
                  (feature: string, i: number) => (
                    <Tooltip key={"feature-" + i}>
                      <TooltipTrigger asChild>
                        <div
                          id={`insight-feature-${index}-${i}`}
                          className="relative max-w-xs bg-white rounded-lg shadow-md px-3 py-2 flex items-center gap-2 cursor-pointer"
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${INSIGHT_STYLES.desiredFeature.pillClass} inline-block`}
                          />
                          <span className="text-gray-900 text-xs font-medium">
                            {feature}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        sideOffset={0}
                        className="bg-gray-800 text-white rounded-lg text-xs font-normal opacity-100"
                      >
                        desired feature
                      </TooltipContent>
                    </Tooltip>
                  )
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function OldWorkflowPage() {
  const [contexts, setContexts] = useState<Context[]>(initialContexts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleEdit = (contextId: string) => {
    setEditingId(contextId);
    setExpandedId(null); // Close insights when editing
  };

  const handleSave = (updatedContext: Context) => {
    setContexts((prev) =>
      prev.map((ctx) => (ctx.id === updatedContext.id ? updatedContext : ctx))
    );
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleToggleInsights = (contextId: string) => {
    if (editingId) return; // Don't toggle insights while editing
    setExpandedId(expandedId === contextId ? null : contextId);
  };

  const getFocusLevel = (contextId: string): "focused" | "ambient" | "fog" => {
    if (editingId === contextId) return "focused";
    if (editingId && editingId !== contextId) return "fog";
    return "ambient";
  };

  return (
    <div className="h-full">
      <header className="h-16 bg-gray-300 px-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Context</h1>
      </header>
      <div className="relative h-full overflow-y-auto">
        <div className="space-y-8 p-12">
          <AnimatePresence>
            {contexts.map((context, idx) => (
              <MercuryContextCard
                key={context.id}
                context={context}
                index={idx}
                isEditing={editingId === context.id}
                isExpanded={expandedId === context.id}
                focusLevel={getFocusLevel(context.id)}
                onEdit={() => handleEdit(context.id)}
                onSave={handleSave}
                onCancel={handleCancel}
                onToggleInsights={() => handleToggleInsights(context.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
