"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initialContexts } from '@/lib/contextMockData';
import { MercuryUploadsTimeline } from '@/components/mercury/mercury-uploads-timeline';
import { MercuryContextCard } from '@/components/mercury/mercury-context-card';
import { useTimelineData } from '@/hooks/useTimelineData';
import { useWorkflowState } from '@/hooks/useWorkflowState';
import { usePlayDemo } from '@/hooks/usePlayDemo';
import { WorkflowHeader } from './components/WorkflowHeader';
import { InsightsPanel } from './components/InsightsPanel';
import {
  MERCURY_DURATIONS,
  MERCURY_EASING,
} from '@/lib/mercury-utils';

declare global {
  interface Window {
    mercurySpaceDepth?: number;
  }
}

export default function WorkflowPage() {
  const {
    contexts,
    editingId,
    expandedIds,
    handleEdit,
    handleSave,
    handleCancel,
    handleToggleInsights,
    getFocusLevel,
  } = useWorkflowState(initialContexts);

  const { timelineUploads, totalUploads, checkpointCount } = useTimelineData({
    contexts,
    currentContextId: editingId || undefined,
  });

  const {
    isPlaying,
    currentPlayIndex,
    cardRefs,
    scrollContainerRef,
    startDemo,
    stopDemo,
  } = usePlayDemo({ contexts, onToggleInsights: handleToggleInsights });

  // Mercury space depth effect
  React.useEffect(() => {
    window.mercurySpaceDepth = 3;
    return () => {
      delete window.mercurySpaceDepth;
    };
  }, []);

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30"
      data-intent="workflow-page"
    >
      {/* Header */}
      <WorkflowHeader
        intent="workflow-header"
        contexts={contexts}
        totalUploads={totalUploads}
        checkpointCount={checkpointCount}
        isPlaying={isPlaying}
        onPlayDemo={startDemo}
        onStopDemo={stopDemo}
      />

      {/* Timeline */}
      <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <MercuryUploadsTimeline
          intent="workflow-timeline"
          focusLevel="ambient"
          uploads={timelineUploads}
          totalUploads={totalUploads}
          checkpointCount={checkpointCount}
        />
      </div>

      {/* Main Content */}
      <div 
        ref={scrollContainerRef}
        className="relative h-[calc(100vh-144px)] overflow-y-auto px-6"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 #f1f5f9',
        }}
      >
        <div className="max-w-7xl mx-auto py-8">
          <AnimatePresence mode="sync">
            {contexts.map((context, idx) => (
              <div
                key={context.id}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className={`relative mb-8 flex items-start justify-center ${
                  isPlaying && currentPlayIndex === idx ? 'ring-2 ring-blue-400 rounded-xl' : ''
                }`}
              >
                {/* Context Card */}
                <div className="relative">
                  <MercuryContextCard
                    intent={`workflow-context-card-${idx}`}
                    context={context}
                    index={idx}
                    isEditing={editingId === context.id}
                    isExpanded={expandedIds.has(context.id)}
                    focusLevel={getFocusLevel(context.id)}
                    onEdit={() => handleEdit(context.id)}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    onToggleInsights={() => handleToggleInsights(context.id)}
                  />
                </div>

                {/* Insights Panel */}
                <AnimatePresence>
                  {expandedIds.has(context.id) && !editingId && (
                    <InsightsPanel
                      intent="insights-panel"
                      context={context}
                      isVisible={expandedIds.has(context.id)}
                    />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

