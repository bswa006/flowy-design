"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamic import to avoid SSR issues
const Timeline = dynamic(() => import("./timeline").then(mod => ({ default: mod.Timeline })), {
  ssr: false,
  loading: () => (
    <div className="w-full bg-white dark:bg-neutral-950 font-sans md:px-10">
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h2 className="text-lg md:text-4xl mb-4 text-black dark:text-white max-w-4xl">
          Context Timeline
        </h2>
        <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-sm">
          Loading timeline...
        </p>
      </div>
    </div>
  )
});

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

interface TimelineWrapperProps {
  data: TimelineEntry[];
  itemRefs?: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

export function TimelineWrapper({ data, itemRefs }: TimelineWrapperProps) {
  return (
    <Suspense fallback={
      <div className="w-full bg-white dark:bg-neutral-950 font-sans md:px-10">
        <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
          <h2 className="text-lg md:text-4xl mb-4 text-black dark:text-white max-w-4xl">
            Context Timeline
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-sm">
            Loading timeline...
          </p>
        </div>
      </div>
    }>
      <Timeline data={data} itemRefs={itemRefs} />
    </Suspense>
  );
}

