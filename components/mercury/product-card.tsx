"use client"

import React, { useState, useCallback } from 'react'
import { cn } from "@/lib/utils"
import { ShoppingBag, MoreHorizontal, Heart } from 'lucide-react'
import { 
  getMercuryFocusClasses,
  getMercuryStatusColors,
  getMercuryTypography,
  validateMercuryProps,
  MERCURY_RADIUS,
  MERCURY_ANIMATIONS,
  type MercuryComponentProps
} from '@/lib/mercury-tokens'

interface ProductData {
  title: string
  brand: string
  price: string
  originalPrice?: string
  image?: string
  rating?: number
  reviewCount?: number
  status: 'available' | 'soldout' | 'limited' | 'neutral'
  sizes?: string[]
  selectedSize?: string
  category: string
  isWishlisted?: boolean
  shipping?: {
    method: string
    time: string
    cost: string
  }
}

interface ProductCardProps extends MercuryComponentProps {
  data: ProductData
  onAddToCart?: () => void
  onWishlist?: () => void
  showNextIndicator?: boolean
  onRevealNext?: () => void
}

export function ProductCard({
  intent,
  focusLevel = 'ambient',
  size = 'compact',
  data,
  className,
  style,
  isInteractive = true,
  showNextIndicator = false,
  onAddToCart,
  onWishlist,
  onRevealNext,
  ...props
}: ProductCardProps) {
  
  // Mercury validation (required for compliance)
  const validationErrors = validateMercuryProps({ intent, focusLevel, size, isInteractive })
  if (validationErrors.length > 0) {
    console.error('Mercury Validation Errors:', validationErrors)
  }
  
  const [showTooltip, setShowTooltip] = useState(false)
  const [selectedSize, setSelectedSize] = useState(data.selectedSize || '')
  
  const handleAddToCart = useCallback(() => {
    console.log(`Mercury Action: add to cart from product: ${intent}`)
    onAddToCart?.()
  }, [intent, onAddToCart])
  
  const handleRevealNext = useCallback(() => {
    console.log(`Mercury Action: reveal next from product: ${intent}`)
    onRevealNext?.()
  }, [intent, onRevealNext])
  
  return (
    <div
      data-intent={intent}
      className={cn(
        'mercury-module relative overflow-hidden group',
        // Subtle white card with minimal shadow - no thick borders
        'bg-white rounded-2xl border border-gray-100',
        'shadow-sm hover:shadow-md transition-shadow duration-300',
        
        // Mercury focus level adjustments
        focusLevel === 'focused' && 'ring-1 ring-gray-200',
        focusLevel === 'fog' && 'opacity-70 pointer-events-none',
        
        // Interactive states - minimal
        isInteractive && 'cursor-pointer',
        
        className
      )}
      role="region"
      aria-label={`${intent} product component`}
      tabIndex={isInteractive ? 0 : undefined}
      onMouseEnter={() => {
        if (showNextIndicator) setShowTooltip(true)
      }}
      onMouseLeave={() => {
        setShowTooltip(false)
      }}
      onClick={handleRevealNext}
      style={style}
      {...props}
    >
      {/* Main Content */}
      <div className="p-4">
        {/* Product Header - Minimal */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-gray-500">1</span>
            <span className="text-sm font-medium text-gray-700">{data.title} • Item from {data.category}</span>
          </div>
          
          {/* Status indicator - small dot */}
          <div className={cn(
            'w-2 h-2 rounded-full',
            data.status === 'available' && 'bg-emerald-400',
            data.status === 'soldout' && 'bg-red-400',
            data.status === 'limited' && 'bg-amber-400',
            data.status === 'neutral' && 'bg-gray-300'
          )} />
        </div>

        {/* Brand & Title - Compact */}
        <h2 className="text-lg font-semibold text-gray-900 mb-1 leading-tight">
          {data.brand}
        </h2>
        
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          {data.title}
        </h3>

        {/* Price - Smaller */}
        <div className="mb-4">
          <span className="text-lg font-semibold text-gray-900">{data.price}</span>
          {data.originalPrice && (
            <span className="text-sm text-gray-500 line-through ml-2">{data.originalPrice}</span>
          )}
        </div>

        {/* Product Image - Much smaller */}
        <div className="w-full h-32 rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          {data.image ? (
            <img 
              src={data.image} 
              alt={data.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {/* Default product illustration - smaller */}
              <div className="w-20 h-16 bg-gray-800 rounded-md relative overflow-hidden">
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-white rounded-t-sm"></div>
                <div className="absolute bottom-2 right-1 text-white text-xs font-medium">
                  LOGO
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Size Selection - Minimal */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Select a size</span>
            <span className="text-xs font-semibold text-gray-900">{selectedSize || '8'}</span>
          </div>
          
          {data.sizes && (
            <div className="flex flex-wrap gap-1">
              {data.sizes.slice(0, 4).map((sizeOption) => (
                <button
                  key={sizeOption}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedSize(sizeOption)
                  }}
                  className={cn(
                    'px-2 py-1 rounded-md text-xs font-medium border transition-colors',
                    selectedSize === sizeOption || (!selectedSize && sizeOption === '8')
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  )}
                >
                  {sizeOption}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons - Much smaller */}
        <div className="space-y-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAddToCart()
            }}
            className="w-full bg-gray-900 text-white font-medium py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-1 text-xs"
          >
            <ShoppingBag className="h-3 w-3" />
            <span>Add to bag</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              onWishlist?.()
            }}
            className="w-full bg-gray-100 text-gray-800 font-medium py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1 text-xs"
          >
            <Heart className={cn(
              'h-3 w-3',
              data.isWishlisted ? 'fill-current text-red-500' : ''
            )} />
            <span>Wishlist</span>
          </button>
        </div>

        {/* More Actions - Much smaller */}
        <button className="flex items-center space-x-1 text-xs text-gray-400 hover:text-gray-600 transition-colors mt-2">
          <MoreHorizontal className="h-3 w-3" />
          <span>More actions</span>
        </button>
      </div>

      {/* Click to Reveal Next Tooltip */}
      {showNextIndicator && showTooltip && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="bg-white rounded-lg shadow-lg px-4 py-2 flex items-center space-x-2 border border-gray-200">
            <ShoppingBag className="h-3 w-3 text-gray-600" />
            <span className="text-xs font-medium text-gray-700 whitespace-nowrap">Click to reveal next</span>
          </div>
        </div>
      )}
    </div>
  )
}

export type { ProductCardProps } 