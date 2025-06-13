"use client"

import React, { useState, useCallback } from 'react'
import { cn } from "@/lib/utils"
import { Send, MoreHorizontal, Mic } from 'lucide-react'
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
  contactHandle: string
  avatar?: string
  lastMessage: string
  timestamp: string
  platform: string
  status: 'read' | 'unread' | 'sent' | 'neutral'
  messages?: Array<{
    text: string
    timestamp: string
    isOwn: boolean
  }>
}

interface MessageCardProps extends MercuryComponentProps {
  data: MessageData
  onReply?: () => void
  onCall?: () => void
  showNextIndicator?: boolean
  onRevealNext?: () => void
}

export function MessageCard({
  intent,
  focusLevel = 'ambient',
  size = 'compact',
  data,
  className,
  style,
  isInteractive = true,
  showNextIndicator = false,
  onReply,
  onCall,
  onRevealNext,
  ...props
}: MessageCardProps) {
  
  // Mercury validation (required for compliance)
  const validationErrors = validateMercuryProps({ intent, focusLevel, size, isInteractive })
  if (validationErrors.length > 0) {
    console.error('Mercury Validation Errors:', validationErrors)
  }
  
  const [showTooltip, setShowTooltip] = useState(false)
  const [replyText, setReplyText] = useState('')
  
  const handleReply = useCallback(() => {
    console.log(`Mercury Action: reply from message: ${intent}`)
    onReply?.()
  }, [intent, onReply])
  
  const handleRevealNext = useCallback(() => {
    console.log(`Mercury Action: reveal next from message: ${intent}`)
    onRevealNext?.()
  }, [intent, onRevealNext])
  
  const handleSendReply = useCallback(() => {
    if (replyText.trim()) {
      console.log(`Sending reply: ${replyText}`)
      setReplyText('')
      handleReply()
    }
  }, [replyText, handleReply])
  
  return (
    <div
      data-intent={intent}
      className={cn(
        'mercury-module relative overflow-hidden group',
        // Subtle white card with minimal shadow - no thick borders
        'bg-white rounded-2xl border border-gray-100',
        'shadow-sm hover:shadow-md transition-shadow duration-300',
        
        // Mercury focus level adjustments
        focusLevel === 'focused' && 'ring-1 ring-gray-200',
        focusLevel === 'fog' && 'opacity-70 pointer-events-none',
        
        // Interactive states - minimal
        isInteractive && 'cursor-pointer',
        
        className
      )}
      role="region"
      aria-label={`${intent} message component`}
      tabIndex={isInteractive ? 0 : undefined}
      onMouseEnter={() => {
        if (showNextIndicator) setShowTooltip(true)
      }}
      onMouseLeave={() => {
        setShowTooltip(false)
      }}
      onClick={handleRevealNext}
      style={style}
      {...props}
    >
      {/* Main Content */}
      <div className="p-4">
        {/* Header Section - Minimal */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {/* Platform indicator - subtle icon */}
            <div className="w-4 h-4 bg-gray-100 rounded-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-400 rounded-sm" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {data.contactName} {data.contactHandle} • {data.platform}
            </span>
          </div>
          
          {/* Status indicator - just a small dot */}
          <div className={cn(
            'w-2 h-2 rounded-full',
            data.status === 'unread' && 'bg-blue-400',
            data.status === 'read' && 'bg-gray-300',
            data.status === 'sent' && 'bg-emerald-400',
            data.status === 'neutral' && 'bg-gray-300'
          )} />
        </div>

        {/* Message Content - Cleaner */}
        <div className="mb-4">
          <div className="bg-gray-50 rounded-xl p-3 mb-3">
            <p className="text-gray-800 text-sm leading-relaxed mb-1">
              {data.lastMessage}
            </p>
            <span className="text-xs text-gray-500">{data.timestamp}</span>
          </div>
          
          {/* New Messages Label - Much smaller */}
          <div className="text-center mb-3">
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
              NEW MESSAGES
            </span>
          </div>
          
          {/* Response Messages - Smaller */}
          {data.messages && data.messages.slice(1).map((message, index) => (
            <div key={index} className={`mb-2 ${message.isOwn ? 'flex justify-end' : ''}`}>
              {!message.isOwn && (
                <div className="flex items-start space-x-2 mb-2">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 text-xs font-medium">
                      {data.contactName.charAt(0)}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-xl rounded-tl-sm p-2 max-w-xs">
                    <p className="text-gray-800 text-xs">{message.text}</p>
                    <span className="text-xs text-gray-400 mt-1 block">{message.timestamp}</span>
                  </div>
                </div>
              )}
              
              {message.isOwn && (
                <div className="bg-gray-900 text-white rounded-xl rounded-tr-sm p-2 max-w-xs">
                  <p className="text-xs">{message.text}</p>
                  <span className="text-xs text-gray-300 mt-1 block">{message.timestamp}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Reply Input - Much more minimal */}
        <div className="border-t border-gray-100 pt-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Reply..."
              className="flex-1 px-3 py-2 bg-gray-50 rounded-lg border-none outline-none focus:ring-1 focus:ring-gray-300 text-sm"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSendReply()
                }
              }}
            />
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleSendReply()
              }}
              className="px-3 py-2 bg-gray-900 text-white rounded-lg font-medium text-xs hover:bg-gray-800 transition-colors"
            >
              Send
            </button>
          </div>
          
          {/* More Actions - Much smaller */}
          <button className="flex items-center space-x-1 text-xs text-gray-400 hover:text-gray-600 transition-colors mt-2">
            <MoreHorizontal className="h-3 w-3" />
            <span>More actions</span>
          </button>
        </div>
      </div>

      {/* Click to Reveal Next Tooltip */}
      {showNextIndicator && showTooltip && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="bg-white rounded-lg shadow-lg px-4 py-2 flex items-center space-x-2 border border-gray-200">
            <Send className="h-3 w-3 text-gray-600" />
            <span className="text-xs font-medium text-gray-700 whitespace-nowrap">Click to reveal next</span>
          </div>
        </div>
      )}
    </div>
  )
}

export type { MessageCardProps } 