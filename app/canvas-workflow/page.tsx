"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Play, Pause, Square } from "lucide-react";

// Playbook components and data
import { PlaybookCard } from "@/components/playbook/PlaybookCard";
import { PlaybookInsightsPanel } from "@/components/playbook/PlaybookInsightsPanel";
import { ProjectHeader } from "@/components/playbook/ProjectHeader";
import { 
  PlaybookCard as PlaybookCardType, 
  PlaybookStep,
  createPlaybookCards, 
  playbookData 
} from "@/lib/playbookData";
import { usePlaybookData } from "@/hooks/usePlaybookData";
import { getUrlParameter } from "@/utils/urlParams";
import { MERCURY_DURATIONS, MERCURY_EASING } from "@/lib/mercury-utils";

// Mercury OS Wu Wei Daoist Easing Functions
const wuWeiEasing = [0.25, 0.46, 0.45, 0.94] as const;

// Simple Stage Details Panel Component
function StageDetailsPanel({ card, stageId, onClose }: { card: PlaybookCardType, stageId: string, onClose: () => void }) {
  const step = card.data as PlaybookStep;
  const stage = step.execution.stages.find(s => s.stage.toString() === stageId);
  
  if (!stage) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Stage not found
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Stage {stage.stage} Details</h3>
        <button 
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Scrollable Content */}
      <div 
        className="flex-1 overflow-y-auto space-y-4 pr-2" 
        style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 #f1f5f9'
          // Remove fixed height - let it take remaining space
        }}
      >
        <div>
          <h4 className="text-base font-semibold text-gray-900 mb-2">{stage.name}</h4>
          <p className="text-sm text-gray-700 mb-4">{stage.instructions}</p>
        </div>
        
        {/* Tool Configuration */}
        {stage.tool && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-sm font-medium text-blue-900">Tool Configuration</h5>
              {stage.tool.url && (
                <a
                  href={stage.tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
            <p className="text-sm text-blue-800">{stage.tool.name}</p>
          </div>
        )}
        
        {/* AI Prompt */}
        {stage.prompt && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <h5 className="text-sm font-medium text-purple-900 mb-2">AI Prompt</h5>
            <p className="text-sm text-purple-800">{stage.prompt.content}</p>
          </div>
        )}
        
        {/* Rich Content */}
        {stage.rich_content && stage.rich_content.elements.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-gray-900 mb-2">Resources</h5>
            <div className="space-y-2">
              {stage.rich_content.elements.map((element, i) => (
                <div key={i} className="text-sm text-gray-700">
                  {element.type === 'code' && (
                    <div className="bg-gray-900 text-green-400 p-2 rounded text-xs font-mono">
                      {element.content}
                    </div>
                  )}
                  {element.type === 'link' && (
                    <a href={element.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {element.content}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Context & Expected Outcomes */}
        {(stage.context || stage.outcome_expected) && (
          <div className="grid grid-cols-1 gap-3">
            {stage.context && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h5 className="text-sm font-medium text-blue-900 mb-2">context to be utilised</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  {stage.context.required.map((context, i) => (
                    <li key={i}>• {context}</li>
                  ))}
                </ul>
                {stage.context.assumptions && (
                  <div className="mt-3 pt-2 border-t border-blue-200">
                    <h6 className="text-xs font-medium text-blue-800 mb-1">Assumptions:</h6>
                    <ul className="text-xs text-blue-600 space-y-1">
                      {stage.context.assumptions.map((assumption, i) => (
                        <li key={i}>✓ {assumption}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {stage.outcome_expected && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-green-900">Expected Outcomes</h5>
                  {stage.ai_completion_badge && (
                    <span className="inline-flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium animate-pulse">
                      <span>{stage.ai_completion_badge.icon}</span>
                      <span>AI KUDOS</span>
                    </span>
                  )}
                </div>
                <ul className="text-sm text-green-700 space-y-1">
                  {stage.outcome_expected.generated.map((outcome, i) => (
                    <li key={i}>• {outcome}</li>
                  ))}
                </ul>
                {stage.outcome_expected.artifacts && (
                  <div className="mt-3 pt-2 border-t border-green-200">
                    <h6 className="text-xs font-medium text-green-800 mb-1">Generated Artifacts:</h6>
                    <ul className="text-xs text-green-600 space-y-1">
                      {stage.outcome_expected.artifacts.map((artifact, i) => (
                        <li key={i}>📄 {artifact}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* AI Prompts - Only show for non-autonomous stages */}
        {stage.ai_prompts && Object.keys(stage.ai_prompts).length > 0 && stage.type !== 'llm_direct' && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-3">
              <h5 className="text-sm font-medium text-purple-900">🤖 AI Prompts</h5>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                {Object.keys(stage.ai_prompts).length} prompts
              </span>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {Object.entries(stage.ai_prompts).map(([key, prompt], index) => (
                <div key={key} className="bg-white border border-purple-200 rounded p-2 relative group">
                  <div className="flex items-center justify-between mb-1">
                    <h6 className="text-xs font-semibold text-purple-800 capitalize">
                      {key.replace(/_/g, ' ').replace('prompt', '')}
                    </h6>
                    <button
                      onClick={() => {
                        const promptText = typeof prompt === 'string' ? prompt : JSON.stringify(prompt);
                        navigator.clipboard.writeText(promptText);
                        // Show temporary success message
                        const button = document.activeElement as HTMLElement;
                        const originalText = button.textContent;
                        button.textContent = '✓ Copied!';
                        button.style.color = '#059669';
                        setTimeout(() => {
                          button.textContent = originalText;
                          button.style.color = '';
                        }, 2000);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-600 hover:text-purple-800 text-xs px-2 py-1 rounded bg-purple-100 hover:bg-purple-200"
                      title="Copy to clipboard"
                    >
                      📋 Copy
                    </button>
                  </div>
                  <div className="text-xs text-purple-700 leading-relaxed max-h-32 overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-mono text-[10px] bg-purple-25 p-1 rounded">
                      {typeof prompt === 'string' ? prompt : JSON.stringify(prompt, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CanvasWorkflowPage() {
  // Mercury compliance properties
  const intent = "canvas-workflow-space";
  
  // Get ID from URL parameter
  const [playbookId, setPlaybookId] = useState<string | null>(null);
  
  // Fetch playbook data from API
  const { data: apiData, loading: apiLoading, error: apiError } = usePlaybookData(playbookId);
  
  // Mercury-compliant state management - using playbook data
  const [playbookCards, setPlaybookCards] = useState<PlaybookCardType[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [expandedStageDetails, setExpandedStageDetails] = useState<{cardId: string, stageId: string} | null>(null);
  
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
  
  // Extract ID from URL parameter on component mount
  useEffect(() => {
    console.log('Page mounted, checking URL parameters...');
    console.log('Current URL:', window.location.href);
    console.log('Current search params:', window.location.search);
    
    const id = getUrlParameter('ID') || getUrlParameter('id'); // Try both uppercase and lowercase
    console.log('Extracted ID from URL:', id); // Debug log
    
    if (id) {
      console.log('Setting playbook ID to:', id);
      setPlaybookId(id);
    } else {
      console.log('No ID found, using static data');
      // If no ID provided, use default static data
      setPlaybookCards(createPlaybookCards());
    }
  }, []);
  
  // Update playbook cards when API data is loaded
  useEffect(() => {
    console.log('API data effect triggered, apiData:', apiData); // Debug log
    if (apiData) {
      console.log('Processing API data, steps count:', apiData.playbook.steps.length); // Debug log
      // Create cards from API data
      const cards: PlaybookCardType[] = [];
      
      // Add all playbook steps as the main cards
      apiData.playbook.steps.forEach((step, index) => {
        cards.push({
          id: `step-${step.id}`,
          type: "step",
          data: step,
          position: { x: 50, y: 100 + (index * 400) }, // Vertical positioning
          connections: [],
          focusLevel: "ambient" as const, // Default focus level
        });
      });
      
      console.log('Created cards from API data:', cards.length); // Debug log
      setPlaybookCards(cards);
    }
  }, [apiData]);
  const [panStart, setPanStart] = useState({ x: 0, y: 0, panX: 0, panY: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  
  // Canvas zoom state
  const [canvasZoom, setCanvasZoom] = useState(1);
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 5;
  const ZOOM_STEP = 0.05; // Reduced sensitivity from 0.1 to 0.05
  const [isZoomControlsVisible, setIsZoomControlsVisible] = useState(false);
  
  // Demo state removed - play demo functionality has been removed
  
  // Simple CSS-based width system
  const getCardClasses = (cardId: string) => {
    if (expandedStageDetails?.cardId === cardId && expandedIds.has(cardId)) {
      return "w-[95vw] max-w-7xl"; // Three panels: 95% of viewport (increased to use more space)
    } else if (expandedIds.has(cardId)) {
      return "w-[75vw] max-w-5xl"; // Two panels: 75% of viewport (increased)
    } else {
      return "w-[30vw] max-w-md"; // Single card: 30% of viewport
    }
  };
  
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
    createPlaybookCards().map(card => card.id)
  );
  
  // Reorder playbook cards based on card order
  const orderedPlaybookCards = cardOrder.map(id => 
    playbookCards.find(card => card.id === id)
  ).filter(Boolean) as PlaybookCardType[];
  
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
    if (!canvasRef.current || orderedPlaybookCards.length === 0) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const padding = 100;
    
    // Calculate bounds of all cards
    const cardWidth = 400;
    const cardHeight = 280; // Updated for playbook cards
    const gap = 24; // 6 * 4px from gap-6
    
    const totalWidth = orderedPlaybookCards.length * cardWidth + (orderedPlaybookCards.length - 1) * gap;
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
  }, [orderedPlaybookCards]);
  
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
  const handleEdit = (cardId: string) => {
    setEditingId(cardId);
    setExpandedIds(new Set()); // Close all insights when editing
  };

  const handleSave = (updatedCard: PlaybookCardType) => {
    setPlaybookCards((prev) =>
      prev.map((card) => (card.id === updatedCard.id ? updatedCard : card))
    );
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleToggleInsights = (cardId: string) => {
    console.log('handleToggleInsights called:', cardId, 'editingId:', editingId);
    if (editingId) return; // Don't toggle insights while editing
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      const wasExpanded = newSet.has(cardId);
      console.log('Card was expanded:', wasExpanded, 'Current expanded IDs:', Array.from(prev));
      if (wasExpanded) {
        newSet.delete(cardId);
        console.log('Removing card from expanded IDs');
        // Also close stage details when closing insights
        setExpandedStageDetails(null);
      } else {
        newSet.add(cardId);
        console.log('Adding card to expanded IDs');
        // No auto-scroll on manual clicks - keep it simple
      }
      console.log('New expanded IDs:', Array.from(newSet));
      return newSet;
    });
  };

  const handleToggleStageDetails = (cardId: string, stageId: string) => {
    setExpandedStageDetails(prev => {
      if (prev?.cardId === cardId && prev?.stageId === stageId) {
        return null; // Close if already open
      }
      return { cardId, stageId }; // Open new stage details
    });
  };

  const getFocusLevel = (cardId: string): "focused" | "ambient" | "fog" => {
    if (editingId === cardId) return "focused";
    if (editingId && editingId !== cardId) return "fog";
    
    // Demo playback removed
    
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

  // Play demo functionality removed

  // Update field for editable playbook card
  const updateField = (field: string, value: string | number | boolean | string[], nested?: string) => {
    setPlaybookCards((prev) => prev.map((card) => {
      if (card.id === editingId) {
        // For now, we'll handle basic updates - more complex editing can be added later
        // This is a placeholder for future implementation
        console.log('Field update requested:', { field, value, nested });
        return card; // Return unchanged for now
      }
      return card;
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

  // Loading state
  if (playbookId && apiLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50/50 via-white to-gray-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading playbook data...</p>
          <p className="text-sm text-gray-500 mt-2">ID: {playbookId}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (playbookId && apiError) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50/50 via-white to-gray-50/30 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Playbook</h2>
          <p className="text-gray-600 mb-4">{apiError}</p>
          <p className="text-sm text-gray-500">ID: {playbookId}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Use API data if available, otherwise fall back to static data
  const currentPlaybookData = apiData || playbookData;

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Fixed Project Header - stays in place during pan/zoom */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <ProjectHeader 
          project={currentPlaybookData.project}
          className="w-full max-w-none"
        />
      </div>
      
      <div 
        ref={canvasRef}
        data-intent={intent}
        data-canvas-background="true"
        className={`mercury-module mercury-space min-h-screen w-full bg-gradient-to-br from-gray-50/50 via-white to-gray-50/30 relative overflow-y-auto overflow-x-auto select-none ${
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
        
        
        {/* Zoom level indicator */}
        {canvasZoom !== 1 && (
          <div className="fixed top-20 right-4 z-40 bg-black/60 text-white px-3 py-1 rounded-lg text-xs font-medium backdrop-blur-sm">
            {Math.round(canvasZoom * 100)}% zoom
          </div>
        )}
        
        
        {/* Vertical scrolling content */}
        <div 
          className="flex flex-col w-full"
          style={{
            paddingLeft: '24px',
            paddingRight: '24px',
            paddingTop: '0px', // No top padding - each card container handles spacing
            paddingBottom: '0px', // No bottom padding for full height
            ...(canvasZoom !== 1 || canvasPan.x !== 0 || canvasPan.y !== 0 ? {
              transform: `translate(${canvasPan.x}px, ${canvasPan.y}px) scale(${canvasZoom})`,
              transformOrigin: 'top left',
              transition: 'transform 75ms ease-out'
            } : {}),
            pointerEvents: isPanning ? 'none' : 'auto'
          }}
          data-canvas-background="true"
        >
          {/* Playbook Step Cards Container */}
          <div className="flex flex-col items-center w-full">
            {/* Playbook Cards */}
            {orderedPlaybookCards.map((playbookCard, index) => (
              <div 
                key={playbookCard.id}
                className="w-full flex items-center justify-center px-4"
                style={{
                  height: '100vh', // Each card gets its own viewport section
                  paddingTop: index === 0 ? '120px' : '80px', // More space for first card (header), less for others
                  paddingBottom: '80px' // Bottom spacing within viewport
                }}
              >
                <motion.div
                  data-intent={`playbook-card-${playbookCard.id}`}
                  className="mercury-module w-full max-w-none"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: MERCURY_DURATIONS.normal,
                    ease: MERCURY_EASING,
                    delay: index * 0.1
                  }}
                  role="region"
                  aria-label={`${playbookCard.type} card ${index + 1}`}
                  style={{
                    cursor: editingId !== playbookCard.id && !isSpacePressed && !isPanning ? 'grab' : 'default',
                    opacity: draggedCardId === playbookCard.id ? 0.5 : 1,
                    pointerEvents: isPanning ? 'none' : 'auto'
                  }}
                >
                <div
                  draggable={editingId !== playbookCard.id && !isPanning && !isSpacePressed}
                  onDragStart={(e: React.DragEvent) => handleDragStart(playbookCard.id, e)}
                  onDragOver={(e: React.DragEvent) => handleDragOver(e, playbookCard.id)}
                  onDragEnd={handleDragEnd}
                  className="w-full h-full"
                >
                  {/* Progressive width expansion card with unified border */}
                  <motion.div
                    className={`bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md mx-auto ${getCardClasses(playbookCard.id)} ${
                      getFocusLevel(playbookCard.id) === 'focused' ? 'scale-[1.02] z-30' :
                      getFocusLevel(playbookCard.id) === 'ambient' ? 'scale-100 z-10' :
                      'scale-[0.98] z-0 opacity-40 pointer-events-none blur-[0.5px]'
                    }`}
                    layout
                    animate={{
                      height: editingId === playbookCard.id ? "80vh" : 'auto'
                    }}
                    transition={{ duration: 0.5, ease: wuWeiEasing }}
                    style={{
                      overflow: "visible",
                      height: 'auto',
                      maxHeight: 'calc(100vh - 200px)',
                      minHeight: '400px'
                    }}
                  >
                    <div className="flex items-stretch w-full">
                      {/* Step Card Section */}
                      <div className={`p-6 ${
                        expandedStageDetails?.cardId === playbookCard.id && expandedIds.has(playbookCard.id) 
                          ? 'w-[30%] min-w-[30%]' // Three panels: 30% (reduced)
                          : expandedIds.has(playbookCard.id) 
                          ? 'w-[40%] min-w-[40%]' // Two panels: 40% (reduced)
                          : 'w-full' // Single panel: 100%
                      }`}>
                        <PlaybookCard
                          card={playbookCard}
                          onToggleInsights={() => handleToggleInsights(playbookCard.id)}
                          onEdit={() => handleEdit(playbookCard.id)}
                          isExpanded={expandedIds.has(playbookCard.id)}
                          focusLevel={getFocusLevel(playbookCard.id)}
                          className="border-0 rounded-none bg-transparent shadow-none"
                        />
                      </div>
                      
                      {/* Insights Panel Section */}
                      <AnimatePresence>
                        {expandedIds.has(playbookCard.id) && editingId !== playbookCard.id && (
                          <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.5, ease: wuWeiEasing }}
                            className={`border-l border-gray-100 p-6 ${
                              expandedStageDetails?.cardId === playbookCard.id 
                                ? 'w-[35%] min-w-[35%] max-h-[500px] overflow-y-auto' // Three panels: 35% with scroll
                                : 'w-[60%] min-w-[60%] max-h-[500px] overflow-y-auto' // Two panels: 60% with scroll
                            }`}
                          >
                            <PlaybookInsightsPanel
                              card={playbookCard}
                              isVisible={true}
                              intent="playbook-insights-panel"
                              className="border-0 rounded-none bg-transparent"
                              onStageDetailToggle={(stageId: string) => handleToggleStageDetails(playbookCard.id, stageId)}
                              expandedStageDetails={expandedStageDetails?.cardId === playbookCard.id ? expandedStageDetails.stageId : null}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      {/* Stage Details Panel */}
                      <AnimatePresence>
                        {expandedStageDetails?.cardId === playbookCard.id && expandedIds.has(playbookCard.id) && editingId !== playbookCard.id && (
                          <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.5, ease: wuWeiEasing }}
                            className="border-l border-gray-100 bg-gray-50 rounded-r-2xl w-[35%] min-w-[35%] h-[500px] overflow-hidden"
                          >
                            <div className="h-full flex flex-col p-6">
                              <StageDetailsPanel 
                                card={playbookCard}
                                stageId={expandedStageDetails.stageId}
                                onClose={() => setExpandedStageDetails(null)}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              </div>
            ))}
          </div>
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
