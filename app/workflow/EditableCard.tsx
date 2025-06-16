import * as React from "react";
import { motion } from "framer-motion";
import {
  Save,
  X,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  RotateCcw,
} from "lucide-react";
import { Context } from "@/lib/contextMockData";
import { MercuryButton } from "@/components/mercury/MercuryButton";
import { Checkbox } from "@/components/ui/checkbox";

interface EditableCardProps {
  editedContext: Context;
  onSave: (updatedContext: Context) => void;
  onCancel: () => void;
  onFieldChange: (
    field: string,
    value: string | number | boolean | string[],
    nested?: string
  ) => void;
}

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
      <label className="text-xs text-gray-800 font-medium ml-2 mb-2">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="w-full px-3 py-1 bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-lg text-slate-800 text-xs resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          className="w-full px-3 py-1 bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-lg focus:outline-none text-slate-800 text-xs"
        />
      )}
    </motion.div>
  );
}

interface WYSIWYGEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function WYSIWYGEditor({ value, onChange, placeholder }: WYSIWYGEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);
  React.useEffect(() => {
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
    handleInput({
      currentTarget: editorRef.current,
    } as React.FormEvent<HTMLDivElement>);
  };
  const ToolbarButton = ({
    onClick,
    icon: Icon,
    title,
    isActive = false,
  }: {
    onClick: () => void;
    icon: React.ElementType;
    title: string;
    isActive?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-all  `}
    >
      {" "}
      <Icon className="w-3 h-3" />{" "}
    </button>
  );
  return (
    <div className="mercury-wysiwyg-editor bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-transparent">
        <div className="flex items-center space-x-1">
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
        <ToolbarButton
          onClick={() => execCommand("removeFormat")}
          icon={RotateCcw}
          title="Clear Formatting"
        />
      </div>
      <div
        ref={editorRef}
        contentEditable
        className={`min-h-32 p-4 focus:outline-none text-slate-800 leading-relaxed text-xs ${isFocused ? "bg-white/90" : "bg-white/60"} transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]`}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
}

export function EditableCard({
  editedContext,
  onSave,
  onCancel,
  onFieldChange,
}: EditableCardProps) {
  return (
    <motion.div
      className="p-6 pb-4 max-w-lg mx-auto bg-white rounded-2xl shadow-md border border-gray-100 relative transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] h-full flex flex-col space-y-6"
      animate={{ width: 600 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-md font-medium text-gray-900 truncate flex items-center gap-2">
          Edit Context
        </h3>
        <MercuryButton
          onClick={onCancel}
          className="text-black"
          intent="cancel-edit-context"
          focusLevel="ambient"
          type="button"
        >
          <X className="w-4 h-4" />
        </MercuryButton>
      </div>
      <motion.div
        className="flex-1 overflow-y-auto space-y-6 mercury-scroll pr-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid grid-cols-2 gap-6">
          <EditableField
            label="File Name"
            value={editedContext.upload.file_name}
            onChange={(value) => onFieldChange("file_name", value, "upload")}
          />
          <EditableField
            label="Priority Score (0-100)"
            type="number"
            min={0}
            max={100}
            value={editedContext.priority_score.toString()}
            onChange={(value) =>
              onFieldChange("priority_score", parseInt(value) || 0)
            }
          />
        </div>
        <EditableField
          label="Original Name"
          value={editedContext.upload.original_name}
          onChange={(value) => onFieldChange("original_name", value, "upload")}
        />
        <EditableField
          label="Description"
          type="textarea"
          rows={2}
          value={editedContext.upload.description}
          onChange={(value) => onFieldChange("description", value, "upload")}
        />
        <EditableField
          label="Upload Summary"
          type="textarea"
          rows={3}
          value={editedContext.upload.summary}
          onChange={(value) => onFieldChange("summary", value, "upload")}
        />
        <EditableField
          label="Main Summary"
          type="textarea"
          rows={3}
          value={editedContext.summary}
          onChange={(value) => onFieldChange("summary", value)}
        />
        <div className="mercury-field-group">
          <label className="text-xs text-gray-800 font-medium ml-2 mb-2">
            Full Text Content
          </label>
          <WYSIWYGEditor
            value={editedContext.text_content}
            onChange={(value) => onFieldChange("text_content", value)}
            placeholder="Enter the main text content..."
          />
        </div>
        <EditableField
          label="Tags"
          value={editedContext.tags?.join(", ") || ""}
          onChange={(value) =>
            onFieldChange(
              "tags",
              value
                .split(",")
                .map((tag: string) => tag.trim())
                .filter(Boolean)
            )
          }
          placeholder="tag1, tag2, tag3"
        />
        <EditableField
          label="Participants"
          value={editedContext.upload.participants?.join(", ") || ""}
          onChange={(value) =>
            onFieldChange(
              "participants",
              value
                .split(",")
                .map((p: string) => p.trim())
                .filter(Boolean),
              "upload"
            )
          }
          placeholder="Person 1, Person 2, Person 3"
        />
        <motion.div
          className="flex items-center space-x-6 pt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <label className="flex items-center space-x-2 cursor-pointer">
            <Checkbox
              checked={editedContext.is_checkpoint}
              onCheckedChange={(checked) =>
                onFieldChange("is_checkpoint", Boolean(checked))
              }
              className="border-slate-800 text-white data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900 data-[state=checked]:text-white"
            />
            <span className="text-xs font-medium text-slate-800">
              Is Checkpoint
            </span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <Checkbox
              checked={editedContext.is_invalidated}
              onCheckedChange={(checked) =>
                onFieldChange("is_invalidated", Boolean(checked))
              }
              className="data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900 data-[state=checked]:text-white"
            />
            <span className="text-xs font-medium text-slate-800">
              Is Invalidated
            </span>
          </label>
        </motion.div>
        <MercuryButton
          onClick={() => onSave(editedContext)}
          className="w-full rounded-md flex items-center justify-center gap-2 px-3 py-1.5 text-sm shadow-lg bg-black text-white"
          title="Save"
          intent="save-context"
          focusLevel="ambient"
          type="button"
        >
          <Save className="w-4 h-4" />
          Save
        </MercuryButton>
      </motion.div>
    </motion.div>
  );
}
