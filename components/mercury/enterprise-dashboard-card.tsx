"use client";

import React, { useCallback, useEffect, useState } from "react";

import {
  Activity,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Minus,
  MoreHorizontal,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

// Import Mercury design tokens
import { cn } from "@/lib/utils";

// Enterprise-grade Mercury interfaces
interface EnterpriseMetric {
  title: string;
  value: string | number;
  previousValue?: string | number;
  change?: {
    value: string;
    percentage: number;
    trend: "up" | "down" | "neutral";
    isSignificant?: boolean;
  };
  description?: string;
  status?: "healthy" | "warning" | "critical" | "neutral";
  sparklineData?: number[];
  actions?: Array<{
    label: string;
    intent: string;
    priority: "primary" | "secondary" | "ambient";
    icon?: React.ReactNode;
  }>;
  metadata?: {
    lastUpdated?: string;
    source?: string;
    confidence?: number;
  };
}

interface EnterpriseDashboardCardProps {
  intent: string;
  focusLevel?: "focused" | "ambient" | "fog";
  data: EnterpriseMetric;
  size?: "compact" | "standard" | "expanded";
  variant?: "default" | "premium" | "executive";
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onAction?: (actionIntent: string) => void;
  isInteractive?: boolean;
  showProgressiveDetails?: boolean;
  isLoading?: boolean;
}

// Clean enterprise status colors using Mercury tokens
const getEnterpriseStatusColors = (status: EnterpriseMetric["status"]) => {
  return {
    bg: "bg-white",
    border: "border-slate-200/50",
    text: "text-slate-700",
    icon: "text-slate-500",
    glow: "shadow-slate-100/30",
    ring: "ring-slate-200/20",
  };
};

// Clean focus styling using Mercury tokens
const getEnterpriseFocusClasses = (
  focusLevel: "focused" | "ambient" | "fog",
  variant: "default" | "premium" | "executive"
) => {
  const focusConfig = {
    scale: "scale-100",
    zIndex: "z-10",
    opacity: "opacity-100",
    contrast: "contrast-100",
    brightness: "brightness-100",
    saturate: "saturate-100",
    background: "bg-white",
    border: "border border-slate-200/50",
    shadow: "shadow-md shadow-slate-100/30",
    animation: "transition-all duration-300",
  };

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
    "ring" in focusConfig ? (focusConfig.ring as string) : "",
    "pointerEvents" in focusConfig ? (focusConfig.pointerEvents as string) : ""
  );
};

// Enterprise sparkline component
const EnterpriseSparkline = ({
  data,
  trend,
  className,
}: {
  data: number[];
  trend: "up" | "down" | "neutral";
  className?: string;
}) => {
  if (!data || data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  const trendColors = {
    up: "stroke-emerald-500",
    down: "stroke-red-500",
    neutral: "stroke-slate-400",
  };

  return (
    <div className={cn("w-16 h-8", className)}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(trendColors[trend], "drop-shadow-sm")}
        />
        {/* Gradient fill */}
        <defs>
          <linearGradient
            id={`gradient-${trend}`}
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopOpacity="0.3" />
            <stop offset="100%" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          points={`0,100 ${points} 100,100`}
          fill={`url(#gradient-${trend})`}
          className={trendColors[trend]}
        />
      </svg>
    </div>
  );
};

