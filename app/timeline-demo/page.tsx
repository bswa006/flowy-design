"use client";

import {
  MercuryUploadsTimeline,
  TimelineUpload,
} from "@/components/mercury/mercury-uploads-timeline";

// Mock data matching the image design
const mockTimelineData: TimelineUpload[] = [
  {
    id: "upload-1",
    date: new Date("2025-06-07"),
    status: "failed",
    title: "Initial Upload Failed",
    description: "Connection timeout during upload",
  },
  {
    id: "upload-2",
    date: new Date("2025-06-10"),
    status: "upload",
    title: "Document Upload",
    description: "Meeting notes uploaded successfully",
  },
  {
    id: "upload-3",
    date: new Date("2025-06-12"),
    status: "checkpoint",
    title: "Milestone Checkpoint",
    description: "Project milestone reached",
  },
  {
    id: "upload-4",
    date: new Date("2025-06-15"),
    status: "failed",
    title: "Upload Failed",
    description: "File size too large",
  },
  {
    id: "upload-5",
    date: new Date("2025-06-15"),
    status: "current",
    title: "Current View",
    description: "Currently viewing this upload",
  },
];

export default function TimelineDemoPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-8 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section - Proper Typography Hierarchy */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent mb-4">
            Mercury Uploads Timeline Demo
          </h1>
          <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            A Mercury OS compliant timeline component for tracking upload
            progress
          </p>
        </div>

        {/* Main Timeline - Proper Container */}
        <div className="mb-20">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/40 p-8">
            <MercuryUploadsTimeline
              intent="demo-uploads-timeline"
              focusLevel="ambient"
              uploads={mockTimelineData}
              totalUploads={3}
              checkpointCount={0}
              currentPage={1}
              uploadsOnPage={1}
            />
          </div>
        </div>

        {/* Focus Level Examples - Fixed Grid & Spacing */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Different Focus Levels
            </h2>
            <p className="text-slate-600 text-lg">
              Demonstrating Mercury's three-tier focus hierarchy
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Focused State */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xl shadow-blue-200/20 p-6 transform scale-[1.02] ring-1 ring-blue-200/30">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-1">
                  Focused State
                </h3>
                <p className="text-sm text-slate-600">
                  Enhanced prominence with scale and shadows
                </p>
              </div>
              <MercuryUploadsTimeline
                intent="focused-timeline"
                focusLevel="ambient"
                uploads={mockTimelineData.slice(0, 3)}
                totalUploads={5}
                checkpointCount={1}
                className="transform-gpu"
              />
            </div>

            {/* Fog State */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/30 p-6 opacity-40 scale-[0.98] blur-[0.5px]">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-1">
                  Fog State
                </h3>
                <p className="text-sm text-slate-600">
                  Reduced prominence for background context
                </p>
              </div>
              <MercuryUploadsTimeline
                intent="fog-timeline"
                focusLevel="ambient"
                uploads={mockTimelineData.slice(0, 3)}
                totalUploads={5}
                checkpointCount={1}
                className="transform-gpu"
              />
            </div>
          </div>
        </div>

        {/* Compliance Documentation - Better Layout */}
        <div className="bg-gradient-to-br from-white via-slate-50/50 to-slate-100/30 rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/40 p-10">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Mercury OS Compliance Features
            </h3>
            <p className="text-slate-600 text-lg">
              Complete adherence to Mercury design system principles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-700 font-bold text-sm">✓</span>
                </div>
                <h4 className="text-lg font-semibold text-slate-800">
                  Required Props
                </h4>
              </div>
              <ul className="space-y-3 text-slate-700 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-slate-400 mt-1">•</span>
                  <span>
                    <code className="bg-slate-100 px-2 py-0.5 rounded text-sm font-medium">
                      intent
                    </code>{" "}
                    prop with data-intent attribute
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-slate-400 mt-1">•</span>
                  <span>
                    <code className="bg-slate-100 px-2 py-0.5 rounded text-sm font-medium">
                      focusLevel
                    </code>{" "}
                    with three-tier hierarchy
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-slate-400 mt-1">•</span>
                  <span>Mercury focus classes applied</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-700 font-bold text-sm">✓</span>
                </div>
                <h4 className="text-lg font-semibold text-slate-800">
                  Accessibility
                </h4>
              </div>
              <ul className="space-y-3 text-slate-700 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-slate-400 mt-1">•</span>
                  <span>WCAG 2.1 AAA keyboard navigation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-slate-400 mt-1">•</span>
                  <span>Proper ARIA labels and roles</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-slate-400 mt-1">•</span>
                  <span>Screen reader optimization</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-700 font-bold text-sm">✓</span>
                </div>
                <h4 className="text-lg font-semibold text-slate-800">
                  Animations
                </h4>
              </div>
              <ul className="space-y-3 text-slate-700 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-slate-400 mt-1">•</span>
                  <span>Mercury cubic-bezier easing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-slate-400 mt-1">•</span>
                  <span>Staggered entrance animations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-slate-400 mt-1">•</span>
                  <span>GPU acceleration with transform-gpu</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-700 font-bold text-sm">✓</span>
                </div>
                <h4 className="text-lg font-semibold text-slate-800">
                  Design Tokens
                </h4>
              </div>
              <ul className="space-y-3 text-slate-700 leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-slate-400 mt-1">•</span>
                  <span>Mercury animation durations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-slate-400 mt-1">•</span>
                  <span>Consistent spacing and typography</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-slate-400 mt-1">•</span>
                  <span>Mercury-compliant color palette</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
