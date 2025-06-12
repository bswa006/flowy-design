"use client"

import React, { useState, useCallback } from 'react'
import { cn } from "@/lib/utils"
import { MessageCircle, Send, MoreHorizontal, Clock } from 'lucide-react'
import { 
  getMercuryFocusClasses,
  getMercuryStatusColors,
  getMercuryTypography,
  validateMercuryProps,
  MERCURY_RADIUS,
  MERCURY_ANIMATIONS,
  type MercuryComponentProps
} from '@/lib/mercury-tokens'

interface MessageData {
  contactName: string
  contactHandle?: string
  avatar?: string
  lastMessage: string
  timestamp: string
  unreadCount?: number
  status: 'unread' | 'active' | 'away' | 'neutral'
  platform: string
  messages?: Array<{
    text: string
    timestamp: string
    isOwn: boolean
  }>
}

interface MessageCardProps extends MercuryComponentProps {
  data: MessageData
  onReply?: (message: string) => void
  onCall?: () => void
}

export function MessageCard({
  intent,
  focusLevel = 'ambient',
  size = 'compact',
  data,
  className,
  style,
  isInteractive = true,
  onReply,
  onCall,
  ...props
}: MessageCardProps) {
  
  // Mercury validation (required for compliance)
  const validationErrors = validateMercuryProps({ intent, focusLevel, size, isInteractive })
  if (validationErrors.length > 0) {
    console.error('Mercury Validation Errors:', validationErrors)
  }
  
  const [isHovered, setIsHovered] = useState(false)
  const [replyText, setReplyText] = useState('')
  
  const handleReply = useCallback(() => {
    if (replyText.trim()) {
      console.log(`Mercury Action: reply from message: ${intent}`)
      onReply?.(replyText)
      setReplyText('')
    }
  }, [intent, onReply, replyText])
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleReply()
    }
  }, [handleReply])
  
  // Mercury configuration
  const focusClasses = getMercuryFocusClasses(focusLevel)
  const statusColors = getMercuryStatusColors(
    data.status === 'unread' ? 'warning' : 
    data.status === 'active' ? 'healthy' : 
    data.status === 'away' ? 'critical' : 'neutral'
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
        data.status === 'unread' && [
          focusLevel === 'focused' && [statusColors.bg, statusColors.border, statusColors.ring],
          focusLevel === 'ambient' && 'bg-gradient-to-br from-amber-50/70 via-yellow-50/60 to-orange-50/70 border-amber-500/60',
          focusLevel === 'fog' && 'bg-gradient-to-br from-amber-50/40 via-yellow-50/30 to-orange-50/40 border-amber-500/40',
          'animate-pulse-subtle'
        ],
        
        data.status === 'away' && [
          focusLevel === 'focused' && [statusColors.bg, statusColors.border, statusColors.ring],
          focusLevel === 'ambient' && 'bg-gradient-to-br from-red-50/70 via-rose-50/60 to-red-50/70 border-red-500/60',
          focusLevel === 'fog' && 'bg-gradient-to-br from-red-50/50 via-rose-50/40 to-red-50/50 border-red-500/50'
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
      aria-label={`${intent} message component`}
      aria-describedby={`${intent}-description`}
      tabIndex={isInteractive ? 0 : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={style}
      {...props}
    >
      
      {/* Mercury Status Accent Bar */}
      <div className={cn(
        'absolute top-0 left-0 right-0',
        MERCURY_RADIUS.accentBar,
        focusLevel === 'focused' && [
          data.status === 'unread' && 'h-2',
          data.status === 'away' && 'h-2',
          data.status !== 'unread' && data.status !== 'away' && 'h-1.5'
        ],
        focusLevel === 'ambient' && 'h-1.5',
        focusLevel === 'fog' && 'h-1',
        statusColors.accent,
        focusLevel === 'focused' && (data.status === 'unread' ? 'opacity-90' : 'opacity-80'),
        focusLevel === 'ambient' && 'opacity-70',
        focusLevel === 'fog' && 'opacity-60'
      )} />
      
      {/* Component Content */}
      <div className="relative z-10 p-6">
        
        {/* Header with Contact Info */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={cn(
              'relative p-2 rounded-xl',
              statusColors.bg.replace('gradient-to-br', 'gradient-to-r'),
              focusLevel === 'focused' && 'shadow-md',
              focusLevel === 'ambient' && 'shadow-sm',
              focusLevel === 'fog' && 'shadow-sm opacity-90'
            )}>
              <MessageCircle className={cn(
                'h-5 w-5',
                statusColors.icon,
                focusLevel === 'fog' && 'opacity-80'
              )} />
              
              {/* Unread indicator */}
              {data.unreadCount && data.unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {data.unreadCount > 9 ? '9+' : data.unreadCount}
                </div>
              )}
            </div>
            <div>
              <h3 className={cn(
                'font-semibold text-slate-800 leading-tight',
                focusLevel === 'focused' && 'text-base',
                focusLevel === 'ambient' && 'text-sm',
                focusLevel === 'fog' && 'text-sm opacity-90'
              )}>
                {data.contactName}
              </h3>
              {data.contactHandle && (
                <p className={cn(
                  'text-xs text-slate-500 mt-1',
                  focusLevel === 'fog' && 'opacity-80'
                )}>
                  {data.contactHandle}
                </p>
              )}
            </div>
          </div>
          
          {/* Platform and Status */}
          <div className="flex items-center space-x-2">
            <div className={cn(
              'px-2 py-1 rounded-lg text-xs font-medium',
              data.status === 'active' && 'bg-emerald-100 text-emerald-800',
              data.status === 'unread' && 'bg-amber-100 text-amber-800',
              data.status === 'away' && 'bg-red-100 text-red-800',
              data.status === 'neutral' && 'bg-slate-100 text-slate-700',
              focusLevel === 'fog' && 'opacity-90'
            )}>
              {data.platform}
            </div>
            
            <button className={cn(
              'p-1 rounded hover:bg-slate-100 transition-colors',
              focusLevel === 'fog' && 'opacity-70'
            )}>
              <MoreHorizontal className="h-4 w-4 text-slate-500" />
            </button>
          </div>
        </div>
        
        {/* Last Message */}
        <div className="mb-4">
          <p className={cn(
            'text-sm text-slate-600 leading-relaxed',
            statusColors.text,
            data.status === 'unread' && 'text-amber-800 font-medium',
            data.status === 'away' && 'text-red-800 font-medium',
            focusLevel === 'fog' && 'opacity-90'
          )}>
            {data.lastMessage}
          </p>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-1">
              <Clock className={cn(
                'h-3 w-3 text-slate-400',
                focusLevel === 'fog' && 'opacity-80'
              )} />
              <span className={cn(
                'text-xs text-slate-500',
                focusLevel === 'fog' && 'opacity-90'
              )}>
                {data.timestamp}
              </span>
            </div>
            
            {data.status === 'unread' && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-amber-600 font-medium">New</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Message History (focused only) */}
        {focusLevel === 'focused' && data.messages && (
          <div className="mb-4 space-y-2 max-h-32 overflow-y-auto">
            {data.messages.slice(-3).map((message, index) => (
              <div 
                key={index}
                className={cn(
                  'p-2 rounded-lg text-sm',
                  message.isOwn 
                    ? 'bg-blue-100 text-blue-900 ml-4' 
                    : 'bg-slate-100 text-slate-700 mr-4'
                )}
              >
                <p>{message.text}</p>
                <span className="text-xs opacity-70">{message.timestamp}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Reply Input (Only show in focused/ambient) */}
        {focusLevel !== 'fog' && (
          <div className="flex space-x-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className={cn(
                'flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'placeholder:text-slate-400',
                focusLevel === 'ambient' && 'opacity-90'
              )}
            />
            
            <button
              onClick={handleReply}
              disabled={!replyText.trim()}
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium',
                'bg-blue-600 text-white hover:bg-blue-700 transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                focusLevel === 'ambient' && 'opacity-90'
              )}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        )}
        
      </div>
      
      {/* Accessibility description */}
      <div id={`${intent}-description`} className="sr-only">
        {`Message from ${data.contactName} on ${data.platform}. Last message: ${data.lastMessage}. Status: ${data.status}.`}
      </div>
      
    </div>
  )
}

export type { MessageCardProps } 