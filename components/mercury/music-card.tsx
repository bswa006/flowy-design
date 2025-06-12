"use client"

import React, { useState, useCallback } from 'react'
import { cn } from "@/lib/utils"
import { Play, Pause, SkipForward, SkipBack, Heart, MoreHorizontal, Volume2 } from 'lucide-react'
import { 
  getMercuryFocusClasses,
  getMercuryStatusColors,
  getMercuryTypography,
  getMercuryAccentBar,
  validateMercuryProps,
  MERCURY_RADIUS,
  MERCURY_ANIMATIONS,
  type MercuryComponentProps
} from '@/lib/mercury-tokens'

interface MusicData {
  title: string
  artist: string
  album?: string
  artwork?: string
  duration: string
  currentTime: string
  progress: number
  status: 'playing' | 'paused' | 'buffering' | 'neutral'
  platform: string
  isLiked?: boolean
  playlist?: string
}

interface MusicCardProps extends MercuryComponentProps {
  data: MusicData
  onPlay?: () => void
  onPause?: () => void
  onNext?: () => void
  onPrevious?: () => void
  onLike?: () => void
}

export function MusicCard({
  intent,
  focusLevel = 'ambient',
  size = 'compact',
  data,
  className,
  style,
  isInteractive = true,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onLike,
  ...props
}: MusicCardProps) {
  
  // Mercury validation (required for compliance)
  const validationErrors = validateMercuryProps({ intent, focusLevel, size, isInteractive })
  if (validationErrors.length > 0) {
    console.error('Mercury Validation Errors:', validationErrors)
  }
  
  const [isHovered, setIsHovered] = useState(false)
  
  const handlePlayPause = useCallback(() => {
    console.log(`Mercury Action: ${data.status === 'playing' ? 'pause' : 'play'} from music: ${intent}`)
    if (data.status === 'playing') {
      onPause?.()
    } else {
      onPlay?.()
    }
  }, [intent, data.status, onPlay, onPause])
  
  // Mercury configuration
  const focusClasses = getMercuryFocusClasses(focusLevel)
  const statusColors = getMercuryStatusColors(
    data.status === 'playing' ? 'healthy' : 
    data.status === 'buffering' ? 'warning' : 
    data.status === 'paused' ? 'neutral' : 'neutral'
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
        data.status === 'buffering' && [
          focusLevel === 'focused' && [statusColors.bg, statusColors.border, statusColors.ring],
          focusLevel === 'ambient' && 'bg-gradient-to-br from-amber-50/70 via-yellow-50/60 to-orange-50/70 border-amber-500/60',
          focusLevel === 'fog' && 'bg-gradient-to-br from-amber-50/40 via-yellow-50/30 to-orange-50/40 border-amber-500/40',
          'animate-pulse-subtle'
        ],
        
        data.status === 'playing' && [
          focusLevel === 'focused' && [statusColors.bg, statusColors.border],
          focusLevel === 'ambient' && 'bg-gradient-to-br from-emerald-50/70 via-green-50/60 to-emerald-50/70 border-emerald-500/60',
          focusLevel === 'fog' && 'bg-gradient-to-br from-emerald-50/40 via-green-50/30 to-emerald-50/40 border-emerald-500/40'
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
      aria-label={`${intent} music component`}
      aria-describedby={`${intent}-description`}
      tabIndex={isInteractive ? 0 : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          handlePlayPause()
        }
      }}
      style={style}
      {...props}
    >
      
      {/* Mercury Status Accent Bar */}
      <div className={cn(
        'absolute top-0 left-0 right-0',
        MERCURY_RADIUS.accentBar,
        focusLevel === 'focused' && [
          data.status === 'buffering' && 'h-2',
          data.status !== 'buffering' && 'h-1.5'
        ],
        focusLevel === 'ambient' && 'h-1.5',
        focusLevel === 'fog' && 'h-1',
        statusColors.accent,
        focusLevel === 'focused' && (data.status === 'buffering' ? 'opacity-90' : 'opacity-80'),
        focusLevel === 'ambient' && 'opacity-70',
        focusLevel === 'fog' && 'opacity-60'
      )} />
      
      {/* Component Content */}
      <div className="relative z-10 p-6">
        
        {/* Header with Platform */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Volume2 className={cn(
              'h-4 w-4',
              statusColors.icon,
              focusLevel === 'fog' && 'opacity-80'
            )} />
            <span className={cn(
              'text-xs font-medium',
              statusColors.text,
              focusLevel === 'fog' && 'opacity-80'
            )}>
              {data.platform}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {data.playlist && (
              <div className={cn(
                'px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700',
                focusLevel === 'fog' && 'opacity-90'
              )}>
                {data.playlist}
              </div>
            )}
            
            <button className={cn(
              'p-1 rounded hover:bg-slate-100 transition-colors',
              focusLevel === 'fog' && 'opacity-70'
            )}>
              <MoreHorizontal className="h-4 w-4 text-slate-500" />
            </button>
          </div>
        </div>
        
        {/* Album Artwork and Track Info */}
        <div className="flex items-center space-x-4 mb-4">
          <div className={cn(
            'relative w-12 h-12 rounded-xl overflow-hidden',
            'bg-gradient-to-br from-slate-200 to-slate-300',
            focusLevel === 'focused' && 'shadow-md',
            focusLevel === 'ambient' && 'shadow-sm',
            focusLevel === 'fog' && 'opacity-90'
          )}>
            {data.artwork ? (
              <img 
                src={data.artwork} 
                alt={`${data.title} artwork`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Volume2 className="h-6 w-6 text-slate-400" />
              </div>
            )}
            
            {/* Playing indicator */}
            {data.status === 'playing' && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              'font-semibold text-slate-800 leading-tight truncate',
              focusLevel === 'focused' && 'text-base',
              focusLevel === 'ambient' && 'text-sm',
              focusLevel === 'fog' && 'text-sm opacity-90'
            )}>
              {data.title}
            </h3>
            <p className={cn(
              'text-sm text-slate-600 truncate mt-1',
              focusLevel === 'fog' && 'opacity-80'
            )}>
              {data.artist}
            </p>
            {data.album && focusLevel === 'focused' && (
              <p className="text-xs text-slate-500 truncate mt-1">
                {data.album}
              </p>
            )}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className={cn(
            'relative w-full h-1 bg-slate-200 rounded-full overflow-hidden',
            focusLevel === 'fog' && 'opacity-80'
          )}>
            <div 
              className={cn(
                'absolute left-0 top-0 h-full rounded-full transition-all duration-300',
                statusColors.accent.replace('bg-gradient-to-r', 'bg-gradient-to-r')
              )}
              style={{ width: `${data.progress}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className={cn(
              'text-xs text-slate-500',
              focusLevel === 'fog' && 'opacity-80'
            )}>
              {data.currentTime}
            </span>
            <span className={cn(
              'text-xs text-slate-500',
              focusLevel === 'fog' && 'opacity-80'
            )}>
              {data.duration}
            </span>
          </div>
        </div>
        
        {/* Controls (Only show in focused/ambient) */}
        {focusLevel !== 'fog' && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={onPrevious}
                className={cn(
                  'p-2 rounded-lg hover:bg-slate-100 transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  focusLevel === 'ambient' && 'opacity-90'
                )}
              >
                <SkipBack className="h-4 w-4 text-slate-600" />
              </button>
              
              <button
                onClick={handlePlayPause}
                className={cn(
                  'p-3 rounded-xl text-white transition-colors',
                  data.status === 'playing' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2',
                  data.status === 'playing' ? 'focus:ring-emerald-500' : 'focus:ring-blue-500',
                  focusLevel === 'ambient' && 'opacity-90'
                )}
              >
                {data.status === 'playing' ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </button>
              
              <button
                onClick={onNext}
                className={cn(
                  'p-2 rounded-lg hover:bg-slate-100 transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  focusLevel === 'ambient' && 'opacity-90'
                )}
              >
                <SkipForward className="h-4 w-4 text-slate-600" />
              </button>
            </div>
            
            <button
              onClick={onLike}
              className={cn(
                'p-2 rounded-lg hover:bg-slate-100 transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
                focusLevel === 'ambient' && 'opacity-90'
              )}
            >
              <Heart className={cn(
                'h-4 w-4',
                data.isLiked ? 'text-red-500 fill-current' : 'text-slate-600'
              )} />
            </button>
          </div>
        )}
        
      </div>
      
      {/* Accessibility description */}
      <div id={`${intent}-description`} className="sr-only">
        {`Music: ${data.title} by ${data.artist} on ${data.platform}. Status: ${data.status}. Progress: ${data.progress}%.`}
      </div>
      
    </div>
  )
}

export type { MusicCardProps } 