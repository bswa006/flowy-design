"use client"

import React, { useState, useCallback } from 'react'
import { cn } from "@/lib/utils"
import { MapPin, Navigation, Clock, Phone } from 'lucide-react'
import { 
  getMercuryFocusClasses,
  getMercuryStatusColors,
  getMercuryTypography,
  validateMercuryProps,
  MERCURY_RADIUS,
  MERCURY_ANIMATIONS,
  type MercuryComponentProps
} from '@/lib/mercury-tokens'

interface LocationData {
  title: string
  address: string
  distance: string
  status: 'open' | 'closed' | 'busy' | 'neutral'
  rating?: number
  type: string
  lastUpdated?: string
  phone?: string
}

interface LocationCardProps extends MercuryComponentProps {
  data: LocationData
  onNavigate?: () => void
  onCall?: () => void
}

export function LocationCard({
  intent,
  focusLevel = 'ambient',
  size = 'compact',
  data,
  className,
  style,
  isInteractive = true,
  onNavigate,
  onCall,
  ...props
}: LocationCardProps) {
  
  // Mercury validation (required for compliance)
  const validationErrors = validateMercuryProps({ intent, focusLevel, size, isInteractive })
  if (validationErrors.length > 0) {
    console.error('Mercury Validation Errors:', validationErrors)
  }
  
  const [isHovered, setIsHovered] = useState(false)
  
  const handleNavigate = useCallback(() => {
    console.log(`Mercury Action: navigate from location: ${intent}`)
    onNavigate?.()
  }, [intent, onNavigate])
  
  const handleCall = useCallback(() => {
    console.log(`Mercury Action: call from location: ${intent}`)
    onCall?.()
  }, [intent, onCall])
  
  // Mercury configuration
  const focusClasses = getMercuryFocusClasses(focusLevel)
  const statusColors = getMercuryStatusColors(
    data.status === 'open' ? 'healthy' : 
    data.status === 'busy' ? 'warning' : 
    data.status === 'closed' ? 'critical' : 'neutral'
  )
  const typography = getMercuryTypography(focusLevel, size)
  
  return (
    <div
      data-intent={intent}
      className={cn(
        'mercury-module relative overflow-hidden group',
        MERCURY_RADIUS.module,
        
        // Mercury focus level classes
        focusClasses.scale,
        focusClasses.opacity,
        focusClasses.contrast,
        focusClasses.brightness,
        focusClasses.saturate,
        focusClasses.background,
        focusClasses.border,
        focusClasses.shadow,
        focusClasses.animation,
        focusLevel === 'fog' && 'pointer-events-none',
        
        // Status overrides (color-based within hierarchy)
        data.status === 'busy' && [
          focusLevel === 'focused' && [statusColors.bg, statusColors.border, statusColors.ring],
          focusLevel === 'ambient' && 'bg-gradient-to-br from-amber-50/70 via-yellow-50/60 to-orange-50/70 border-amber-500/60',
          focusLevel === 'fog' && 'bg-gradient-to-br from-amber-50/40 via-yellow-50/30 to-orange-50/40 border-amber-500/40',
          'animate-pulse-subtle'
        ],
        
        data.status === 'closed' && [
          focusLevel === 'focused' && [statusColors.bg, statusColors.border, statusColors.ring],
          focusLevel === 'ambient' && 'bg-gradient-to-br from-red-50/70 via-rose-50/60 to-red-50/70 border-red-500/60',
          focusLevel === 'fog' && 'bg-gradient-to-br from-red-50/50 via-rose-50/40 to-red-50/50 border-red-500/50',
          'animate-pulse'
        ],
        
        // Interactive states
        isInteractive && [
          'cursor-pointer',
          MERCURY_ANIMATIONS.hover,
          MERCURY_ANIMATIONS.active,
          MERCURY_ANIMATIONS.focus
        ],
        
        className
      )}
      role="region"
      aria-label={`${intent} location component`}
      aria-describedby={`${intent}-description`}
      tabIndex={isInteractive ? 0 : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          handleNavigate()
        }
      }}
      style={style}
      {...props}
    >
      

      
      {/* Component Content */}
      <div className="relative z-10 p-6">
        
        {/* Header with Location Icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={cn(
              'p-2 rounded-xl',
              statusColors.bg.replace('gradient-to-br', 'gradient-to-r'),
              focusLevel === 'focused' && 'shadow-md',
              focusLevel === 'ambient' && 'shadow-sm',
              focusLevel === 'fog' && 'shadow-sm opacity-90'
            )}>
              <MapPin className={cn(
                'h-5 w-5',
                statusColors.icon,
                focusLevel === 'fog' && 'opacity-80'
              )} />
            </div>
            <div>
              <h3 className={cn(
                'font-semibold text-slate-800 leading-tight',
                focusLevel === 'focused' && 'text-base',
                focusLevel === 'ambient' && 'text-sm',
                focusLevel === 'fog' && 'text-sm opacity-90'
              )}>
                {data.title}
              </h3>
              <p className={cn(
                'text-xs text-slate-500 mt-1',
                focusLevel === 'fog' && 'opacity-80'
              )}>
                {data.type}
              </p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={cn(
            'px-2 py-1 rounded-lg text-xs font-medium',
            data.status === 'open' && 'bg-emerald-100 text-emerald-800',
            data.status === 'busy' && 'bg-amber-100 text-amber-800',
            data.status === 'closed' && 'bg-red-100 text-red-800',
            data.status === 'neutral' && 'bg-slate-100 text-slate-700',
            focusLevel === 'fog' && 'opacity-90'
          )}>
            {data.status === 'open' && '• Open'}
            {data.status === 'busy' && '• Busy'}
            {data.status === 'closed' && '• Closed'}
            {data.status === 'neutral' && '• Unknown'}
          </div>
        </div>
        
        {/* Address */}
        <div className="mb-4">
          <p className={cn(
            'text-sm text-slate-600 leading-relaxed',
            statusColors.text,
            data.status === 'busy' && 'text-amber-800 font-medium',
            data.status === 'closed' && 'text-red-800 font-medium',
            focusLevel === 'fog' && 'opacity-90'
          )}>
            {data.address}
          </p>
        </div>
        
        {/* Distance and Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <Navigation className={cn(
              'h-4 w-4 text-slate-500',
              focusLevel === 'fog' && 'opacity-80'
            )} />
            <span className={cn(
              'text-sm text-slate-600',
              focusLevel === 'fog' && 'opacity-90'
            )}>
              {data.distance}
            </span>
          </div>
          
          {data.rating && (
            <div className="flex items-center space-x-1">
              <span className="text-yellow-500">★</span>
              <span className={cn(
                'text-sm text-slate-600',
                focusLevel === 'fog' && 'opacity-90'
              )}>
                {data.rating}
              </span>
            </div>
          )}
        </div>
        
        {/* Action Buttons (Only show in focused/ambient) */}
        {focusLevel !== 'fog' && (
          <div className="flex space-x-2">
            <button
              onClick={handleNavigate}
              className={cn(
                'flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium',
                'bg-blue-600 text-white hover:bg-blue-700 transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                focusLevel === 'ambient' && 'opacity-90'
              )}
            >
              <Navigation className="h-4 w-4" />
              <span>Navigate</span>
            </button>
            
            {data.phone && (
              <button
                onClick={handleCall}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium border',
                  'border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2',
                  focusLevel === 'ambient' && 'opacity-90'
                )}
              >
                <Phone className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
        
        {/* Last Updated (focused only) */}
        {data.lastUpdated && focusLevel === 'focused' && (
          <div className="mt-4 pt-3 border-t border-slate-200/40">
            <div className="flex items-center space-x-1 text-xs text-slate-500">
              <Clock className="h-3 w-3" />
              <span>Updated {data.lastUpdated}</span>
            </div>
          </div>
        )}
        
      </div>
      
      {/* Accessibility description */}
      <div id={`${intent}-description`} className="sr-only">
        {`Location: ${data.title} at ${data.address}. Status: ${data.status}. Distance: ${data.distance}`}
      </div>
      
    </div>
  )
}

export type { LocationCardProps } 