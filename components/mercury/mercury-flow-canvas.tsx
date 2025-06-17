"use client";

import React, { useState, useRef, useCallback } from "react";

import { AnimatePresence, motion } from "framer-motion";

import {
  getMercuryDropZoneStyles,
  useMercuryDrop,
} from "@/lib/mercury-drag-system";
import {
  ApartmentListing,
  DragItem,
  MercuryCard,
  Point,
} from "@/lib/mercury-types";
import { cn } from "@/lib/utils";

// Mercury OS Wu Wei Daoist Easing Functions
const wuWeiEasing = [0.25, 0.46, 0.45, 0.94] as const;
const _wuWeiSlowEasing = [0.15, 0.35, 0.25, 0.96] as const;
const _wuWeiSpringEasing = [0.34, 1.56, 0.64, 1] as const;

// Mercury Spatial Computing - Collision Detection & Flow Validation
interface CardBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
  centerX: number;
  centerY: number;
}

const getCardBounds = (
  card: MercuryCard,
  cardWidth: number = 425,
  cardHeight: number = 300
): CardBounds => {
  return {
    left: card.position.x,
    right: card.position.x + cardWidth,
    top: card.position.y,
    bottom: card.position.y + cardHeight,
    centerX: card.position.x + cardWidth / 2,
    centerY: card.position.y + cardHeight / 2,
  };
};

const checkCollision = (
  position: Point,
  cardWidth: number,
  cardHeight: number,
  existingCards: MercuryCard[]
): boolean => {
  const newCardBounds = {
    left: position.x,
    right: position.x + cardWidth,
    top: position.y,
    bottom: position.y + cardHeight,
  };

  return existingCards.some((card) => {
    const existingBounds = getCardBounds(
      card,
      card.intent.includes("search-results") ? 425 : 280,
      card.intent.includes("search-results") ? 300 : 200
    );

    // Check if rectangles overlap
    return !(
      newCardBounds.right <= existingBounds.left ||
      newCardBounds.left >= existingBounds.right ||
      newCardBounds.bottom <= existingBounds.top ||
      newCardBounds.top >= existingBounds.bottom
    );
  });
};

const isDropAllowed = (
  position: Point,
  cardWidth: number,
  existingCards: MercuryCard[]
): boolean => {
  // Find the rightmost card position
  const rightmostX = existingCards.reduce((maxX, card) => {
    const cardWidth = card.intent.includes("search-results") ? 425 : 280;
    return Math.max(maxX, card.position.x + cardWidth);
  }, 0);

  // Allow drops only to the right of existing cards or in empty space
  return position.x >= rightmostX - 50; // 50px tolerance for better UX
};

const findValidPosition = (
  desiredPosition: Point,
  cardWidth: number,
  cardHeight: number,
  existingCards: MercuryCard[]
): Point => {
  let position = { ...desiredPosition };
  const maxAttempts = 20;
  const offset = 20;

  // First check if desired position is valid
  if (
    !checkCollision(position, cardWidth, cardHeight, existingCards) &&
    isDropAllowed(position, cardWidth, existingCards)
  ) {
    return position;
  }

  // Find rightmost position as fallback
  const rightmostX = existingCards.reduce((maxX, card) => {
    const existingCardWidth = card.intent.includes("search-results")
      ? 425
      : 280;
    return Math.max(maxX, card.position.x + existingCardWidth);
  }, 0);

  // Try positions to the right with some spacing
  for (let i = 0; i < maxAttempts; i++) {
    position = {
      x: rightmostX + i * offset + 32, // 32px spacing
      y: Math.max(100, desiredPosition.y), // Keep desired Y, minimum 100px from top
    };

    if (!checkCollision(position, cardWidth, cardHeight, existingCards)) {
      return position;
    }
  }

  // Final fallback - find any valid position
  return {
    x: rightmostX + 32,
    y: Math.max(100, desiredPosition.y),
  };
};

