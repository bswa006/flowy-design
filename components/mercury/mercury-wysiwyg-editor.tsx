"use client";

import { cn } from "@/lib/utils";
import { getMercuryAnimationClasses, MERCURY_EASING } from "@/lib/mercury-utils";
import { motion } from "framer-motion";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  RotateCcw,
  Underline,
} from "lucide-react";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface MercuryWYSIWYGEditorProps {
  intent: string; // Required Mercury prop
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  focusLevel?: 'focused' | 'ambient' | 'fog';
}

interface ToolbarButtonProps {
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  isActive?: boolean;
  'aria-pressed'?: boolean;
}

const ToolbarButton = React.memo(({
  onClick,
  icon: Icon,
  title,
  isActive = false,
  'aria-pressed': ariaPressed,
}: ToolbarButtonProps) => {
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  }, [onClick]);

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      title={title}
      aria-label={title}
      aria-pressed={ariaPressed ?? isActive}
      className={cn(
        "p-2 rounded-lg transition-all duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
        isActive
          ? "bg-blue-500 text-white shadow-md"
          : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-800"
      )}
    >
      <Icon className="w-3 h-3" />
    </button>
  );
});
ToolbarButton.displayName = "ToolbarButton";

export function MercuryWYSIWYGEditor({ 
  intent, 
  value, 
  onChange, 
  placeholder,
  focusLevel = 'ambient' 
}: MercuryWYSIWYGEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML;
    onChange(newContent);
  }, [onChange]);

  const execCommand = useCallback((command: string, commandValue?: string) => {
    // Modern approach: Use execCommand with fallback
    try {
      document.execCommand(command, false, commandValue);
      editorRef.current?.focus();
      if (editorRef.current) {
        handleInput({ currentTarget: editorRef.current } as React.FormEvent<HTMLDivElement>);
      }
    } catch (error) {
      console.warn(`Command ${command} not supported:`, error);
    }
  }, [handleInput]);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
      }
    }
  }, [execCommand]);

  return (
    <motion.div
      data-intent={intent}
      className={cn(
        "mercury-module mercury-wysiwyg-editor bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-xl overflow-hidden",
        getMercuryAnimationClasses(true)
      )}
      role="region"
      aria-label={`${intent} WYSIWYG editor`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: MERCURY_EASING }}
    >
      {/* Compact Mercury Toolbar */}
      <div 
        className="flex items-center justify-between p-3 border-b border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-transparent"
        role="toolbar"
        aria-label="Text formatting toolbar"
      >
        <div className="flex items-center space-x-1">
          {/* Text Formatting */}
          <div className="flex items-center space-x-1" role="group" aria-label="Text formatting">
            <ToolbarButton
              onClick={() => execCommand("bold")}
              icon={Bold}
              title="Bold (Ctrl+B)"
            />
            <ToolbarButton
              onClick={() => execCommand("italic")}
              icon={Italic}
              title="Italic (Ctrl+I)"
            />
            <ToolbarButton
              onClick={() => execCommand("underline")}
              icon={Underline}
              title="Underline (Ctrl+U)"
            />
          </div>

          <div className="w-px h-4 bg-slate-300 mx-2" role="separator" />

          {/* Lists */}
          <div className="flex items-center space-x-1" role="group" aria-label="List formatting">
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
        role="textbox"
        aria-multiline="true"
        aria-label={placeholder || "Rich text editor"}
        className={cn(
          "min-h-32 p-4 focus:outline-none text-slate-800 leading-relaxed transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
          isFocused ? "bg-white/90" : "bg-white/60"
        )}
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
        style={{
          fontSize: "14px",
          lineHeight: "1.5",
        }}
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </motion.div>
  );
} 