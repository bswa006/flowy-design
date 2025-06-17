"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "p"
    | "lead"
    | "large"
    | "small"
    | "muted"
    | "code";
  mercury?: boolean;
  as?: React.ElementType;
}

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  (
    { className, variant = "p", mercury = true, as, children, ...props },
    ref
  ) => {
    // Mercury-level typography variants
    const mercuryVariants = {
      h1: "text-mercury-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50",
      h2: "text-mercury-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50",
      h3: "text-mercury-xl font-semibold tracking-tight text-gray-900 dark:text-gray-50",
      h4: "text-mercury-lg font-medium tracking-tight text-gray-900 dark:text-gray-100",
      h5: "text-mercury-base font-medium tracking-tight text-gray-900 dark:text-gray-100",
      h6: "text-mercury-sm font-medium tracking-tight text-gray-900 dark:text-gray-100",
      p: "text-mercury-base leading-relaxed text-gray-700 dark:text-gray-300",
      lead: "text-mercury-lg leading-relaxed text-gray-800 dark:text-gray-200 font-medium",
      large: "text-mercury-lg font-medium text-gray-900 dark:text-gray-100",
      small: "text-mercury-sm text-gray-600 dark:text-gray-400",
      muted: "text-mercury-sm text-gray-500 dark:text-gray-500",
      code: "text-mercury-sm font-mono bg-mercury-glass-200 dark:bg-mercury-glass-dark-200 px-1.5 py-0.5 rounded-mercury-xs",
    };

    // Legacy typography variants
    const legacyVariants = {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      h5: "scroll-m-20 text-lg font-semibold tracking-tight",
      h6: "scroll-m-20 text-base font-semibold tracking-tight",
      p: "leading-7 [&:not(:first-child)]:mt-6",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
      code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
    };

    const variants = mercury ? mercuryVariants : legacyVariants;

    // Determine the HTML element
    const Component =
      as ||
      (variant.startsWith("h")
        ? variant
        : variant === "p" || variant === "lead"
          ? "p"
          : variant === "code"
            ? "code"
            : "span");

    return React.createElement(
      Component,
      {
        ref,
        className: cn(
          variants[variant],
          mercury && "transition-colors duration-200",
          className
        ),
        ...props,
      },
      children
    );
  }
);

Typography.displayName = "Typography";

// Mercury-enhanced card typography components
export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { mercury?: boolean }
>(({ className, mercury = true, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      mercury
        ? [
            "font-semibold leading-tight text-gray-900 dark:text-gray-50",
            "text-mercury-lg tracking-tight",
            "transition-colors duration-200",
          ]
        : ["text-lg font-semibold text-gray-900 dark:text-gray-100"],
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { mercury?: boolean }
>(({ className, mercury = true, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      mercury
        ? [
            "text-mercury-sm text-gray-600 dark:text-gray-400 leading-relaxed",
            "transition-colors duration-200",
          ]
        : ["text-sm text-gray-600 dark:text-gray-400"],
      className
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardCaption = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { mercury?: boolean }
>(({ className, mercury = true, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      mercury
        ? [
            "text-mercury-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wide",
            "transition-colors duration-200",
          ]
        : [
            "text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wide",
          ],
      className
    )}
    {...props}
  />
));
CardCaption.displayName = "CardCaption";

export const CardLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & { mercury?: boolean }
>(({ className, mercury = true, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      mercury
        ? [
            "text-mercury-sm font-medium text-gray-700 dark:text-gray-300",
            "transition-colors duration-200",
          ]
        : ["text-sm font-medium text-gray-700 dark:text-gray-300"],
      className
    )}
    {...props}
  />
));
CardLabel.displayName = "CardLabel";

export const CardMeta = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { mercury?: boolean }
>(({ className, mercury = true, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      mercury
        ? [
            "text-mercury-xs text-gray-500 dark:text-gray-500",
            "transition-colors duration-200",
          ]
        : ["text-xs text-gray-500 dark:text-gray-500"],
      className
    )}
    {...props}
  />
));
CardMeta.displayName = "CardMeta";

// Add missing CardSubtitle component
export const CardSubtitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { mercury?: boolean }
>(({ className, mercury = true, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      mercury
        ? [
            "text-mercury-sm font-medium text-gray-600 dark:text-gray-400",
            "transition-colors duration-200",
          ]
        : ["text-sm font-medium text-gray-600 dark:text-gray-300"],
      className
    )}
    {...props}
  />
));
CardSubtitle.displayName = "CardSubtitle";

// Add missing ErrorText component
export const ErrorText = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { mercury?: boolean }
>(({ className, mercury = true, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      mercury
        ? [
            "text-mercury-sm font-medium text-red-600 dark:text-red-400",
            "transition-colors duration-200",
          ]
        : ["text-sm font-medium text-red-600 dark:text-red-400"],
      className
    )}
    {...props}
  />
));
ErrorText.displayName = "ErrorText";

// Advanced typography utilities
export const TextGradient = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    from?: string;
    to?: string;
    mercury?: boolean;
  }
>(
  (
    {
      className,
      from = "from-mercury-blue-600",
      to = "to-purple-600",
      mercury = true,
      ...props
    },
    ref
  ) => (
    <span
      ref={ref}
      className={cn(
        "bg-gradient-to-r bg-clip-text text-transparent",
        from,
        to,
        mercury && "transition-all duration-200",
        className
      )}
      {...props}
    />
  )
);
TextGradient.displayName = "TextGradient";

export const TextHighlight = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { mercury?: boolean }
>(({ className, mercury = true, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      mercury
        ? [
            "bg-mercury-blue-100 dark:bg-mercury-blue-900 text-mercury-blue-900 dark:text-mercury-blue-100",
            "px-1.5 py-0.5 rounded-mercury-xs font-medium",
            "transition-colors duration-200",
          ]
        : [
            "bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100",
            "px-1 py-0.5 rounded font-medium",
          ],
      className
    )}
    {...props}
  />
));
TextHighlight.displayName = "TextHighlight";
