"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Context } from '@/lib/contextMockData';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  MERCURY_DURATIONS,
  MERCURY_EASING,
} from '@/lib/mercury-utils';

interface InsightsPanelProps {
  intent: 'insights-panel' | 'insights-panel-grid';
  context: Context;
  isVisible: boolean;
}

const INSIGHT_STYLES = {
  keyPainPoint: {
    label: 'Key Pain Point',
    pillClass: 'bg-orange-400',
    containerClass: 'bg-orange-50 hover:bg-orange-100',
    tooltip: 'key pain point',
  },
  desiredFeature: {
    label: 'Desired Feature',
    pillClass: 'bg-emerald-800',
    containerClass: 'bg-emerald-50 hover:bg-emerald-100',
    tooltip: 'desired feature',
  },
  integration: {
    label: 'Integration Required',
    pillClass: 'bg-blue-500',
    containerClass: 'bg-blue-50 hover:bg-blue-100',
    tooltip: 'integration required',
  },
  marketGap: {
    label: 'Market Gap',
    pillClass: 'bg-red-500',
    containerClass: 'bg-red-50 hover:bg-red-100',
    tooltip: 'market gap',
  },
  differentiator: {
    label: 'Key Differentiator',
    pillClass: 'bg-purple-500',
    containerClass: 'bg-purple-50 hover:bg-purple-100',
    tooltip: 'key differentiator',
  },
} as const;

