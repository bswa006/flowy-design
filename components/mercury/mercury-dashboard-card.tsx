"use client";

import React, { useState, useCallback } from "react";

import { ChevronRight, MoreHorizontal, TrendingUp } from "lucide-react";

import { getMercuryFocusClasses } from "@/lib/mercury-tokens";
import { cn } from "@/lib/utils";

// Temporary shadcn/ui components - replace with actual imports when available
const Card = ({ children, className, ...props }: any) => (
  <div className={cn("mercury-card", className)} {...props}>
    {children}
  </div>
);
const CardHeader = ({ children, className, ...props }: any) => (
  <div className={cn("px-6 py-4", className)} {...props}>
    {children}
  </div>
);
const CardTitle = ({ children, className, ...props }: any) => (
  <h3 className={cn("mercury-heading text-lg", className)} {...props}>
    {children}
  </h3>
);
const CardContent = ({ children, className, ...props }: any) => (
  <div className={cn("px-6 pb-4", className)} {...props}>
    {children}
  </div>
);
const Button = ({
  children,
  className,
  variant = "default",
  size = "default",
  ...props
}: any) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      variant === "default" && "mercury-button-primary px-4 py-2",
      variant === "outline" && "mercury-button-secondary px-4 py-2",
      variant === "ghost" && "hover:bg-slate-100 px-2 py-1",
      size === "sm" && "px-3 py-1.5 text-xs",
      className
    )}
    {...props}
  >
    {children}
  </button>
);
export const Badge = ({
  children,
  className,
  variant = "default",
  ...props
}: any) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      variant === "secondary" && "bg-slate-100 text-slate-800",
      className
    )}
    {...props}
  >
    {children}
  </span>
);

// Mercury-compliant TypeScript interfaces following docs/mercury-inspired-web-design-principles.md
interface MercuryDashboardCardProps {
  // REQUIRED: Every Mercury component must have intent
  intent: string;

  // Focus management following three-tier system (focused/ambient/fog)
  focusLevel?: "focused" | "ambient" | "fog";

  // Data structure following intention-driven design
  data: {
    title: string;
    value: string | number;
    change?: {
      value: string;
      trend: "up" | "down" | "neutral";
    };
    description?: string;
    actions?: Array<{
      label: string;
      intent: string;
      priority: "primary" | "secondary" | "ambient";
    }>;
  };

  // Mercury design system properties
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onAction?: (actionIntent: string) => void;

  // Cognitive accessibility support
  isInteractive?: boolean;
  showProgressiveDetails?: boolean;
}

// Clean Mercury focus styling using tokens
const getFocusClasses = (focusLevel: "focused" | "ambient" | "fog") => {
  const focusConfig = getMercuryFocusClasses(focusLevel);

  return cn(
    focusConfig.scale,
    focusConfig.zIndex,
    focusConfig.opacity,
    focusConfig.contrast,
    focusConfig.brightness,
    focusConfig.saturate,
    focusConfig.background,
    focusConfig.border,
    focusConfig.shadow,
    focusConfig.animation,
    "ring" in focusConfig ? focusConfig.ring : "",
    "pointerEvents" in focusConfig ? focusConfig.pointerEvents : ""
  );
};

// Mercury animation classes following Daoist inexertion principles
const getMercuryAnimationClasses = (isInteractive: boolean) => {
  return cn(
    // Natural transitions with Mercury easing curves
    "transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",

    // Interactive states following fluid principle
    isInteractive && [
      "cursor-pointer",
      "hover:scale-[1.02]",
      "hover:shadow-md",
      "active:scale-[0.98]",
      "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
    ],

    // Reduced motion support for accessibility
    "motion-reduce:transition-none motion-reduce:transform-none"
  );
};

// Clean Mercury trend indicator
const TrendIndicator = ({
  trend,
  value,
}: {
  trend: "up" | "down" | "neutral";
  value: string;
}) => {
  const trendStyles = {
    up: "text-emerald-600 bg-white border border-emerald-200/50",
    down: "text-rose-600 bg-white border border-rose-200/50",
    neutral: "text-slate-600 bg-white border border-slate-200/50",
  };

  return (
    <Badge
      variant="secondary"
      className={cn("text-xs font-medium shadow-sm", trendStyles[trend])}
    >
      {trend === "up" && <TrendingUp className="w-3 h-3 mr-1" />}
      {value}
    </Badge>
  );
};

