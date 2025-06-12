"use client"

import React, { useState } from 'react'
import { EnterpriseDashboardCard } from '@/components/mercury/enterprise-dashboard-card'
import { LocationCard } from '@/components/mercury/location-card'
import { MessageCard } from '@/components/mercury/message-card'
import { MusicCard } from '@/components/mercury/music-card'
import { ProductCard } from '@/components/mercury/product-card'
import { cn } from '@/lib/utils'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  AlertTriangle,
  BarChart3,
  Download,
  Settings,
  Eye
} from 'lucide-react'

// Enterprise sample data with sophisticated metrics
const enterpriseMetrics = [
  {
    intent: 'revenue-performance',
    data: {
      title: 'Monthly Recurring Revenue',
      value: 2847650,
      previousValue: 2654320,
      change: {
        value: '+7.3%',
        percentage: 7.3,
        trend: 'up' as const,
        isSignificant: true
      },
      description: 'Strong growth driven by enterprise accounts',
      status: 'healthy' as const,
      sparklineData: [2.1, 2.3, 2.2, 2.5, 2.4, 2.7, 2.8, 2.9, 2.85],
      actions: [
        {
          label: 'Revenue Deep Dive',
          intent: 'analyze-revenue-trends',
          priority: 'primary' as const,
          icon: <BarChart3 className="w-4 h-4" />
        },
        {
          label: 'Export Report',
          intent: 'export-revenue-report',
          priority: 'secondary' as const,
          icon: <Download className="w-4 h-4" />
        },
        {
          label: 'Configure Alerts',
          intent: 'setup-revenue-alerts',
          priority: 'ambient' as const,
          icon: <Settings className="w-4 h-4" />
        }
      ],
      metadata: {
        lastUpdated: '2 minutes ago',
        source: 'Stripe + Salesforce',
        confidence: 98
      }
    }
  },
  {
    intent: 'customer-acquisition',
    data: {
      title: 'Customer Acquisition Cost',
      value: '$127',
      change: {
        value: '-12.4%',
        percentage: -12.4,
        trend: 'up' as const, // Down cost is good (up trend)
        isSignificant: true
      },
      description: 'Improved efficiency in marketing spend',
      status: 'healthy' as const,
      sparklineData: [145, 142, 138, 135, 132, 129, 127],
      actions: [
        {
          label: 'Channel Analysis',
          intent: 'analyze-acquisition-channels',
          priority: 'primary' as const,
          icon: <Eye className="w-4 h-4" />
        },
        {
          label: 'Campaign Performance',
          intent: 'view-campaign-metrics',
          priority: 'secondary' as const
        }
      ],
      metadata: {
        lastUpdated: '5 minutes ago',
        source: 'Google Analytics + HubSpot',
        confidence: 94
      }
    }
  },
  {
    intent: 'churn-monitoring',
    data: {
      title: 'Monthly Churn Rate',
      value: '2.8%',
      change: {
        value: '+0.3%',
        percentage: 0.3,
        trend: 'down' as const,
        isSignificant: false
      },
      description: 'Slight increase requires attention',
      status: 'warning' as const,
      sparklineData: [2.1, 2.2, 2.4, 2.3, 2.5, 2.7, 2.8],
      actions: [
        {
          label: 'Churn Analysis',
          intent: 'analyze-churn-patterns',
          priority: 'primary' as const,
          icon: <AlertTriangle className="w-4 h-4" />
        },
        {
          label: 'Retention Strategies',
          intent: 'view-retention-playbook',
          priority: 'primary' as const
        },
        {
          label: 'Customer Health Score',
          intent: 'view-health-scores',
          priority: 'secondary' as const
        }
      ],
      metadata: {
        lastUpdated: '1 hour ago',
        source: 'Customer Success Platform',
        confidence: 91
      }
    }
  },
  {
    intent: 'system-performance',
    data: {
      title: 'System Uptime',
      value: '99.97%',
      change: {
        value: 'stable',
        percentage: 0,
        trend: 'neutral' as const
      },
      description: 'Exceeding SLA requirements',
      status: 'healthy' as const,
      sparklineData: [99.95, 99.96, 99.98, 99.97, 99.99, 99.97, 99.97],
      actions: [
        {
          label: 'Infrastructure Health',
          intent: 'view-infrastructure-metrics',
          priority: 'secondary' as const
        },
        {
          label: 'Incident Reports',
          intent: 'view-incident-history',
          priority: 'ambient' as const
        }
      ],
      metadata: {
        lastUpdated: 'Real-time',
        source: 'DataDog + AWS CloudWatch',
        confidence: 99
      }
    }
  },
  {
    intent: 'team-productivity',
    data: {
      title: 'Development Velocity',
      value: 47,
      change: {
        value: '+18%',
        percentage: 18,
        trend: 'up' as const,
        isSignificant: true
      },
      description: 'Story points per sprint',
      status: 'healthy' as const,
      sparklineData: [38, 41, 39, 44, 42, 45, 47],
      actions: [
        {
          label: 'Sprint Analytics',
          intent: 'view-sprint-metrics',
          priority: 'primary' as const
        },
        {
          label: 'Team Performance',
          intent: 'view-team-dashboard',
          priority: 'secondary' as const
        }
      ],
      metadata: {
        lastUpdated: '30 minutes ago',
        source: 'Jira + GitHub',
        confidence: 96
      }
    }
  },
  {
    intent: 'security-posture',
    data: {
      title: 'Security Score',
      value: 94,
      change: {
        value: '+2 points',
        percentage: 2.1,
        trend: 'up' as const
      },
      description: 'Improved after recent security updates',
      status: 'healthy' as const,
      sparklineData: [89, 90, 91, 92, 93, 94, 94],
      actions: [
        {
          label: 'Security Dashboard',
          intent: 'view-security-metrics',
          priority: 'primary' as const
        },
        {
          label: 'Vulnerability Report',
          intent: 'view-vulnerability-scan',
          priority: 'secondary' as const
        }
      ],
      metadata: {
        lastUpdated: '15 minutes ago',
        source: 'Security Operations Center',
        confidence: 97
      }
    }
  }
]

