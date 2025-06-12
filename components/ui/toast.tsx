"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastType = "success" | "error" | "warning" | "info"

export interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
  clearAll: () => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    }

    setToasts((prev) => [...prev, newToast])

    // Auto remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const clearAll = React.useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

function ToastContainer() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastComponent key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastComponent({ toast }: { toast: Toast }) {
  const { removeToast } = useToast()
  const [progress, setProgress] = React.useState(100)

  React.useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - (100 / (toast.duration! / 100))
          return newProgress <= 0 ? 0 : newProgress
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [toast.duration])

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const colors = {
    success: {
      bg: "bg-green-50/90 dark:bg-green-950/90",
      border: "border-green-200/50 dark:border-green-800/50",
      icon: "text-green-600 dark:text-green-400",
      title: "text-green-900 dark:text-green-100",
      description: "text-green-700 dark:text-green-200",
      progress: "bg-green-500",
    },
    error: {
      bg: "bg-red-50/90 dark:bg-red-950/90",
      border: "border-red-200/50 dark:border-red-800/50",
      icon: "text-red-600 dark:text-red-400",
      title: "text-red-900 dark:text-red-100",
      description: "text-red-700 dark:text-red-200",
      progress: "bg-red-500",
    },
    warning: {
      bg: "bg-yellow-50/90 dark:bg-yellow-950/90",
      border: "border-yellow-200/50 dark:border-yellow-800/50",
      icon: "text-yellow-600 dark:text-yellow-400",
      title: "text-yellow-900 dark:text-yellow-100",
      description: "text-yellow-700 dark:text-yellow-200",
      progress: "bg-yellow-500",
    },
    info: {
      bg: "bg-blue-50/90 dark:bg-blue-950/90",
      border: "border-blue-200/50 dark:border-blue-800/50",
      icon: "text-blue-600 dark:text-blue-400",
      title: "text-blue-900 dark:text-blue-100",
      description: "text-blue-700 dark:text-blue-200",
      progress: "bg-blue-500",
    },
  }

  const Icon = icons[toast.type]
  const colorScheme = colors[toast.type]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={cn(
        "relative overflow-hidden rounded-2xl border backdrop-blur-lg shadow-lg",
        "p-4 w-full",
        colorScheme.bg,
        colorScheme.border
      )}
    >
      {/* Progress bar */}
      {toast.duration && toast.duration > 0 && (
        <div className="absolute bottom-0 left-0 h-1 bg-black/10 dark:bg-white/10 w-full">
          <motion.div
            className={cn("h-full", colorScheme.progress)}
            initial={{ width: "100%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
      )}

      <div className="flex items-start space-x-3">
        <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", colorScheme.icon)} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className={cn("text-sm font-semibold", colorScheme.title)}>
                {toast.title}
              </h4>
              {toast.description && (
                <p className={cn("text-xs mt-1", colorScheme.description)}>
                  {toast.description}
                </p>
              )}
            </div>
            
            <motion.button
              className="flex-shrink-0 ml-2 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => removeToast(toast.id)}
            >
              <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </motion.button>
          </div>

          {toast.action && (
            <motion.button
              className={cn(
                "mt-2 text-xs font-medium underline hover:no-underline transition-all",
                colorScheme.title
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                toast.action!.onClick()
                removeToast(toast.id)
              }}
            >
              {toast.action.label}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Convenience functions for different toast types
export const toast = {
  success: (title: string, description?: string, options?: Partial<Toast>) => {
    const { addToast } = useToast()
    addToast({ type: "success", title, description, ...options })
  },
  error: (title: string, description?: string, options?: Partial<Toast>) => {
    const { addToast } = useToast()
    addToast({ type: "error", title, description, ...options })
  },
  warning: (title: string, description?: string, options?: Partial<Toast>) => {
    const { addToast } = useToast()
    addToast({ type: "warning", title, description, ...options })
  },
  info: (title: string, description?: string, options?: Partial<Toast>) => {
    const { addToast } = useToast()
    addToast({ type: "info", title, description, ...options })
  },
}

// Hook for toast actions
export function useToastActions() {
  const { addToast } = useToast()

  return React.useMemo(
    () => ({
      success: (title: string, description?: string, options?: Partial<Toast>) =>
        addToast({ type: "success", title, description, ...options }),
      error: (title: string, description?: string, options?: Partial<Toast>) =>
        addToast({ type: "error", title, description, ...options }),
      warning: (title: string, description?: string, options?: Partial<Toast>) =>
        addToast({ type: "warning", title, description, ...options }),
      info: (title: string, description?: string, options?: Partial<Toast>) =>
        addToast({ type: "info", title, description, ...options }),
    }),
    [addToast]
  )
} 