import * as React from "react";

import { cn } from "@/lib/utils";

export interface MercuryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  intent: string;
  priority?: "primary" | "secondary" | "ambient";
  focusLevel?: "focused" | "ambient" | "fog";
}

const priorityClasses = {
  primary: "bg-mercury-primary hover:bg-mercury-focused text-white",
  secondary: "bg-mercury-surface-elevated hover:mercury-focused",
  ambient: "mercury-ambient hover:mercury-focused text-mercury-text-secondary",
};

const focusLevelClasses = {
  focused: "mercury-focused animate-mercury-focus",
  ambient: "mercury-ambient",
  fog: "mercury-fog",
};

export const MercuryButton = React.forwardRef<
  HTMLButtonElement,
  MercuryButtonProps
>(
  (
    {
      className,
      intent,
      priority = "primary",
      focusLevel = "ambient",
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      data-intent={intent}
      className={cn(
        "transition-all duration-300 ease-out focus:mercury-focused focus:outline-none active:scale-95",
        priorityClasses[priority],
        focusLevelClasses[focusLevel],
        className
      )}
      {...props}
    />
  )
);

MercuryButton.displayName = "MercuryButton";
