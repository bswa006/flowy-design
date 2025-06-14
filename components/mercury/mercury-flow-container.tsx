"use client"

import React, { useState, useCallback } from 'react'
import { cn } from "@/lib/utils"

interface MercuryFlowContainerProps {
  intent: string; // REQUIRED - Mercury intention tracking
  children: React.ReactNode;
  focusManagement?: boolean;
  className?: string;
  defaultFocusIndex?: number;
}

export function MercuryFlowContainer({ 
  intent, 
  children, 
  focusManagement = true,
  className,
  defaultFocusIndex = 0
}: MercuryFlowContainerProps) {
  const [focusedIndex, setFocusedIndex] = useState(defaultFocusIndex)

  const handleFocusChange = useCallback((index: number) => {
    setFocusedIndex(index)
    console.log(`Mercury Focus: Card ${index} focused in flow ${intent}`)
  }, [intent])

  return (
    <div 
      data-intent={intent}
      className={cn(
        'mercury-module',
        'flex space-x-4 overflow-x-auto py-4 px-2',
        'scrollbar-hide', // Mercury clean scrolling
        'transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
        className
      )}
      role="region"
      aria-label={`${intent} flow container`}
    >
      {React.Children.map(children, (child, index) => {
        if (focusManagement && React.isValidElement(child)) {
          // Calculate focus level based on distance from focused card
          const distance = Math.abs(index - focusedIndex)
          const focusLevel = distance === 0 ? 'focused' : 
                           distance <= 1 ? 'ambient' : 'fog'
          
          return React.cloneElement(child as React.ReactElement<any>, { 
            focusLevel,
            onClick: () => handleFocusChange(index),
            isInteractive: true,
            key: child.key || index
          })
        }
        return child
      })}
    </div>
  )
} 