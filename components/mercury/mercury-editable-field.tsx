"use client";

import { cn } from "@/lib/utils";
import { getMercuryAnimationClasses, MERCURY_EASING } from "@/lib/mercury-utils";
import { motion } from "framer-motion";
import { useCallback, useId } from "react";

interface MercuryEditableFieldProps {
  intent: string; // Required Mercury prop
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "textarea" | "number";
  rows?: number;
  placeholder?: string;
  min?: number;
  max?: number;
  focusLevel?: 'focused' | 'ambient' | 'fog';
  required?: boolean;
  disabled?: boolean;
}

export function MercuryEditableField({
  intent,
  label,
  value,
  onChange,
  type = "text",
  rows = 3,
  placeholder,
  min,
  max,
  focusLevel = 'ambient',
  required = false,
  disabled = false,
}: MercuryEditableFieldProps) {
  const fieldId = useId();
  const labelId = `${fieldId}-label`;
  const helperId = `${fieldId}-helper`;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const baseInputClasses = cn(
    "w-full p-3 bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-lg",
    "focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/60",
    "hover:bg-white/80 text-slate-800 font-medium",
    "transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    type === "textarea" && "resize-none",
    getMercuryAnimationClasses(true)
  );

  return (
    <motion.div
      data-intent={intent}
      className={cn(
        "mercury-module mercury-field-group",
        getMercuryAnimationClasses(true)
      )}
      role="group"
      aria-labelledby={labelId}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: MERCURY_EASING }}
    >
      <label 
        id={labelId}
        htmlFor={fieldId}
        className="block text-sm font-semibold text-slate-700 mb-2"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {type === "textarea" ? (
        <textarea
          id={fieldId}
          value={value}
          onChange={handleChange}
          rows={rows}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-labelledby={labelId}
          aria-describedby={placeholder ? helperId : undefined}
          className={baseInputClasses}
        />
      ) : (
        <input
          id={fieldId}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          min={min}
          max={max}
          required={required}
          disabled={disabled}
          aria-labelledby={labelId}
          aria-describedby={placeholder ? helperId : undefined}
          className={baseInputClasses}
        />
      )}
      
      {placeholder && (
        <div id={helperId} className="sr-only">
          {placeholder}
        </div>
      )}
    </motion.div>
  );
} 