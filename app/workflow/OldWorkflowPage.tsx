"use client";

import * as React from "react";
import { Check, CircleCheck, Edit, X, Save, Bold, Italic, Underline, List, ListOrdered, Type, Heading1, Heading2, RotateCcw, ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Mercury OS Spatial Computing - Remove old scroll animation globals
// Add Mercury spatial state management
declare global {
  interface Window {
    mercurySpaceDepth?: number;
  }
}

// Add explicit type for contexts
interface ContextUpload {
  id: string;
  file_name: string;
  original_name: string;
  content_type: string;
  upload_type: string;
  description: string;
  status: string;
  priority: string;
  is_checkpoint: boolean;
  recorded_on: string;
  summary: string;
  participants?: string[];
  number_of_participants?: number;
}
interface Context {
  id: string;
  processing_request_id: string;
  upload: ContextUpload;
  text_content: string;
  summary: string;
  priority_score: number;
  is_checkpoint: boolean;
  is_invalidated: boolean;
  extracted_metadata?: Record<string, unknown>;
  tags?: string[];
  created_at: string;
}

const initialContexts: Context[] = [
  {
    id: "c1111111-1111-1111-1111-111111111111",
    processing_request_id: "pr111111-1111-1111-1111-111111111111",
    upload: {
      id: "u1111111-1111-1111-1111-111111111111",
      file_name: "user_research_sales_teams.mp4",
      original_name:
        "Sales Team User Research - Meeting Pain Points - 2024-01-10.mp4",
      content_type: "video/mp4",
      upload_type: "video",
      description:
        "User research session with 5 sales managers discussing meeting inefficiencies and note-taking challenges",
      status: "completed",
      priority: "high",
      is_checkpoint: true,
      recorded_on: "2024-01-10T14:00:00Z",
      summary:
        "Sales teams lose 40% of meeting value due to poor note-taking, missed action items, and lack of CRM updates. Key insight: they need an 'invisible assistant' that captures everything without disrupting flow.",
      participants: [
        "Tom Bradley",
        "Lisa Chen",
        "Marcus Johnson",
        "Sarah Ahmed",
        "David Kim",
      ],
      number_of_participants: 5,
    },
    text_content:
      "Tom Bradley (Sales Director, TechCorp): I'll be brutally honest - I'm in 6-8 customer calls daily, and I retain maybe 30% of what's discussed. By the time I update Salesforce, half the nuances are gone.\n\nMarcus Johnson (Account Executive): Exactly! Yesterday I had a call where the client mentioned their Q2 budget constraints in passing. I was screen-sharing, couldn't take notes, and completely forgot to log it. Lost a $200K deal because I didn't follow up appropriately.\n\nLisa Chen (Researcher): What would the ideal solution look like?\n\nTom: Something that just... listens. Like having a brilliant intern who never misses anything. No buttons to push, no apps to switch between. It just captures everything and knows what's important.\n\nSarah Ahmed (Sales Manager): And it needs to understand context! When a client says 'we'll revisit this after the board meeting,' that should automatically create a follow-up task for the right date.\n\nDavid Kim (VP Sales): The CRM integration is critical. I spend 2 hours every evening updating Salesforce. If an AI could draft those updates and just let me review... game changer.\n\nMarcus: What about compliance? We discuss sensitive pricing.\n\nTom: Good point. It needs enterprise-grade security. SOC 2, HIPAA compliant. And the ability to redact sensitive information automatically.\n\nLisa: How do you handle action items currently?\n\nSarah: Poorly! (laughs) I try to write them down, but when you're presenting and negotiating, something always slips. Last week I promised a client three deliverables and only remembered two.\n\nDavid: The worst is when multiple people are on the call. Who said they'd do what? By when? It's chaos.\n\nTom: You know what would be incredible? If it could detect commitment language. When someone says 'I'll send that by Friday,' boom - task created, assigned, due date set.\n\nMarcus: And meeting summaries! My manager always asks 'how did the call go?' I want to forward a perfect summary in 30 seconds, not spend 15 minutes writing one.\n\nSarah: Integration with our existing tools is non-negotiable. Zoom, obviously. But also Slack for quick summaries, Jira for technical discussions, Google Calendar for scheduling follow-ups.\n\nDavid: Price point?\n\nTom: For something that saves 5-8 hours per week? $50-100 per user per month is a no-brainer. That's less than an hour of a salesperson's time.",
    summary:
      "Sales teams desperately need an 'invisible' AI meeting assistant that captures everything, understands context, and automatically updates CRM/task systems without disrupting meeting flow.",
    priority_score: 100,
    is_checkpoint: true,
    is_invalidated: false,
    extracted_metadata: {
      key_pain_points: [
        "Retain only 30% of meeting content",
        "Miss critical action items while presenting",
        "Spend 2+ hours daily on CRM updates",
        "Lose deals due to forgotten follow-ups",
        "No clarity on who owns what action items",
      ],
      desired_features: [
        "Invisible/automatic operation",
        "Context-aware action item detection",
        "Automatic CRM updates",
        "Commitment language recognition",
        "Multi-party action item tracking",
        "One-click meeting summaries",
        "Enterprise security compliance",
      ],
      integrations_required: [
        "Zoom",
        "Salesforce",
        "Slack",
        "Jira",
        "Google Calendar",
      ],
      pricing_expectation: "$50-100 per user/month",
      expected_time_savings: "5-8 hours per week",
    },
    tags: [
      "user-research",
      "sales-teams",
      "requirements",
      "checkpoint",
      "high-value",
    ],
    created_at: "2024-01-10T18:00:00Z",
  },
  // ... (repeat for all other context objects from your JSON) ...
];

// Mercury WYSIWYG Editor Component with Rich Text Formatting
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
    isActive = false 
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
          ? 'bg-blue-500 text-white shadow-md' 
          : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-800'
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
              onClick={() => execCommand('bold')}
              icon={Bold}
              title="Bold"
            />
            <ToolbarButton
              onClick={() => execCommand('italic')}
              icon={Italic}
              title="Italic"
            />
            <ToolbarButton
              onClick={() => execCommand('underline')}
              icon={Underline}
              title="Underline"
            />
          </div>

          <div className="w-px h-4 bg-slate-300 mx-2" />

          {/* Lists */}
          <div className="flex items-center space-x-1">
            <ToolbarButton
              onClick={() => execCommand('insertUnorderedList')}
              icon={List}
              title="Bullet List"
            />
            <ToolbarButton
              onClick={() => execCommand('insertOrderedList')}
              icon={ListOrdered}
              title="Numbered List"
            />
          </div>
        </div>

        {/* Clear Formatting */}
        <ToolbarButton
          onClick={() => execCommand('removeFormat')}
          icon={RotateCcw}
          title="Clear Formatting"
        />
      </div>

      {/* Editor Content */}
      <div
        ref={editorRef}
        contentEditable
        className={`min-h-32 p-4 focus:outline-none text-slate-800 leading-relaxed ${
          isFocused ? 'bg-white/90' : 'bg-white/60'
        } transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]`}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        suppressContentEditableWarning={true}
        style={{ 
          fontSize: '14px',
          lineHeight: '1.5'
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
  type?: 'text' | 'textarea' | 'number';
  rows?: number;
  placeholder?: string;
  min?: number;
  max?: number;
}

function EditableField({ label, value, onChange, type = 'text', rows = 3, placeholder, min, max }: EditableFieldProps) {
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
      {type === 'textarea' ? (
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
  focusLevel: 'focused' | 'ambient' | 'fog';
  onEdit: () => void;
  onSave: (updatedContext: Context) => void;
  onCancel: () => void;
  onToggleInsights: () => void;
}

function MercuryContextCard({ 
  context, 
  index, 
  isEditing, 
  isExpanded,
  focusLevel, 
  onEdit, 
  onSave, 
  onCancel,
  onToggleInsights 
}: MercuryContextCardProps) {
  const [editedContext, setEditedContext] = useState<Context>(context);

  // Update local state when context changes
  useEffect(() => {
    setEditedContext(context);
  }, [context]);

  const updateField = (field: string, value: any, nested?: string) => {
    setEditedContext(prev => {
      if (nested) {
        return {
          ...prev,
          [nested]: {
            ...prev[nested as keyof Context] as any,
            [field]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleSave = () => {
    onSave(editedContext);
  };

  // Mercury focus classes
  const getFocusClasses = () => {
    switch (focusLevel) {
      case 'focused':
        return 'scale-[1.02] z-30 opacity-100 shadow-2xl shadow-blue-500/20 ring-1 ring-blue-300/40';
      case 'ambient':
        return 'scale-100 z-10 opacity-90';
      case 'fog':
        return 'scale-[0.98] z-0 opacity-40 pointer-events-none blur-[0.5px]';
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
            !isEditing ? 'cursor-pointer hover:shadow-lg' : ''
          }`}
          layout
          style={{ 
            height: isEditing ? '80vh' : 'auto',
            minHeight: isEditing ? 'auto' : '220px',
            width: isEditing ? '600px' : '400px',
            overflow: isEditing ? 'hidden' : 'visible'
          }}
          animate={{
            width: isEditing ? 600 : 400,
          }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Edit/Save buttons */}
          <AnimatePresence>
            {!isEditing && focusLevel !== 'fog' && (
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

          <div className={`${isEditing ? 'h-full flex flex-col' : 'p-8'}`}>
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
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#cbd5e1 #f1f5f9'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                <div className="grid grid-cols-2 gap-6">
                  <EditableField
                    label="File Name"
                    value={editedContext.upload.file_name}
                    onChange={(value) => updateField('file_name', value, 'upload')}
                  />
                  <EditableField
                    label="Priority Score (0-100)"
                    type="number"
                    min={0}
                    max={100}
                    value={editedContext.priority_score.toString()}
                    onChange={(value) => updateField('priority_score', parseInt(value) || 0)}
                  />
                </div>

                <EditableField
                  label="Original Name"
                  value={editedContext.upload.original_name}
                  onChange={(value) => updateField('original_name', value, 'upload')}
                />

                <EditableField
                  label="Description"
                  type="textarea"
                  rows={2}
                  value={editedContext.upload.description}
                  onChange={(value) => updateField('description', value, 'upload')}
                />

                <EditableField
                  label="Upload Summary"
                  type="textarea"
                  rows={3}
                  value={editedContext.upload.summary}
                  onChange={(value) => updateField('summary', value, 'upload')}
                />

                <EditableField
                  label="Main Summary"
                  type="textarea"
                  rows={3}
                  value={editedContext.summary}
                  onChange={(value) => updateField('summary', value)}
                />

                <div className="mercury-field-group">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Text Content
                  </label>
                  <WYSIWYGEditor
                    value={editedContext.text_content}
                    onChange={(value) => updateField('text_content', value)}
                    placeholder="Enter the main text content..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <EditableField
                    label="Tags (comma-separated)"
                    value={editedContext.tags?.join(', ') || ''}
                    onChange={(value) => updateField('tags', value.split(',').map(tag => tag.trim()).filter(Boolean))}
                    placeholder="tag1, tag2, tag3"
                  />
                  <EditableField
                    label="Participants (comma-separated)"
                    value={editedContext.upload.participants?.join(', ') || ''}
                    onChange={(value) => updateField('participants', value.split(',').map(p => p.trim()).filter(Boolean), 'upload')}
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
                      onChange={(e) => updateField('is_checkpoint', e.target.checked)}
                      className="w-4 h-4 rounded border-2 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/40"
                    />
                    <span className="text-sm font-semibold text-slate-700">Is Checkpoint</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editedContext.is_invalidated}
                      onChange={(e) => updateField('is_invalidated', e.target.checked)}
                      className="w-4 h-4 rounded border-2 border-slate-300 text-red-600 focus:ring-2 focus:ring-red-500/40"
                    />
                    <span className="text-sm font-semibold text-slate-700">Is Invalidated</span>
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
            className="flex items-center ml-8 space-x-8 relative z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Arrow to insights */}
            <ArrowRight className="w-8 h-8 text-gray-400" />
            {/* Insights: Key Pain Points */}
            <div className="max-w-xs bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col min-h-[120px]">
              <div className="text-base font-bold text-gray-900 mb-2">
                Insights: Key Pain Points
              </div>
              <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                {Array.isArray(
                  context.extracted_metadata?.key_pain_points
                ) &&
                  context.extracted_metadata.key_pain_points.map(
                    (point: string, i: number) => <li key={i}>{point}</li>
                  )}
              </ul>
            </div>
            {/* Arrow to insights */}
            <ArrowRight className="w-8 h-8 text-gray-400" />
            {/* Insights: Desired Features */}
            <div className="max-w-xs bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col min-h-[120px]">
              <div className="text-base font-bold text-gray-900 mb-2">
                Insights: Desired Features
              </div>
              <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                {Array.isArray(
                  context.extracted_metadata?.desired_features
                ) &&
                  context.extracted_metadata.desired_features.map(
                    (feature: string, i: number) => (
                      <li key={i}>{feature}</li>
                    )
                  )}
              </ul>
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
    setContexts(prev => 
      prev.map(ctx => 
        ctx.id === updatedContext.id ? updatedContext : ctx
      )
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

  const getFocusLevel = (contextId: string): 'focused' | 'ambient' | 'fog' => {
    if (editingId === contextId) return 'focused';
    if (editingId && editingId !== contextId) return 'fog';
    return 'ambient';
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