// Mercury Spatial Layout Management - Viewport-Constrained System
const calculateOptimalLayout = (
  cards: MercuryCard[],
  newCard: MercuryCard,
  viewportWidth: number,
  canvasPadding: number = 40
): {
  repositionedCards: MercuryCard[];
  finalNewCard: MercuryCard;
  chatRepositionNeeded?: { x: number; y: number };
} => {
  const cardSpacing = 16; // Reduced from 32 to 16 for better packing
  const sideMargin = 16; // Much smaller margins for maximum card space
  const rowSpacing = 50; // Slightly reduced row spacing
  const viewportHeight =
    typeof window !== "undefined" ? window.innerHeight : 800;

  const chatModuleWidth = 400;
  const chatModuleHeight = 600;

  // More efficient available width calculation
  // Total usable width = viewport - chat - margins (no extra spacing deduction)
  const availableCardWidth = viewportWidth - chatModuleWidth - sideMargin * 2;

  // Get card dimensions
  const getCardDimensions = (card: MercuryCard) => ({
    width: card.intent.includes("search-results") ? 425 : 280,
    height: card.intent.includes("search-results") ? 300 : 200,
  });

  const newCardDims = getCardDimensions(newCard);

  console.log("🎯 EFFICIENT LAYOUT CALCULATION:", {
    viewportWidth,
    chatModuleWidth,
    sideMargin,
    availableCardWidth,
    newCardDims,
    "3ActionCards": "280+16+280+16+280=872px",
    "available>=872": availableCardWidth >= 872,
  });

  // CASE 1: First action card - position chat and action within viewport
  if (cards.length === 0) {
    const optimalChatX = sideMargin;
    const chatY = Math.max(
      canvasPadding + 20,
      (viewportHeight - chatModuleHeight) / 2
    );

    const firstActionCard = {
      ...newCard,
      position: {
        x: optimalChatX + chatModuleWidth + cardSpacing,
        y: chatY + 80,
      },
    };

    console.log("🎯 FIRST CARD EFFICIENT LAYOUT:", {
      chatPosition: { x: optimalChatX, y: chatY },
      actionPosition: firstActionCard.position,
      strategy: "EFFICIENT_PACKING",
    });

    return {
      repositionedCards: [],
      finalNewCard: firstActionCard,
      chatRepositionNeeded: { x: optimalChatX, y: chatY },
    };
  }

  // CASE 2: Subsequent cards - efficient row-based packing

  // Fixed chat position at left edge with minimal margin
  const optimalChatX = sideMargin;
  const baseY = Math.max(
    canvasPadding + 20,
    (viewportHeight - chatModuleHeight) / 2
  );

  // Efficient space-finding with proper card packing
  const findAvailablePositionEfficient = (
    cards: MercuryCard[],
    cardDims: { width: number; height: number }
  ) => {
    const minX = optimalChatX + chatModuleWidth + cardSpacing;
    const maxX = viewportWidth - sideMargin - cardDims.width;
    const startY = baseY + 80;

    console.log("🎯 EFFICIENT SPACE SEARCH:", {
      minX,
      maxX,
      cardWidth: cardDims.width,
      availableWidth: maxX - minX,
      canFit3Actions: maxX - minX >= 280 * 3 + cardSpacing * 2,
    });

    // Try different rows with efficient packing
    for (let row = 0; row < 10; row++) {
      const y = startY + row * (Math.max(cardDims.height, 200) + rowSpacing);

      // Collect all cards in this row and sort by x position
      const cardsInRow: Array<{
        card: MercuryCard;
        dims: { width: number; height: number };
      }> = [];

      cards.forEach((existingCard) => {
        const existingDims = getCardDimensions(existingCard);

        // More precise row overlap detection
        const rowOverlap = !(
          existingCard.position.y + existingDims.height + 10 <= y ||
          existingCard.position.y >= y + cardDims.height + 10
        );

        if (rowOverlap) {
          cardsInRow.push({ card: existingCard, dims: existingDims });
        }
      });

      // Sort cards in this row by x position
      cardsInRow.sort((a, b) => a.card.position.x - b.card.position.x);

      // Try to fit the new card in available spaces
      let currentX = minX;

      // Check space before first card
      if (cardsInRow.length === 0) {
        // Empty row - place at start
        const testPosition = { x: currentX, y };
        console.log("🎯 FOUND EMPTY ROW:", { position: testPosition, row });
        return testPosition;
      }

      // Check gaps between existing cards
      for (let i = 0; i < cardsInRow.length; i++) {
        const currentCard = cardsInRow[i];
        const cardStart = currentCard.card.position.x;
        const cardEnd = currentCard.card.position.x + currentCard.dims.width;

        // Check if new card fits before this existing card
        if (currentX + cardDims.width + cardSpacing <= cardStart) {
          const testPosition = { x: currentX, y };
          console.log("🎯 FOUND GAP BEFORE CARD:", {
            position: testPosition,
            row,
            gapSize: cardStart - currentX,
            needed: cardDims.width + cardSpacing,
          });
          return testPosition;
        }

        // Move to after this card
        currentX = cardEnd + cardSpacing;
      }

      // Check space after last card in row
      if (currentX + cardDims.width <= maxX) {
        const testPosition = { x: currentX, y };
        console.log("🎯 FOUND SPACE AFTER LAST CARD:", {
          position: testPosition,
          row,
          remainingSpace: maxX - currentX,
          needed: cardDims.width,
        });
        return testPosition;
      }

      console.log(
        `🎯 ROW ${row} FULL (${cardsInRow.length} cards), TRYING NEXT ROW`
      );
    }

    // Fallback: place at start of a new row
    const fallbackRow = Math.max(5, cards.length);
    const fallbackPosition = {
      x: minX,
      y: startY + fallbackRow * (200 + rowSpacing),
    };
    console.log("🎯 FALLBACK TO NEW ROW:", fallbackPosition);
    return fallbackPosition;
  };

  // Keep existing cards in their current positions
  const repositionedCards = [...cards];

  // Find optimal position for new card with efficient packing
  const optimalNewPosition = findAvailablePositionEfficient(cards, newCardDims);

  const intelligentNewCard = {
    ...newCard,
    position: optimalNewPosition,
  };

  console.log("🎯 EFFICIENT LAYOUT RESULT:", {
    existingCardsKept: cards.length,
    newCardPosition: intelligentNewCard.position,
    newCardDims: newCardDims,
    strategy: "EFFICIENT_HORIZONTAL_PACKING",
  });

  return {
    repositionedCards,
    finalNewCard: intelligentNewCard,
    chatRepositionNeeded: { x: optimalChatX, y: baseY },
  };
};

