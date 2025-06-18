"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Play, Pause, Square } from "lucide-react";

// import { MercuryFlowCanvas as FlowCanvas } from "@/components/mercury/mercury-flow-canvas";
import { Context, initialContexts } from "@/lib/contextMockData";
import { MainCard } from "../workflow/MainCard";
import { EditableCard } from "../workflow/EditableCard";
import { InsightsPanel } from "../workflow/components/InsightsPanel";
import { MERCURY_DURATIONS, MERCURY_EASING } from "@/lib/mercury-utils";

// Mercury OS Wu Wei Daoist Easing Functions
const wuWeiEasing = [0.25, 0.46, 0.45, 0.94] as const;

export default function CanvasWorkflowPage() {
  // Mercury compliance properties
  const intent = "canvas-workflow-space";
  // Mercury-compliant state management
  const [contexts, setContexts] = useState<Context[]>(initialContexts.slice(0, 3)); // Use first 3 contexts
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  
  // Canvas-specific state
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  
  // Card dimensions for collision detection
  const CARD_WIDTH = 400;
  const CARD_HEIGHT = 220;
  const MIN_SPACING = 20;
  const VIEWPORT_MARGIN = 20;
  
  // Canvas pan state
  const [canvasPan, setCanvasPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0, panX: 0, panY: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  
  // Canvas zoom state
  const [canvasZoom, setCanvasZoom] = useState(1);
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 5;
  const ZOOM_STEP = 0.05; // Reduced sensitivity from 0.1 to 0.05
  const [isZoomControlsVisible, setIsZoomControlsVisible] = useState(false);
  
  // Play demo state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0);
  const [playTimeoutId, setPlayTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
  // Horizontal scroll should always be available when content overflows
  
  // Intelligent spatial management utilities
  const getViewportBounds = useCallback(() => {
    if (typeof window === 'undefined') return { width: 1200, height: 800 };
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }, []);
  
  const checkCollision = useCallback((pos1: {x: number, y: number}, pos2: {x: number, y: number}) => {
    const rect1 = {
      left: pos1.x,
      right: pos1.x + CARD_WIDTH,
      top: pos1.y,
      bottom: pos1.y + CARD_HEIGHT
    };
    
    const rect2 = {
      left: pos2.x,
      right: pos2.x + CARD_WIDTH,
      top: pos2.y,
      bottom: pos2.y + CARD_HEIGHT
    };
    
    // Check if rectangles overlap with spacing buffer
    return !(
      rect1.right + MIN_SPACING <= rect2.left ||
      rect1.left >= rect2.right + MIN_SPACING ||
      rect1.bottom + MIN_SPACING <= rect2.top ||
      rect1.top >= rect2.bottom + MIN_SPACING
    );
  }, []);
  
  const findValidPosition = useCallback((desiredPosition: {x: number, y: number}, excludeId: string, allPositions: Record<string, {x: number, y: number}>) => {
    const viewport = getViewportBounds();
    
    // Clamp to viewport boundaries first
    const clampedPosition = {
      x: Math.max(VIEWPORT_MARGIN, Math.min(viewport.width - CARD_WIDTH - VIEWPORT_MARGIN, desiredPosition.x)),
      y: Math.max(VIEWPORT_MARGIN, Math.min(viewport.height - CARD_HEIGHT - VIEWPORT_MARGIN, desiredPosition.y))
    };
    
    // Check for collisions with other cards
    const otherPositions = Object.entries(allPositions).filter(([id]) => id !== excludeId);
    
    // If no collision, return the clamped position
    let hasCollision = false;
    for (const [, pos] of otherPositions) {
      if (checkCollision(clampedPosition, pos)) {
        hasCollision = true;
        break;
      }
    }
    
    if (!hasCollision) {
      return clampedPosition;
    }
    
    // Smart collision resolution: try positions in expanding spiral pattern
    const searchRadius = CARD_WIDTH + MIN_SPACING;
    const maxAttempts = 20;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const angleStep = (Math.PI * 2) / (attempt * 4); // More positions for larger radiuses
      const radius = searchRadius * attempt * 0.5;
      
      for (let i = 0; i < attempt * 4; i++) {
        const angle = angleStep * i;
        const testPosition = {
          x: clampedPosition.x + Math.cos(angle) * radius,
          y: clampedPosition.y + Math.sin(angle) * radius
        };
        
        // Clamp test position to viewport
        const clampedTestPosition = {
          x: Math.max(VIEWPORT_MARGIN, Math.min(viewport.width - CARD_WIDTH - VIEWPORT_MARGIN, testPosition.x)),
          y: Math.max(VIEWPORT_MARGIN, Math.min(viewport.height - CARD_HEIGHT - VIEWPORT_MARGIN, testPosition.y))
        };
        
        // Check if this position is collision-free
        let testHasCollision = false;
        for (const [, pos] of otherPositions) {
          if (checkCollision(clampedTestPosition, pos)) {
            testHasCollision = true;
            break;
          }
        }
        
        if (!testHasCollision) {
          return clampedTestPosition;
        }
      }
    }
    
    // Fallback: find empty space in grid pattern
    const gridSize = CARD_WIDTH + MIN_SPACING;
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < Math.floor(viewport.width / gridSize); col++) {
        const gridPosition = {
          x: VIEWPORT_MARGIN + col * gridSize,
          y: VIEWPORT_MARGIN + row * (CARD_HEIGHT + MIN_SPACING)
        };
        
        if (gridPosition.y + CARD_HEIGHT > viewport.height - VIEWPORT_MARGIN) break;
        
        let gridHasCollision = false;
        for (const [, pos] of otherPositions) {
          if (checkCollision(gridPosition, pos)) {
            gridHasCollision = true;
            break;
          }
        }
        
        if (!gridHasCollision) {
          return gridPosition;
        }
      }
    }
    
    // Ultimate fallback: return clamped position (may overlap)
    return clampedPosition;
  }, [checkCollision, getViewportBounds]);
  
  // Card positions state - initialize cards with intelligent spacing (for future collision detection)
  // const [cardPositions, setCardPositions] = useState<Record<string, {x: number, y: number}>>(() => {
  //   const initialPositions: Record<string, {x: number, y: number}> = {};
  //   const viewport = typeof window !== 'undefined' ? { width: window.innerWidth, height: window.innerHeight } : { width: 1200, height: 800 };
  //   
  //   initialContexts.slice(0, 3).forEach((context, index) => {
  //     const baseX = VIEWPORT_MARGIN + index * (CARD_WIDTH + MIN_SPACING * 2);
  //     const baseY = VIEWPORT_MARGIN + 60; // Account for header space
  //     
  //     // Ensure cards fit in viewport horizontally
  //     const maxX = viewport.width - CARD_WIDTH - VIEWPORT_MARGIN;
  //     const x = Math.min(baseX, maxX);
  //     
  //     // If cards would overflow horizontally, stack them vertically
  //     const y = baseX > maxX ? baseY + Math.floor(index / 2) * (CARD_HEIGHT + MIN_SPACING) : baseY;
  //     
  //     initialPositions[context.id] = { x, y };
  //   });
  //   
  //   return initialPositions;
  // });


  // Drag and drop state
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [cardOrder, setCardOrder] = useState<string[]>(() => 
    initialContexts.slice(0, 3).map(context => context.id)
  );
  
  // Reorder contexts based on card order (needed for zoom calculations)
  const orderedContexts = cardOrder.map(id => 
    contexts.find(context => context.id === id)
  ).filter(Boolean) as Context[];
  
  // Zoom utilities
  const zoomAtPoint = useCallback((newZoom: number, clientX: number, clientY: number) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;
    
    // Calculate the point in canvas coordinates before zoom
    const canvasX = (mouseX - canvasPan.x) / canvasZoom;
    const canvasY = (mouseY - canvasPan.y) / canvasZoom;
    
    // Calculate new pan to keep the mouse point fixed
    const newPanX = mouseX - canvasX * newZoom;
    const newPanY = mouseY - canvasY * newZoom;
    
    setCanvasZoom(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom)));
    setCanvasPan({ x: newPanX, y: newPanY });
  }, [canvasZoom, canvasPan]);
  
  const handleZoomIn = useCallback((clientX?: number, clientY?: number) => {
    const centerX = clientX ?? (canvasRef.current?.getBoundingClientRect().width ?? 0) / 2;
    const centerY = clientY ?? (canvasRef.current?.getBoundingClientRect().height ?? 0) / 2;
    zoomAtPoint(canvasZoom + ZOOM_STEP, centerX, centerY);
  }, [canvasZoom, zoomAtPoint]);
  
  const handleZoomOut = useCallback((clientX?: number, clientY?: number) => {
    const centerX = clientX ?? (canvasRef.current?.getBoundingClientRect().width ?? 0) / 2;
    const centerY = clientY ?? (canvasRef.current?.getBoundingClientRect().height ?? 0) / 2;
    zoomAtPoint(canvasZoom - ZOOM_STEP, centerX, centerY);
  }, [canvasZoom, zoomAtPoint]);
  
  const handleZoomReset = useCallback(() => {
    setCanvasZoom(1);
    setCanvasPan({ x: 0, y: 0 });
  }, []);
  
  const handleZoomToFit = useCallback(() => {
    if (!canvasRef.current || orderedContexts.length === 0) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const padding = 100;
    
    // Calculate bounds of all cards
    const cardWidth = 400;
    const cardHeight = 220;
    const gap = 24; // 6 * 4px from gap-6
    
    const totalWidth = orderedContexts.length * cardWidth + (orderedContexts.length - 1) * gap;
    const totalHeight = cardHeight;
    
    // Calculate zoom to fit with padding
    const zoomX = (rect.width - padding * 2) / totalWidth;
    const zoomY = (rect.height - padding * 2) / totalHeight;
    const fitZoom = Math.min(zoomX, zoomY, 1); // Don't zoom in beyond 100%
    
    // Center the content
    const contentCenterX = totalWidth / 2;
    const contentCenterY = totalHeight / 2;
    const viewportCenterX = rect.width / 2;
    const viewportCenterY = rect.height / 2;
    
    setCanvasZoom(fitZoom);
    setCanvasPan({
      x: viewportCenterX - contentCenterX * fitZoom,
      y: viewportCenterY - contentCenterY * fitZoom
    });
  }, [orderedContexts]);
  
  // Canvas pan handlers
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start panning if space is pressed or if clicking on canvas background
    const target = e.target as HTMLElement;
    const isBackgroundClick = target.dataset.canvasBackground === 'true';
    
    if (isSpacePressed || isBackgroundClick) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({
        x: e.clientX,
        y: e.clientY,
        panX: canvasPan.x,
        panY: canvasPan.y
      });
      
      // Add visual feedback for panning
      document.body.style.cursor = 'grabbing';
    }
  }, [isSpacePressed, canvasPan]);
  
  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    
    e.preventDefault();
    const deltaX = e.clientX - panStart.x;
    const deltaY = e.clientY - panStart.y;
    
    setCanvasPan({
      x: panStart.panX + deltaX,
      y: panStart.panY + deltaY
    });
  }, [isPanning, panStart]);
  
  const handleCanvasMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      document.body.style.cursor = '';
    }
  }, [isPanning]);
  
  // Mouse wheel zoom handler
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      // Further reduce sensitivity for mouse wheel - use smaller steps
      const wheelZoomStep = ZOOM_STEP * 0.5; // Even more granular control
      const delta = e.deltaY > 0 ? -wheelZoomStep : wheelZoomStep;
      zoomAtPoint(canvasZoom + delta, e.clientX, e.clientY);
    }
  }, [canvasZoom, zoomAtPoint]);
  
  // Keyboard handlers for space key and zoom shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space key for panning
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setIsSpacePressed(true);
        document.body.style.cursor = 'grab';
        return;
      }
      
      // Zoom shortcuts
      if ((e.ctrlKey || e.metaKey) && !e.repeat) {
        switch (e.code) {
          case 'Equal': // Cmd/Ctrl + =
          case 'NumpadAdd':
            e.preventDefault();
            handleZoomIn();
            break;
          case 'Minus':
          case 'NumpadSubtract':
            e.preventDefault();
            handleZoomOut();
            break;
          case 'Digit0':
          case 'Numpad0':
            e.preventDefault();
            handleZoomReset();
            break;
          case 'Digit1':
          case 'Numpad1':
            e.preventDefault();
            handleZoomToFit();
            break;
        }
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(false);
        if (!isPanning) {
          document.body.style.cursor = '';
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.body.style.cursor = '';
    };
  }, [isPanning, handleZoomIn, handleZoomOut, handleZoomReset, handleZoomToFit]);
  
  // Global mouse handlers for panning
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isPanning) return;
      
      e.preventDefault();
      const deltaX = e.clientX - panStart.x;
      const deltaY = e.clientY - panStart.y;
      
      setCanvasPan({
        x: panStart.panX + deltaX,
        y: panStart.panY + deltaY
      });
    };
    
    const handleGlobalMouseUp = () => {
      if (isPanning) {
        setIsPanning(false);
        document.body.style.cursor = isSpacePressed ? 'grab' : '';
      }
    };
    
    if (isPanning) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isPanning, panStart, isSpacePressed]);

  // Handle drag start - prevent if panning
  const handleDragStart = (contextId: string, e: React.DragEvent) => {
    if (isPanning || isSpacePressed) {
      e.preventDefault();
      return;
    }
    setDraggedCardId(contextId);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, targetContextId: string) => {
    e.preventDefault();
    if (!draggedCardId || draggedCardId === targetContextId || isPanning) return;

    setCardOrder(prev => {
      const newOrder = [...prev];
      const draggedIndex = newOrder.indexOf(draggedCardId);
      const targetIndex = newOrder.indexOf(targetContextId);
      
      // Remove dragged item and insert at target position
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedCardId);
      
      return newOrder;
    });
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedCardId(null);
  };

  /* 
   * ALTERNATIVE: Pure Framer Motion Drag Implementation
   * 
   * If we wanted to use only Framer Motion drag system:
   * 
   * const handleFramerDragStart = (event: MotionEvent, info: PanInfo) => {
   *   if (isPanning || isSpacePressed) return;
   *   setDraggedCardId(contextId);
   * };
   * 
   * const handleFramerDrag = (event: MotionEvent, info: PanInfo) => {
   *   // Calculate which card we're hovering over based on mouse position
   *   const mouseX = info.point.x;
   *   const cardWidth = 400;
   *   const gap = 24;
   *   const cardIndex = Math.floor(mouseX / (cardWidth + gap));
   *   
   *   // Reorder if hovering over different card
   *   const targetContextId = orderedContexts[cardIndex]?.id;
   *   if (targetContextId && targetContextId !== draggedCardId) {
   *     // Update order...
   *   }
   * };
   * 
   * const handleFramerDragEnd = () => {
   *   setDraggedCardId(null);
   * };
   * 
   * // In JSX:
   * <motion.div
   *   drag={!isPanning && !isSpacePressed}
   *   dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
   *   onDragStart={handleFramerDragStart}
   *   onDrag={handleFramerDrag}
   *   onDragEnd={handleFramerDragEnd}
   * >
   * 
   * Pros:
   * - Smooth physics-based dragging
   * - Better visual feedback
   * - More control over animations
   * 
   * Cons:
   * - More complex collision detection
   * - Manual reordering logic
   * - Less accessible than HTML5 drag & drop
   */

  // Workflow integration handlers
  const handleEdit = (contextId: string) => {
    setEditingId(contextId);
    setExpandedIds(new Set()); // Close all insights when editing
  };

  const handleSave = (updatedContext: Context) => {
    setContexts((prev) =>
      prev.map((ctx) => (ctx.id === updatedContext.id ? updatedContext : ctx))
    );
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleToggleInsights = (contextId: string) => {
    if (editingId) return; // Don't toggle insights while editing
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      const wasExpanded = newSet.has(contextId);
      if (wasExpanded) {
        newSet.delete(contextId);
      } else {
        newSet.add(contextId);
        // No auto-scroll on manual clicks - keep it simple
      }
      return newSet;
    });
  };

  const getFocusLevel = (contextId: string): "focused" | "ambient" | "fog" => {
    if (editingId === contextId) return "focused";
    if (editingId && editingId !== contextId) return "fog";
    
    // Highlight current card during demo playback
    if (isPlaying) {
      const currentContext = orderedContexts[currentPlayIndex];
      if (currentContext && currentContext.id === contextId) {
        return "focused";
      } else {
        return "fog";
      }
    }
    
    return "ambient";
  };

  // Scroll to card function for demo - simple and predictable
  const scrollToCard = useCallback((cardIndex: number) => {
    if (!canvasRef.current) return;
    
    const cardWidth = 400;
    const gap = 24;
    const padding = 24;
    
    // Calculate card position
    const cardPosition = padding + cardIndex * (cardWidth + gap);
    
    // Simple scroll to show card with fixed margin from left
    canvasRef.current.scrollTo({
      left: Math.max(0, cardPosition - 100), // Fixed 100px margin
      behavior: 'smooth'
    });
  }, []);

  // Play demo functionality
  const startPlayDemo = useCallback(() => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    playNextCardRef.current(currentPlayIndex);
  }, [isPlaying, currentPlayIndex]);

  const playNextCard = useCallback((index: number) => {
    if (index >= orderedContexts.length) {
      // Demo finished
      setIsPlaying(false);
      setCurrentPlayIndex(0);
      return;
    }

    setCurrentPlayIndex(index);
    
    // Scroll to ensure both card and insight panel will be visible
    if (canvasRef.current) {
      const cardWidth = 400;
      const insightWidth = 400;
      const gap = 24;
      const padding = 24;
      
      // Calculate where insight panel will end
      const cardPosition = padding + index * (cardWidth + gap);
      const insightEndPosition = cardPosition + cardWidth + gap + insightWidth;
      
      // Get viewport width
      const viewportWidth = canvasRef.current.clientWidth;
      
      // Position the card on the left side with room for insight panel
      // Don't try to be clever - just position card nicely and let insight flow naturally
      const targetScroll = Math.max(0, cardPosition - 150); // Show card 150px from left edge
      
      canvasRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
    
    // Wait for scroll, then show insights (no additional scrolling)
    setTimeout(() => {
      const contextId = orderedContexts[index].id;
      // Open insights - no additional scroll needed
      handleToggleInsights(contextId);

      // Schedule next card
      const timeoutId = setTimeout(() => {
        playNextCard(index + 1);
      }, 3000); // 3 seconds to view each card's insights

      setPlayTimeoutId(timeoutId);
    }, 800); // 800ms for scroll animation
  }, [orderedContexts]);

  // Fix circular dependency by creating a ref for playNextCard
  const playNextCardRef = useRef(playNextCard);
  playNextCardRef.current = playNextCard;

  const pausePlayDemo = useCallback(() => {
    setIsPlaying(false);
    if (playTimeoutId) {
      clearTimeout(playTimeoutId);
      setPlayTimeoutId(null);
    }
  }, [playTimeoutId]);

  const stopPlayDemo = useCallback(() => {
    setIsPlaying(false);
    setCurrentPlayIndex(0);
    setExpandedIds(new Set()); // Close all insights
    if (playTimeoutId) {
      clearTimeout(playTimeoutId);
      setPlayTimeoutId(null);
    }
  }, [playTimeoutId]);

  // Update field for editable context
  const updateField = (field: string, value: string | number | boolean | string[], nested?: string) => {
    setContexts((prev) => prev.map((ctx) => {
      if (ctx.id === editingId) {
        if (nested) {
          const nestedObj = ctx[nested as keyof Context] as Record<string, unknown>;
          return {
            ...ctx,
            [nested]: {
              ...nestedObj,
              [field]: value,
            },
          };
        }
        return {
          ...ctx,
          [field]: value,
        };
      }
      return ctx;
    }));
  };

  // Action Feedback Animation
  const feedbackVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: wuWeiEasing,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: wuWeiEasing,
      },
    },
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div 
        ref={canvasRef}
        data-intent={intent}
        data-canvas-background="true"
        className={`mercury-module mercury-space h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-x-auto overflow-y-hidden select-none ${
          isSpacePressed ? 'cursor-grab' : isPanning ? 'cursor-grabbing' : ''
        }`}
        role="region"
        aria-label={`${intent} workspace`}
        tabIndex={0}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onWheel={handleWheel}
        onMouseEnter={() => setIsZoomControlsVisible(true)}
        onMouseLeave={() => setIsZoomControlsVisible(false)}
      >
        {/* Action Feedback */}
        <AnimatePresence>
          {actionFeedback && (
            <motion.div
              data-intent="action-feedback"
              className="mercury-module fixed top-8 right-8 z-50"
              role="status"
              aria-live="polite"
              aria-label="Action feedback notification"
              variants={feedbackVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="bg-slate-900/90 text-white px-6 py-3 rounded-2xl backdrop-blur-lg border border-white/20 shadow-2xl">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span className="text-sm font-medium">{actionFeedback}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Canvas pan indicator */}
        {(isSpacePressed || isPanning) && (
          <div className="fixed top-4 left-4 z-50 bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm">
            {isPanning ? 'Panning...' : 'Hold Space + Drag to Pan'}
          </div>
        )}
        
        {/* Zoom controls */}
        <div className="fixed bottom-4 right-4 z-[9999] pointer-events-auto">
          <div className="bg-white/90 backdrop-blur-lg rounded-xl border border-gray-200 shadow-lg p-2 flex items-center gap-2">
            {/* Zoom out */}
            <button
              onClick={() => handleZoomOut()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={canvasZoom <= MIN_ZOOM}
              title="Zoom Out (Cmd/Ctrl + -)" 
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </button>
            
            {/* Zoom percentage */}
            <button
              onClick={handleZoomReset}
              className="px-3 py-1 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors min-w-[60px]"
              title="Reset Zoom (Cmd/Ctrl + 0)"
            >
              {Math.round(canvasZoom * 100)}%
            </button>
            
            {/* Zoom in */}
            <button
              onClick={() => handleZoomIn()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={canvasZoom >= MAX_ZOOM}
              title="Zoom In (Cmd/Ctrl + +)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
                <line x1="11" y1="8" x2="11" y2="14"/>
                <line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </button>
            
            {/* Zoom to fit */}
            <button
              onClick={handleZoomToFit}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Zoom to Fit (Cmd/Ctrl + 1)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Play Demo Controls */}
        <div className="fixed top-4 right-4 z-50">
          {/* Demo controls have priority in top-right corner */}
          {!isPlaying ? (
            <div className="flex items-center gap-3">
              <motion.button
                onClick={startPlayDemo}
                disabled={editingId !== null}
                className="group flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed"
                whileHover={{ scale: editingId ? 1 : 1.02 }}
                whileTap={{ scale: editingId ? 1 : 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Play className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span>{currentPlayIndex === 0 ? "Play Demo" : "Resume"}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              </motion.button>

              {currentPlayIndex > 0 && (
                <motion.button
                  onClick={stopPlayDemo}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Square className="w-4 h-4" />
                  <span>Reset</span>
                </motion.button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <motion.button
                onClick={pausePlayDemo}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-medium text-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </motion.button>

              <motion.button
                onClick={stopPlayDemo}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-medium text-sm transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Square className="w-4 h-4" />
                <span>Stop</span>
              </motion.button>

              {/* Progress Indicator */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center ml-3 px-4 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-slate-700">
                    Card {currentPlayIndex + 1} of {orderedContexts.length}
                  </span>
                </div>
              </motion.div>
            </div>
          )}
        </div>
        
        {/* Zoom level indicator - positioned below demo controls */}
        {canvasZoom !== 1 && (
          <div className="fixed top-24 right-4 z-40 bg-black/60 text-white px-3 py-1 rounded-lg text-xs font-medium backdrop-blur-sm">
            {Math.round(canvasZoom * 100)}% zoom
          </div>
        )}
        
        {/* Scrolling content with conditional transforms */}
        <div 
          className="flex items-center gap-6 p-6 min-h-screen"
          style={{
            width: 'max-content',
            paddingRight: `${Math.max(600, expandedIds.size * 500 + 600)}px`,
            ...(canvasZoom !== 1 || canvasPan.x !== 0 || canvasPan.y !== 0 ? {
              transform: `translate(${canvasPan.x}px, ${canvasPan.y}px) scale(${canvasZoom})`,
              transformOrigin: 'top left',
              transition: 'transform 75ms ease-out'
            } : {}),
            pointerEvents: isPanning ? 'none' : 'auto'
          }}
          data-canvas-background="true"
        >
            {/* Workflow Context Cards */}
            {orderedContexts.map((context, index) => (
              <motion.div
                key={context.id}
                data-intent={`workflow-context-${context.id}`}
                className="mercury-module flex-shrink-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: MERCURY_DURATIONS.normal,
                  ease: MERCURY_EASING,
                  delay: index * 0.1
                }}
                role="region"
                aria-label={`Context card ${index + 1}`}
                style={{
                  cursor: editingId !== context.id && !isSpacePressed && !isPanning ? 'grab' : 'default',
                  opacity: draggedCardId === context.id ? 0.5 : 1,
                  pointerEvents: isPanning ? 'none' : 'auto'
                }}
              >
                <div
                  draggable={editingId !== context.id && !isPanning && !isSpacePressed}
                  onDragStart={(e: React.DragEvent) => handleDragStart(context.id, e)}
                  onDragOver={(e: React.DragEvent) => handleDragOver(e, context.id)}
                  onDragEnd={handleDragEnd}
                  className="w-full h-full"
                >
                  <div className="flex items-start gap-6">
                    {/* Main card */}
                    <motion.div
                      className={`w-[400px] bg-white rounded-2xl shadow-md border border-gray-100 relative transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
                        getFocusLevel(context.id) === 'focused' ? 'scale-[1.02] z-30 opacity-100' :
                        getFocusLevel(context.id) === 'ambient' ? 'scale-100 z-10 opacity-90' :
                        'scale-[0.98] z-0 opacity-40 pointer-events-none blur-[0.5px]'
                      } ${
                        !editingId && !isSpacePressed && !isPanning ? "cursor-pointer hover:shadow-lg" : ""
                      }`}
                      layout
                      onClick={() => {
                        if (editingId !== context.id) {
                          handleToggleInsights(context.id);
                        }
                      }}
                      style={{
                        height: editingId === context.id ? "80vh" : "auto",
                        minHeight: editingId === context.id ? "auto" : "220px",
                        overflow: editingId === context.id ? "hidden" : "visible",
                      }}
                      animate={{
                        width: editingId === context.id ? 600 : 400,
                      }}
                      transition={{ duration: 0.7, ease: wuWeiEasing }}
                    >
                      <div className={`${editingId === context.id ? "h-full flex flex-col p-4" : "p-4"}`}>
                        {editingId !== context.id ? (
                          <MainCard
                            context={context}
                            onToggleInsights={() => handleToggleInsights(context.id)}
                            contextNumber={cardOrder.indexOf(context.id) + 1}
                            handleEdit={() => handleEdit(context.id)}
                          />
                        ) : (
                          <EditableCard
                            editedContext={context}
                            onSave={handleSave}
                            onCancel={handleCancel}
                            onFieldChange={updateField}
                          />
                        )}
                      </div>
                    </motion.div>

                    {/* Insights Panel - flows naturally in flex layout */}
                    <AnimatePresence>
                      {expandedIds.has(context.id) && editingId !== context.id && (
                        <motion.div
                          initial={{ opacity: 0, width: 0, x: -20 }}
                          animate={{ opacity: 1, width: 400, x: 0 }}
                          exit={{ opacity: 0, width: 0, x: -20 }}
                          transition={{ duration: 0.5, ease: wuWeiEasing }}
                          className="flex-shrink-0"
                        >
                          <InsightsPanel
                            intent="insights-panel"
                            context={context}
                            isVisible={true}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
        
        {/* Canvas background - extends beyond cards for panning */}
        <div 
          className="absolute inset-0 -z-10" 
          data-canvas-background="true"
          style={{
            width: '200vw',
            height: '200vh',
            left: '-50vw',
            top: '-50vh'
          }}
        />
      </div>
    </DndProvider>
  );
}
