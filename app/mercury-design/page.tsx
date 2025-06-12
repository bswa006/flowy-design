"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  ArrowLeft,
  User,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  Share,
  Eye,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Calendar,
  Clock,
  MapPin,
  Star,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Monitor,
  Smartphone,
  Tablet,
  Layout,
  Grid,
  List,
  Image,
  FileText,
  Database
} from "lucide-react"
import Link from "next/link"

// Mercury Design System Card Components
const MercuryCard = ({ 
  children, 
  className = "",
  hover = true,
  ...props 
}: { 
  children: React.ReactNode
  className?: string
  hover?: boolean
}) => (
  <div
    className={`
      bg-white border border-gray-200 
      ${hover ? 'hover:shadow-md hover:border-gray-300' : 'shadow-sm'}
      transition-all duration-200 ease-out
      ${className}
    `}
    {...props}
  >
    {children}
  </div>
)

const MercuryText = ({ 
  children, 
  variant = "body",
  className = "" 
}: { 
  children: React.ReactNode
  variant?: "title" | "subtitle" | "body" | "caption" | "label"
  className?: string
}) => {
  const variants = {
    title: "text-lg font-semibold text-gray-900",
    subtitle: "text-base font-medium text-gray-700", 
    body: "text-sm text-gray-600",
    caption: "text-xs text-gray-500",
    label: "text-xs font-medium text-gray-700 uppercase tracking-wide"
  }
  
  return (
    <div className={`${variants[variant]} ${className}`}>
      {children}
    </div>
  )
}

// Module Cards - Small component previews
const ModuleCard = ({ title, icon: Icon, status = "active" }: { title: string, icon: any, status?: "active" | "inactive" | "beta" }) => (
  <MercuryCard className="p-4 w-48 h-28 relative">
    <div className="flex items-center justify-between mb-2">
      <Icon className="w-4 h-4 text-gray-600" />
      {status === "beta" && (
        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">Beta</span>
      )}
    </div>
    <MercuryText variant="subtitle" className="mb-1">{title}</MercuryText>
    <MercuryText variant="caption">Component module</MercuryText>
    {status === "active" && (
      <div className="absolute bottom-2 right-2 w-2 h-2 bg-green-500 rounded-full" />
    )}
  </MercuryCard>
)

// Form Cards - Clean form components
const FormCard = ({ title, type = "input" }: { title: string, type?: "input" | "select" | "checkbox" | "radio" }) => (
  <MercuryCard className="p-6 w-80">
    <MercuryText variant="label" className="mb-3">{title}</MercuryText>
    
    {type === "input" && (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input 
            type="email" 
            className="w-full px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            className="w-full px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
            placeholder="Enter your password"
          />
        </div>
        <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
          Sign In
        </button>
      </div>
    )}
    
    {type === "select" && (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <select className="w-full px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors">
            <option>United States</option>
            <option>Canada</option>
            <option>United Kingdom</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
          <select className="w-full px-3 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </div>
      </div>
    )}
  </MercuryCard>
)

// Content Cards - Product/content with images
const ContentCard = ({ featured = false }: { featured?: boolean }) => (
  <MercuryCard className={`p-0 w-72 overflow-hidden ${featured ? 'ring-2 ring-blue-500' : ''}`}>
    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
      <Image className="w-12 h-12 text-gray-400" />
    </div>
    <div className="p-6">
      <div className="flex items-center justify-between mb-2">
        <MercuryText variant="subtitle">MacBook Pro 16"</MercuryText>
        <button className="p-1 hover:bg-gray-100 rounded">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      <MercuryText variant="body" className="mb-4">
        Powerful performance for professional workflows
      </MercuryText>
      <div className="flex items-center justify-between">
        <MercuryText variant="title" className="text-gray-900">$2,399</MercuryText>
        <div className="flex items-center space-x-2">
          <button className="p-1 hover:bg-gray-100 rounded">
            <Heart className="w-4 h-4 text-gray-400" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <Share className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  </MercuryCard>
)

