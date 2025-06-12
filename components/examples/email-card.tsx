"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Mail, Star, Archive, MoreHorizontal, Reply, Forward, Mic, Trash2 } from "lucide-react"
import {
  FlowyCard,
  FlowyCardHeader,
  FlowyCardTitle,
  FlowyCardSubtitle,
  FlowyCardContent,
  FlowyCardFooter,
} from "@/components/ui/flowy-card"
import { cn } from "@/lib/utils"

interface EmailCardProps {
  sender: string
  subject: string
  preview: string
  timestamp: string
  content: string
  variant?: "mercury" | "mercury-elevated" | "mercury-float" | "mercury-glass" | "default" | "elevated" | "transparent" | "glass"
  className?: string
  expanded?: boolean
  onExpand?: () => void
  onReply?: () => void
  onForward?: () => void
  onDelete?: () => void
}

export function EmailCard({
  sender,
  subject,
  preview,
  timestamp,
  content,
  variant = "default",
  className,
  expanded = false,
  onExpand,
  onReply,
  onForward,
  onDelete,
}: EmailCardProps) {
  const handleAction = (action: (() => void) | undefined, event: React.MouseEvent) => {
    event.stopPropagation()
    if (action) {
      action()
    }
  }

  return (
    <FlowyCard
      variant={variant}
      size="md"
      expandable
      expanded={expanded}
      onExpand={onExpand}
      className={cn("max-w-md mx-auto", className)}
    >
      <FlowyCardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <FlowyCardTitle className="truncate text-base">
                {subject}
              </FlowyCardTitle>
              <FlowyCardSubtitle className="truncate">
                Mail from {sender}
              </FlowyCardSubtitle>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Mic className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500">{timestamp}</span>
          </div>
        </div>
      </FlowyCardHeader>

      <FlowyCardContent>
        <div className="space-y-4">
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
              {sender}
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              {subject}
            </div>
          </div>
          
          <div className="text-gray-700 dark:text-gray-200 leading-relaxed">
            {content}
          </div>
          
          <div className="text-right">
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {sender.split(' ')[0]}
            </div>
          </div>
        </div>
      </FlowyCardContent>

      <FlowyCardFooter className="border-t-0 pt-4">
        <div className="flex items-center space-x-2 w-full">
          <motion.button
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-white/20 hover:bg-white/70 dark:hover:bg-gray-700/50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => handleAction(onReply, e)}
          >
            <Reply className="h-4 w-4 mr-2 inline" />
            Reply
          </motion.button>
          
          <motion.button
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-white/20 hover:bg-white/70 dark:hover:bg-gray-700/50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => handleAction(onForward, e)}
          >
            <Forward className="h-4 w-4 mr-2 inline" />
            Forward
          </motion.button>
          
          <motion.button
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-white/20 hover:bg-white/70 dark:hover:bg-gray-700/50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => handleAction(onDelete, e)}
          >
            <Trash2 className="h-4 w-4 mr-2 inline" />
            Delete
          </motion.button>
        </div>
        
        <div className="mt-3 flex items-center justify-center">
          <motion.button
            className="flex items-center text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MoreHorizontal className="h-3 w-3 mr-1" />
            More actions
          </motion.button>
        </div>
      </FlowyCardFooter>
    </FlowyCard>
  )
} 