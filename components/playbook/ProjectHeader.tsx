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
  Database
} from "lucide-react";

import { getProjectHeader, formatDuration, PlaybookProject } from "@/lib/playbookData";
import { MERCURY_DURATIONS, MERCURY_EASING } from "@/lib/mercury-utils";

interface ProjectHeaderProps {
  project?: PlaybookProject;
  steps?: any[];
  className?: string;
}

export function ProjectHeader({ 
  project: projectProp,
  steps: stepsProp,
  className = ""
}: ProjectHeaderProps) {
  // Use provided data or fall back to static data
  const fallbackHeaderData = getProjectHeader();
  const project = projectProp || fallbackHeaderData.project;
  const steps = stepsProp || [];
  
  // Calculate metrics from provided steps or fallback
  const totalSteps = steps.length > 0 ? steps.length : fallbackHeaderData.totalSteps;
  const completedSteps = steps.length > 0 ? steps.filter(step => step.status === "completed").length : fallbackHeaderData.completedSteps;
  const estimatedDuration = steps.length > 0 ? steps.reduce((total, step) => total + step.estimated_minutes, 0) : fallbackHeaderData.estimatedDuration;

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
    </motion.div>
  );
}

