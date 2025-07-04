"use client";
import { useScroll, useTransform, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

interface TimelineProps {
  data: TimelineEntry[];
  itemRefs?: React.MutableRefObject<(HTMLDivElement | null)[]>;
  scrollContainer?: React.RefObject<HTMLDivElement | null>;
}

export const Timeline = ({
  data,
  itemRefs,
  scrollContainer,
}: TimelineProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const updateHeight = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setHeight(rect.height);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, [ref, data]);

  // Only use scroll hooks after component is mounted
  const scrollHook = useScroll(
    scrollContainer
      ? {
          container: scrollContainer,
          target: ref,
          offset: ["start start", "end end"],
        }
      : {
          target: ref,
          offset: ["start 90%", "end 20%"],
        }
  );

  const heightTransform = useTransform(
    scrollHook.scrollYProgress,
    [0, 1],
    [0, height]
  );
  const opacityTransform = useTransform(
    scrollHook.scrollYProgress,
    [0, 0.05],
    [0, 1]
  );

  // Don't render motion elements until mounted
  if (!isMounted) {
    return (
      <div
        className="w-full dark:bg-neutral-950 font-sans md:px-10"
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
            <div className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full dark:bg-neutral-950 font-sans md:px-10"
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
              {/* <div className="h-6 absolute left-2 md:left-2 w-6 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-gray-400" />
              </div> */}
              <h3 className="hidden md:block text-4xl md:pl-12 font-semibold text-neutral-300">
                {item.title}
              </h3>
            </div>

            <div className="relative w-full">
              <h3 className="md:hidden block text-lg mb-4 text-left font-semibold text-gray-300">
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </div>
        ))}
        {/* Enhanced Vertical Line with Glow Effect */}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-5 left-5 top-0 overflow-hidden w-[2px]"
        >
          {/* Background Line with Subtle Glow */}
          {/* <div className="absolute inset-0 w-[2px] bg-gradient-to-b from-transparent via-gray-200 dark:via-neutral-800 to-transparent opacity-60" /> */}

          {/* Animated Progress Line with Enhanced Glow */}
          {/* <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-gray-300 via-gray-100 to-transparent rounded-full shadow-[0_0_6px_rgba(156,163,175,0.12)] dark:shadow-[0_0_8px_rgba(75,85,99,0.12)]"
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 40,
            }}
          /> */}

          {/* Pulsing Glow Effect */}
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            // className="absolute inset-x-0 top-0 w-[3px] -left-[0.5px] bg-gradient-to-t from-gray-200/20 via-gray-100/20 to-transparent/10 rounded-full blur-[2px]"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              height: {
                type: "spring",
                stiffness: 400,
                damping: 40,
              },
              opacity: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};
