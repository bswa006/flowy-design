"use client"

import React, { useState, useCallback } from 'react'
import { cn } from "@/lib/utils"
import { ShoppingBag, Heart, Star, Package, Truck, MoreHorizontal } from 'lucide-react'
import { 
  getMercuryFocusClasses,
  getMercuryStatusColors,
  getMercuryTypography,
  getMercuryAccentBar,
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
  status: 'available' | 'limited' | 'sold-out' | 'neutral'
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
  onAddToBag?: () => void
  onWishlist?: () => void
  onSizeSelect?: (size: string) => void
}

export function ProductCard({
  intent,
  focusLevel = 'ambient',
  size = 'compact',
  data,
  className,
  style,
  isInteractive = true,
  onAddToBag,
  onWishlist,
  onSizeSelect,
  ...props
}: ProductCardProps) {
  
  // Mercury validation (required for compliance)
  const validationErrors = validateMercuryProps({ intent, focusLevel, size, isInteractive })
  if (validationErrors.length > 0) {
    console.error('Mercury Validation Errors:', validationErrors)
  }
  
  const [isHovered, setIsHovered] = useState(false)
  
  const handleAddToBag = useCallback(() => {
    console.log(`Mercury Action: add to bag from product: ${intent}`)
    onAddToBag?.()
  }, [intent, onAddToBag])
  
  const handleWishlist = useCallback(() => {
    console.log(`Mercury Action: ${data.isWishlisted ? 'remove from' : 'add to'} wishlist: ${intent}`)
    onWishlist?.()
  }, [intent, data.isWishlisted, onWishlist])
  
  // Mercury configuration
  const focusClasses = getMercuryFocusClasses(focusLevel)
  const statusColors = getMercuryStatusColors(
    data.status === 'available' ? 'healthy' : 
    data.status === 'limited' ? 'warning' : 
    data.status === 'sold-out' ? 'critical' : 'neutral'
  )
  const typography = getMercuryTypography(focusLevel, size)
  
  const discount = data.originalPrice && data.price !== data.originalPrice ? 
    Math.round((1 - parseFloat(data.price.replace('$', '')) / parseFloat(data.originalPrice.replace('$', ''))) * 100) : null
  
  return (
    <div
      data-intent={intent}
      className={cn(
        'mercury-module relative overflow-hidden group',
        MERCURY_RADIUS.module,
        
        // Mercury focus level classes
        focusClasses.scale,
        focusClasses.opacity,
        focusClasses.contrast,
        focusClasses.brightness,
        focusClasses.saturate,
        focusClasses.background,
        focusClasses.border,
        focusClasses.shadow,
        focusClasses.animation,
        focusLevel === 'fog' && 'pointer-events-none',
        
        // Clean status indication through accent colors only
        data.status === 'limited' && focusLevel === 'focused' && statusColors.border,
        data.status === 'sold-out' && focusLevel === 'focused' && statusColors.border,
        
        // Subtle status animations for focused cards only
        data.status === 'limited' && focusLevel === 'focused' && 'animate-pulse-gentle',
        data.status === 'sold-out' && focusLevel === 'focused' && 'animate-pulse-soft',
        
        // Interactive states
        isInteractive && [
          'cursor-pointer',
          MERCURY_ANIMATIONS.hover,
          MERCURY_ANIMATIONS.active,
          MERCURY_ANIMATIONS.focus
        ],
        
        className
      )}
      role="region"
      aria-label={`${intent} product component`}
      aria-describedby={`${intent}-description`}
      tabIndex={isInteractive ? 0 : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          handleAddToBag()
        }
      }}
      style={style}
      {...props}
    >
      

      
      {/* Component Content */}
      <div className="relative z-10 p-6">
        
        {/* Header with Brand and Actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <ShoppingBag className={cn(
              'h-4 w-4',
              statusColors.icon,
              focusLevel === 'fog' && 'opacity-80'
            )} />
            <span className={cn(
              'text-xs font-medium',
              statusColors.text,
              focusLevel === 'fog' && 'opacity-80'
            )}>
              {data.brand}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Discount badge */}
            {discount && (
              <div className="px-2 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-800">
                -{discount}%
              </div>
            )}
            
            {/* Status badge */}
            <div className={cn(
              'px-2 py-1 rounded-lg text-xs font-medium',
              data.status === 'available' && 'bg-emerald-100 text-emerald-800',
              data.status === 'limited' && 'bg-amber-100 text-amber-800',
              data.status === 'sold-out' && 'bg-red-100 text-red-800',
              data.status === 'neutral' && 'bg-slate-100 text-slate-700',
              focusLevel === 'fog' && 'opacity-90'
            )}>
              {data.status === 'available' && 'In Stock'}
              {data.status === 'limited' && 'Limited'}
              {data.status === 'sold-out' && 'Sold Out'}
              {data.status === 'neutral' && 'Coming Soon'}
            </div>
            
            <button className={cn(
              'p-1 rounded hover:bg-slate-100 transition-colors',
              focusLevel === 'fog' && 'opacity-70'
            )}>
              <MoreHorizontal className="h-4 w-4 text-slate-500" />
            </button>
          </div>
        </div>
        
        {/* Product Image */}
        <div className={cn(
          'relative w-full h-32 rounded-xl overflow-hidden mb-4',
          'bg-gradient-to-br from-slate-100 to-slate-200',
          focusLevel === 'focused' && 'shadow-md',
          focusLevel === 'ambient' && 'shadow-sm',
          focusLevel === 'fog' && 'opacity-90'
        )}>
          {data.image ? (
            <img 
              src={data.image} 
              alt={data.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-8 w-8 text-slate-400" />
            </div>
          )}
          
          {/* Wishlist button overlay */}
          <button
            onClick={handleWishlist}
            className={cn(
              'absolute top-2 right-2 p-2 rounded-lg bg-white/80 backdrop-blur-sm',
              'hover:bg-white transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
              focusLevel === 'fog' && 'opacity-70'
            )}
          >
            <Heart className={cn(
              'h-4 w-4',
              data.isWishlisted ? 'text-red-500 fill-current' : 'text-slate-600'
            )} />
          </button>
        </div>
        
        {/* Product Info */}
        <div className="mb-4">
          <h3 className={cn(
            'font-semibold text-slate-800 leading-tight mb-2',
            focusLevel === 'focused' && 'text-base',
            focusLevel === 'ambient' && 'text-sm',
            focusLevel === 'fog' && 'text-sm opacity-90'
          )}>
            {data.title}
          </h3>
          
          {/* Price */}
          <div className="flex items-center space-x-2 mb-2">
            <span className={cn(
              'font-bold',
              statusColors.text,
              data.status === 'limited' && 'text-amber-900',
              data.status === 'sold-out' && 'text-red-900',
              focusLevel === 'focused' && 'text-lg',
              focusLevel === 'ambient' && 'text-base',
              focusLevel === 'fog' && 'text-base opacity-90'
            )}>
              {data.price}
            </span>
            {data.originalPrice && data.originalPrice !== data.price && (
              <span className={cn(
                'text-sm text-slate-500 line-through',
                focusLevel === 'fog' && 'opacity-80'
              )}>
                {data.originalPrice}
              </span>
            )}
          </div>
          
          {/* Rating */}
          {data.rating && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-3 w-3',
                      i < Math.floor(data.rating!) ? 'text-yellow-500 fill-current' : 'text-slate-300',
                      focusLevel === 'fog' && 'opacity-80'
                    )}
                  />
                ))}
              </div>
              {data.reviewCount && (
                <span className={cn(
                  'text-xs text-slate-500',
                  focusLevel === 'fog' && 'opacity-80'
                )}>
                  ({data.reviewCount})
                </span>
              )}
            </div>
          )}
        </div>
        
        {/* Size Selection (focused only) */}
        {focusLevel === 'focused' && data.sizes && (
          <div className="mb-4">
            <p className="text-sm font-medium text-slate-700 mb-2">Size</p>
            <div className="flex flex-wrap gap-2">
              {data.sizes.map((sizeOption) => (
                <button
                  key={sizeOption}
                  onClick={() => onSizeSelect?.(sizeOption)}
                  className={cn(
                    'px-3 py-1 rounded-lg text-sm font-medium border transition-colors',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    data.selectedSize === sizeOption
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  )}
                >
                  {sizeOption}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Shipping Info (focused only) */}
        {focusLevel === 'focused' && data.shipping && (
          <div className="mb-4 p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Truck className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">{data.shipping.method}</span>
            </div>
            <p className="text-xs text-slate-600">
              {data.shipping.time} • {data.shipping.cost}
            </p>
          </div>
        )}
        
        {/* Add to Bag Button (Only show in focused/ambient) */}
        {focusLevel !== 'fog' && (
          <button
            onClick={handleAddToBag}
            disabled={data.status === 'sold-out'}
            className={cn(
              'w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium',
              'transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              data.status === 'sold-out' 
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : 'bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-500',
              focusLevel === 'ambient' && 'opacity-90'
            )}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>
              {data.status === 'sold-out' ? 'Sold Out' : 'Add to Bag'}
            </span>
          </button>
        )}
        
      </div>
      
      {/* Accessibility description */}
      <div id={`${intent}-description`} className="sr-only">
        {`Product: ${data.title} by ${data.brand}. Price: ${data.price}. Status: ${data.status}. ${data.rating ? `Rating: ${data.rating} stars.` : ''}`}
      </div>
      
    </div>
  )
}

export type { ProductCardProps } 