"use client";

import * as React from "react";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import {
  FlowyCard,
  FlowyCardContent,
  FlowyCardFooter,
  FlowyCardHeader,
} from "./flowy-card";

interface SkeletonProps {
  className?: string;
  variant?: "default" | "rounded" | "circular";
  animation?: "pulse" | "wave" | "none";
}

export function Skeleton({
  className,
  variant = "default",
  animation = "pulse",
}: SkeletonProps) {
  const baseClasses =
    "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700";

  const variantClasses = {
    default: "rounded-md",
    rounded: "rounded-lg",
    circular: "rounded-full",
  };

  const animationVariants = {
    pulse: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
    wave: {
      backgroundPosition: ["-200px 0", "calc(200px + 100%) 0", "-200px 0"],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      },
    },
    none: {},
  };

  return (
    <motion.div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animation === "wave" &&
          "bg-gradient-to-r from-gray-200 via-gray-50 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700",
        className
      )}
      animate={animation !== "none" ? animationVariants[animation] : undefined}
      style={
        animation === "wave" ? { backgroundSize: "200px 100%" } : undefined
      }
    />
  );
}

// Specialized skeleton components
export function FlowyCardSkeleton({
  variant = "default",
  showFooter = true,
  className,
}: {
  variant?: "email" | "calendar" | "conversation" | "default";
  showFooter?: boolean;
  className?: string;
}) {
  const skeletonVariants = {
    email: <EmailCardSkeleton />,
    calendar: <CalendarCardSkeleton />,
    conversation: <ConversationCardSkeleton />,
    default: <DefaultCardSkeleton showFooter={showFooter} />,
  };

  return (
    <FlowyCard variant="default" className={cn("animate-pulse", className)}>
      {skeletonVariants[variant]}
    </FlowyCard>
  );
}

function DefaultCardSkeleton({ showFooter }: { showFooter: boolean }) {
  return (
    <>
      <FlowyCardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <Skeleton variant="circular" className="h-4 w-4" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton variant="circular" className="h-4 w-4" />
        </div>
      </FlowyCardHeader>

      <FlowyCardContent>
        <div className="space-y-3">
          <Skeleton className="h-6 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </FlowyCardContent>

      {showFooter && (
        <FlowyCardFooter>
          <div className="flex space-x-2 w-full">
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 flex-1" />
          </div>
        </FlowyCardFooter>
      )}
    </>
  );
}

function EmailCardSkeleton() {
  return (
    <>
      <FlowyCardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <Skeleton variant="circular" className="h-4 w-4" />
            <div className="min-w-0 flex-1 space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton variant="circular" className="h-4 w-4" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </FlowyCardHeader>

      <FlowyCardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="text-right">
            <Skeleton className="h-4 w-12 ml-auto" />
          </div>
        </div>
      </FlowyCardContent>

      <FlowyCardFooter>
        <div className="flex space-x-2 w-full">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
        </div>
      </FlowyCardFooter>
    </>
  );
}

function CalendarCardSkeleton() {
  return (
    <>
      <FlowyCardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 flex-1">
            <Skeleton variant="circular" className="h-4 w-4" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
          <Skeleton variant="circular" className="h-4 w-4" />
        </div>
      </FlowyCardHeader>

      <FlowyCardContent>
        <div className="space-y-4">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-full" />

          <div className="space-y-2">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          <div className="grid grid-cols-2 gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </div>
      </FlowyCardContent>

      <FlowyCardFooter>
        <div className="space-y-3 w-full">
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
          </div>
        </div>
      </FlowyCardFooter>
    </>
  );
}

function ConversationCardSkeleton() {
  return (
    <>
      <FlowyCardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 flex-1">
            <Skeleton className="h-4 w-4 rounded-sm" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
          <Skeleton variant="circular" className="h-4 w-4" />
        </div>
      </FlowyCardHeader>

      <FlowyCardContent>
        <div className="space-y-3">
          {/* Message bubbles */}
          <div className="flex justify-start">
            <div className="max-w-[80%]">
              <div className="flex items-center space-x-2 mb-1">
                <Skeleton variant="circular" className="h-5 w-5" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-3 w-12 mt-1" />
            </div>
          </div>

          <div className="flex justify-end">
            <div className="max-w-[80%]">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-3 w-12 mt-1 ml-auto" />
            </div>
          </div>

          <div className="flex justify-start">
            <div className="max-w-[80%]">
              <div className="flex items-center space-x-2 mb-1">
                <Skeleton variant="circular" className="h-5 w-5" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-3 w-12 mt-1" />
            </div>
          </div>
        </div>
      </FlowyCardContent>

      <FlowyCardFooter>
        <div className="flex items-center space-x-2 w-full">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-16" />
        </div>
      </FlowyCardFooter>
    </>
  );
}

// Hook for managing loading states
export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = React.useState(initialState);
  const [error, setError] = React.useState<Error | null>(null);

  const startLoading = React.useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const stopLoading = React.useCallback(() => {
    setIsLoading(false);
  }, []);

  const setLoadingError = React.useCallback((error: Error) => {
    setError(error);
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setError: setLoadingError,
  };
}
