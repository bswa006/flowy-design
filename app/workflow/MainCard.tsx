import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CircleCheck, Edit } from "lucide-react";
import { Context } from "@/lib/contextMockData";

interface MainCardProps {
  context: Context;
  index: number;
  focusLevel: "focused" | "ambient" | "fog";
  onEdit: () => void;
  onToggleInsights: () => void;
  isExpanded: boolean;
}

function getFocusClasses(focusLevel: "focused" | "ambient" | "fog") {
  switch (focusLevel) {
    case "focused":
      return "scale-[1.02] z-30 opacity-100 shadow-2xl shadow-blue-500/20 ring-1 ring-blue-300/40";
    case "ambient":
      return "scale-100 z-10 opacity-90";
    case "fog":
      return "scale-[0.98] z-0 opacity-40 pointer-events-none blur-[0.5px]";
  }
}

export function MainCard({
  context,
  index,
  focusLevel,
  onEdit,
  onToggleInsights,
}: MainCardProps) {
  return (
    <motion.div
      className="relative"
      layout
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Number badge */}
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-semibold text-base border border-gray-200 shadow-sm z-10">
        {index + 1}
      </div>
      {/* Card content */}
      <motion.div
        className={`max-w-lg mx-auto bg-white rounded-2xl shadow-md border border-gray-100 relative transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${getFocusClasses(focusLevel)} cursor-pointer hover:shadow-lg`}
        layout
        style={{ minHeight: "220px", width: "400px", overflow: "visible" }}
        animate={{ width: 400 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={onToggleInsights}
      >
        <AnimatePresence>
          {focusLevel !== "fog" && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="absolute top-4 right-4 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors opacity-0 group-hover:opacity-100 z-20"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
        <div className="p-8">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-500 font-medium truncate">
              {context.upload.original_name}
            </div>
            <div className="text-xs text-gray-400 font-medium">
              {new Date(context.upload.recorded_on).toLocaleDateString()}
            </div>
          </div>
          <div className="text-lg font-bold text-gray-900 mb-1 truncate">
            {context.upload.file_name}
          </div>
          <div className="text-base text-gray-700 mb-2 truncate">
            {context.upload.description}
          </div>
          <div className="text-gray-700 text-base leading-relaxed mb-4 line-clamp-4">
            {context.upload.summary}
          </div>
          {context.upload.is_checkpoint && (
            <div className="flex items-center gap-2 mt-2">
              <CircleCheck className="w-5 h-5 text-emerald-700" />
              <span className="text-emerald-700 font-semibold text-sm">
                Checkpoint
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
