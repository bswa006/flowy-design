"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

export interface FlowyCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode
  variant?: "mercury" | "mercury-elevated" | "mercury-float" | "mercury-glass" | "default" | "elevated" | "transparent" | "glass"
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  interactive?: boolean
  expandable?: boolean
  className?: string
  onExpand?: () => void
  expanded?: boolean
  mercury?: boolean // Enable Mercury-level enhancements
}

export const FlowyCard = React.forwardRef<HTMLDivElement, FlowyCardProps>(
  ({
    children,
    variant = "mercury",
    size = "md",
    interactive = true,
    expandable = false,
    className,
    onExpand,
    expanded = false,
    mercury = true,
    ...props
  }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)
    const [isPressed, setIsPressed] = React.useState(false)

    // Mercury-level variant styles
    const mercuryVariants = {
      mercury: "bg-mercury-glass-300 border-mercury-border-200 backdrop-blur-mercury-md shadow-mercury-md",
      "mercury-elevated": "bg-mercury-glass-400 border-mercury-border-300 backdrop-blur-mercury-lg shadow-mercury-lg",
      "mercury-float": "bg-mercury-glass-300 border-mercury-border-200 backdrop-blur-mercury-lg shadow-mercury-float",
      "mercury-glass": "bg-gradient-to-br from-mercury-glass-400 to-mercury-glass-200 border-mercury-border-300 backdrop-blur-mercury-xl shadow-mercury-xl",
    }

    // Legacy variant styles for backward compatibility
    const legacyVariants = {
      default: "bg-flowy-glass border-flowy-border backdrop-blur-flowy shadow-flowy",
      elevated: "bg-white/60 border-white/30 backdrop-blur-flowy-md shadow-flowy-md",
      transparent: "bg-white/20 border-white/15 backdrop-blur-flowy shadow-flowy-sm",
      glass: "bg-gradient-to-br from-white/40 to-white/20 border-white/25 backdrop-blur-flowy-lg shadow-flowy",
    }

    const variantStyles = mercury ? mercuryVariants : legacyVariants

    // Mercury-level size styles
    const mercurySizes = {
      xs: "p-mercury-sm rounded-mercury-sm",
      sm: "p-mercury-md rounded-mercury-md",
      md: "p-mercury-lg rounded-mercury-lg",
      lg: "p-mercury-xl rounded-mercury-xl",
      xl: "p-mercury-2xl rounded-mercury-2xl",
    }

    // Legacy size styles
    const legacySizes = {
      xs: "p-3 rounded-flowy-sm",
      sm: "p-4 rounded-flowy-sm",
      md: "p-6 rounded-flowy-md",
      lg: "p-8 rounded-flowy-lg",
      xl: "p-10 rounded-flowy-lg",
    }

    const sizeStyles = mercury ? mercurySizes : legacySizes

    // Mercury-level animation variants
    const mercuryAnimations = {
      initial: { 
        opacity: 0, 
        y: 8,
        scale: 0.96,
        filter: "blur(0px)"
      },
      animate: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1],
          staggerChildren: 0.1
        }
      },
      hover: interactive ? {
        y: -2,
        scale: 1.005,
        transition: {
          duration: 0.15,
          ease: [0.4, 0, 0.2, 1]
        }
      } : {},
      tap: interactive ? {
        scale: 0.995,
        y: 0,
        transition: {
          duration: 0.08,
          ease: "easeOut"
        }
      } : {},
      focus: {
        scale: 1.002,
        transition: {
          duration: 0.2,
          ease: [0.4, 0, 0.2, 1]
        }
      },
      expanded: expandable && expanded ? {
        scale: 1.02,
        zIndex: 50,
        y: -4,
        transition: {
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1]
        }
      } : {}
    }

    // Legacy animations
    const legacyAnimations = {
      initial: { 
        opacity: 0, 
        y: 12,
        scale: 0.98
      },
      animate: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: {
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1]
        }
      },
      hover: interactive ? {
        y: -4,
        scale: 1.01,
        transition: {
          duration: 0.2,
          ease: [0.4, 0, 0.2, 1]
        }
      } : {},
      tap: interactive ? {
        scale: 0.98,
        transition: {
          duration: 0.1,
          ease: "easeOut"
        }
      } : {},
      expanded: expandable && expanded ? {
        scale: 1.05,
        zIndex: 50,
        transition: {
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1]
        }
      } : {}
    }

    const cardVariants = mercury ? mercuryAnimations : legacyAnimations

    // Mercury-level shadow enhancement based on state
    const getMercuryShadow = () => {
      if (isPressed) return "shadow-mercury-sm"
      if (isHovered && interactive) {
        if (variant === "mercury-float") return "shadow-mercury-float-lg"
        return "shadow-mercury-xl"
      }
      if (isFocused) return "shadow-mercury-lg"
      
      return variant === "mercury-float" ? "shadow-mercury-float" : 
             variant === "mercury-elevated" ? "shadow-mercury-lg" :
             variant === "mercury-glass" ? "shadow-mercury-xl" :
             "shadow-mercury-md"
    }

    // Legacy shadow system
    const getLegacyShadow = () => {
      if (isHovered && interactive) return "shadow-flowy-lg"
      return variant === "elevated" ? "shadow-flowy-md" : "shadow-flowy"
    }

    const currentShadow = mercury ? getMercuryShadow() : getLegacyShadow()

    const handleClick = () => {
      if (expandable && onExpand) {
        onExpand()
      }
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if ((event.key === 'Enter' || event.key === ' ') && (interactive || expandable)) {
        event.preventDefault()
        if (expandable && onExpand) {
          onExpand()
        }
      }
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          // Base styles
          "relative border transition-all duration-200 ease-mercury-ease",
          "will-change-transform cursor-default",
          "ring-0 ring-transparent ring-offset-0",
          
          // Variant and size styles
          variantStyles[variant as keyof typeof variantStyles],
          sizeStyles[size as keyof typeof sizeStyles],
          
          // Interactive states
          interactive && "cursor-pointer select-none",
          expandable && "cursor-pointer select-none",
          
          // Dynamic shadow based on state
          currentShadow,
          
          // State-based styling
          isPressed && mercury && "scale-[0.998]",
          
          // Expanded styles
          expanded && expandable && "relative z-50",
          
          // Dark mode support with Mercury enhancements
          mercury ? [
            "dark:bg-mercury-glass-dark-300 dark:border-mercury-border-dark-200 dark:shadow-mercury-dark-md",
            isHovered && interactive && "dark:shadow-mercury-dark-lg",
          ] : [
            "dark:bg-flowy-glass-dark dark:border-flowy-border-dark dark:shadow-flowy-dark"
          ],
          
          // Enhanced accessibility with Mercury standards
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mercury-blue-500 focus-visible:ring-offset-2",
          "focus-visible:ring-offset-background focus-visible:border-mercury-blue-400",
          
          // Better transitions
          mercury && [
            "transition-all duration-200 ease-mercury-ease",
            "hover:transition-all hover:duration-150",
            "focus:transition-all focus:duration-200",
          ],
          
          className
        )}
        variants={cardVariants}
        initial="initial"
        animate={[
          "animate",
          ...(expanded && expandable ? ["expanded"] : []),
          ...(isFocused ? ["focus"] : []),
        ]}
        whileHover="hover"
        whileTap="tap"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          setIsPressed(false)
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={interactive || expandable ? 0 : undefined}
        role={expandable ? "button" : "article"}
        aria-expanded={expandable ? expanded : undefined}
        aria-label={expandable ? "Expandable card" : undefined}
        data-mercury={mercury}
        data-flowy-card
        style={{
          // Enhanced backdrop-filter support
          WebkitBackdropFilter: mercury ? "blur(12px)" : "blur(8px)",
          backdropFilter: mercury ? "blur(12px)" : "blur(8px)",
          // Better sub-pixel rendering
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

FlowyCard.displayName = "FlowyCard"

// Enhanced sub-components with Mercury-level typography
export const FlowyCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { mercury?: boolean }
>(({ className, mercury = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      mercury ? "flex flex-col space-y-mercury-xs mb-mercury-md" : "flex flex-col space-y-1.5 mb-4",
      className
    )}
    {...props}
  />
))
FlowyCardHeader.displayName = "FlowyCardHeader"

export const FlowyCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { mercury?: boolean }
>(({ className, mercury = true, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      mercury ? [
        "font-semibold leading-tight text-gray-900 dark:text-gray-50",
        "text-mercury-lg tracking-tight",
        "transition-colors duration-200"
      ] : [
        "font-semibold leading-tight text-gray-900 dark:text-gray-100",
        "text-lg tracking-tight"
      ],
      className
    )}
    {...props}
  />
))
FlowyCardTitle.displayName = "FlowyCardTitle"

