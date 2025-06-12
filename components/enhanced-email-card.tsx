"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  Mail, 
  Reply, 
  Forward, 
  Trash2, 
  Star, 
  Archive,
  MoreHorizontal,
  Clock,
  AlertCircle
} from "lucide-react"
import { FlowyCard, FlowyCardContent, FlowyCardFooter, FlowyCardHeader } from "./ui/flowy-card"
import { FlowyErrorBoundary } from "./ui/error-boundary"
import { FlowyCardSkeleton, useLoadingState } from "./ui/skeleton"
import { useToastActions } from "./ui/toast"
import { CardTitle, CardSubtitle, CardDescription, CardCaption, ErrorText } from "./ui/typography"
import { cn } from "@/lib/utils"

interface EmailData {
  id: string
  from: {
    name: string
    email: string
    avatar?: string
  }
  subject: string
  preview: string
  body: string
  timestamp: Date
  isRead: boolean
  isStarred: boolean
  isImportant: boolean
  priority: "low" | "normal" | "high"
}

interface EnhancedEmailCardProps {
  email?: EmailData
  className?: string
  onReply?: (email: EmailData) => Promise<void>
  onForward?: (email: EmailData) => Promise<void>
  onDelete?: (email: EmailData) => Promise<void>
  onMarkAsRead?: (email: EmailData) => Promise<void>
  onToggleStar?: (email: EmailData) => Promise<void>
  onArchive?: (email: EmailData) => Promise<void>
}

// Mock data generator
function generateMockEmail(): EmailData {
  const mockEmails = [
    {
      from: { name: "Sarah Chen", email: "sarah@company.com" },
      subject: "Q4 Marketing Strategy Review",
      preview: "Hi team, I've attached the updated marketing strategy document for Q4. Please review the budget allocations...",
      body: "Hi team,\n\nI've attached the updated marketing strategy document for Q4. Please review the budget allocations and campaign timelines. We need to finalize this by Friday.\n\nKey highlights:\n- 30% increase in digital spend\n- New social media campaigns\n- Partnership opportunities\n\nLet me know your thoughts!\n\nBest,\nSarah",
      priority: "high" as const,
      isImportant: true
    },
    {
      from: { name: "Design Team", email: "design@company.com" },
      subject: "New Brand Guidelines Available",
      preview: "The updated brand guidelines are now available in the shared drive. Please ensure all materials follow...",
      body: "The updated brand guidelines are now available in the shared drive. Please ensure all future materials follow these new standards.\n\nChanges include:\n- Updated color palette\n- New typography guidelines\n- Logo usage rules\n\nDownload link: [Brand Guidelines v2.0]",
      priority: "normal" as const,
      isImportant: false
    }
  ]
  
  const emailData = mockEmails[Math.floor(Math.random() * mockEmails.length)]
  
  return {
    id: Math.random().toString(36).substring(2, 9),
    ...emailData,
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    isRead: Math.random() > 0.3,
    isStarred: Math.random() > 0.7,
  }
}

