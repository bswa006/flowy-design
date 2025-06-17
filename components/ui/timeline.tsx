"use client";
import {
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

interface TimelineProps {
  data: TimelineEntry[];
  itemRefs?: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

export const Timeline = ({ data, itemRefs }: TimelineProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  // Only use scroll hooks after component is mounted
  const scrollHook = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollHook.scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollHook.scrollYProgress, [0, 0.1], [0, 1]);

  // Don't render motion elements until mounted
  if (!isMounted) {
    return (
      <div
        className="w-full bg-white dark:bg-neutral-950 font-sans md:px-10"
        ref={containerRef}
      >
        <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex justify-start pt-10 md:pt-40 md:gap-10"
            >
              <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
                <div className="h-6 absolute left-2 md:left-2 w-6 rounded-full bg-white dark:bg-black flex items-center justify-center border border-gray-200 shadow-sm">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                </div>
                <h3 className="hidden md:block text-sm md:pl-12 md:text-lg font-semibold text-gray-600 dark:text-gray-400">
                  {item.title}
                </h3>
              </div>

              <div className="relative pl-20 pr-4 md:pl-4 w-full">
                <h3 className="md:hidden block text-sm mb-4 text-left font-semibold text-gray-600 dark:text-gray-400">
                  {item.title}
                </h3>
                {item.content}{" "}
              </div>
            </div>
          ))}
          <div
            style={{
              height: height + "px",
            }}
            className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
          >
            <div
              className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full bg-white dark:bg-neutral-950 font-sans md:px-10"
      ref={containerRef}
    >

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            ref={(el) => {
              if (itemRefs && itemRefs.current) {
                itemRefs.current[index] = el;
              }
            }}
            className="flex justify-start pt-8 md:pt-12 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-6 absolute left-2 md:left-2 w-6 rounded-full bg-white dark:bg-black flex items-center justify-center border border-gray-200 shadow-sm">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
              </div>
              <h3 className="hidden md:block text-sm md:pl-12 md:text-lg font-semibold text-gray-600 dark:text-gray-400">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-12 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-sm mb-4 text-left font-semibold text-gray-600 dark:text-gray-400">
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-5 left-5 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-gray-300 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

