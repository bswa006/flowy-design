"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useMercuryDrag, createDragItemFromListing, getMercuryDragPreviewStyles } from '@/lib/mercury-drag-system'
import { ApartmentListing } from '@/lib/mercury-types'
import { Heart, MapPin, Calendar } from "lucide-react"

// Mercury OS Wu Wei Daoist Easing Functions
const wuWeiEasing = [0.25, 0.46, 0.45, 0.94] as const

interface MercuryDraggableListingProps {
  listing: ApartmentListing
  index: number
  onDragStart?: () => void
  onDragEnd?: () => void
  onLike?: (listingId: string) => void
  onSelect?: (listingId: string) => void
  isSelected?: boolean
  className?: string
}

export function MercuryDraggableListing({ 
  listing, 
  index,
  onDragStart, 
  onDragEnd,
  onLike,
  onSelect,
  isSelected = false,
  className = ''
}: MercuryDraggableListingProps) {
  const dragItem = createDragItemFromListing(listing, 'housing-module')
  const { isDragging, drag } = useMercuryDrag(dragItem)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    onLike?.(listing.id)
  }

  const handleSelect = () => {
    onSelect?.(listing.id)
  }

  // Trigger callbacks
  React.useEffect(() => {
    if (isDragging) {
      onDragStart?.()
    } else {
      onDragEnd?.()
    }
  }, [isDragging, onDragStart, onDragEnd])

  const dragPreviewStyles = getMercuryDragPreviewStyles(isDragging)

  return (
    <motion.div
      ref={drag}
      onClick={handleSelect}
      className={`
        relative flex space-x-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 
        rounded-xl transition-all duration-300 cursor-grab group
        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        ${className}
      `}
      style={dragPreviewStyles}
      initial={{ opacity: 0, x: 30, y: 10, scale: 0.95, filter: "blur(4px)" }}
      animate={{ 
        opacity: 1, 
        x: 0,
        y: 0,
        scale: isDragging ? 1.05 : 1,
        filter: "blur(0px)",
        zIndex: isDragging ? 999 : 1
      }}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: wuWeiEasing,
        filter: {
          duration: 0.5,
          delay: index * 0.12 + 0.2,
          ease: wuWeiEasing
        }
      }}
      whileHover={{
        scale: isDragging ? 1.05 : 1.02,
        y: isDragging ? 0 : -4,
        boxShadow: "0 12px 35px -8px rgba(0, 0, 0, 0.15)",
        transition: { duration: 0.4, ease: wuWeiEasing }
      }}
    >
      {/* Image with gradient overlay */}
      <motion.div 
        className="w-28 h-20 bg-gradient-to-br rounded-xl flex-shrink-0 overflow-hidden relative"
        style={{
          backgroundImage: `linear-gradient(135deg, 
            ${index === 0 ? '#f3e8ff, #e0e7ff' : 
              index === 1 ? '#fef3c7, #fed7aa' :
              index === 2 ? '#f3f4f6, #d1d5db' :
              '#f0fdf4, #dcfce7'})`
        }}
        whileHover={{
          scale: isDragging ? 1 : 1.05,
          transition: { duration: 0.3, ease: wuWeiEasing }
        }}
      >
        <div className="w-full h-full flex items-center justify-center backdrop-blur-sm">
          <motion.div 
            className="w-10 h-10 bg-white/30 rounded-full"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: wuWeiEasing
            }}
          />
        </div>
        
        {/* Like button overlay */}
        <motion.button
          onClick={handleLike}
          className="absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm bg-white/20 hover:bg-white/30 transition-all duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            transition: { 
              delay: index * 0.12 + 0.5,
              duration: 0.4,
              ease: wuWeiEasing
            }
          }}
        >
          <Heart 
            className={`w-3 h-3 transition-colors duration-200 ${
              listing.isLiked 
                ? 'text-red-500 fill-red-500' 
                : 'text-white group-hover:text-red-400'
            }`}
          />
        </motion.button>
      </motion.div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <motion.div 
              className="text-xs text-slate-500 mb-1 flex items-center space-x-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.12 + 0.3,
                ease: wuWeiEasing
              }}
            >
              <span>{listing.bedrooms}, {listing.bathrooms}</span>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <MapPin className="w-3 h-3 text-slate-400" />
            </motion.div>
            <motion.h4 
              className="font-semibold text-slate-900 dark:text-slate-100 text-sm group-hover:text-blue-600 transition-colors duration-200"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.12 + 0.4,
                ease: wuWeiEasing
              }}
            >
              {listing.name}
            </motion.h4>
          </div>
        </div>
        <motion.div 
          className="mt-3 flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: index * 0.12 + 0.5,
            ease: wuWeiEasing
          }}
        >
          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            {listing.price}
          </span>
          <motion.div
            className="flex items-center space-x-1 text-xs text-slate-500"
            whileHover={{ scale: 1.05 }}
          >
            <Calendar className="w-3 h-3" />
            <span>Available now</span>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          className="absolute left-0 top-1/2 w-1 h-8 bg-blue-500 rounded-r-full"
          initial={{ opacity: 0, x: -4, scaleY: 0.5 }}
          animate={{ opacity: 1, x: 0, scaleY: 1 }}
          exit={{ opacity: 0, x: -4, scaleY: 0.5 }}
          transition={{ duration: 0.3, ease: wuWeiEasing }}
          style={{ transform: 'translateY(-50%)' }}
        />
      )}

      {/* Drag indicator */}
      {isDragging && (
        <motion.div
          className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: wuWeiEasing }}
        >
          Drag to create card
        </motion.div>
      )}
    </motion.div>
  )
} 