// Enterprise trend indicator with sophisticated styling
const EnterpriseTrendIndicator = ({
  change,
  sparklineData,
  size = "default",
}: {
  change: EnterpriseMetric["change"];
  sparklineData?: number[];
  size?: "compact" | "default" | "large";
}) => {
  if (!change) return null;

  const { trend, value, percentage, isSignificant } = change;

  const trendIcons = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
  };

  const TrendIcon = trendIcons[trend];

  const trendStyles = {
    up: cn(
      "text-emerald-700 bg-white border border-emerald-200/60",
      "shadow-md shadow-emerald-100/30",
      isSignificant && "ring-1 ring-emerald-200/40 animate-pulse-gentle"
    ),
    down: cn(
      "text-rose-700 bg-white border border-rose-200/60",
      "shadow-md shadow-rose-100/30",
      isSignificant && "ring-1 ring-rose-200/40 animate-pulse-soft"
    ),
    neutral: cn(
      "text-slate-600 bg-white border border-slate-200/50",
      "shadow-md shadow-slate-100/30"
    ),
  };

  const sizeClasses = {
    compact: "text-xs px-2 py-1",
    default: "text-sm px-3 py-1.5",
    large: "text-base px-4 py-2",
  };

  return (
    <div className="flex items-center space-x-2">
      <div
        className={cn(
          "inline-flex items-center space-x-1.5 rounded-lg font-medium backdrop-blur-sm",
          "shadow-sm transition-all duration-300",
          trendStyles[trend],
          sizeClasses[size]
        )}
      >
        <TrendIcon className="w-3.5 h-3.5" />
        <span>{value}</span>
        {isSignificant && (
          <Sparkles className="w-3 h-3 text-current opacity-60" />
        )}
      </div>

      {sparklineData && (
        <EnterpriseSparkline
          data={sparklineData}
          trend={trend}
          className="opacity-60"
        />
      )}
    </div>
  );
};