export default function EnterpriseDemoPage() {
  const [focusedCard, setFocusedCard] = useState<string>('revenue')

  // Sample data for enterprise dashboard cards
  const dashboardCards = [
    {
      title: 'Monthly Recurring Revenue',
      value: '$847,329',
      status: 'healthy' as const,
      description: 'Monthly subscription revenue from active customers',
      change: { value: '+12.3%', percentage: 12.3, trend: 'up' as const, isSignificant: true },
      metadata: { lastUpdated: '2 minutes ago', source: 'Stripe API', confidence: 98 }
    },
    {
      title: 'Customer Acquisition Cost',
      value: '$284',
      status: 'warning' as const,
      description: 'Average cost to acquire each new customer',
      change: { value: '+8.7%', percentage: 8.7, trend: 'up' as const, isSignificant: true },
      metadata: { lastUpdated: '5 minutes ago', source: 'Marketing Analytics', confidence: 94 }
    },
    {
      title: 'Monthly Churn Rate',
      value: '2.1%',
      status: 'critical' as const,
      description: 'Percentage of customers who cancelled this month',
      change: { value: '+0.4%', percentage: 0.4, trend: 'up' as const, isSignificant: true },
      metadata: { lastUpdated: '1 hour ago', source: 'Customer Database', confidence: 96 }
    }
  ]

  const cardIds = ['revenue', 'cac', 'churn']

  // Sample data for new card types
  const locationData = {
    title: 'Starbucks Reserve',
    address: '1912 Pike Place, Seattle, WA 98101',
    distance: '0.3 miles',
    status: 'open' as const,
    rating: 4.8,
    type: 'Coffee Shop',
    lastUpdated: '5 minutes ago',
    phone: '+1 (206) 448-8762'
  }

  const messageData = {
    contactName: 'Danny Trinh',
    contactHandle: '@dtrinh',
    lastMessage: "Let me get back to you on that. My schedule is kinda crazy right now with Mercury.",
    timestamp: 'Mon 11:26 PM',
    unreadCount: 2,
    status: 'unread' as const,
    platform: 'Twitter Conversation',
    messages: [
      { text: "Hey! How's the project going?", timestamp: '11:20 PM', isOwn: false },
      { text: "Going well! Just finishing up the design system", timestamp: '11:22 PM', isOwn: true },
      { text: "I'm excited to see this beast", timestamp: '11:25 PM', isOwn: false }
    ]
  }

  const musicData = {
    title: 'Four Seasons',
    artist: 'Taeyeon',
    album: 'INVU - The 3rd Album',
    duration: '3:42',
    currentTime: '1:34',
    progress: 42,
    status: 'playing' as const,
    platform: 'Music from Spotify',
    isLiked: true,
    playlist: 'Daily Mix 1'
  }

  const productData = {
    title: 'Black Bonded Speed Sneakers',
    brand: 'Balenciaga',
    price: '$795',
    originalPrice: '$950',
    rating: 4.5,
    reviewCount: 127,
    status: 'available' as const,
    sizes: ['6', '7', '8', '9', '10', '11'],
    selectedSize: '8',
    category: 'Footwear',
    isWishlisted: false,
    shipping: {
      method: 'Express Delivery',
      time: '1-2 business days',
      cost: 'Free'
    }
  }

  const handleFocusChange = (cardId: string) => {
    setFocusedCard(cardId)
  }

  const getFocusLevel = (cardId: string): 'focused' | 'ambient' | 'fog' => {
    if (cardId === focusedCard) return 'focused'
    
    // Dashboard cards logic
    if (cardIds.includes(cardId)) {
      const focusedIndex = cardIds.indexOf(focusedCard)
      const currentIndex = cardIds.indexOf(cardId)
      if (focusedIndex !== -1 && Math.abs(focusedIndex - currentIndex) === 1) {
        return 'ambient'
      }
      return 'fog'
    }
    
    // Other cards logic
    const otherCards = ['location', 'message', 'music', 'product']
    if (otherCards.includes(cardId)) {
      if (['revenue', 'cac', 'churn'].includes(focusedCard)) {
        return 'fog'
      }
      const focusedIndex = otherCards.indexOf(focusedCard)
      const currentIndex = otherCards.indexOf(cardId)
      if (focusedIndex !== -1 && Math.abs(focusedIndex - currentIndex) === 1) {
        return 'ambient'
      }
      return 'fog'
    }
    
    return 'fog'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 mb-4">
            Mercury Design System
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
            Enterprise-grade components with focus hierarchy, status communication, and accessibility. 
            Click any card to see Mercury's selective contrast system in action.
          </p>
        </div>

        {/* Focus Management Info */}
        <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
          <h2 className="text-lg font-bold text-blue-900 mb-2">
            Mercury Focus Management
          </h2>
          <p className="text-blue-800 mb-3">
            Currently focused: <span className="font-bold">{focusedCard}</span>
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-blue-700">Focused (100% opacity, scale 1.05)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 opacity-85 rounded-full"></div>
              <span className="text-blue-700">Ambient (85% opacity, scale 0.98)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-300 opacity-70 rounded-full"></div>
              <span className="text-blue-700">Fog (70% opacity, scale 0.96)</span>
            </div>
          </div>
        </div>

        {/* Enterprise Dashboard Cards */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Enterprise Dashboard Cards
          </h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
             {dashboardCards.map((card, index) => (
               <EnterpriseDashboardCard
                 key={cardIds[index]}
                 intent={cardIds[index]}
                 focusLevel={getFocusLevel(cardIds[index])}
                 size="compact"
                 data={card}
                 onAction={() => handleFocusChange(cardIds[index])}
                 className="cursor-pointer"
               />
             ))}
           </div>
        </div>

        {/* New Mercury Card Types */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Mercury Card Components
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            
                         {/* Location Card */}
             <div onClick={() => handleFocusChange('location')} className="cursor-pointer">
               <LocationCard
                 intent="location"
                 focusLevel={getFocusLevel('location')}
                 size="compact"
                 data={locationData}
                 onNavigate={() => console.log('Navigate to location')}
                 onCall={() => console.log('Call location')}
               />
             </div>
             
             {/* Message Card */}
             <div onClick={() => handleFocusChange('message')} className="cursor-pointer">
               <MessageCard
                 intent="message"
                 focusLevel={getFocusLevel('message')}
                 size="compact"
                 data={messageData}
                 onReply={(message) => console.log('Reply:', message)}
               />
             </div>
             
             {/* Music Card */}
             <div onClick={() => handleFocusChange('music')} className="cursor-pointer">
               <MusicCard
                 intent="music"
                 focusLevel={getFocusLevel('music')}
                 size="compact"
                 data={musicData}
                 onPlay={() => console.log('Play music')}
                 onPause={() => console.log('Pause music')}
                 onNext={() => console.log('Next track')}
                 onPrevious={() => console.log('Previous track')}
                 onLike={() => console.log('Toggle like')}
               />
             </div>
             
             {/* Product Card */}
             <div onClick={() => handleFocusChange('product')} className="cursor-pointer">
               <ProductCard
                 intent="product"
                 focusLevel={getFocusLevel('product')}
                 size="compact"
                 data={productData}
                 onAddToBag={() => console.log('Add to bag')}
                 onWishlist={() => console.log('Toggle wishlist')}
                 onSizeSelect={(size) => console.log('Select size:', size)}
               />
             </div>
            
          </div>
        </div>

        {/* Mercury Principles Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Mercury Design Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Fluid</h3>
              <p className="text-slate-600 leading-relaxed">
                Seamless interactions with natural easing curves. 700ms transitions with 
                cubic-bezier(0.25,0.46,0.45,0.94) for Daoist inexertion principles.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Focused</h3>
              <p className="text-slate-600 leading-relaxed">
                Clear visual hierarchy with selective contrast. Only ONE focused element 
                at a time, with status communication through color within hierarchy.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">Familiar</h3>
              <p className="text-slate-600 leading-relaxed">
                Intuitive patterns with WCAG 2.1 AAA accessibility. Keyboard navigation, 
                screen reader support, and cognitive accessibility for all users.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
} 