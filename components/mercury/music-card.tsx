"use client";

import React, { useState, useCallback } from "react";

import { MoreHorizontal, Play } from "lucide-react";

import {
  type MercuryComponentProps,
  validateMercuryProps,
} from "@/lib/mercury-tokens";
import { cn } from "@/lib/utils";

interface MusicData {
  title: string;
  artist: string;
  album?: string;
  artwork?: string;
  duration: string;
  currentTime: string;
  progress: number;
  status: "playing" | "paused" | "buffering" | "neutral";
  platform: string;
  isLiked?: boolean;
  playlist?: string;
}

interface MusicCardProps extends MercuryComponentProps {
  data: MusicData;
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onLike?: () => void;
  showNextIndicator?: boolean;
  onRevealNext?: () => void;
}

export function MusicCard({
  intent,
  focusLevel = "ambient",
  size = "compact",
  data,
  className,
  style,
  isInteractive = true,
  showNextIndicator = false,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onLike,
  onRevealNext,
  ...props
}: MusicCardProps) {
  // Mercury validation (required for compliance)
  const validationErrors = validateMercuryProps({
    intent,
    focusLevel,
    size,
    isInteractive,
  });
  if (validationErrors.length > 0) {
    console.error("Mercury Validation Errors:", validationErrors);
  }

  const [showTooltip, setShowTooltip] = useState(false);

  const handlePlayPause = useCallback(() => {
    console.log(
      `Mercury Action: ${data.status === "playing" ? "pause" : "play"} from music: ${intent}`
    );
    if (data.status === "playing") {
      onPause?.();
    } else {
      onPlay?.();
    }
  }, [intent, data.status, onPlay, onPause]);

  const handleRevealNext = useCallback(() => {
    console.log(`Mercury Action: reveal next from music: ${intent}`);
    onRevealNext?.();
  }, [intent, onRevealNext]);

  return (
    <div
      data-intent={intent}
      className={cn(
        "mercury-module relative overflow-hidden group",
        // Subtle white card with minimal shadow - no thick borders
        "bg-white rounded-2xl border border-gray-100",
        "shadow-sm hover:shadow-md transition-shadow duration-300",

        // Mercury focus level adjustments
        focusLevel === "focused" && "ring-1 ring-gray-200",
        focusLevel === "fog" && "opacity-70 pointer-events-none",

        // Interactive states - minimal
        isInteractive && "cursor-pointer",

        className
      )}
      role="region"
      aria-label={`${intent} music component`}
      tabIndex={isInteractive ? 0 : undefined}
      onMouseEnter={() => {
        if (showNextIndicator) setShowTooltip(true);
      }}
      onMouseLeave={() => {
        setShowTooltip(false);
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
            {/* Music indicator - subtle icon */}
            <div className="w-4 h-4 bg-gray-100 rounded-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-400 rounded-sm" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {data.title} • {data.platform}
            </span>
          </div>

          {/* Status indicator - small dot */}
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              data.status === "playing" && "bg-emerald-400",
              data.status === "paused" && "bg-gray-300",
              data.status === "buffering" && "bg-amber-400",
              data.status === "neutral" && "bg-gray-300"
            )}
          />
        </div>

        {/* Main Content Area - Minimal */}
        <div className="flex space-x-3 mb-4">
          {/* Album Artwork - Smaller */}
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200">
            {data.artwork ? (
              <img
                src={data.artwork}
                alt={`${data.title} artwork`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Play className="h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>

          {/* Song Information - Compact */}
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-1 leading-tight">
              {data.title}
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              Single by {data.artist}
            </p>

            {/* Action Buttons - Much smaller */}
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPause();
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md transition-colors text-xs"
              >
                Play
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLike?.();
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md transition-colors text-xs"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Track Listing - Minimal */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3 text-gray-600">
            <span className="text-xs w-3">1</span>
            <span className="text-xs">Blue</span>
          </div>

          <div className="flex items-center space-x-3 text-gray-600">
            <span className="text-xs w-3">2</span>
            <span className="text-xs">{data.title}</span>
          </div>

          {/* More Actions - Much smaller */}
          <button className="flex items-center space-x-1 text-xs text-gray-400 hover:text-gray-600 transition-colors pt-1">
            <MoreHorizontal className="h-3 w-3" />
            <span>More actions</span>
          </button>
        </div>
      </div>

      {/* Click to Reveal Next Tooltip */}
      {showNextIndicator && showTooltip && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="bg-white rounded-lg shadow-lg px-4 py-2 flex items-center space-x-2 border border-gray-200">
            <Play className="h-3 w-3 text-gray-600" />
            <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
              Click to reveal next
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export type { MusicCardProps };
