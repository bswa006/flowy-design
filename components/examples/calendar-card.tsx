"use client";

import * as React from "react";

import { motion } from "framer-motion";
import { Calendar, MapPin, Mic, MoreHorizontal } from "lucide-react";

import {
  FlowyCard,
  FlowyCardContent,
  FlowyCardFooter,
  FlowyCardHeader,
  FlowyCardSubtitle,
  FlowyCardTitle,
} from "@/components/ui/flowy-card";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  location?: string;
  color: "blue" | "gray";
}

interface CalendarCardProps {
  title: string;
  subtitle: string;
  availableUntil: string;
  events: CalendarEvent[];
  expanded?: boolean;
  onExpand?: () => void;
  onCreateEvent?: () => void;
  onEditEvent?: () => void;
  onViewCalendar?: () => void;
  onDismiss?: () => void;
  variant?: string;
  className?: string;
}

export function CalendarCard({
  title,
  subtitle,
  availableUntil,
  events = [],
  expanded = false,
  onExpand,
  onCreateEvent,
  onEditEvent,
  onViewCalendar,
  onDismiss,
  variant,
  className,
}: CalendarCardProps) {
  const handleAction = (
    action: (() => void) | undefined,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    if (action) {
      action();
    }
  };

  const getEventColorClasses = (color: "blue" | "gray") => {
    return color === "blue"
      ? "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200/50"
      : "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-200/50";
  };

  return (
    <FlowyCard
      variant={(variant as any) || "glass"}
      size="md"
      expandable
      expanded={expanded}
      onExpand={onExpand}
      className={cn("max-w-md mx-auto", className)}
    >
      <FlowyCardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <FlowyCardTitle className="truncate text-base">
                {title}
              </FlowyCardTitle>
              <FlowyCardSubtitle className="truncate">
                {subtitle}
              </FlowyCardSubtitle>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Mic className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </FlowyCardHeader>

      <FlowyCardContent>
        <div className="space-y-4">
          <div>
            <div className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {availableUntil}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Would you like to create an event for Coffee with Marisa at 11 AM?
            </div>
          </div>

          <div className="space-y-2">
            {events.map((event) => (
              <motion.div
                key={event.id}
                className={`p-3 rounded-lg border ${getEventColorClasses(event.color)} transition-colors`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{event.title}</div>
                    {event.location && (
                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.location}
                      </div>
                    )}
                  </div>
                  <div className="text-xs font-medium ml-3">{event.time}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
            <div className="text-center py-1">9:41 AM</div>
            <div className="text-center py-1"></div>
            <div className="text-center py-1">11 AM</div>
            <div className="text-center py-1"></div>
            <div className="text-center py-1">1 PM</div>
            <div className="text-center py-1"></div>
            <div className="text-center py-1">3 PM</div>
            <div className="text-center py-1"></div>
          </div>
        </div>
      </FlowyCardContent>

      <FlowyCardFooter className="border-t-0 pt-4">
        <div className="grid grid-cols-2 gap-2 w-full mb-3">
          <motion.button
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-white/20 hover:bg-white/70 dark:hover:bg-gray-700/50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => handleAction(onCreateEvent, e)}
          >
            Create Event
          </motion.button>

          <motion.button
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-white/20 hover:bg-white/70 dark:hover:bg-gray-700/50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => handleAction(onEditEvent, e)}
          >
            Edit Event
          </motion.button>
        </div>

        <div className="grid grid-cols-2 gap-2 w-full">
          <motion.button
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-white/20 hover:bg-white/70 dark:hover:bg-gray-700/50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => handleAction(onViewCalendar, e)}
          >
            Full Calendar
          </motion.button>

          <motion.button
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-white/20 hover:bg-white/70 dark:hover:bg-gray-700/50 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => handleAction(onDismiss, e)}
          >
            Dismiss
          </motion.button>
        </div>

        <div className="mt-3 flex items-center justify-center">
          <motion.button
            className="flex items-center text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MoreHorizontal className="h-3 w-3 mr-1" />
            More actions
          </motion.button>
        </div>
      </FlowyCardFooter>
    </FlowyCard>
  );
}
