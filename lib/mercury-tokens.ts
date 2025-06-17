/**
 * Mercury Design System Tokens - Clean Minimalist Edition
 * Updated for premium, clean aesthetic with subtle hierarchy
 *
 * These tokens provide clean, elegant styling that eliminates visual noise
 * while maintaining Mercury's focus hierarchy and accessibility standards
 */

// ========================================
// MERCURY FOCUS LEVELS (Clean & Minimalist)
// ========================================

export const MERCURY_FOCUS_LEVELS = {
  focused: {
    scale: "scale-[1.02]", // More subtle scaling
    zIndex: "z-40",
    opacity: "opacity-100",
    contrast: "contrast-100",
    brightness: "brightness-100",
    saturate: "saturate-100",
    background: "bg-white", // Pure white for clarity
    border: "border border-slate-200/60", // Subtle border instead of heavy blue
    shadow: "shadow-lg shadow-slate-200/40", // Clean shadow
    animation:
      "transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
    ring: "ring-1 ring-slate-300/30", // Very subtle focus ring
  },
  ambient: {
    scale: "scale-[0.99]", // Very subtle scaling
    zIndex: "z-10",
    opacity: "opacity-90", // Less dramatic opacity reduction
    contrast: "contrast-100",
    brightness: "brightness-[0.98]",
    saturate: "saturate-95",
    background: "bg-white", // Keep it clean white
    border: "border border-slate-100/40", // Even more subtle
    shadow: "shadow-md shadow-slate-100/30",
    animation:
      "transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
  },
  fog: {
    scale: "scale-[0.98]", // Minimal scaling
    zIndex: "z-0",
    opacity: "opacity-75", // More readable
    contrast: "contrast-[0.95]",
    brightness: "brightness-[0.96]",
    saturate: "saturate-90",
    background: "bg-slate-50/80", // Very light, clean background
    border: "border border-slate-100/30",
    shadow: "shadow-sm shadow-slate-100/20",
    animation:
      "transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
    pointerEvents: "pointer-events-none",
  },
} as const;

// ========================================
// MERCURY STATUS COLORS (Clean & Subtle)
// ========================================

export const MERCURY_STATUS_COLORS = {
  healthy: {
    bg: "bg-white", // Clean white background
    border: "border-slate-200/50",
    accent: "bg-emerald-500", // Simple solid accent
    text: "text-slate-700", // Softer text colors
    icon: "text-emerald-600",
    glow: "shadow-emerald-100/30", // Very subtle glow
    ring: "ring-emerald-200/20",
  },
  warning: {
    bg: "bg-white", // Keep background clean
    border: "border-amber-200/60", // More subtle warning indication
    accent: "bg-amber-500", // Clean solid accent
    text: "text-slate-700",
    icon: "text-amber-600",
    glow: "shadow-amber-100/40",
    ring: "ring-amber-200/30",
  },
  critical: {
    bg: "bg-white", // Clean background
    border: "border-rose-200/60", // Subtle critical indication
    accent: "bg-rose-500", // Clean solid accent
    text: "text-slate-700",
    icon: "text-rose-600",
    glow: "shadow-rose-100/40",
    ring: "ring-rose-200/30",
  },
  neutral: {
    bg: "bg-white",
    border: "border-slate-200/50",
    accent: "bg-slate-400",
    text: "text-slate-700",
    icon: "text-slate-500",
    glow: "shadow-slate-100/30",
    ring: "ring-slate-200/20",
  },
} as const;

// ========================================
// MERCURY TYPOGRAPHY SCALE (Refined)
// ========================================

export const MERCURY_TYPOGRAPHY = {
  focused: {
    compact: "text-2xl font-bold", // Less aggressive than font-black
    standard: "text-4xl font-bold",
    expanded: "text-5xl font-bold",
  },
  ambient: {
    compact: "text-xl font-semibold", // More refined
    standard: "text-2xl font-semibold",
    expanded: "text-3xl font-semibold",
  },
  fog: {
    compact: "text-lg font-medium", // Softer weights
    standard: "text-xl font-medium",
    expanded: "text-2xl font-medium",
  },
  description: "text-sm font-medium leading-relaxed text-slate-600", // More refined
  metadata: "text-xs text-slate-400 font-normal",
} as const;

// ========================================
// MERCURY SPACING SYSTEM (More Generous)
// ========================================

export const MERCURY_SPACING = {
  xs: "0.375rem", // 6px - slightly more generous
  sm: "0.75rem", // 12px
  md: "1.25rem", // 20px
  lg: "2rem", // 32px
  xl: "2.5rem", // 40px
  "2xl": "3.5rem", // 56px
  "3xl": "5rem", // 80px
} as const;

export const MERCURY_PADDING = {
  compact: "p-5", // More generous padding
  standard: "p-7",
  expanded: "p-9",
} as const;

// ========================================
// MERCURY ANIMATIONS (Gentle & Natural)
// ========================================

