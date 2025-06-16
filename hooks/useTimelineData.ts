import { useMemo } from "react";
import { Context } from "@/lib/contextMockData";
import { TimelineUpload } from "@/components/mercury/mercury-uploads-timeline";

export interface UseTimelineDataReturn {
  timelineUploads: TimelineUpload[];
  totalUploads: number;
  checkpointCount: number;
  failedCount: number;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

export interface UseTimelineDataProps {
  contexts: Context[];
  currentContextId?: string;
}

/**
 * Custom hook for managing timeline data conversion and calculations
 * Follows DRY principle by centralizing timeline logic
 */
export function useTimelineData({
  contexts,
  currentContextId,
}: UseTimelineDataProps): UseTimelineDataReturn {
  const timelineData = useMemo(() => {
    const timelineUploads: TimelineUpload[] = contexts.map((context) => ({
      id: context.id,
      date: new Date(context.created_at),
      status: context.is_invalidated ? 'failed' as const :
              context.is_checkpoint ? 'checkpoint' as const :
              context.id === currentContextId ? 'current' as const :
              'upload' as const,
      title: context.upload.file_name,
      description: context.upload.description,
    }));

    const sortedUploads = [...timelineUploads].sort((a, b) => 
      a.date.getTime() - b.date.getTime()
    );

    const stats = {
      totalUploads: contexts.length,
      checkpointCount: contexts.filter(c => c.is_checkpoint).length,
      failedCount: contexts.filter(c => c.is_invalidated).length,
      dateRange: {
        start: sortedUploads[0]?.date || null,
        end: sortedUploads[sortedUploads.length - 1]?.date || null,
      },
    };

    return {
      timelineUploads,
      ...stats,
    };
  }, [contexts, currentContextId]);

  return timelineData;
} 