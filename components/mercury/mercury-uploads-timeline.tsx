"use client";

import * as React from "react";

import { motion } from "framer-motion";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MERCURY_DURATIONS,
  MERCURY_EASING,
  MercuryFocusLevel,
  getMercuryAnimationClasses,
} from "@/lib/mercury-utils";
import { cn } from "@/lib/utils";

export interface TimelineUpload {
  id: string;
  date: Date;
  status: "upload" | "checkpoint" | "failed" | "current";
  title?: string;
  description?: string;
}

interface MercuryUploadsTimelineProps {
  intent: string; // Required Mercury prop
  focusLevel?: MercuryFocusLevel;
  uploads: TimelineUpload[];
  totalUploads: number;
  checkpointCount: number;
  currentPage?: number;
  uploadsOnPage?: number;
  className?: string;
}

interface TimelineMarkerProps {
  intent: string;
  upload: TimelineUpload;
  position: number; // 0-100 percentage position
  focusLevel: MercuryFocusLevel;
}

function TimelineMarker({
  intent,
  upload,
  position,
  focusLevel,
}: TimelineMarkerProps) {
  const getMarkerConfig = () => {
    switch (upload.status) {
      case "failed":
        return {
          size: "w-3 h-3",
          gradient: "bg-gradient-to-br from-red-400 via-red-500 to-red-600",
          ring: "ring-2 ring-red-200/60",
          shadow: "shadow-lg shadow-red-500/25",
          pulse: "animate-pulse",
        };
      case "current":
        return {
          size: "w-4 h-4",
          gradient:
            "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900",
          ring: "ring-3 ring-slate-300/80",
          shadow: "shadow-xl shadow-slate-600/30",
          pulse: "",
        };
      case "checkpoint":
        return {
          size: "w-3.5 h-3.5",
          gradient:
            "bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600",
          ring: "ring-2 ring-emerald-200/70",
          shadow: "shadow-lg shadow-emerald-500/25",
          pulse: "",
        };
      case "upload":
      default:
        return {
          size: "w-2.5 h-2.5",
          gradient:
            "bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500",
          ring: "ring-1 ring-slate-200/60",
          shadow: "shadow-md shadow-slate-400/20",
          pulse: "",
        };
    }
  };

  const config = getMarkerConfig();

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <motion.button
          data-intent={`${intent}-marker-${upload.id}`}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group",
            "hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400/50 rounded-full",
            getMercuryAnimationClasses(true),
            // Focus level styling handled by getMercuryAnimationClasses
          )}
          style={{ left: `${position}%` }}
          aria-label={`${upload.status} on ${upload.date.toLocaleDateString()}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: MERCURY_DURATIONS.normal,
            ease: MERCURY_EASING,
            delay: position * 0.008, // Subtle stagger
          }}
          whileHover={{
            scale: 1.15,
            transition: { duration: MERCURY_DURATIONS.fast },
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
            }
          }}
        >
          <div
            className={cn(
              config.size,
              config.gradient,
              config.ring,
              config.shadow,
              config.pulse,
              "rounded-full transition-all duration-300 backdrop-blur-sm",
              "group-hover:shadow-2xl transform-gpu"
            )}
          />
        </motion.button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="bg-slate-900/95 text-white border-slate-700/50 shadow-2xl backdrop-blur-md"
        sideOffset={8}
      >
        <div className="space-y-1.5 py-1">
          <div className="font-semibold text-sm capitalize text-slate-100">
            {upload.status}
          </div>
          <div className="text-xs text-slate-300 font-medium">
            {upload.date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          {upload.title && (
            <div className="text-xs text-slate-400 max-w-48 leading-relaxed">
              {upload.title}
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export function MercuryUploadsTimeline({
  intent,
  focusLevel = "ambient",
  uploads,
  totalUploads,
  checkpointCount,
  currentPage = 1,
  uploadsOnPage,
  className,
}: MercuryUploadsTimelineProps) {
  // Calculate date range
  const sortedUploads = [...uploads].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
  const startDate = sortedUploads[0]?.date;
  const endDate = sortedUploads[sortedUploads.length - 1]?.date;

  // Calculate positions for markers
  const getMarkerPosition = (date: Date) => {
    if (!startDate || !endDate || startDate.getTime() === endDate.getTime()) {
      return 50; // Center single point
    }
    const totalTime = endDate.getTime() - startDate.getTime();
    const timeFromStart = date.getTime() - startDate.getTime();
    return Math.max(5, Math.min(95, (timeFromStart / totalTime) * 90 + 5)); // 5-95% range
  };

  const displayUploadsCount = uploadsOnPage || uploads.length;

  const legendItems = [
    {
      status: "upload",
      label: "Upload",
      indicator:
        "w-2.5 h-2.5 bg-gradient-to-br from-slate-300 to-slate-500 ring-1 ring-slate-200/60",
    },
    {
      status: "current",
      label: "Current View",
      indicator:
        "w-3 h-3 bg-gradient-to-br from-slate-700 to-slate-900 ring-2 ring-slate-300/60",
    },
    {
      status: "checkpoint",
      label: "Checkpoint",
      indicator:
        "w-3 h-3 bg-gradient-to-br from-emerald-400 to-emerald-600 ring-2 ring-emerald-200/60",
    },
    {
      status: "failed",
      label: "Failed",
      indicator:
        "w-2.5 h-2.5 bg-gradient-to-br from-red-400 to-red-600 ring-2 ring-red-200/60",
    },
  ];

  return (
    <TooltipProvider>
      <motion.div
        data-intent={intent}
        className={cn(
          "mercury-module relative",
          "px-6 py-3",
          // Focus level classes applied via getMercuryAnimationClasses
          getMercuryAnimationClasses(true),
          className
        )}
        role="region"
        aria-label={`${intent} uploads timeline`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: MERCURY_DURATIONS.normal,
          ease: MERCURY_EASING,
        }}
      >
        {/* Ultra-Compact Header */}
        <motion.div
          className="flex items-center justify-between mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: MERCURY_DURATIONS.fast,
            ease: MERCURY_EASING,
          }}
        >
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              All Uploads Timeline
            </h2>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-100/60 rounded-full">
              <div className="w-1 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full animate-pulse" />
              <span className="font-medium text-slate-700 text-xs">
                {uploads.length} uploads
              </span>
            </div>
          </div>

          <div className="text-xs font-medium text-slate-500">
            {checkpointCount} checkpoints out of {totalUploads} total uploads
            {currentPage && (
              <span className="text-slate-400 ml-1">
                (showing {displayUploadsCount} on this page)
              </span>
            )}
          </div>
        </motion.div>

        {/* Inline Date Range */}
        <motion.div
          className="flex items-center justify-between mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: MERCURY_DURATIONS.fast,
            ease: MERCURY_EASING,
            delay: 0.1,
          }}
        >
          <div className="text-xs font-medium text-slate-500">
            {startDate?.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>

          <div className="text-xs font-medium text-slate-500">
            {endDate?.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </motion.div>

        {/* Ultra-Compact Timeline */}
        <motion.div
          className="relative mb-2 px-2"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{
            duration: MERCURY_DURATIONS.normal,
            ease: MERCURY_EASING,
            delay: 0.15,
          }}
          style={{ transformOrigin: "left" }}
        >
          {/* Thin Timeline Line */}
          <div className="relative h-0.5 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-full">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-slate-400/20 to-emerald-400/20 rounded-full" />
          </div>

          {/* Timeline Markers */}
          {uploads.map((upload) => (
            <TimelineMarker
              key={upload.id}
              intent={intent}
              upload={upload}
              position={getMarkerPosition(upload.date)}
              focusLevel={focusLevel}
            />
          ))}
        </motion.div>

        {/* Minimal Legend */}
        <motion.div
          data-intent={`${intent}-legend`}
          className={cn(
            "flex items-center justify-between pt-2 border-t border-slate-200/40",
            // Focus level styling handled by parent component
          )}
          role="list"
          aria-label="Timeline legend"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: MERCURY_DURATIONS.fast,
            ease: MERCURY_EASING,
            delay: 0.2,
          }}
        >
          <div className="flex items-center gap-3">
            {legendItems.map((item) => (
              <motion.div
                key={item.status}
                className="flex items-center gap-1"
                role="listitem"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: MERCURY_DURATIONS.fast }}
              >
                <div
                  className={cn("rounded-full", item.indicator)}
                  aria-hidden="true"
                />
                <span className="text-xs font-medium text-slate-600 select-none">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
          <div className="text-xs text-slate-400 italic font-light">
            Hover for details
          </div>
        </motion.div>
      </motion.div>
    </TooltipProvider>
  );
}
