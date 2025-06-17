"use client";

import * as React from "react";

import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";

import {
  FlowyCard,
  FlowyCardContent,
  FlowyCardHeader,
  FlowyCardTitle,
} from "./flowy-card";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class FlowyErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    this.props.onError?.(error, errorInfo);

    // Log error to analytics service
    if (typeof window !== "undefined") {
      console.error("FlowyCard Error:", error, errorInfo);
    }
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent error={this.state.error} retry={this.retry} />
        );
      }

      return (
        <DefaultErrorFallback error={this.state.error} retry={this.retry} />
      );
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({
  error,
  retry,
}: {
  error?: Error;
  retry: () => void;
}) {
  return (
    <FlowyCard
      variant="transparent"
      className="border-red-200/50 bg-red-50/30 dark:bg-red-950/30"
    >
      <FlowyCardHeader>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <FlowyCardTitle className="text-red-900 dark:text-red-100">
            Something went wrong
          </FlowyCardTitle>
        </div>
      </FlowyCardHeader>

      <FlowyCardContent>
        <div className="space-y-3">
          <p className="text-sm text-red-700 dark:text-red-200">
            {error?.message ||
              "An unexpected error occurred while loading this card."}
          </p>

          {process.env.NODE_ENV === "development" && error?.stack && (
            <details className="text-xs">
              <summary className="cursor-pointer text-red-600 hover:text-red-800">
                View technical details
              </summary>
              <pre className="mt-2 overflow-auto text-red-600 bg-red-100/50 p-2 rounded">
                {error.stack}
              </pre>
            </details>
          )}

          <motion.button
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={retry}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </motion.button>
        </div>
      </FlowyCardContent>
    </FlowyCard>
  );
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, "children">
) {
  const WrappedComponent = (props: P) => (
    <FlowyErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </FlowyErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}
