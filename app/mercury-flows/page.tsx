import { MercuryFlowDemo } from "@/components/mercury/mercury-flow-demo";

export default function MercuryFlowsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Page Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Mercury Flow System
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Fluid, intent-driven card interactions with spring-based
                animations
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Live Demo
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className="max-w-7xl mx-auto px-6 py-12"
        data-intent="mercury-flows-page"
      >
        <div className="space-y-12">
          {/* Introduction */}
          <section className="space-y-4" data-intent="introduction-section">
            <div className="max-w-3xl">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Experience Mercury OS Card Interactions
              </h2>
              <div className="prose prose-slate dark:prose-invert">
                <p>
                  This implementation recreates the fluid card insertion
                  animations from the MercuryOS video. Click the blue "+" button
                  to see new cards animate into the flow with spring-driven fade
                  effects, and natural settling behavior.
                </p>
                <ul className="text-sm space-y-1 mt-4">
                  <li>
                    <strong>Spring Physics:</strong> Cards enter with realistic
                    bounce and settling
                  </li>
                  <li>
                    <strong>Focus Management:</strong> Three-tier attention
                    hierarchy (focused/ambient/fog)
                  </li>
                  <li>
                    <strong>Intent Tracking:</strong> Every interaction logs
                    Mercury intentions
                  </li>
                  <li>
                    <strong>Accessibility:</strong> Full keyboard navigation and
                    screen reader support
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Main Demo */}
          <section data-intent="main-demo-section">
            <MercuryFlowDemo />
          </section>

          {/* Technical Details */}
          <section className="space-y-6" data-intent="technical-details">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Technical Implementation
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Animation System
                </h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>• Framer Motion with spring physics</li>
                  <li>• Mercury easing curves</li>
                  <li>• Staggered entrance animations</li>
                  <li>• GPU-accelerated transforms</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Mercury Compliance
                </h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>• Required intent prop on all components</li>
                  <li>• Three-tier focus system</li>
                  <li>• WCAG 2.1 AAA accessibility</li>
                  <li>• Reduced motion support</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Design Tokens
                </h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>• Mercury standardized spacing</li>
                  <li>• Consistent color palette</li>
                  <li>• Typography scale integration</li>
                  <li>• Shadow and radius tokens</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Usage Instructions */}
          <section
            className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-8"
            data-intent="usage-instructions"
          >
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              How to Use
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Interactive Elements
                </h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                  <li>
                    <strong>+ Button:</strong> Click to add new cards with
                    spring animation
                  </li>
                  <li>
                    <strong>Cards:</strong> Click any card to focus it and see
                    the hierarchy
                  </li>
                  <li>
                    <strong>Keyboard:</strong> Tab navigation works throughout
                  </li>
                  <li>
                    <strong>Console:</strong> Open dev tools to see Mercury
                    intent logging
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Animation Details
                </h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                  <li>
                    <strong>Entry:</strong> Cards slide in from right with 3D
                    rotation
                  </li>
                  <li>
                    <strong>Physics:</strong> Spring stiffness 200, damping 20
                  </li>
                  <li>
                    <strong>Focus:</strong> Automatic scale and shadow
                    adjustments
                  </li>
                  <li>
                    <strong>Settling:</strong> Natural bounce and overshoot
                    behavior
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
            <p>Mercury OS Design System Implementation</p>
            <p>Built with React 19, Framer Motion, and Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
