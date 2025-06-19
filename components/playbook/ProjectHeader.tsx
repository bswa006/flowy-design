"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Target, 
  Calendar, 
  Clock, 
  Users, 
  Layers,
  CheckCircle,
  ArrowRight,
  Database,
  Play,
  Pause,
  Square
} from "lucide-react";

import { getProjectHeader, formatDuration } from "@/lib/playbookData";
import { MERCURY_DURATIONS, MERCURY_EASING } from "@/lib/mercury-utils";

interface ProjectHeaderProps {
  className?: string;
  // Play demo props
  isPlaying?: boolean;
  currentPlayIndex?: number;
  totalCards?: number;
  onStartDemo?: () => void;
  onPauseDemo?: () => void;
  onStopDemo?: () => void;
  editingId?: string | null;
}

export function ProjectHeader({ 
  className = "",
  isPlaying = false,
  currentPlayIndex = 0,
  totalCards = 0,
  onStartDemo,
  onPauseDemo,
  onStopDemo,
  editingId = null
}: ProjectHeaderProps) {
  const headerData = getProjectHeader();
  const { project, totalSteps, completedSteps, estimatedDuration, generatedFrom, createdAt } = headerData;

  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MERCURY_DURATIONS.normal, ease: MERCURY_EASING }}
      className={`${className}`}
    >
      {/* Elegant Minimal Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          {/* Minimal Project Icon */}
          <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
            <Target className="w-4 h-4 text-white" />
          </div>

          {/* Clean Project Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-lg font-semibold text-gray-900 tracking-tight">{project.name}</h1>
              <div className="w-2 h-2 bg-green-500 rounded-full" />
            </div>
            
            {/* Essential Metrics - Clean and Minimal */}
            <div className="flex items-center space-x-6 text-xs text-gray-600">
              <div className="flex items-center space-x-1.5">
                <Layers className="w-3 h-3 text-gray-400" />
                <span><span className="font-medium text-gray-900">{totalSteps}</span> steps</span>
              </div>
              
              <div className="flex items-center space-x-1.5">
                <Clock className="w-3 h-3 text-gray-400" />
                <span><span className="font-medium text-gray-900">{formatDuration(estimatedDuration)}</span></span>
              </div>

              <div className="flex items-center space-x-1.5">
                <Users className="w-3 h-3 text-gray-400" />
                <span className="font-medium text-gray-900">{project.metadata.target_users}</span>
              </div>

              <div className="w-px h-4 bg-gray-200" />
              
              <span className="text-xs font-medium text-gray-700">{project.metadata.expected_impact}</span>
            </div>
          </div>
        </div>

        {/* Play Demo Controls + Progress */}
        <div className="flex items-center space-x-6">
          {/* Play Demo Controls */}
          {onStartDemo && (
            <div className="flex items-center gap-3">
              {!isPlaying ? (
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={onStartDemo}
                    disabled={editingId !== null}
                    className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-medium text-sm transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed"
                    whileHover={{ scale: editingId ? 1 : 1.02 }}
                    whileTap={{ scale: editingId ? 1 : 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Play className="w-4 h-4" />
                    <span>{currentPlayIndex === 0 ? "Play Demo" : "Resume"}</span>
                  </motion.button>

                  {currentPlayIndex > 0 && onStopDemo && (
                    <motion.button
                      onClick={onStopDemo}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 px-3 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Square className="w-3 h-3" />
                      <span>Reset</span>
                    </motion.button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {onPauseDemo && (
                    <motion.button
                      onClick={onPauseDemo}
                      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </motion.button>
                  )}

                  {onStopDemo && (
                    <motion.button
                      onClick={onStopDemo}
                      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Square className="w-4 h-4" />
                      <span>Stop</span>
                    </motion.button>
                  )}

                  {/* Demo Progress Indicator */}
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center ml-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <span className="text-xs font-medium text-slate-700">
                        {currentPlayIndex + 1} of {totalCards}
                      </span>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          )}
          
          {/* Project Progress */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span><span className="font-semibold text-gray-900">{completedSteps}</span> of {totalSteps} completed</span>
            </div>
            
            <div className="relative w-14 h-14">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-gray-200"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 24}`}
                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - progressPercentage / 100)}`}
                  className="text-blue-500 transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-900">{Math.round(progressPercentage)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

