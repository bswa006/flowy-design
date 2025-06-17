"use client";

import React from "react";
import { motion } from "framer-motion";
import { Context } from "@/lib/contextMockData";
import { MERCURY_DURATIONS, MERCURY_EASING } from "@/lib/mercury-utils";
import { Lightbulb } from "lucide-react";

interface InsightsPanelProps {
  intent: "insights-panel" | "insights-panel-grid";
  context: Context;
  isVisible: boolean;
}

const INSIGHT_STYLES = {
  keyPainPoint: {
    label: "Key Pain Point",
    pillClass: "bg-orange-400",
    containerClass: "bg-orange-50 hover:bg-orange-100",
    tooltip: "key pain point",
  },
  desiredFeature: {
    label: "Desired Feature",
    pillClass: "bg-emerald-800",
    containerClass: "bg-emerald-50 hover:bg-emerald-100",
    tooltip: "desired feature",
  },
  integration: {
    label: "Integration Required",
    pillClass: "bg-blue-500",
    containerClass: "bg-blue-50 hover:bg-blue-100",
    tooltip: "integration required",
  },
  marketGap: {
    label: "Market Gap",
    pillClass: "bg-red-500",
    containerClass: "bg-red-50 hover:bg-red-100",
    tooltip: "market gap",
  },
  differentiator: {
    label: "Key Differentiator",
    pillClass: "bg-purple-500",
    containerClass: "bg-purple-50 hover:bg-purple-100",
    tooltip: "key differentiator",
  },
} as const;
interface CategoryData {
  title: string;
  insights: { text: string; source: string; source_id: string }[];
  style: {
    label: string;
    pillClass: string;
    containerClass: string;
    tooltip: string;
  };
  maxVisible: number;
}

