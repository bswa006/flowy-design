import React, { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { Edit as EditIcon, Lightbulb } from "lucide-react";

interface DraggableTextCardProps {
  description: string;
  onCreateInsight?: () => void;
  handleEdit?: () => void;
}

interface OptionsCardState {
  x: number;
  y: number;
  command: string;
}

export function DraggableTextCard({
  description,
  onCreateInsight,
  handleEdit,
}: DraggableTextCardProps) {
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
  const [showBar, setShowBar] = useState(false);
  const [optionsCard, setOptionsCard] = useState<OptionsCardState | null>(null);
  const [draggingCommand, setDraggingCommand] = useState<string | null>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  // Listen for selection changes
  useEffect(() => {
    function handleSelection(e: Event) {
      e.stopPropagation();
      const sel = window.getSelection();
      if (
        sel &&
        sel.rangeCount > 0 &&
        !sel.isCollapsed &&
        descriptionRef.current &&
        descriptionRef.current.contains(sel.anchorNode)
      ) {
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelectionRect(rect);
        setShowBar(true);
      } else {
        setShowBar(false);
      }
    }
    document.addEventListener("selectionchange", handleSelection);
    return () =>
      document.removeEventListener("selectionchange", handleSelection);
  }, []);

  // Handle drag from bar
  function handleDrop(e: React.DragEvent) {
    e.stopPropagation();
    if (draggingCommand) {
      setOptionsCard({
        x: e.clientX,
        y: e.clientY,
        command: draggingCommand,
      });
      setDraggingCommand(null);
      setShowBar(false);
      window.getSelection()?.removeAllRanges();
    }
  }

  // Close options card on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      e.stopPropagation();
      if (
        optionsCard &&
        !(e.target as HTMLElement).closest(".mercury-options-card")
      ) {
        setOptionsCard(null);
      }
    }
    if (optionsCard) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [optionsCard]);

  // Only one options card at a time
  useEffect(() => {
    if (draggingCommand) setOptionsCard(null);
  }, [draggingCommand]);

  return (
    <div
      ref={descriptionRef}
      className="draggable-text-card relative min-h-[60px] cursor-text select-text"
      onDrop={handleDrop}
      onDragOver={(e) => {
        if (draggingCommand) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <span className="block whitespace-pre-line text-gray-700 text-xs border border-gray-200 rounded-lg px-3 py-2">
        {description}
      </span>
      {/* Floating Action Bar */}
      <AnimatePresence>
        {showBar && selectionRect && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-fit"
          >
            <div className="flex flex-col items-start bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 gap-2 mercury-module">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateInsight?.();
                }}
                className="w-full text-xs px-2 py-1 rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
              >
                <Lightbulb className="w-4 h-4" />
                Create Insight
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit?.();
                }}
                className="w-full text-xs px-2 py-1 rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
              >
                <EditIcon className="w-4 h-4" />
                Edit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
