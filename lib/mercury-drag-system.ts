"use client";

import { useDrag, useDrop } from "react-dnd";

import { DragItem, DropResult, Point } from "./mercury-types";

// Mercury OS drag types
export const DRAG_TYPES = {
  SEARCH_RESULT: "search-result",
  ACTION_CARD: "action-card",
  CONTENT_BLOCK: "content-block",
} as const;

export interface UseMercuryDragResult {
  isDragging: boolean;
  drag: (node: HTMLElement | null) => void;
  _dragPreview: (node: HTMLElement | null) => void;
}

export interface UseMercuryDropResult {
  isOver: boolean;
  canDrop: boolean;
  drop: (node: HTMLElement | null) => void;
}

/**
 * Mercury OS drag hook with Wu Wei animation principles
 */
export function useMercuryDrag(
  item: DragItem,
  onDropComplete?: (item: DragItem, result: DropResult | null) => void
): UseMercuryDragResult {
  const [{ isDragging }, drag, _dragPreview] = useDrag(() => ({
    type: item.type,
    item: item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      console.log(`Mercury Drag Started: ${item.type}`, item);
      const dropResult = monitor.getDropResult() as DropResult | null;
      if (item && dropResult) {
        console.log(`Mercury Drag Completed:`, { item, dropResult });
        onDropComplete?.(item, dropResult);
      }
    },
  }));

  return { isDragging, drag, _dragPreview };
}

/**
 * Mercury OS drop hook with spatial positioning
 */
export function useMercuryDrop(
  onDrop: (item: DragItem, position: Point) => void,
  targetId: string = "mercury-drop-zone"
): UseMercuryDropResult {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [
      DRAG_TYPES.SEARCH_RESULT,
      DRAG_TYPES.ACTION_CARD,
      DRAG_TYPES.CONTENT_BLOCK,
    ],
    drop: (item: DragItem, monitor) => {
      const clientOffset = monitor.getClientOffset();

      if (clientOffset) {
        // Get the actual drop target element using the ref
        const dropElement = document.getElementById(targetId);

        if (dropElement) {
          const targetRect = dropElement.getBoundingClientRect();

          // Debug: Log all coordinate values
          console.log("🎯 COMPREHENSIVE DROP DEBUG:", {
            "clientOffset (mouse position)": clientOffset,
            "targetRect (canvas bounds)": {
              left: targetRect.left,
              top: targetRect.top,
              right: targetRect.right,
              bottom: targetRect.bottom,
              width: targetRect.width,
              height: targetRect.height,
            },
            "window.scrollX": window.scrollX,
            "window.scrollY": window.scrollY,
            "document.documentElement.scrollLeft":
              document.documentElement.scrollLeft,
            "document.documentElement.scrollTop":
              document.documentElement.scrollTop,
          });

          // TEST: Use clientOffset directly (canvas is full-screen)
          const relativePosition: Point = {
            x: clientOffset.x,
            y: clientOffset.y,
          };

          console.log("🎯 MOUSE DROP POSITION:", relativePosition);
          console.log(
            "🎯 CARD WILL BE CENTERED ON:",
            `x: ${relativePosition.x}px, y: ${relativePosition.y}px from viewport top-left`
          );

          onDrop(item, relativePosition);
        } else {
          console.warn(
            "Drop target not found, using client offset as fallback"
          );
          onDrop(item, { x: clientOffset.x, y: clientOffset.y });
        }
      }

      // Return drop result for the drag source
      return {
        targetId,
        targetType: "flow-canvas" as const,
        position: clientOffset || { x: 0, y: 0 },
        action: "create-card" as const,
      } as DropResult;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    hover: (item, monitor) => {
      // Optional: Add hover effects here
      const clientOffset = monitor.getClientOffset();
      if (clientOffset) {
        // Could dispatch hover events for real-time preview
      }
    },
  });

  return { isOver, canDrop, drop };
}

/**
 * Utility to create drag item from apartment listing
 */
export function createDragItemFromListing(
  listing: any,
  sourceContext: string = "housing-module"
): DragItem {
  return {
    id: listing.id,
    type: DRAG_TYPES.SEARCH_RESULT,
    data: listing,
    sourceContext,
  };
}

/**
 * Utility to create drag item from action card
 */
export function createDragItemFromAction(
  action: any,
  sourceContext: string = "action-popup"
): DragItem {
  return {
    id: action.id || `action-${Date.now()}`,
    type: DRAG_TYPES.ACTION_CARD,
    data: action,
    sourceContext,
  };
}

/**
 * Mercury OS specific drag preview styles
 */
export const getMercuryDragPreviewStyles = (isDragging: boolean) => ({
  opacity: isDragging ? 0.5 : 1,
  transform: isDragging ? "scale(1.05) rotate(2deg)" : "scale(1) rotate(0deg)",
  transition: "all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)", // Wu Wei easing
  cursor: isDragging ? "grabbing" : "grab",
  zIndex: isDragging ? 999 : 1,
  filter: isDragging ? "drop-shadow(0 8px 16px rgba(0,0,0,0.15))" : "none",
});

/**
 * Mercury OS specific drop zone styles
 */
export const getMercuryDropZoneStyles = (
  isOver: boolean,
  canDrop: boolean
) => ({
  backgroundColor:
    isOver && canDrop ? "rgba(59, 130, 246, 0.08)" : "transparent",
  borderColor: isOver && canDrop ? "#3B82F6" : "#E2E8F0",
  borderStyle: "dashed",
  borderWidth: "2px",
  transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  transform: isOver && canDrop ? "scale(1.02)" : "scale(1)",
});
