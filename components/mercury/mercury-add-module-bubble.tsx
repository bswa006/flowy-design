"use client"

import React, { useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from "@/lib/utils"
import { getMercuryFocusClasses } from "@/lib/mercury-tokens"
import { Plus } from "lucide-react"

interface MercuryAddModuleBubbleProps {
  intent: string; // REQUIRED - Mercury intention tracking
  onClick: () => void;
  focusLevel?: 'focused' | 'ambient' | 'fog';
  className?: string;
  disabled?: boolean;
}

export function MercuryAddModuleBubble({ 
  intent, 
  onClick, 
  focusLevel = 'ambient',
  className,
  disabled = false
}: MercuryAddModuleBubbleProps) {
  
  const handleClick = useCallback(() => {
    if (!disabled) {
      console.log(`Mercury Intent: ${intent} - adding new module`)
      onClick()
    }
  }, [disabled, intent, onClick])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      handleClick()
    }
  }, [disabled, handleClick])

  return (
    <motion.button
      data-intent={intent}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={cn(
        'mercury-module',
        getMercuryFocusClasses(focusLevel),
        'w-14 h-14 flex items-center justify-center',
        'bg-blue-600 hover:bg-blue-700 text-white rounded-full',
        'shadow-lg hover:shadow-xl disabled:opacity-50',
        className
      )}
      role="button"
      aria-label={`Add new module for ${intent}`}
      tabIndex={disabled ? -1 : 0}
      
      // 3. Revealing the Add Bubble
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ ease: 'easeOut', duration: 0.15 }}
    >
      <Plus className="w-6 h-6" strokeWidth={2.5} />
    </motion.button>
  )
} 