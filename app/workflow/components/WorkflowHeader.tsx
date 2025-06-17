"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square } from 'lucide-react';
import { Context } from '@/lib/contextMockData';
import {
  MERCURY_DURATIONS,
  MERCURY_EASING,
} from '@/lib/mercury-utils';

interface WorkflowHeaderProps {
  intent: 'workflow-header';
  contexts: Context[];
  totalUploads: number;
  checkpointCount: number;
  isPlaying: boolean;
  onPlayDemo: () => void;
  onStopDemo: () => void;
}

export function WorkflowHeader({
  intent,
  contexts,
  totalUploads,
  checkpointCount,
  isPlaying,
  onPlayDemo,
  onStopDemo,
}: WorkflowHeaderProps) {
  const handlePlayClick = () => {
    if (isPlaying) {
      onStopDemo();
    } else {
      onPlayDemo();
    }
  };

  return (
    <motion.div
      data-intent={intent}
      className="mercury-module sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: MERCURY_DURATIONS.slow,
        ease: MERCURY_EASING,
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Title and Stats */}
        <div className="flex items-center gap-6">
          <motion.h1
            className="text-xl font-semibold text-gray-900"
            layoutId="workflow-title"
          >
            Workflow Insights
          </motion.h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span className="font-medium">{contexts.length}</span>
              <span>contexts</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="font-medium">{totalUploads}</span>
              <span>uploads</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="font-medium">{checkpointCount}</span>
              <span>checkpoints</span>
            </div>
          </div>
        </div>

        {/* Play Demo Controls */}
        <motion.button
          onClick={handlePlayClick}
          className="mercury-button flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{
            duration: MERCURY_DURATIONS.fast,
            ease: MERCURY_EASING,
          }}
          data-intent="play-demo-button"
          aria-label={isPlaying ? 'Stop demo' : 'Play demo'}
        >
          {isPlaying ? (
            <>
              <Square className="w-4 h-4" />
              <span>Stop Demo</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Play Demo</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