// Main Enterprise Dashboard Card
export function EnterpriseDashboardCard({
  intent,
  focusLevel = "ambient",
  data,
  size = "standard",
  variant = "default",
  className,
  style,
  onClick,
  onAction,
  isInteractive = false,
  showProgressiveDetails = false,
  isLoading = false,
}: EnterpriseDashboardCardProps) {
  const [showDetails, setShowDetails] = useState(showProgressiveDetails);
  const [isHovered, setIsHovered] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);

  const statusColors = getEnterpriseStatusColors(data.status);

  // Animate number counting
  useEffect(() => {
    if (typeof data.value === "number") {
      const targetValue = data.value;
      const duration = 1500;
      const steps = 60;
      const increment = targetValue / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
          setAnimatedValue(targetValue);
          clearInterval(timer);
        } else {
          setAnimatedValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [data.value]);

  const handleAction = useCallback(
    (actionIntent: string) => {
      console.log(`Enterprise Mercury Action: ${actionIntent} from ${intent}`);
      onAction?.(actionIntent);
    },
    [intent, onAction]
  );

  const handleCardClick = useCallback(() => {
    if (isInteractive) {
      if (focusLevel === "focused") {
        setShowDetails((prev) => !prev);
      }
      onClick?.();
    }
  }, [isInteractive, focusLevel, onClick]);

  const sizeClasses = {
    compact: "mercury-compact",
    standard: "mercury-standard",
    expanded: "mercury-expanded",
  };

  const StatusIcon =
    data.status === "healthy"
      ? CheckCircle2
      : data.status === "warning"
        ? AlertCircle
        : data.status === "critical"
          ? AlertCircle
          : Activity;

  return (
    <div
      data-intent={intent}
      className={cn(
        // MERCURY BASE: Clean module with natural motion
        "mercury-module relative overflow-hidden group cursor-pointer",
        "rounded-2xl", // Clean, refined corners

        // Focus level styling from Mercury tokens
        getEnterpriseFocusClasses(focusLevel, variant),

        // Size variations using Mercury tokens
        sizeClasses[size],

        // Clean status indication through subtle accents
        data.status === "warning" && statusColors.border,
        data.status === "critical" && statusColors.border,

        // Status animations - very subtle
        data.status === "warning" &&
          focusLevel === "focused" &&
          "animate-pulse-gentle",
        data.status === "critical" &&
          focusLevel === "focused" &&
          "animate-pulse-soft",

        // MERCURY INTERACTIVE: Clean micro-interactions
        isInteractive && [
          "hover:scale-[1.01] hover:shadow-lg hover:shadow-slate-200/40",
          "active:scale-[0.99] active:shadow-md",
          "focus-visible:ring-2 focus-visible:ring-slate-300/40 focus-visible:ring-offset-2",
        ],

        // Loading state
        isLoading && "animate-pulse",

        className
      )}
      style={style}
      role="region"
      aria-label={`${intent} enterprise dashboard card`}
      aria-describedby={`${intent}-description`}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (isInteractive && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Header with status and actions */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center space-x-3">
          <div
            className={cn(
              "p-3 rounded-lg",
              statusColors.bg,
              statusColors.border,
              statusColors.glow,
              // Clean status ring for focused cards
              focusLevel === "focused" && statusColors.ring
            )}
          >
            <StatusIcon className={cn("w-5 h-5", statusColors.icon)} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 text-sm leading-tight">
              {data.title}
            </h3>
            {data.metadata?.lastUpdated && (
              <p className="text-xs text-slate-500 mt-0.5">
                Updated {data.metadata.lastUpdated}
              </p>
            )}
          </div>
        </div>

        {/* Progressive disclosure trigger */}
        {data.actions && focusLevel === "focused" && (
          <button
            className={cn(
              "p-2 rounded-lg transition-all duration-300",
              "hover:bg-slate-100 focus:bg-slate-100",
              "opacity-0 group-hover:opacity-100",
              isHovered && "opacity-100"
            )}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              setShowDetails(!showDetails);
            }}
            aria-label="Toggle details"
          >
            <MoreHorizontal className="w-4 h-4 text-slate-600" />
          </button>
        )}
      </div>

      {/* Main metric display - Clean Mercury Typography */}
      <div className="mb-6">
        <div className="flex items-baseline space-x-4 mb-3">
          <span
            className={cn(
              // Mercury typography from tokens(focusLevel, size),
              "tabular-nums tracking-tight leading-none",
              statusColors.text
            )}
          >
            {typeof data.value === "number"
              ? animatedValue.toLocaleString()
              : data.value}
          </span>

          {data.change && (
            <div className="flex flex-col items-start space-y-1">
              <EnterpriseTrendIndicator
                change={data.change}
                sparklineData={data.sparklineData}
                size="large"
              />
              {/* Enhanced sparkline display */}
              {data.sparklineData && (
                <div className="opacity-70">
                  <EnterpriseSparkline
                    data={data.sparklineData}
                    trend={data.change.trend}
                    className="w-20 h-10"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {data.description && (
          <p className="text-sm font-medium leading-relaxed text-slate-600 mb-3">
            {data.description}
          </p>
        )}

        {/* Previous value comparison for context */}
        {data.previousValue && typeof data.value === "number" && (
          <p className="text-sm text-slate-500">
            Previous:{" "}
            {typeof data.previousValue === "number"
              ? data.previousValue.toLocaleString()
              : data.previousValue}
          </p>
        )}
      </div>

      {/* Progressive disclosure section */}
      {showDetails && data.actions && (
        <div
          className="mt-6 pt-4 border-t border-slate-200/60 space-y-2"
          id={`${intent}-description`}
        >
          {data.actions.map((action, index) => (
            <button
              key={action.intent}
              className={cn(
                "w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium",
                "transition-all duration-300 text-left",
                "hover:bg-slate-50 focus:bg-slate-50 focus:ring-2 focus:ring-blue-500/20",
                action.priority === "primary" &&
                  "bg-blue-600 text-white hover:bg-blue-700",
                action.priority === "secondary" &&
                  "border border-slate-200 hover:border-slate-300",
                action.priority === "ambient" && "opacity-70 hover:opacity-100"
              )}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleAction(action.intent);
              }}
              style={{
                animationDelay: `${index * 100}ms`,
                animationName: "mercury-enter",
                animationDuration: "0.4s",
                animationFillMode: "both",
              }}
            >
              <div className="flex items-center space-x-2">
                {action.icon}
                <span>{action.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-60" />
            </button>
          ))}
        </div>
      )}

      {/* Metadata footer */}
      {data.metadata && focusLevel === "focused" && (
        <div className="mt-4 pt-3 border-t border-slate-200/40">
          <div className="flex items-center justify-between text-xs text-slate-500">
            {data.metadata.source && (
              <span>Source: {data.metadata.source}</span>
            )}
            {data.metadata.confidence && (
              <span>Confidence: {data.metadata.confidence}%</span>
            )}
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

export type { EnterpriseDashboardCardProps, EnterpriseMetric };