// Main Mercury Dashboard Card Component
export function MercuryDashboardCard({
  intent,
  focusLevel = "ambient",
  data,
  className,
  style,
  onClick,
  onAction,
  isInteractive = false,
  showProgressiveDetails = false,
}: MercuryDashboardCardProps) {
  // Local state for progressive disclosure (focused principle)
  const [showDetails, setShowDetails] = useState(showProgressiveDetails);

  // Handle action with intention tracking
  const handleAction = useCallback(
    (actionIntent: string) => {
      console.log(
        `Mercury Action: ${actionIntent} from component intent: ${intent}`
      );
      onAction?.(actionIntent);
    },
    [intent, onAction]
  );

  // Handle card interaction following fluid principle
  const handleCardClick = useCallback(() => {
    if (isInteractive) {
      // Toggle progressive disclosure for focused elements
      if (focusLevel === "focused") {
        setShowDetails((prev) => !prev);
      }
      onClick?.();
    }
  }, [isInteractive, focusLevel, onClick]);

  return (
    <Card
      // REQUIRED: Mercury data-intent attribute for analytics
      data-intent={intent}
      // Clean Mercury styling
      className={cn(
        // Base Mercury module styling
        "mercury-module relative overflow-hidden rounded-2xl",

        // Focus level styling from tokens
        getFocusClasses(focusLevel),

        // Clean animation classes
        getMercuryAnimationClasses(isInteractive),

        // Custom classes
        className
      )}
      // Accessibility following WCAG 2.1 AAA
      role="region"
      aria-label={`${intent} dashboard card`}
      aria-describedby={`${intent}-description`}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={handleCardClick}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (isInteractive && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Progressive enhancement with staggered animation */}
      <div
        className="animate-[mercury-enter_0.4s_cubic-bezier(0.25,0.46,0.45,0.94)]"
        style={{ animationFillMode: "both" }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          {/* Title with Mercury typography scale */}
          <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {data.title}
          </CardTitle>

          {/* Actions with progressive disclosure */}
          {data.actions && focusLevel === "focused" && (
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  setShowDetails(!showDetails);
                }}
                aria-label="Toggle details"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent>
          {/* Main value with clean Mercury typography */}
          <div
            className={cn(
              "text-2xl font-bold text-slate-900 mb-2 tabular-nums"
            )}
          >
            {data.value}
          </div>

          {/* Trend indicator with selective contrast */}
          {data.change && (
            <div className="flex items-center space-x-2 mb-2">
              <TrendIndicator
                trend={data.change.trend}
                value={data.change.value}
              />
              {data.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {data.description}
                </p>
              )}
            </div>
          )}

          {/* Progressive disclosure section following focused principle */}
          {showDetails && data.actions && (
            <div
              className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2 animate-[mercury-fade_0.3s_ease-out] animate-fill-mode-both"
              id={`${intent}-description`}
            >
              {data.actions.map((action, index) => (
                <Button
                  key={action.intent}
                  variant={
                    action.priority === "primary" ? "default" : "outline"
                  }
                  size="sm"
                  className={cn(
                    "w-full justify-start text-xs",
                    // Mercury button styling based on priority
                    action.priority === "primary" &&
                      "bg-blue-600 hover:bg-blue-700 text-white",
                    action.priority === "secondary" &&
                      "border-slate-300 hover:bg-slate-50",
                    action.priority === "ambient" &&
                      "opacity-70 hover:opacity-100"
                  )}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleAction(action.intent);
                  }}
                  // Staggered animation delay
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationName: "mercury-enter",
                    animationDuration: "0.3s",
                    animationFillMode: "both",
                  }}
                >
                  {action.label}
                  <ChevronRight className="ml-auto h-3 w-3" />
                </Button>
              ))}
            </div>
          )}

          {/* Interaction hint for focused elements */}
          {isInteractive && focusLevel === "focused" && (
            <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">
              Click to {showDetails ? "hide" : "show"} actions
            </div>
          )}
        </CardContent>
      </div>

      {/* Focus ring for keyboard navigation */}
      {focusLevel === "focused" && (
        <div className="absolute inset-0 rounded-lg ring-1 ring-blue-200 dark:ring-blue-800 pointer-events-none" />
      )}
    </Card>
  );
}

// Mercury compound component for multiple cards with focus management
interface MercuryDashboardGridProps {
  cards: Array<{
    intent: string;
    data: MercuryDashboardCardProps["data"];
  }>;
  defaultFocusIndex?: number;
  className?: string;
}

export function MercuryDashboardGrid({
  cards,
  defaultFocusIndex = 0,
  className,
}: MercuryDashboardGridProps) {
  const [focusedIndex, setFocusedIndex] = useState(defaultFocusIndex);

  // Mercury focus management hook pattern
  const getFocusLevel = useCallback(
    (index: number): "focused" | "ambient" | "fog" => {
      if (index === focusedIndex) return "focused";
      if (Math.abs(index - focusedIndex) <= 1) return "ambient";
      return "fog";
    },
    [focusedIndex]
  );

  return (
    <div
      className={cn(
        // Mercury grid following responsive design principles
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
        "p-6",
        className
      )}
      data-intent="dashboard-overview"
      role="region"
      aria-label="Dashboard overview with focus management"
    >
      {cards.map((card, index) => (
        <MercuryDashboardCard
          key={card.intent}
          intent={card.intent}
          data={card.data}
          focusLevel={getFocusLevel(index)}
          isInteractive={true}
          onClick={() => setFocusedIndex(index)}
          // Staggered entrance animation
          className="animate-[mercury-enter_0.4s_cubic-bezier(0.25,0.46,0.45,0.94)]"
          style={
            {
              animationDelay: `${index * 100}ms`,
              animationFillMode: "both",
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

// Export types for consumers
export type { MercuryDashboardCardProps, MercuryDashboardGridProps };