export const MERCURY_ANIMATIONS = {
  // Base transition for all Mercury components
  base: "transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] transform-gpu",

  // Entrance animations - more gentle
  enter: "animate-[mercury-enter_0.8s_ease-out] animate-fill-mode-both",

  // Status animations - very subtle
  warningPulse: "animate-pulse-gentle", // 4s very gentle pulse
  criticalPulse: "animate-pulse-soft", // 3s soft pulse

  // Interaction states - more refined
  hover: "hover:scale-[1.01] hover:shadow-lg hover:shadow-slate-200/40",
  active: "active:scale-[0.99] active:shadow-md",
  focus:
    "focus-visible:ring-2 focus-visible:ring-slate-300/40 focus-visible:ring-offset-2",
} as const;

// ========================================
// MERCURY BORDER RADIUS SYSTEM (Refined)
// ========================================

export const MERCURY_BORDER_RADIUS = {
  module: "rounded-2xl", // Slightly less rounded for cleaner look
  accentBar: "rounded-t-2xl",
  statusIcon: "rounded-lg",
  badge: "rounded-md", // More subtle
  button: "rounded-lg",
} as const;

// ========================================
// MERCURY ACCENT BAR SYSTEM (Minimal)
// ========================================

export const MERCURY_ACCENT_BARS = {
  focused: {
    healthy: { height: "h-1", opacity: "opacity-70" }, // Much more subtle
    warning: { height: "h-1.5", opacity: "opacity-80" },
    critical: { height: "h-1.5", opacity: "opacity-80" },
  },
  ambient: {
    all: { height: "h-1", opacity: "opacity-60" },
  },
  fog: {
    all: { height: "h-0.5", opacity: "opacity-50" }, // Very minimal
  },
} as const;

// ========================================
// MERCURY COMPONENT INTERFACE
// ========================================

export interface MercuryComponentProps {
  intent: string;
  focusLevel?: "focused" | "ambient" | "fog";
  size?: "compact" | "standard" | "expanded";
  className?: string;
  style?: React.CSSProperties;
  isInteractive?: boolean;
  "data-intent"?: string;
}

export interface MercuryStatusData {
  status?: "healthy" | "warning" | "critical" | "neutral";
  title: string;
  value: string | number;
  description?: string;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
    isSignificant?: boolean;
  };
  metadata?: {
    lastUpdated?: string;
    source?: string;
    confidence?: number;
  };
}

// ========================================
// MERCURY UTILITY FUNCTIONS
// ========================================

/**
 * Get Mercury focus classes for a component
 */
export function getMercuryFocusClasses(
  focusLevel: "focused" | "ambient" | "fog"
) {
  return MERCURY_FOCUS_LEVELS[focusLevel];
}

/**
 * Get Mercury status colors for a status type
 */
export function getMercuryStatusColors(
  status: "healthy" | "warning" | "critical" | "neutral"
) {
  return MERCURY_STATUS_COLORS[status];
}

/**
 * Get Mercury typography classes for focus level and size
 */
export function getMercuryTypographyClasses(
  focusLevel: "focused" | "ambient" | "fog",
  size: "compact" | "standard" | "expanded"
) {
  return MERCURY_TYPOGRAPHY[focusLevel][size];
}

/**
 * Get Mercury accent bar configuration
 */
export function getMercuryAccentBarConfig(
  focusLevel: "focused" | "ambient" | "fog",
  status: "healthy" | "warning" | "critical" | "neutral"
) {
  if (focusLevel === "focused") {
    return (
      MERCURY_ACCENT_BARS.focused[
        status as keyof typeof MERCURY_ACCENT_BARS.focused
      ] || MERCURY_ACCENT_BARS.focused.healthy
    );
  }
  return MERCURY_ACCENT_BARS[focusLevel].all;
}

// ========================================
// MERCURY VALIDATION
// ========================================

/**
 * Validate Mercury component props
 */
export function validateMercuryProps(props: MercuryComponentProps): string[] {
  const errors: string[] = [];

  if (!props.intent) {
    errors.push("Mercury component MUST have intent prop");
  }

  if (
    props.focusLevel &&
    !["focused", "ambient", "fog"].includes(props.focusLevel)
  ) {
    errors.push("focusLevel must be one of: focused, ambient, fog");
  }

  return errors;
}

// ========================================
// MERCURY CSS CUSTOM PROPERTIES (Clean)
// ========================================

export const MERCURY_CSS_VARS = `
  :root {
    /* Mercury Focus System - Refined */
    --mercury-focused-scale: 1.02;
    --mercury-ambient-scale: 0.99;
    --mercury-fog-scale: 0.98;
    
    /* Mercury Opacity System - More Readable */
    --mercury-focused-opacity: 1;
    --mercury-ambient-opacity: 0.9;
    --mercury-fog-opacity: 0.75;
    
    /* Mercury Animation - Gentler */
    --mercury-easing: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    --mercury-duration: 500ms;
    
    /* Mercury Radius - Cleaner */
    --mercury-radius-module: 1rem;
    --mercury-radius-icon: 0.5rem;
  }
  
  /* Mercury Keyframes - More Natural */
  @keyframes mercury-enter {
    from {
      opacity: 0;
      transform: translateY(4px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  @keyframes mercury-pulse-gentle {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.98;
      transform: scale(1.005);
    }
  }
  
  @keyframes mercury-pulse-soft {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.96;
      transform: scale(1.01);
    }
  }
`;
