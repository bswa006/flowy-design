/**
 * Mercury OS Design System Utilities
 * Provides standard focus classes and animation utilities
 */

export type MercuryFocusLevel = "focused" | "ambient" | "fog";

/**
 * Gets Mercury-compliant focus classes based on focus level
 */
export function getMercuryFocusClasses(focusLevel: MercuryFocusLevel): string {
  switch (focusLevel) {
    case "focused":
      return "scale-[1.02] z-30 opacity-100 shadow-2xl shadow-blue-500/20 ring-1 ring-blue-300/40";
    case "ambient":
      return "scale-100 z-10 opacity-90";
    case "fog":
      return "scale-[0.98] z-0 opacity-40 pointer-events-none blur-[0.5px]";
  }
}

/**
 * Gets Mercury-compliant animation classes for interactive elements
 */
export function getMercuryAnimationClasses(
  isInteractive: boolean = true
): string {
  if (!isInteractive) return "";
  return "transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]";
}

/**
 * Mercury easing curve - natural motion following Daoist inexertion principles
 */
export const MERCURY_EASING = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * Standard Mercury animation durations
 */
export const MERCURY_DURATIONS = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slowest: 0.7,
} as const;