// Mercury Wu Wei Animation - Graceful Layout Transitions
const _animateLayoutChange = (
  cards: MercuryCard[],
  newPositions: MercuryCard[],
  onUpdate: (cards: MercuryCard[]) => void
) => {
  // Trigger smooth repositioning of existing cards
  onUpdate(newPositions);
};

interface MercuryFlowCanvasProps {
  intent: string;
  children?: React.ReactNode;
  onCardCreated?: (card: MercuryCard) => void;
  onCardRemoved?: (cardId: string) => void;
  onChatRepositioned?: (newPosition: { x: number; y: number }) => void;
  className?: string;
}

export function MercuryFlowCanvas({
  intent,
  children,
  onCardCreated,
  onCardRemoved,
  onChatRepositioned,
  className = "",
}: MercuryFlowCanvasProps) {
  const [cards, setCards] = useState<MercuryCard[]>([]);
  const [_dragPreview, setDragPreview] = useState<{
    position: Point;
    item: DragItem;
  } | null>(null);
  const [_dragPosition, setDragPosition] = useState<Point | null>(null);
  const [_isValidDrop, setIsValidDrop] = useState(true);
  const _canvasRef = useRef<HTMLDivElement>(null);

  const handleDrop = useCallback(
    (item: DragItem, position: Point) => {
      console.log("🎯 CANVAS RECEIVED DROP:", { item, position });
      console.log("🎯 ITEM TYPE:", item.type, "DATA TYPE:", item.data.type);

      // Auto-scroll helper function (vertical only)
      const autoScrollToCard = (
        cardPosition: Point,
        cardWidth: number,
        cardHeight: number
      ) => {
        setTimeout(() => {
          const buffer = 100;
          const targetY = cardPosition.y - buffer;

          // Calculate if the card is outside the vertical viewport
          const viewportHeight = window.innerHeight;
          const scrollY = window.scrollY;

          const cardBottom = cardPosition.y + cardHeight + buffer;

          let shouldScrollY = false;
          let newScrollY = scrollY;

          // Check if card is outside vertical viewport
          if (cardBottom > scrollY + viewportHeight) {
            shouldScrollY = true;
            newScrollY = cardBottom - viewportHeight + buffer;
          } else if (targetY < scrollY) {
            shouldScrollY = true;
            newScrollY = targetY;
          }

          // Smooth scroll vertically to show the new card
          if (shouldScrollY) {
            console.log("🎯 AUTO-SCROLLING VERTICALLY TO SHOW NEW CARD:", {
              cardPosition,
              currentScrollY: scrollY,
              newScrollY: newScrollY,
            });

            window.scrollTo({
              left: 0, // Keep horizontal scroll at 0
              top: newScrollY,
              behavior: "smooth",
            });
          }
        }, 800); // Delay to allow card animation to start
      };

      // Handle housing search action - create unified search results card
      if (
        item.type === "action-card" &&
        (item.data.type === "housing-search" || item.data.type === "housing")
      ) {
        const housingListings = [
          {
            id: "1",
            name: "7 Creekside",
            bedrooms: "4br",
            bathrooms: "2b",
            price: "$9,000/month",
            image:
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop&auto=format",
            description: "Modern apartment with city views",
          },
          {
            id: "2",
            name: "64 Church St.",
            bedrooms: "4br",
            bathrooms: "2b",
            price: "$12,000/month",
            image:
              "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop&auto=format",
            description: "Luxury downtown living",
          },
          {
            id: "3",
            name: "The Rustic Swag",
            bedrooms: "4br",
            bathrooms: "2b",
            price: "$20,000/month",
            image:
              "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=250&fit=crop&auto=format",
            description: "Premium luxury apartment",
          },
          {
            id: "4",
            name: "Noobles Ave.",
            bedrooms: "4br",
            bathrooms: "2b",
            price: "$11,000/month",
            image:
              "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop&auto=format",
            description: "Cozy residential apartment",
          },
        ];

        // Mercury Intelligent Spatial Layout System
        const desiredPosition = {
          x: position.x - 212, // Half of card width (425/2)
          y: position.y - 150, // Half of card height (300/2)
        };

        const newSearchCard: MercuryCard = {
          id: `search-results-${Date.now()}`,
          type: "housing-listing" as const,
          position: desiredPosition, // Temporary position for layout calculation
          content: {
            title: "Find homes in Mountain View, CA",
            description: `${housingListings.length} results found`,
            metadata: {
              searchQuery: item.data.title,
              listings: housingListings,
              searchType: "housing-search",
            },
          },
          connections: [],
          focusLevel: "focused" as const,
          intent: `${intent}-search-results`,
          metadata: {
            sourceType: item.type,
            sourceContext: item.sourceContext,
            createdAt: Date.now(),
            searchResults: housingListings,
          },
        };

        // Calculate optimal layout with intelligent positioning
        const viewportWidth = window.innerWidth;
        const { repositionedCards, finalNewCard, chatRepositionNeeded } =
          calculateOptimalLayout(cards, newSearchCard, viewportWidth, 40);

        console.log("🎯 MERCURY INTELLIGENT LAYOUT:");
        console.log("  Original drop position:", position);
        console.log("  Is first card:", cards.length === 0);
        console.log("  Repositioned existing cards:", repositionedCards.length);
        console.log("  Final new card position:", finalNewCard.position);
        console.log("  Chat reposition needed:", chatRepositionNeeded);
        console.log(
          "  Layout strategy:",
          cards.length === 0
            ? "FLOW_FROM_CENTERED_CHAT"
            : "VIEWPORT_AWARE_LAYOUT"
        );

        // Reposition chat if needed for optimal layout
        if (chatRepositionNeeded) {
          console.log("🎯 REPOSITIONING CHAT MODULE TO:", chatRepositionNeeded);
          onChatRepositioned?.(chatRepositionNeeded);
        }

        // Apply layout changes with smooth animation
        setCards((prev) => {
          // First update existing cards to their new positions
          const updatedExisting = prev.map((existingCard) => {
            const repositioned = repositionedCards.find(
              (r) => r.id === existingCard.id
            );
            return repositioned || existingCard;
          });

          // Add the new card
          return [...updatedExisting, finalNewCard];
        });

        onCardCreated?.(finalNewCard);

        // Auto-scroll to show the new card
        autoScrollToCard(finalNewCard.position, 425, 300);
      } else if (item.type === "action-card") {
        // Handle other action cards with intelligent layout
        const desiredPosition = {
          x: position.x - 140, // Half of card width (280/2)
          y: position.y - 75, // Half of card height (150/2)
        };

        const newActionCard: MercuryCard = {
          id: `action-card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: "action-result",
          position: desiredPosition, // Temporary position for layout calculation
          content: {
            title: item.data.title || "Action Result",
            description: item.data.description || `${item.data.type} action`,
            metadata: { ...item.data },
          },
          connections: [],
          focusLevel: "focused" as const,
          intent: `${intent}-action-result`,
          metadata: {
            sourceType: item.type,
            sourceContext: item.sourceContext,
            createdAt: Date.now(),
          },
        };

        // Calculate optimal layout
        const viewportWidth = window.innerWidth;
        const { repositionedCards, finalNewCard, chatRepositionNeeded } =
          calculateOptimalLayout(cards, newActionCard, viewportWidth, 40);

        console.log("🎯 ACTION CARD LAYOUT:", {
          originalPosition: desiredPosition,
          finalPosition: finalNewCard.position,
          chatReposition: chatRepositionNeeded,
        });

        // Reposition chat if needed
        if (chatRepositionNeeded) {
          onChatRepositioned?.(chatRepositionNeeded);
        }

        // Apply layout changes
        setCards((prev) => {
          const updatedExisting = prev.map((existingCard) => {
            const repositioned = repositionedCards.find(
              (r) => r.id === existingCard.id
            );
            return repositioned || existingCard;
          });

          return [...updatedExisting, finalNewCard];
        });

        onCardCreated?.(finalNewCard);

        // Auto-scroll to show the new card
        autoScrollToCard(finalNewCard.position, 280, 200);
      } else {
        // Handle single item drops with intelligent layout
        console.log("🎯 SINGLE ITEM DROP:", { item, position });

        const desiredPosition = {
          x: position.x - 140, // Half of card width (280/2)
          y: position.y - 75, // Half of card height (150/2)
        };

        const newCard: MercuryCard = {
          id: `single-item-${Date.now()}`,
          type: "content-block",
          position: desiredPosition,
          content: {
            title: item.data?.title || "Dropped Item",
            description: item.data?.description || "Item added to canvas",
            metadata: { ...item.data },
          },
          connections: [],
          focusLevel: "focused" as const,
          intent: `${intent}-single-item`,
          metadata: {
            sourceType: item.type,
            sourceContext: item.sourceContext,
            createdAt: Date.now(),
          },
        };

        // Calculate optimal layout
        const viewportWidth = window.innerWidth;
        const { repositionedCards, finalNewCard, chatRepositionNeeded } =
          calculateOptimalLayout(cards, newCard, viewportWidth, 40);

        // Reposition chat if needed
        if (chatRepositionNeeded) {
          onChatRepositioned?.(chatRepositionNeeded);
        }

        // Apply layout changes
        setCards((prev) => {
          const updatedExisting = prev.map((existingCard) => {
            const repositioned = repositionedCards.find(
              (r) => r.id === existingCard.id
            );
            return repositioned || existingCard;
          });

          return [...updatedExisting, finalNewCard];
        });

        onCardCreated?.(finalNewCard);

        // Auto-scroll to show the new card
        autoScrollToCard(finalNewCard.position, 280, 200);
      }

      // Clear drag preview
      setDragPreview(null);
    },
    [intent, onCardCreated, cards]
  );

  const handleCardMove = useCallback((cardId: string, newPosition: Point) => {
    setCards((prev) => {
      const movingCard = prev.find((card) => card.id === cardId);
      if (!movingCard) return prev;

      const otherCards = prev.filter((card) => card.id !== cardId);

      // For manual moves, we allow more freedom but still prevent overlaps
      // Use simple collision detection for manual moves to preserve user intent
      const cardWidth = movingCard.intent.includes("search-results")
        ? 425
        : 280;
      const cardHeight = movingCard.intent.includes("search-results")
        ? 300
        : 200;

      // Check for basic collision
      const wouldCollide = checkCollision(
        newPosition,
        cardWidth,
        cardHeight,
        otherCards
      );

      if (wouldCollide) {
        // Find a nearby valid position that respects user intent
        const validPosition = findValidPosition(
          newPosition,
          cardWidth,
          cardHeight,
          otherCards
        );
        console.log("🎯 MANUAL MOVE - COLLISION PREVENTED:", {
          cardId,
          requested: newPosition,
          adjusted: validPosition,
        });

        return prev.map((card) =>
          card.id === cardId ? { ...card, position: validPosition } : card
        );
      }

      // No collision - allow the move
      console.log("🎯 MANUAL MOVE - ALLOWED:", {
        cardId,
        position: newPosition,
      });
      return prev.map((card) =>
        card.id === cardId ? { ...card, position: newPosition } : card
      );
    });
  }, []);

  const handleCardRemove = useCallback(
    (cardId: string) => {
      setCards((prev) => prev.filter((card) => card.id !== cardId));
      onCardRemoved?.(cardId);
    },
    [onCardRemoved]
  );

  const canvasId = `${intent}-flow-canvas`;

  // Calculate dynamic canvas dimensions based on card positions
  const calculateCanvasBounds = useCallback(() => {
    const viewportWidth =
      typeof window !== "undefined" ? window.innerWidth : 1200;

    if (cards.length === 0) {
      return {
        minWidth: viewportWidth,
        minHeight:
          typeof window !== "undefined"
            ? Math.max(800, window.innerHeight)
            : 800,
      };
    }

    let maxY = 0;

    cards.forEach((card) => {
      const cardHeight = card.intent.includes("search-results") ? 300 : 200;
      maxY = Math.max(maxY, card.position.y + cardHeight);
    });

    // Add vertical padding and ensure minimum height, but constrain width to viewport
    const padding = 200;
    return {
      minWidth: viewportWidth, // Always match viewport width
      minHeight: Math.max(800, maxY + padding),
    };
  }, [cards]);

  const canvasBounds = calculateCanvasBounds();

  // Enhanced drop hook with validation feedback
  const handleDropWithValidation = useCallback(
    (item: DragItem, position: Point) => {
      setDragPosition(null);
      setIsValidDrop(true);
      handleDrop(item, position);
    },
    [handleDrop]
  );

  const { isOver, canDrop, drop } = useMercuryDrop(
    handleDropWithValidation,
    canvasId
  );

  const dropZoneStyles = getMercuryDropZoneStyles(isOver, canDrop);

  return (
    <motion.div
      ref={(node) => {
        drop(node);
        if (node) {
          // Ensure the node has the correct ID for drop targeting
          node.id = canvasId;
        }
      }}
      data-intent={intent}
      id={canvasId}
      className={cn(
        "relative w-full overflow-x-hidden",
        "bg-gradient-to-br from-slate-50/50 to-white/80 backdrop-blur-sm",
        className
      )}
      style={{
        ...dropZoneStyles,
        minHeight: `${canvasBounds.minHeight}px`,
        padding: "40px",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: wuWeiEasing,
      }}
    >
      {/* Canvas Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="mercury-grid"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="12" cy="12" r="1" fill="#64748b" opacity="0.1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mercury-grid)" />
        </svg>
      </div>

      {/* Content area */}
      <div className="relative z-10">{children}</div>

      {/* Spawned Cards */}
      <AnimatePresence mode="popLayout">
        {cards.map((card) => (
          <MercuryContextualCard
            key={card.id}
            card={card}
            onMove={(newPosition) => handleCardMove(card.id, newPosition)}
            onRemove={() => handleCardRemove(card.id)}
          />
        ))}
      </AnimatePresence>

      {/* Mercury Intelligent Layout Preview */}
      <AnimatePresence>
        {isOver && (
          <>
            {/* Show existing cards with gentle highlight */}
            {cards.map((card) => {
              const cardWidth = card.intent.includes("search-results")
                ? 425
                : 280;
              const cardHeight = card.intent.includes("search-results")
                ? 300
                : 200;

              return (
                <motion.div
                  key={`layout-preview-${card.id}`}
                  className="absolute border-2 border-blue-300/60 bg-blue-50/20 rounded-xl z-10 pointer-events-none"
                  style={{
                    left: card.position.x - 8,
                    top: card.position.y - 8,
                    width: cardWidth + 16,
                    height: cardHeight + 16,
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 0.7, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: wuWeiEasing }}
                />
              );
            })}

            {/* Chat-centric layout indicator */}
            <motion.div
              className="absolute top-8 left-96 bg-blue-500/90 text-white px-6 py-3 rounded-2xl font-medium shadow-lg backdrop-blur-sm z-10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: wuWeiEasing }}
            >
              💬 Chat module anchor → 🎯 Action cards flow
            </motion.div>

            {/* Show chat module boundary */}
            <motion.div
              className="absolute border-2 border-blue-400/60 bg-blue-50/20 rounded-xl z-10 pointer-events-none"
              style={{
                left: 24,
                top: 24,
                width: 416, // Chat module width + padding
                height: 616, // Chat module height + padding
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 0.5, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: wuWeiEasing }}
            />

            {/* Show flow direction indicator */}
            <motion.div
              className="absolute left-96 top-32 flex items-center z-10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, delay: 0.1, ease: wuWeiEasing }}
            >
              <motion.div
                className="flex space-x-2 text-blue-500"
                animate={{ x: [0, 10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: wuWeiEasing,
                }}
              >
                <span>→</span>
                <span>→</span>
                <span>→</span>
              </motion.div>
              <span className="ml-3 text-sm font-medium text-blue-600">
                {cards.length === 0 ? "First action here" : "Cards flow here"}
              </span>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Drop instruction overlay */}
      <AnimatePresence>
        {isOver && canDrop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 flex items-center justify-center bg-green-50/40 backdrop-blur-sm z-20"
            transition={{ duration: 0.3, ease: wuWeiEasing }}
          >
            <motion.div
              className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-green-200/50"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.1,
                ease: _wuWeiSpringEasing,
              }}
            >
              <div className="text-center">
                <motion.div
                  className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: wuWeiEasing,
                  }}
                >
                  <div className="w-6 h-6 bg-white rounded-full" />
                </motion.div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  🎯 Drop to Create Card
                </h3>
                <p className="text-sm text-slate-600">
                  {cards.length === 0
                    ? "First action will flow from chat module"
                    : "Cards will reflow gracefully from chat anchor"}
                </p>
                <p className="text-xs text-green-600 mt-2 font-medium">
                  Chat-centric spatial computing
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {cards.length === 0 && !isOver && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: wuWeiEasing }}
        >
          <div className="text-center max-w-md">
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full mx-auto mb-6 flex items-center justify-center"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: wuWeiEasing,
              }}
            >
              <div className="w-8 h-8 bg-white/60 rounded-full" />
            </motion.div>
            <h3 className="text-xl font-semibold text-slate-700 mb-3">
              Mercury Flow Canvas
            </h3>
            <p className="text-slate-500 leading-relaxed">
              Drag apartment listings or actions here to create contextual
              cards. Organize your spatial computing interface with Wu Wei
              principles.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

/**
 * Individual Mercury Contextual Card Component
 */
interface MercuryContextualCardProps {
  card: MercuryCard;
  onMove?: (position: Point) => void;
  onRemove?: () => void;
  onFocusChange?: (level: "focused" | "ambient" | "fog") => void;
}

function MercuryContextualCard({
  card,
  onMove,
  onRemove,
  onFocusChange,
}: MercuryContextualCardProps) {
  const [focusLevel, setFocusLevel] = useState(card.focusLevel);
  const [isDragging, setIsDragging] = useState(false);

  const handleFocusChange = (level: "focused" | "ambient" | "fog") => {
    setFocusLevel(level);
    onFocusChange?.(level);
  };

  const isSearchResults = card.intent.includes("search-results");
  const listings = card.metadata?.searchResults || [];

  return (
    <motion.div
      data-intent={card.intent}
      className={cn(
        "bg-white rounded-xl shadow-lg border border-slate-200",
        "cursor-move hover:shadow-xl z-30",
        isDragging ? "transition-none" : "transition-all duration-300",
        isSearchResults
          ? "min-w-[400px] max-w-[450px]"
          : "min-w-[240px] max-w-[320px]",
        focusLevel === "focused"
          ? "opacity-100"
          : focusLevel === "ambient"
            ? "opacity-85"
            : "opacity-60"
      )}
      initial={{
        x: card.position.x,
        y: card.position.y,
        scale: 0.8,
        opacity: 0,
        rotateY: -15,
        filter: "blur(6px)",
      }}
      animate={{
        x: card.position.x,
        y: card.position.y,
        scale: 1,
        opacity:
          focusLevel === "focused" ? 1 : focusLevel === "ambient" ? 0.85 : 0.6,
        rotateY: 0,
        filter: focusLevel === "fog" ? "blur(1px)" : "blur(0px)",
      }}
      onAnimationStart={() => {
        console.log(
          "🎯 CARD ANIMATION START:",
          card.id,
          "POSITION:",
          card.position
        );
      }}
      exit={{
        scale: 0.8,
        opacity: 0,
        rotateY: 15,
        filter: "blur(4px)",
        transition: { duration: 0.4, ease: wuWeiEasing },
      }}
      transition={{
        duration: 0.8,
        ease: wuWeiEasing,
        opacity: { duration: 0.6, ease: wuWeiEasing },
        filter: { duration: 0.6, ease: wuWeiEasing },
        x: { duration: 0.3, ease: wuWeiEasing },
        y: { duration: 0.3, ease: wuWeiEasing },
      }}
      style={{
        position: "absolute",
        filter: focusLevel === "fog" ? "blur(1px)" : "none",
        willChange: "transform",
        backfaceVisibility: "hidden",
      }}
      whileHover={{
        scale: 1.01,
        transition: { duration: 0.2, ease: wuWeiEasing },
      }}
      drag
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={false}
      whileDrag={{
        scale: 1.05,
        rotate: 2,
        zIndex: 999,
        transition: { duration: 0.1 },
      }}
      onDragStart={(_event, _info) => {
        setIsDragging(true);
        document.body.style.setProperty("--mercury-performance-mode", "true");
      }}
      onDragEnd={(_event, _info) => {
        setIsDragging(false);
        document.body.style.removeProperty("--mercury-performance-mode");

        // Use the reliable offset from drag info
        const newPosition = {
          x: Math.max(0, card.position.x + _info.offset.x),
          y: Math.max(0, card.position.y + _info.offset.y),
        };

        onMove?.(newPosition);
      }}
    >
      {/* Card Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isSearchResults && (
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
              </div>
            )}
            <h3 className="font-semibold text-slate-900 text-sm">
              {card.content.title}
            </h3>
          </div>
          <div className="flex items-center space-x-1">
            {/* Focus level controls */}
            {(["fog", "ambient", "focused"] as const).map((level) => (
              <button
                key={level}
                onClick={() => handleFocusChange(level)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  focusLevel === level ? "bg-blue-500" : "bg-slate-300"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div
        className={cn(
          "p-4",
          isSearchResults ? "max-h-[400px] overflow-y-auto" : ""
        )}
      >
        {isSearchResults ? (
          /* Search Results Layout */
          <div className="space-y-3">
            {isDragging ? (
              /* Simplified view during drag */
              <div className="text-center py-8">
                <div className="text-sm text-slate-600">
                  {listings.length} search results
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Release to view details
                </div>
              </div>
            ) : (
              /* Full detailed view when not dragging */
              listings.map((listing: any, index: number) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.05,
                    ease: wuWeiEasing,
                  }}
                  className="flex space-x-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors duration-150"
                >
                  <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={listing.image}
                      alt={listing.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">
                          {listing.bedrooms}, {listing.bathrooms}
                        </p>
                        <h4 className="font-semibold text-slate-900 text-sm mb-1">
                          {listing.name}
                        </h4>
                        <p className="font-bold text-slate-900 text-sm">
                          {listing.price}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}

            {!isDragging && (
              <>
                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4 border-t border-slate-100">
                  <button className="flex-1 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                    Add all to flow
                  </button>
                  <button className="flex-1 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                    Find some more
                  </button>
                </div>

                <button
                  onClick={onRemove}
                  className="w-full py-2 text-xs text-slate-500 hover:text-red-500 transition-colors"
                >
                  Remove card
                </button>
              </>
            )}
          </div>
        ) : (
          /* Regular Card Layout */
          <>
            {/* Apartment Image */}
            {card.content.imageUrl && (
              <motion.div
                className="w-full h-32 rounded-lg overflow-hidden mb-3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: wuWeiEasing }}
              >
                <img
                  src={card.content.imageUrl}
                  alt={card.content.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
            )}

            {card.content.description && (
              <p className="text-sm text-slate-600 mb-3">
                {card.content.description}
              </p>
            )}

            {card.content.price && (
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">
                  {card.content.price}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={onRemove}
                    className="text-xs text-slate-500 hover:text-red-500 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Connection points */}
      <div className="absolute -right-2 top-1/2 w-4 h-4 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute -left-2 top-1/2 w-4 h-4 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}
