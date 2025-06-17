"use client";

import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { Download, Mic } from "lucide-react";

import { cn } from "@/lib/utils";

import { MercuryDraggableListing } from "./mercury-draggable-listing";

// Mercury OS Wu Wei Daoist Easing Functions
const wuWeiEasing = [0.25, 0.46, 0.45, 0.94] as const; // Natural settling
const _wuWeiSlowEasing = [0.15, 0.35, 0.25, 0.96] as const; // Deep tranquility
const _wuWeiSpringEasing = [0.34, 1.56, 0.64, 1] as const; // Natural bounce

interface ApartmentListing {
  id: string;
  bedrooms: string;
  bathrooms: string;
  name: string;
  price: string;
  image: string;
  isLiked?: boolean;
}

interface MercuryHousingModuleProps {
  intent: string;
  focusLevel?: "focused" | "ambient" | "fog";
  onAddAllToFlow?: () => void;
  className?: string;
}

const APARTMENT_LISTINGS: ApartmentListing[] = [
  {
    id: "1",
    bedrooms: "4br",
    bathrooms: "2b",
    name: "7 Creekside",
    price: "$9,000/month",
    image: "/api/placeholder/300/200?text=Modern+Apartment+1",
    isLiked: false,
  },
  {
    id: "2",
    bedrooms: "4br",
    bathrooms: "2b",
    name: "64 Church St.",
    price: "$12,000/month",
    image: "/api/placeholder/300/200?text=Modern+Apartment+2",
    isLiked: true,
  },
  {
    id: "3",
    bedrooms: "4br",
    bathrooms: "2b",
    name: "The Rustic Swag",
    price: "$20,000/month",
    image: "/api/placeholder/300/200?text=Modern+Apartment+3",
    isLiked: false,
  },
  {
    id: "4",
    bedrooms: "4br",
    bathrooms: "2b",
    name: "Noobles Ave.",
    price: "$11,000/month",
    image: "/api/placeholder/300/200?text=Modern+Apartment+4",
    isLiked: false,
  },
];

export function MercuryHousingModule({
  intent,
  focusLevel = "ambient",
  onAddAllToFlow,
  className,
}: MercuryHousingModuleProps) {
  const [listings, setListings] =
    useState<ApartmentListing[]>(APARTMENT_LISTINGS);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Mercury Listing Animation Variants
  const _listingVariants = {
    hidden: {
      opacity: 0,
      x: 30,
      y: 10,
      scale: 0.95,
      filter: "blur(4px)",
    },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.7,
        delay: index * 0.12, // Staggered natural entrance
        ease: wuWeiEasing,
        filter: {
          duration: 0.5,
          delay: index * 0.12 + 0.2,
          ease: wuWeiEasing,
        },
      },
    }),
  };

  // Action Button Animation Variants
  const actionButtonVariants = {
    idle: {
      scale: 1,
      boxShadow: "0 2px 8px -2px rgba(0, 0, 0, 0.1)",
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 8px 25px -5px rgba(0, 0, 0, 0.15)",
      y: -2,
      transition: {
        duration: 0.3,
        ease: wuWeiEasing,
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
        ease: _wuWeiSpringEasing,
      },
    },
  };

  const handleLikeListing = (listingId: string) => {
    setListings((prev) =>
      prev.map((listing) =>
        listing.id === listingId
          ? { ...listing, isLiked: !listing.isLiked }
          : listing
      )
    );

    const listing = listings.find((l) => l.id === listingId);
    const isNowLiked = !listing?.isLiked;
    setActionFeedback(
      isNowLiked ? "Added to favorites" : "Removed from favorites"
    );
    setTimeout(() => setActionFeedback(null), 1500);
  };

  const handleAddAllToFlow = () => {
    onAddAllToFlow?.();
    setActionFeedback("Added all listings to Mercury flow");
    setTimeout(() => setActionFeedback(null), 2000);
  };

  const renderListing = (listing: ApartmentListing, index: number) => (
    <MercuryDraggableListing
      key={listing.id}
      listing={listing}
      index={index}
      onDragStart={() => console.log("Drag started:", listing.id)}
      onDragEnd={() => console.log("Drag ended:", listing.id)}
      onLike={handleLikeListing}
      onSelect={setSelectedListing}
      isSelected={selectedListing === listing.id}
    />
  );

  return (
    <motion.div
      data-intent={intent}
      initial={{ opacity: 0, x: 50, scale: 0.95, rotateY: -5 }}
      animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
      exit={{ opacity: 0, x: 30, scale: 0.95, rotateY: -3 }}
      transition={{
        duration: 1.0,
        ease: _wuWeiSlowEasing,
        rotateY: {
          duration: 1.2,
          ease: _wuWeiSlowEasing,
        },
      }}
      whileHover={{
        y: -3,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
        transition: { duration: 0.4, ease: wuWeiEasing },
      }}
      className={cn(
        "mercury-module",
        // Focus level styling handled elsewhere
        "h-[600px] w-[400px] bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 flex flex-col",
        className
      )}
    >
      {/* Header with Mercury Animation */}
      <motion.div
        className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.3,
          ease: wuWeiEasing,
        }}
      >
        <div className="flex items-center space-x-2">
          <motion.div
            className="w-2 h-2 bg-red-500 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [1, 0.6, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: wuWeiEasing,
            }}
          />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              Find homes in Mountain View, CA
            </h3>
            <motion.p
              className="text-xs text-slate-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.6,
                ease: wuWeiEasing,
              }}
            >
              {listings.length} listings found
            </motion.p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {[Download].map((Icon, index) => (
            <motion.button
              key={index}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgb(241 245 249)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: wuWeiEasing }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: {
                  delay: 0.4 + index * 0.1,
                  duration: 0.3,
                  ease: wuWeiEasing,
                },
              }}
            >
              <Icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Listings with Staggered Animation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-2">
          {listings.map((listing, index) => renderListing(listing, index))}
        </div>
      </div>

      {/* Actions with Mercury Enhancement */}
      <motion.div
        className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: 0.8,
          ease: wuWeiEasing,
        }}
      >
        <div className="flex space-x-3">
          <motion.button
            onClick={handleAddAllToFlow}
            variants={actionButtonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-slate-900 dark:text-slate-100 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 border border-blue-200/50"
          >
            Add all to flow
          </motion.button>
          <motion.button
            variants={actionButtonVariants}
            initial="idle"
            whileHover="hover"
            whileTap="tap"
            className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300"
          >
            Find some more
          </motion.button>
        </div>

        <motion.div
          className="flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: 1.0,
            ease: wuWeiEasing,
          }}
        >
          <motion.button
            className="text-xs text-slate-500 hover:text-slate-600 flex items-center space-x-2 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>⚡ More actions</span>
            <motion.div
              className="w-1 h-1 bg-slate-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: wuWeiEasing,
              }}
            />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Action Feedback */}
      <AnimatePresence>
        {actionFeedback && (
          <motion.div
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg backdrop-blur-sm"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.3, ease: wuWeiEasing }}
          >
            {actionFeedback}
            <motion.div
              className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900/90"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.2,
                delay: 0.1,
                ease: _wuWeiSpringEasing,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