export default function EnhancedEmailCard({
  email: initialEmail,
  className,
  onReply,
  onForward,
  onDelete,
  onMarkAsRead,
  onToggleStar,
  onArchive,
  ...props
}: EnhancedEmailCardProps) {
  const [email, setEmail] = React.useState<EmailData | null>(initialEmail || null)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const { isLoading, error, startLoading, stopLoading, setError } = useLoadingState()
  const toast = useToastActions()

  // Load mock data if no email provided
  React.useEffect(() => {
    if (!initialEmail) {
      startLoading()
      // Simulate API delay
      setTimeout(() => {
        try {
          setEmail(generateMockEmail())
          stopLoading()
        } catch (err) {
          setError(err as Error)
        }
      }, 800 + Math.random() * 1200) // 0.8-2s delay
    }
  }, [initialEmail, startLoading, stopLoading, setError])

  // Action handlers with loading states and error handling
  const handleAction = React.useCallback(async (
    action: ((email: EmailData) => Promise<void>) | undefined,
    actionName: string,
    email: EmailData
  ) => {
    if (!action) return

    startLoading()
    try {
      await action(email)
      toast.success(`${actionName} successful`, `Email "${email.subject}" has been processed.`)
      stopLoading()
    } catch (err) {
      const error = err as Error
      setError(error)
      toast.error(`${actionName} failed`, error.message)
    }
  }, [startLoading, stopLoading, setError, toast])

  const actions = React.useMemo(() => [
    {
      icon: Reply,
      label: "Reply",
      onClick: () => email && handleAction(onReply, "Reply", email),
      variant: "default" as const
    },
    {
      icon: Forward,
      label: "Forward", 
      onClick: () => email && handleAction(onForward, "Forward", email),
      variant: "default" as const
    },
    {
      icon: Archive,
      label: "Archive",
      onClick: () => email && handleAction(onArchive, "Archive", email),
      variant: "secondary" as const
    },
    {
      icon: Trash2,
      label: "Delete",
      onClick: () => email && handleAction(onDelete, "Delete", email),
      variant: "destructive" as const
    }
  ], [email, handleAction, onReply, onForward, onArchive, onDelete])

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - timestamp.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    return "Just now"
  }

  // Loading state
  if (isLoading || !email) {
    return <FlowyCardSkeleton variant="email" className={className} />
  }

  // Error state
  if (error) {
    return (
      <FlowyCard variant="transparent" className={cn("border-red-200/50", className)}>
        <FlowyCardContent className="text-center py-8">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <ErrorText>Failed to load email</ErrorText>
          <CardCaption className="mt-1">{error.message}</CardCaption>
        </FlowyCardContent>
      </FlowyCard>
    )
  }

  return (
    <FlowyErrorBoundary>
      <FlowyCard 
        variant="default" 
        className={cn(
          "group transition-all duration-300 cursor-pointer",
          !email.isRead && "border-l-4 border-l-blue-500",
          email.priority === "high" && "ring-1 ring-red-200 dark:ring-red-800",
          className
        )}
        onClick={() => setIsExpanded(!isExpanded)}
        {...props}
      >
        <FlowyCardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <Mail className={cn(
                "h-4 w-4 flex-shrink-0",
                email.isRead ? "text-gray-400" : "text-blue-500"
              )} />
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <CardTitle className={cn(
                    "truncate text-sm",
                    !email.isRead && "font-bold"
                  )}>
                    {email.from.name}
                  </CardTitle>
                  {email.isImportant && (
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </div>
                <CardSubtitle className="truncate text-xs">
                  {email.from.email}
                </CardSubtitle>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation()
                  email && onToggleStar?.(email)
                }}
                className={cn(
                  "p-1 rounded transition-colors",
                  email.isStarred 
                    ? "text-yellow-500 hover:text-yellow-600" 
                    : "text-gray-400 hover:text-yellow-500"
                )}
              >
                <Star className={cn("h-4 w-4", email.isStarred && "fill-current")} />
              </motion.button>
              
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 text-gray-400" />
                <CardCaption>{formatTimeAgo(email.timestamp)}</CardCaption>
              </div>
            </div>
          </div>
        </FlowyCardHeader>

        <FlowyCardContent>
          <div className="space-y-3">
            <div>
              <CardTitle className="text-base mb-1">
                {email.subject}
              </CardTitle>
              
              <CardDescription className="line-clamp-2">
                {isExpanded ? email.body : email.preview}
              </CardDescription>
            </div>

            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t pt-3 mt-3"
              >
                <CardDescription className="whitespace-pre-wrap">
                  {email.body}
                </CardDescription>
              </motion.div>
            )}

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                {email.priority === "high" && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    High Priority
                  </span>
                )}
                {!email.isRead && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    Unread
                  </span>
                )}
              </div>
              
              <CardCaption>
                {isExpanded ? "Click to collapse" : "Click to expand"}
              </CardCaption>
            </div>
          </div>
        </FlowyCardContent>

        <FlowyCardFooter>
          <div className="flex justify-between items-center w-full">
            <div className="flex space-x-2 flex-1">
              {actions.slice(0, 2).map((action, index) => (
                <motion.button
                  key={action.label}
                  className={cn(
                    "flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium transition-all flex-1 justify-center",
                    "bg-white/50 hover:bg-white/80 border border-gray-200/50",
                    "dark:bg-gray-800/50 dark:hover:bg-gray-800/80 dark:border-gray-700/50"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    action.onClick()
                  }}
                  disabled={isLoading}
                >
                  <action.icon className="h-3 w-3" />
                  <span>{action.label}</span>
                </motion.button>
              ))}
            </div>
            
            <div className="flex space-x-1 ml-2">
              {actions.slice(2).map((action) => (
                <motion.button
                  key={action.label}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    action.variant === "destructive" 
                      ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950" 
                      : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    action.onClick()
                  }}
                  disabled={isLoading}
                  title={action.label}
                >
                  <action.icon className="h-4 w-4" />
                </motion.button>
              ))}
              
              <motion.button
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                title="More options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </FlowyCardFooter>
      </FlowyCard>
    </FlowyErrorBoundary>
  )
} 