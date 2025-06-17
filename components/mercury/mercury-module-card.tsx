"use client";

import React, { useEffect, useRef } from "react";

import { motion, useAnimation } from "framer-motion";

import { getMercuryAnimationClasses } from "@/lib/mercury-utils";
import { cn } from "@/lib/utils";

// Re-introducing temporary shadcn/ui components
const Card = ({ children, className, ...props }: any) => (
  <div
    className={cn(
      "mercury-card bg-transparent border-0 shadow-none",
      className
    )}
    {...props}
  >
    {children}
  </div>
);
const CardHeader = ({ children, className, ...props }: any) => (
  <div className={cn("p-4 pb-2", className)} {...props}>
    {children}
  </div>
);
const CardTitle = ({ children, className, ...props }: any) => (
  <h3
    className={cn(
      "text-lg font-semibold text-slate-800 dark:text-slate-200",
      className
    )}
    {...props}
  >
    {children}
  </h3>
);
const CardContent = ({ children, className, ...props }: any) => (
  <div
    className={cn("p-4 pt-2 text-slate-600 dark:text-slate-400", className)}
    {...props}
  >
    {children}
  </div>
);

interface MercuryModuleCardProps {
  intent: string;
  focusLevel?: "focused" | "ambient" | "fog";
  title: string;
  children: React.ReactNode;
  isInteractive?: boolean;
  onClick?: () => void;
  className?: string;
  // New props for sequential animation
  isNew?: boolean;
  onAnimationComplete?: () => void;
}

export function MercuryModuleCard({
  intent,
  focusLevel = "ambient",
  title,
  children,
  isInteractive = false,
  onClick,
  className,
  isNew = false,
  onAnimationComplete,
}: MercuryModuleCardProps) {
  const controls = useAnimation();

  // Your detailed animation breakdown translated to code
  useEffect(() => {
    const sequence = async () => {
      if (isNew) {
        // 1. Adding a New Card: Slide in
        await controls.start({
          opacity: 1,
          x: 0,
          transition: {
            type: "spring",
            stiffness: 200,
            damping: 20,
            duration: 0.5,
          },
        });

        // 2. Post-Insert Settling: Overshoot and return
        await controls.start({
          x: -5, // Overshoot
          transition: {
            type: "spring",
            stiffness: 200,
            damping: 20,
            duration: 0.15,
          },
        });
        await controls.start({
          x: 0, // Settle back
          transition: {
            type: "spring",
            stiffness: 200,
            damping: 20,
            duration: 0.15,
          },
        });

        // Notify parent that the full sequence is complete
        onAnimationComplete?.();
      }
    };
    sequence();
  }, [isNew, controls, onAnimationComplete]);

  return (
    <motion.div
      data-intent={intent}
      className={cn(
        "mercury-module",
        getMercuryAnimationClasses(isInteractive), // Focus level styling
        "relative overflow-hidden rounded-2xl w-80 flex-shrink-0",
        "bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800",
        "shadow-lg shadow-slate-200/40 dark:shadow-slate-900/40",
        isInteractive && "cursor-pointer hover:shadow-xl",
        className
      )}
      onClick={onClick}
      // Use Framer Motion's "animate" prop with the controls
      initial={{ opacity: isNew ? 0 : 1, x: isNew ? 50 : 0 }}
      animate={controls}
      layout
    >
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
}