function InsightCategory({
  category,
  isExpanded,
  onToggle,
}: {
  category: CategoryData;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const visibleInsights = isExpanded
    ? category.insights
    : category.insights.slice(0, category.maxVisible);
  const hasMore = category.insights.length > category.maxVisible;

  if (category.insights.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Category Header */}
      <div
        className={`px-3 py-2 border-b border-gray-200 cursor-pointer flex items-center justify-between`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-800">
            {category.title}
          </span>
          <span className="text-[10px] text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded-full">
            {category.insights.length}
          </span>
        </div>
        {hasMore && (
          <span className="text-[10px] text-gray-600">
            {isExpanded ? "−" : "+"}
          </span>
        )}
      </div>

      {/* Category Content */}
      <div className="p-2 space-y-1">
        {visibleInsights.map((insight, i) => {
          // Group insights by source for cleaner display
          const isNewCard =
            i === 0 || visibleInsights[i - 1].source !== insight.source;

          return (
            <div key={i}>
              {isNewCard && visibleInsights.length > 3 && (
                <div className="text-[9px] text-gray-400 font-medium mb-1 mt-2 first:mt-0">
                  {insight.source}
                </div>
              )}
              <div className="text-xs text-gray-700 pl-2">
                <span
                  className={`inline-block align-middle mr-2 w-1.5 h-1.5 ${category.style.pillClass} rounded-full`}
                />
                {insight.text}
              </div>
            </div>
          );
        })}

        {!isExpanded && hasMore && (
          <div
            className="text-[10px] text-blue-600 cursor-pointer hover:text-blue-800 pl-2 pt-1"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            +{category.insights.length - category.maxVisible} more
          </div>
        )}
      </div>
    </div>
  );
}

export function InsightsPanel({
  intent,
  context,
  isVisible,
}: InsightsPanelProps) {
  // Move hooks to the top
  const [expandedCategories, setExpandedCategories] = React.useState<
    Set<string>
  >(new Set());

  if (!isVisible) return null;
  const metadata = context.extracted_metadata;
  if (!metadata) return null;

  // Check if this is a grid layout (multi-column view)
  const isGridLayout = intent === "insights-panel-grid";

  // Use cumulative insights if available, otherwise fall back to old format
  const cumulativeInsights = metadata.cumulative_insights;

  const getPainPoints = () => {
    if (cumulativeInsights?.key_pain_points) {
      return cumulativeInsights.key_pain_points;
    }
    return Array.isArray(metadata.key_pain_points)
      ? metadata.key_pain_points.map((point: string) => ({
          text: point,
          source: "Current Card",
          source_id: context.id,
        }))
      : [];
  };

  const getDesiredFeatures = () => {
    if (cumulativeInsights?.desired_features) {
      return cumulativeInsights.desired_features;
    }
    return Array.isArray(metadata.desired_features)
      ? metadata.desired_features.map((feature: string) => ({
          text: feature,
          source: "Current Card",
          source_id: context.id,
        }))
      : [];
  };

  const getIntegrations = () => {
    if (cumulativeInsights?.integrations_required) {
      return cumulativeInsights.integrations_required;
    }
    return Array.isArray(metadata.integrations_required)
      ? metadata.integrations_required.map((integration: string) => ({
          text: integration,
          source: "Current Card",
          source_id: context.id,
        }))
      : [];
  };

  const getMarketGaps = () => {
    if (cumulativeInsights?.market_gaps) {
      return cumulativeInsights.market_gaps;
    }
    return Array.isArray(metadata.market_gaps)
      ? metadata.market_gaps.map((gap: string) => ({
          text: gap,
          source: "Current Card",
          source_id: context.id,
        }))
      : [];
  };

  const getTechnicalAchievements = () => {
    if (cumulativeInsights?.technical_achievements) {
      return cumulativeInsights.technical_achievements;
    }
    return Array.isArray(metadata.technical_achievements)
      ? metadata.technical_achievements.map((achievement: string) => ({
          text: achievement,
          source: "Current Card",
          source_id: context.id,
        }))
      : [];
  };

  const getDesignPrinciples = () => {
    if (cumulativeInsights?.design_principles) {
      return cumulativeInsights.design_principles;
    }
    return [];
  };

  const getBetaMetrics = () => {
    if (cumulativeInsights?.beta_metrics) {
      return cumulativeInsights.beta_metrics;
    }
    return [];
  };

  // Organize insights into categories
  const categories: CategoryData[] = [
    {
      title: "Pain Points",
      insights: getPainPoints(),
      style: INSIGHT_STYLES.keyPainPoint,
      maxVisible: 3,
    },
    {
      title: "Desired Features",
      insights: getDesiredFeatures(),
      style: INSIGHT_STYLES.desiredFeature,
      maxVisible: 3,
    },
    {
      title: "Integrations",
      insights: getIntegrations(),
      style: INSIGHT_STYLES.integration,
      maxVisible: 4,
    },
    {
      title: "Market Opportunities",
      insights: getMarketGaps(),
      style: INSIGHT_STYLES.marketGap,
      maxVisible: 2,
    },
    {
      title: "Technical Progress",
      insights: getTechnicalAchievements(),
      style: INSIGHT_STYLES.differentiator,
      maxVisible: 3,
    },
    {
      title: "Design Principles",
      insights: getDesignPrinciples(),
      style: {
        ...INSIGHT_STYLES.differentiator,
        pillClass: "bg-indigo-500",
        containerClass: "bg-indigo-50 hover:bg-indigo-100",
      },
      maxVisible: 2,
    },
    {
      title: "Beta Insights",
      insights: getBetaMetrics(),
      style: {
        ...INSIGHT_STYLES.differentiator,
        pillClass: "bg-green-500",
        containerClass: "bg-green-50 hover:bg-green-100",
      },
      maxVisible: 3,
    },
  ].filter((category) => category.insights.length > 0);

  const toggleCategory = (categoryTitle: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryTitle)) {
        newSet.delete(categoryTitle);
      } else {
        newSet.add(categoryTitle);
      }
      return newSet;
    });
  };

  const uniqueSources = new Set(
    categories.flatMap((cat) => cat.insights.map((insight) => insight.source))
  ).size;

  return (
    <motion.div
      data-intent={intent}
      className={`mercury-module p-4 z-40 pointer-events-auto ${
        isGridLayout ? "w-auto min-w-0" : "max-w-sm"
      }`}
      style={
        isGridLayout
          ? {
              width: "100%",
              maxWidth: "none",
              display: "block",
              boxSizing: "border-box",
              flex: "none",
              minWidth: "0",
            }
          : {}
      }
      initial={{
        opacity: 0,
        x: isGridLayout ? 0 : 20,
        y: isGridLayout ? 20 : 0,
        scale: 0.95,
      }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{
        opacity: 0,
        x: isGridLayout ? 0 : 20,
        y: isGridLayout ? -20 : 0,
        scale: 0.95,
      }}
      transition={{
        duration: MERCURY_DURATIONS.normal,
        ease: MERCURY_EASING,
      }}
    >
      <div className="flex flex-col gap-y-3">
        <div
          className={`bg-white rounded-lg border border-gray-200 p-2 flex items-center gap-1`}
        >
          <Lightbulb className={`w-4 h-4 ${uniqueSources > 1 ? "mb-4" : ""}`} />
          <div>
            Insights
            {uniqueSources > 1 && !isGridLayout && (
              <div className="text-[10px] text-gray-500 mt-1">
                From {uniqueSources} product development phases
              </div>
            )}
          </div>
          {/* Remove tab buttons and summary view */}
        </div>

        {/* Always show All Categories content */}
        {categories.length > 2 ? (
          /* Grid Layout for 3+ categories */
          <div className="grid grid-cols-2 gap-4">
            {/* First Column */}
            <div className="space-y-2">
              {categories
                .slice(0, Math.ceil(categories.length / 2))
                .map((category) => (
                  <InsightCategory
                    key={category.title}
                    category={category}
                    isExpanded={expandedCategories.has(category.title)}
                    onToggle={() => toggleCategory(category.title)}
                  />
                ))}
            </div>

            {/* Second Column */}
            <div className="space-y-2">
              {categories
                .slice(Math.ceil(categories.length / 2))
                .map((category) => (
                  <InsightCategory
                    key={category.title}
                    category={category}
                    isExpanded={expandedCategories.has(category.title)}
                    onToggle={() => toggleCategory(category.title)}
                  />
                ))}
            </div>
          </div>
        ) : (
          /* Single Column Layout for 1-2 categories */
          <div className="space-y-2">
            {categories.map((category) => (
              <InsightCategory
                key={category.title}
                category={category}
                isExpanded={expandedCategories.has(category.title)}
                onToggle={() => toggleCategory(category.title)}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