// List Cards - Navigation/menu style
const ListCard = ({ title, items }: { title: string, items: string[] }) => (
  <MercuryCard className="p-0 w-80">
    <div className="px-6 py-4 border-b border-gray-200">
      <MercuryText variant="subtitle">{title}</MercuryText>
    </div>
    <div className="divide-y divide-gray-100">
      {items.map((item, index) => (
        <div key={index} className="px-6 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="flex items-center justify-between">
            <MercuryText variant="body">{item}</MercuryText>
            <div className="w-2 h-2 bg-gray-300 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  </MercuryCard>
)

// Application Cards - Device mockups
const ApplicationCard = ({ device = "laptop", title }: { device?: "laptop" | "tablet" | "phone", title: string }) => (
  <div className="flex flex-col items-center space-y-4">
    <MercuryText variant="subtitle" className="text-center">{title}</MercuryText>
    
    {device === "laptop" && (
      <div className="relative">
        <div className="w-96 h-64 bg-gray-900 rounded-t-lg p-2">
          <div className="w-full h-full bg-white rounded border">
            <div className="h-8 bg-gray-100 border-b flex items-center px-4 space-x-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <div className="flex-1 bg-white border rounded px-2 py-1 text-xs text-gray-500 mx-4">
                localhost:3000/mercury-design
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-full" />
              <div className="h-3 bg-gray-100 rounded w-5/6" />
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="h-16 bg-gray-100 rounded" />
                <div className="h-16 bg-blue-100 rounded" />
                <div className="h-16 bg-gray-100 rounded" />
              </div>
            </div>
          </div>
        </div>
        <div className="w-80 h-4 bg-gray-800 rounded-b-lg mx-auto" />
      </div>
    )}
    
    {device === "tablet" && (
      <div className="w-64 h-80 bg-gray-900 rounded-lg p-4">
        <div className="w-full h-full bg-white rounded">
          <div className="p-4 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-2 bg-gray-100 rounded w-full" />
            <div className="h-2 bg-gray-100 rounded w-3/4" />
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="h-12 bg-gray-100 rounded" />
              <div className="h-12 bg-blue-100 rounded" />
              <div className="h-12 bg-gray-100 rounded" />
              <div className="h-12 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
)

// Component Showcase Cards
const ComponentShowcase = ({ title, description, variant }: { title: string, description: string, variant: "button" | "input" | "card" | "nav" }) => (
  <MercuryCard className="p-6 w-96">
    <div className="mb-4">
      <MercuryText variant="subtitle" className="mb-1">{title}</MercuryText>
      <MercuryText variant="body">{description}</MercuryText>
    </div>
    
    <div className="border border-gray-200 rounded p-4 bg-gray-50">
      {variant === "button" && (
        <div className="space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">Primary</button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50">Secondary</button>
          <button className="px-4 py-2 text-blue-600 text-sm hover:bg-blue-50 rounded">Tertiary</button>
        </div>
      )}
      
      {variant === "input" && (
        <div className="space-y-3">
          <input className="w-full px-3 py-2 border border-gray-300 rounded text-sm" placeholder="Default input" />
          <input className="w-full px-3 py-2 border border-red-300 rounded text-sm bg-red-50" placeholder="Error state" />
          <input className="w-full px-3 py-2 border border-green-300 rounded text-sm bg-green-50" placeholder="Success state" />
        </div>
      )}
      
      {variant === "card" && (
        <div className="bg-white border border-gray-200 rounded p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">John Doe</div>
              <div className="text-xs text-gray-500">Product Designer</div>
            </div>
          </div>
          <div className="text-xs text-gray-600">Component card example with user information</div>
        </div>
      )}
    </div>
  </MercuryCard>
)

// Statistics Cards
const StatCard = ({ title, value, change, trend }: { title: string, value: string, change: string, trend: "up" | "down" | "neutral" }) => (
  <MercuryCard className="p-6 w-56">
    <MercuryText variant="label" className="mb-2">{title}</MercuryText>
    <MercuryText variant="title" className="text-2xl font-bold text-gray-900 mb-1">{value}</MercuryText>
    <div className="flex items-center space-x-1">
      <span className={`text-xs font-medium ${
        trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"
      }`}>
        {change}
      </span>
      <MercuryText variant="caption">vs last month</MercuryText>
    </div>
  </MercuryCard>
)

export default function MercuryDesign() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/cards"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Flowy Cards</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/workflow"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Workflow
              </Link>
              <Link 
                href="/"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mercury Design</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            A comprehensive design system architecture showcasing clean, minimal components 
            with professional aesthetics and systematic organization.
          </p>
        </div>

        {/* Modules Section */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Modules</h2>
            <p className="text-gray-600">Core component modules with different states and configurations</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ModuleCard title="Authentication" icon={User} status="active" />
            <ModuleCard title="Navigation" icon={Layout} status="active" />
            <ModuleCard title="Data Tables" icon={Database} status="beta" />
            <ModuleCard title="Forms" icon={FileText} status="active" />
            <ModuleCard title="Charts" icon={Grid} status="inactive" />
            <ModuleCard title="Notifications" icon={Bell} status="active" />
            <ModuleCard title="Search" icon={Search} status="beta" />
            <ModuleCard title="Settings" icon={Settings} status="active" />
          </div>
        </section>

        {/* Forms Section */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Forms</h2>
            <p className="text-gray-600">Clean form components with proper validation states</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FormCard title="Login Form" type="input" />
            <FormCard title="Settings Form" type="select" />
          </div>
        </section>

        {/* Content Cards Section */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Content Cards</h2>
            <p className="text-gray-600">Product and content display cards with actions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ContentCard featured={true} />
            <ContentCard />
            <ContentCard />
          </div>
        </section>

        {/* Lists Section */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Lists</h2>
            <p className="text-gray-600">Navigation and menu-style list components</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ListCard 
              title="Navigation Menu" 
              items={["Dashboard", "Projects", "Team", "Settings", "Help"]} 
            />
            <ListCard 
              title="Recent Files" 
              items={["design-system.fig", "components.tsx", "README.md", "package.json"]} 
            />
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Statistics</h2>
            <p className="text-gray-600">Key metrics and performance indicators</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Users" value="24,896" change="+12%" trend="up" />
            <StatCard title="Revenue" value="$45,210" change="+8%" trend="up" />
            <StatCard title="Bounce Rate" value="2.4%" change="-5%" trend="down" />
            <StatCard title="Conversion" value="3.2%" change="+0.1%" trend="neutral" />
          </div>
        </section>

        {/* Applications Section */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Applications</h2>
            <p className="text-gray-600">Real-world implementation examples across different devices</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ApplicationCard device="laptop" title="Desktop Application" />
            <ApplicationCard device="tablet" title="Tablet Interface" />
          </div>
        </section>

        {/* Component Showcase Section */}
        <section className="mb-20">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Component Showcase</h2>
            <p className="text-gray-600">Detailed component examples with different states</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ComponentShowcase 
              title="Button Components" 
              description="Primary, secondary, and tertiary button variations"
              variant="button"
            />
            <ComponentShowcase 
              title="Input States" 
              description="Default, error, and success input field states"
              variant="input"
            />
            <ComponentShowcase 
              title="User Cards" 
              description="Profile card component with user information"
              variant="card"
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-16 border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Mercury Design System - Clean, minimal, and systematic component architecture
            </p>
          </div>
        </footer>

      </div>
    </div>
  )
} 