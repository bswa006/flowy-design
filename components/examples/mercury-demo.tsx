"use client";

import React, { useState } from "react";

import {
  MercuryDashboardCard,
  MercuryDashboardGrid,
} from "../mercury/mercury-dashboard-card";

// Sample data demonstrating Mercury intention-driven design
const sampleDashboardData = [
  {
    intent: "revenue-overview",
    data: {
      title: "Total Revenue",
      value: "$45,231",
      change: {
        value: "+20.1%",
        trend: "up" as const,
      },
      description: "from last month",
      actions: [
        {
          label: "View Detailed Report",
          intent: "view-revenue-details",
          priority: "primary" as const,
        },
        {
          label: "Export Data",
          intent: "export-revenue-data",
          priority: "secondary" as const,
        },
        {
          label: "Set Alert",
          intent: "create-revenue-alert",
          priority: "ambient" as const,
        },
      ],
    },
  },
  {
    intent: "user-engagement",
    data: {
      title: "Active Users",
      value: "2,350",
      change: {
        value: "+5.2%",
        trend: "up" as const,
      },
      description: "daily active users",
      actions: [
        {
          label: "User Analytics",
          intent: "view-user-analytics",
          priority: "primary" as const,
        },
        {
          label: "Engagement Report",
          intent: "view-engagement-report",
          priority: "secondary" as const,
        },
      ],
    },
  },
  {
    intent: "conversion-tracking",
    data: {
      title: "Conversion Rate",
      value: "3.24%",
      change: {
        value: "-0.5%",
        trend: "down" as const,
      },
      description: "needs attention",
      actions: [
        {
          label: "Analyze Funnel",
          intent: "analyze-conversion-funnel",
          priority: "primary" as const,
        },
        {
          label: "A/B Test Results",
          intent: "view-ab-test-results",
          priority: "secondary" as const,
        },
        {
          label: "Optimize Landing",
          intent: "optimize-landing-page",
          priority: "primary" as const,
        },
      ],
    },
  },
  {
    intent: "support-metrics",
    data: {
      title: "Support Tickets",
      value: "23",
      change: {
        value: "stable",
        trend: "neutral" as const,
      },
      description: "open tickets",
      actions: [
        {
          label: "View All Tickets",
          intent: "view-support-tickets",
          priority: "primary" as const,
        },
        {
          label: "Priority Queue",
          intent: "view-priority-tickets",
          priority: "secondary" as const,
        },
      ],
    },
  },
];

// Mercury Demo Component following all principles from docs/
export function MercuryDemo() {
  const [actionLog, setActionLog] = useState<string[]>([]);

  // Handle Mercury intentions with analytics tracking
  const handleMercuryAction = (intent: string) => {
    console.log(`Mercury Intent Captured: ${intent}`);
    setActionLog((prev) => [
      ...prev.slice(-4),
      `${new Date().toLocaleTimeString()}: ${intent}`,
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Mercury Header following focused principle */}
      <header className="mercury-module p-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <h1
            className="mercury-heading text-3xl mb-2"
            data-intent="page-title"
          >
            Mercury OS Dashboard
          </h1>
          <p className="mercury-body text-lg" data-intent="page-description">
            Demonstration of fluid, focused, and familiar design principles
          </p>
        </div>
      </header>

      {/* Mercury Dashboard Grid with Focus Management */}
      <main className="max-w-7xl mx-auto" data-intent="main-dashboard">
        <MercuryDashboardGrid
          cards={sampleDashboardData}
          defaultFocusIndex={0}
          className="mb-12"
        />
      </main>

      {/* Individual Card Examples */}
      <section
        className="max-w-7xl mx-auto p-6"
        data-intent="individual-examples"
      >
        <h2 className="mercury-heading text-xl mb-6">
          Focus Level Demonstrations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Focused Card Example */}
          <div>
            <h3 className="mercury-caption mb-3">
              FOCUSED (Primary Attention)
            </h3>
            <MercuryDashboardCard
              intent="focused-example"
              focusLevel="focused"
              data={{
                title: "High Priority",
                value: "$12,450",
                change: { value: "+15%", trend: "up" },
                description: "requires immediate attention",
                actions: [
                  {
                    label: "Take Action",
                    intent: "take-immediate-action",
                    priority: "primary",
                  },
                ],
              }}
              isInteractive={true}
              onAction={handleMercuryAction}
            />
          </div>

          {/* Ambient Card Example */}
          <div>
            <h3 className="mercury-caption mb-3">
              AMBIENT (Secondary Context)
            </h3>
            <MercuryDashboardCard
              intent="ambient-example"
              focusLevel="ambient"
              data={{
                title: "Background Metric",
                value: "1,234",
                change: { value: "+2%", trend: "up" },
                description: "steady progress",
              }}
              isInteractive={true}
              onAction={handleMercuryAction}
            />
          </div>

          {/* Fog Card Example */}
          <div>
            <h3 className="mercury-caption mb-3">FOG (Background Context)</h3>
            <MercuryDashboardCard
              intent="fog-example"
              focusLevel="fog"
              data={{
                title: "Archive Data",
                value: "567",
                change: { value: "archived", trend: "neutral" },
                description: "historical reference",
              }}
            />
          </div>
        </div>
      </section>

      {/* Mercury Action Log demonstrating intention tracking */}
      <aside className="max-w-7xl mx-auto p-6" data-intent="action-log">
        <div className="mercury-card p-4">
          <h3 className="mercury-heading text-sm mb-3">
            Mercury Intention Tracking
          </h3>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {actionLog.length === 0 ? (
              <p className="mercury-caption">
                Interact with cards above to see intention tracking...
              </p>
            ) : (
              actionLog.map((log, index) => (
                <div
                  key={index}
                  className="mercury-caption font-mono text-xs p-2 bg-slate-50 dark:bg-slate-800 rounded"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationName: "mercury-enter",
                    animationDuration: "0.3s",
                    animationFillMode: "both",
                  }}
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Mercury Accessibility Notice */}
      <footer
        className="max-w-7xl mx-auto p-6 mt-12"
        data-intent="accessibility-info"
      >
        <div className="mercury-card p-4">
          <h4 className="mercury-heading text-sm mb-2">
            Mercury Accessibility Features
          </h4>
          <ul className="mercury-caption space-y-1">
            <li>✓ WCAG 2.1 AAA compliant focus management</li>
            <li>✓ Keyboard navigation with Enter/Space</li>
            <li>✓ Screen reader optimized with proper ARIA labels</li>
            <li>✓ Reduced motion support for vestibular disorders</li>
            <li>✓ Cognitive accessibility through progressive disclosure</li>
            <li>✓ High contrast ratios following Mercury selective contrast</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

// Utility function for Mercury compliance checking
export function validateMercuryCompliance(component: any): boolean {
  const requiredProps = ["intent", "data-intent"];
  // In a real implementation, this would validate Mercury compliance
  return requiredProps.every((prop) => component.props?.[prop]);
}

export default MercuryDemo;