function InsightItem({ 
  insight, 
  style, 
  type 
}: { 
  insight: { text: string; source: string; source_id: string } | string;
  style: typeof INSIGHT_STYLES[keyof typeof INSIGHT_STYLES];
  type: string;
}) {
  const text = typeof insight === 'string' ? insight : insight.text;
  const source = typeof insight === 'string' ? 'Current Card' : insight.source;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer transition-colors ${style.containerClass}`}>
          <span className={`w-2 h-2 ${style.pillClass} rounded-full flex-shrink-0`} />
          <div className="flex flex-col gap-1">
            <span className="text-gray-900 text-xs font-medium leading-relaxed">
              {text}
            </span>
            {typeof insight !== 'string' && (
              <span className="text-gray-500 text-[10px] font-normal">
                From: {source}
              </span>
            )}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="left"
        sideOffset={8}
        className="bg-gray-800 text-white rounded-lg text-xs font-normal"
      >
        <div className="flex flex-col gap-1">
          <span>{style.tooltip}</span>
          {typeof insight !== 'string' && (
            <span className="text-gray-300 text-[10px]">
              Source: {source}
            </span>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

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
  onToggle 
}: { 
  category: CategoryData;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const visibleInsights = isExpanded ? category.insights : category.insights.slice(0, category.maxVisible);
  const hasMore = category.insights.length > category.maxVisible;
  
  if (category.insights.length === 0) return null;
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Category Header */}
      <div 
        className={`px-3 py-2 ${category.style.containerClass} border-b border-gray-200 cursor-pointer flex items-center justify-between`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 ${category.style.pillClass} rounded-full flex-shrink-0`} />
          <span className="text-xs font-semibold text-gray-800">{category.title}</span>
          <span className="text-[10px] text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded-full">
            {category.insights.length}
          </span>
        </div>
        {hasMore && (
          <span className="text-[10px] text-gray-600">
            {isExpanded ? '−' : '+'}
          </span>
        )}
      </div>
      
      {/* Category Content */}
      <div className="p-2 space-y-1">
        {visibleInsights.map((insight, i) => {
          // Group insights by source for cleaner display
          const isNewCard = i === 0 || visibleInsights[i-1].source !== insight.source;
          
          return (
            <div key={i}>
              {isNewCard && visibleInsights.length > 3 && (
                <div className="text-[9px] text-gray-400 font-medium mb-1 mt-2 first:mt-0">
                  {insight.source}
                </div>
              )}
              <div className="text-xs text-gray-700 pl-2 border-l-2 border-gray-100">
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

export function InsightsPanel({ intent, context, isVisible }: InsightsPanelProps) {
  if (!isVisible) return null;

  const metadata = context.extracted_metadata;
  if (!metadata) return null;

  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set());
  
  // Check if this is a grid layout (multi-column view)
  const isGridLayout = intent === 'insights-panel-grid';
  
  // Grid layout always uses summary view for compactness
  const [viewMode, setViewMode] = React.useState<'summary' | 'detailed'>('summary');
  
  // Override viewMode to always be 'summary' in grid layout
  const effectiveViewMode = isGridLayout ? 'summary' : viewMode;

  // Use cumulative insights if available, otherwise fall back to old format
  const cumulativeInsights = metadata.cumulative_insights;
  
  const getPainPoints = () => {
    if (cumulativeInsights?.key_pain_points) {
      return cumulativeInsights.key_pain_points;
    }
    return Array.isArray(metadata.key_pain_points) ? 
      metadata.key_pain_points.map((point: string) => ({ text: point, source: 'Current Card', source_id: context.id })) : 
      [];
  };
  
  const getDesiredFeatures = () => {
    if (cumulativeInsights?.desired_features) {
      return cumulativeInsights.desired_features;
    }
    return Array.isArray(metadata.desired_features) ? 
      metadata.desired_features.map((feature: string) => ({ text: feature, source: 'Current Card', source_id: context.id })) : 
      [];
  };
  
  const getIntegrations = () => {
    if (cumulativeInsights?.integrations_required) {
      return cumulativeInsights.integrations_required;
    }
    return Array.isArray(metadata.integrations_required) ? 
      metadata.integrations_required.map((integration: string) => ({ text: integration, source: 'Current Card', source_id: context.id })) : 
      [];
  };
  
  const getMarketGaps = () => {
    if (cumulativeInsights?.market_gaps) {
      return cumulativeInsights.market_gaps;
    }
    return Array.isArray(metadata.market_gaps) ? 
      metadata.market_gaps.map((gap: string) => ({ text: gap, source: 'Current Card', source_id: context.id })) : 
      [];
  };
  
  const getTechnicalAchievements = () => {
    if (cumulativeInsights?.technical_achievements) {
      return cumulativeInsights.technical_achievements;
    }
    return Array.isArray(metadata.technical_achievements) ? 
      metadata.technical_achievements.map((achievement: string) => ({ text: achievement, source: 'Current Card', source_id: context.id })) : 
      [];
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
      maxVisible: 3
    },
    {
      title: "Desired Features",
      insights: getDesiredFeatures(),
      style: INSIGHT_STYLES.desiredFeature,
      maxVisible: 3
    },
    {
      title: "Integrations",
      insights: getIntegrations(),
      style: INSIGHT_STYLES.integration,
      maxVisible: 4
    },
    {
      title: "Market Opportunities",
      insights: getMarketGaps(),
      style: INSIGHT_STYLES.marketGap,
      maxVisible: 2
    },
    {
      title: "Technical Progress",
      insights: getTechnicalAchievements(),
      style: INSIGHT_STYLES.differentiator,
      maxVisible: 3
    },
    {
      title: "Design Principles",
      insights: getDesignPrinciples(),
      style: { ...INSIGHT_STYLES.differentiator, pillClass: 'bg-indigo-500', containerClass: 'bg-indigo-50 hover:bg-indigo-100' },
      maxVisible: 2
    },
    {
      title: "Beta Insights",
      insights: getBetaMetrics(),
      style: { ...INSIGHT_STYLES.differentiator, pillClass: 'bg-green-500', containerClass: 'bg-green-50 hover:bg-green-100' },
      maxVisible: 3
    }
  ].filter(category => category.insights.length > 0);

  const toggleCategory = (categoryTitle: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryTitle)) {
        newSet.delete(categoryTitle);
      } else {
        newSet.add(categoryTitle);
      }
      return newSet;
    });
  };

  const totalInsights = categories.reduce((sum, cat) => sum + cat.insights.length, 0);
  const uniqueSources = new Set(categories.flatMap(cat => cat.insights.map(insight => insight.source))).size;

  // Summary view - show only the most critical insights
  const getSummaryInsights = () => {
    const summaryData = [];
    
    // Show top 2 pain points
    const painPoints = getPainPoints().slice(0, 2);
    if (painPoints.length > 0) {
      summaryData.push({
        title: "Top Pain Points",
        insights: painPoints,
        style: INSIGHT_STYLES.keyPainPoint
      });
    }
    
    // Show top 2 desired features
    const features = getDesiredFeatures().slice(0, 2);
    if (features.length > 0) {
      summaryData.push({
        title: "Key Features",
        insights: features,
        style: INSIGHT_STYLES.desiredFeature
      });
    }
    
    // Show latest technical achievements if any
    const achievements = getTechnicalAchievements().slice(-2);
    if (achievements.length > 0) {
      summaryData.push({
        title: "Latest Progress",
        insights: achievements,
        style: INSIGHT_STYLES.differentiator
      });
    }
    
    return summaryData;
  };

  return (
    <motion.div
      data-intent={intent}
      className={`mercury-module p-4 z-40 pointer-events-auto ${
        isGridLayout ? 'w-auto min-w-0' : 'max-w-sm'
      }`}
      style={isGridLayout ? {
        width: '100%',
        maxWidth: 'none',
        display: 'block',
        boxSizing: 'border-box',
        flex: 'none',
        minWidth: '0'
      } : {}}
      initial={{ opacity: 0, x: isGridLayout ? 0 : 20, y: isGridLayout ? 20 : 0, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: isGridLayout ? 0 : 20, y: isGridLayout ? -20 : 0, scale: 0.95 }}
      transition={{
        duration: MERCURY_DURATIONS.normal,
        ease: MERCURY_EASING,
      }}
    >
      <div className="flex flex-col gap-y-3">
        <div className={`bg-gray-50 rounded-lg border border-gray-200 ${
          isGridLayout ? 'p-2' : 'p-3'
        }`}>
          {/* <div className="flex items-center justify-between mb-2">
            <h3 className={`font-semibold text-gray-800 ${
              isGridLayout ? 'text-xs' : 'text-sm'
            }`}>Journey Insights</h3>
            <div className={`text-gray-600 bg-white px-2 py-1 rounded-full border ${
              isGridLayout ? 'text-[10px]' : 'text-xs'
            }`}>
              {totalInsights}
            </div>
          </div> */}
          
          {!isGridLayout && (
            <div className="flex gap-1 mt-2">
              <button
                onClick={() => setViewMode('summary')}
                className={`px-2 py-1 text-[10px] rounded-full transition-colors ${
                  viewMode === 'summary' 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Summary
              </button>
              <button
                onClick={() => setViewMode('detailed')}
                className={`px-2 py-1 text-[10px] rounded-full transition-colors ${
                  viewMode === 'detailed' 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Categories
              </button>
            </div>
          )}
          
          {uniqueSources > 1 && !isGridLayout && (
            <div className="text-[10px] text-gray-500 mt-1">
              From {uniqueSources} product development phases
            </div>
          )}
        </div>
        
        {/* Content based on view mode */}
        {effectiveViewMode === 'summary' ? (
          /* Summary View - Compact */
          <div className="space-y-2">
            {getSummaryInsights().map((section, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 ${section.style.pillClass} rounded-full`} />
                  <span className="text-xs font-semibold text-gray-700">{section.title}</span>
                </div>
                <div className="space-y-1">
                  {section.insights.map((insight, i) => (
                    <div key={i} className="text-xs text-gray-700 pl-2 border-l-2 border-gray-100">
                      {insight.text}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Detailed View - All Categories */
          categories.length > 2 ? (
            /* Grid Layout for 3+ categories */
            <div className="grid grid-cols-2 gap-4">
              {/* First Column */}
              <div className="space-y-2">
                {categories.slice(0, Math.ceil(categories.length / 2)).map((category) => (
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
                {categories.slice(Math.ceil(categories.length / 2)).map((category) => (
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
          )
        )}
      </div>
    </motion.div>
  );
}

