"use client";

import React, { useState, useCallback } from "react";

import { MapPin, Navigation, Plus, Star } from "lucide-react";

import {
  type MercuryComponentProps,
  validateMercuryProps,
} from "@/lib/mercury-tokens";
import { cn } from "@/lib/utils";

interface LocationData {
  title: string;
  address: string;
  distance: string;
  status: "open" | "closed" | "busy" | "neutral";
  rating?: number;
  type: string;
  lastUpdated?: string;
  phone?: string;
}

interface LocationCardProps extends MercuryComponentProps {
  data: LocationData;
  onNavigate?: () => void;
  onCall?: () => void;
  stepNumber?: number;
  showNextIndicator?: boolean;
  onRevealNext?: () => void;
}

export function LocationCard({
  intent,
  focusLevel = "ambient",
  size = "compact",
  data,
  className,
  style,
  isInteractive = true,
  stepNumber,
  showNextIndicator = false,
  onNavigate,
  onCall,
  onRevealNext,
  ...props
}: LocationCardProps) {
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

  const handleNavigate = useCallback(() => {
    console.log(`Mercury Action: navigate from location: ${intent}`);
    onNavigate?.();
  }, [intent, onNavigate]);

  const handleRevealNext = useCallback(() => {
    console.log(`Mercury Action: reveal next from location: ${intent}`);
    onRevealNext?.();
  }, [intent, onRevealNext]);

  return (
    <div className="relative">
      {/* Step Number Badge with Connecting Line - More Subtle */}
      {stepNumber && (
        <div className="absolute -left-12 top-8 flex items-center">
          <div className="w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-medium text-xs z-10 border border-gray-200">
            {stepNumber}
          </div>
          {/* Connecting line - Much lighter */}
          <div className="absolute left-3 top-6 w-px h-40 bg-gray-100"></div>
        </div>
      )}

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
        aria-label={`${intent} location component`}
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
          {/* Header Section - Much More Subtle */}
          <div className="flex items-start justify-between mb-4">
            {/* Location Info */}
            <div className="flex items-start space-x-3 flex-1">
              {/* Location Icon - Very subtle */}
              <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-1 leading-tight">
                  {data.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2 font-normal">
                  {data.type}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {data.address}
                </p>
              </div>
            </div>

            {/* Status - Very minimal */}
            <div className="flex items-start space-x-2 flex-shrink-0 ml-3">
              {/* Status indicator - tiny dot */}
              <div
                className={cn(
                  "w-2 h-2 rounded-full mt-2",
                  data.status === "open" && "bg-emerald-400",
                  data.status === "busy" && "bg-amber-400",
                  data.status === "closed" && "bg-red-400",
                  data.status === "neutral" && "bg-gray-300"
                )}
              />
            </div>
          </div>

          {/* Distance and Rating Row - Minimal */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1 text-gray-500">
              <Navigation className="h-3 w-3" />
              <span className="text-sm font-medium">{data.distance}</span>
            </div>

            {data.rating && (
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                <span className="text-sm font-medium text-gray-700">
                  {data.rating}
                </span>
              </div>
            )}
          </div>

          {/* Navigate Button - Much smaller and subtle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate();
            }}
            className="w-full bg-gray-900 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 hover:bg-gray-800 flex items-center justify-center space-x-2 text-sm"
          >
            <Navigation className="h-3 w-3" />
            <span>Navigate</span>
          </button>
        </div>

        {/* Click to Reveal Next Tooltip */}
        {showNextIndicator && showTooltip && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="bg-white rounded-lg shadow-lg px-4 py-2 flex items-center space-x-2 border border-gray-200">
              <Plus className="h-3 w-3 text-gray-600" />
              <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
                Click to reveal next
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export type { LocationCardProps };