export const FlowyCardSubtitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { mercury?: boolean }
>(({ className, mercury = true, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      mercury ? [
        "text-mercury-sm font-medium text-gray-600 dark:text-gray-400",
        "transition-colors duration-200"
      ] : [
        "text-sm font-medium text-gray-600 dark:text-gray-300"
      ],
      className
    )}
    {...props}
  />
))
FlowyCardSubtitle.displayName = "FlowyCardSubtitle"

export const FlowyCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { mercury?: boolean }
>(({ className, mercury = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      mercury ? [
        "text-mercury-base text-gray-700 dark:text-gray-300 leading-relaxed",
        "transition-colors duration-200"
      ] : [
        "text-sm text-gray-700 dark:text-gray-200 leading-relaxed"
      ],
      className
    )}
    {...props}
  />
))
FlowyCardContent.displayName = "FlowyCardContent"

export const FlowyCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { mercury?: boolean }
>(({ className, mercury = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      mercury ? [
        "flex items-center justify-between pt-mercury-md mt-mercury-md",
        "border-t border-mercury-border-200 dark:border-mercury-border-dark-200"
      ] : [
        "flex items-center justify-between pt-4 mt-4 border-t border-white/20"
      ],
      className
    )}
    {...props}
  />
))
FlowyCardFooter.displayName = "FlowyCardFooter" 