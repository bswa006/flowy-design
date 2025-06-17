"use client";

import React from "react";

import { motion } from "framer-motion";

import {
  createDragItemFromAction,
  getMercuryDragPreviewStyles,
  useMercuryDrag,
} from "@/lib/mercury-drag-system";

// Mercury OS Wu Wei Daoist Easing Functions
const wuWeiEasing = [0.25, 0.46, 0.45, 0.94] as const;

interface ActionData {
  id: string;
  title: string;
  type: "housing-search" | "location" | "photos";
  data: Record<string, any>;
}

interface MercuryDraggableActionProps {
  action: ActionData;
  onClick?: () => void;
  onActionUsed?: (actionId: string) => void;
  className?: string;
  children: React.ReactNode;
}

export function MercuryDraggableAction({
  action,
  onClick,
  onActionUsed,
  className = "",
  children,
}: MercuryDraggableActionProps) {
  const dragItem = createDragItemFromAction(action, "action-popup");

  const handleDropComplete = (item: any, result: any) => {
    if (result && result.action === "create-card") {
      console.log(`Action ${action.id} successfully dropped, marking as used`);
      onActionUsed?.(action.id);
    }
  };

  const { isDragging, drag } = useMercuryDrag(dragItem, handleDropComplete);

  const _dragPreviewStyles = getMercuryDragPreviewStyles(isDragging);

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      onClick?.();
    }
  };

  return (
    <motion.div
      ref={drag}
      onClick={handleClick}
      className={`
        relative cursor-grab active:cursor-grabbing
        ${isDragging ? "cursor-grabbing" : "cursor-grab"}
        ${className}
      `}
      style={_dragPreviewStyles}
      whileHover={{
        scale: isDragging ? 1.05 : 1.02,
        transition: { duration: 0.2, ease: wuWeiEasing },
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1, ease: wuWeiEasing },
      }}
    >
      {children}

      {/* Drag indicator */}
      {isDragging && (
        <motion.div
          className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: wuWeiEasing }}
        >
          Drag to canvas
        </motion.div>
      )}
    </motion.div>
  );
}
