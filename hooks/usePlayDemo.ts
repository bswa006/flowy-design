import { useState, useRef, useCallback, useEffect } from 'react';
import { Context } from '@/lib/contextMockData';

interface UsePlayDemoProps {
  contexts: Context[];
  onToggleInsights: (contextId: string) => void;
}

export function usePlayDemo({ contexts, onToggleInsights }: UsePlayDemoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0);
  const [playTimeoutId, setPlayTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToCard = useCallback((index: number) => {
    const cardElement = cardRefs.current[index];
    const scrollContainer = scrollContainerRef.current;
    
    if (!cardElement || !scrollContainer) return;
    
    const timelineHeight = 120; // Height of timeline
    const cardRect = cardElement.getBoundingClientRect();
    const containerRect = scrollContainer.getBoundingClientRect();
    
    const targetScrollTop = 
      cardElement.offsetTop - 
      containerRect.height / 2 + 
      cardRect.height / 2 -
      timelineHeight;
    
    scrollContainer.scrollTo({
      top: Math.max(0, targetScrollTop),
      behavior: 'smooth'
    });
  }, []);

  const playNextCard = useCallback(() => {
    if (currentPlayIndex < contexts.length) {
      const currentContext = contexts[currentPlayIndex];
      
      // Toggle insights for current card
      onToggleInsights(currentContext.id);
      
      // Scroll to current card
      scrollToCard(currentPlayIndex);
      
      setCurrentPlayIndex(prev => prev + 1);
      
      // Set timeout for next card
      const timeoutId = setTimeout(() => {
        playNextCard();
      }, 2000);
      
      setPlayTimeoutId(timeoutId);
    } else {
      // Demo completed
      setIsPlaying(false);
      setCurrentPlayIndex(0);
      setPlayTimeoutId(null);
    }
  }, [currentPlayIndex, contexts, onToggleInsights, scrollToCard]);

  const startDemo = useCallback(() => {
    setIsPlaying(true);
    setCurrentPlayIndex(0);
    playNextCard();
  }, [playNextCard]);

  const stopDemo = useCallback(() => {
    setIsPlaying(false);
    setCurrentPlayIndex(0);
    if (playTimeoutId) {
      clearTimeout(playTimeoutId);
      setPlayTimeoutId(null);
    }
  }, [playTimeoutId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playTimeoutId) {
        clearTimeout(playTimeoutId);
      }
    };
  }, [playTimeoutId]);

  return {
    isPlaying,
    currentPlayIndex,
    cardRefs,
    scrollContainerRef,
    startDemo,
    stopDemo,
  };
}

