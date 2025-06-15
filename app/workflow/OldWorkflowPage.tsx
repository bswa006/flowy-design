"use client";

import * as React from "react";
import { Check, CircleCheck } from "lucide-react";

// Mercury OS Spatial Computing - Remove old scroll animation globals
// Add Mercury spatial state management
declare global {
  interface Window {
    mercurySpaceDepth?: number;
  }
}

// Add explicit type for contexts
interface ContextUpload {
  id: string;
  file_name: string;
  original_name: string;
  content_type: string;
  upload_type: string;
  description: string;
  status: string;
  priority: string;
  is_checkpoint: boolean;
  recorded_on: string;
  summary: string;
  participants?: string[];
  number_of_participants?: number;
}
interface Context {
  id: string;
  processing_request_id: string;
  upload: ContextUpload;
  text_content: string;
  summary: string;
  priority_score: number;
  is_checkpoint: boolean;
  is_invalidated: boolean;
  extracted_metadata?: Record<string, unknown>;
  tags?: string[];
  created_at: string;
}

const contexts: Context[] = [
  {
    id: "c1111111-1111-1111-1111-111111111111",
    processing_request_id: "pr111111-1111-1111-1111-111111111111",
    upload: {
      id: "u1111111-1111-1111-1111-111111111111",
      file_name: "user_research_sales_teams.mp4",
      original_name:
        "Sales Team User Research - Meeting Pain Points - 2024-01-10.mp4",
      content_type: "video/mp4",
      upload_type: "video",
      description:
        "User research session with 5 sales managers discussing meeting inefficiencies and note-taking challenges",
      status: "completed",
      priority: "high",
      is_checkpoint: true,
      recorded_on: "2024-01-10T14:00:00Z",
      summary:
        "Sales teams lose 40% of meeting value due to poor note-taking, missed action items, and lack of CRM updates. Key insight: they need an 'invisible assistant' that captures everything without disrupting flow.",
      participants: [
        "Tom Bradley",
        "Lisa Chen",
        "Marcus Johnson",
        "Sarah Ahmed",
        "David Kim",
      ],
      number_of_participants: 5,
    },
    text_content:
      "Tom Bradley (Sales Director, TechCorp): I'll be brutally honest - I'm in 6-8 customer calls daily, and I retain maybe 30% of what's discussed. By the time I update Salesforce, half the nuances are gone.\n\nMarcus Johnson (Account Executive): Exactly! Yesterday I had a call where the client mentioned their Q2 budget constraints in passing. I was screen-sharing, couldn't take notes, and completely forgot to log it. Lost a $200K deal because I didn't follow up appropriately.\n\nLisa Chen (Researcher): What would the ideal solution look like?\n\nTom: Something that just... listens. Like having a brilliant intern who never misses anything. No buttons to push, no apps to switch between. It just captures everything and knows what's important.\n\nSarah Ahmed (Sales Manager): And it needs to understand context! When a client says 'we'll revisit this after the board meeting,' that should automatically create a follow-up task for the right date.\n\nDavid Kim (VP Sales): The CRM integration is critical. I spend 2 hours every evening updating Salesforce. If an AI could draft those updates and just let me review... game changer.\n\nMarcus: What about compliance? We discuss sensitive pricing.\n\nTom: Good point. It needs enterprise-grade security. SOC 2, HIPAA compliant. And the ability to redact sensitive information automatically.\n\nLisa: How do you handle action items currently?\n\nSarah: Poorly! (laughs) I try to write them down, but when you're presenting and negotiating, something always slips. Last week I promised a client three deliverables and only remembered two.\n\nDavid: The worst is when multiple people are on the call. Who said they'd do what? By when? It's chaos.\n\nTom: You know what would be incredible? If it could detect commitment language. When someone says 'I'll send that by Friday,' boom - task created, assigned, due date set.\n\nMarcus: And meeting summaries! My manager always asks 'how did the call go?' I want to forward a perfect summary in 30 seconds, not spend 15 minutes writing one.\n\nSarah: Integration with our existing tools is non-negotiable. Zoom, obviously. But also Slack for quick summaries, Jira for technical discussions, Google Calendar for scheduling follow-ups.\n\nDavid: Price point?\n\nTom: For something that saves 5-8 hours per week? $50-100 per user per month is a no-brainer. That's less than an hour of a salesperson's time.",
    summary:
      "Sales teams desperately need an 'invisible' AI meeting assistant that captures everything, understands context, and automatically updates CRM/task systems without disrupting meeting flow.",
    priority_score: 100,
    is_checkpoint: true,
    is_invalidated: false,
    extracted_metadata: {
      key_pain_points: [
        "Retain only 30% of meeting content",
        "Miss critical action items while presenting",
        "Spend 2+ hours daily on CRM updates",
        "Lose deals due to forgotten follow-ups",
        "No clarity on who owns what action items",
      ],
      desired_features: [
        "Invisible/automatic operation",
        "Context-aware action item detection",
        "Automatic CRM updates",
        "Commitment language recognition",
        "Multi-party action item tracking",
        "One-click meeting summaries",
        "Enterprise security compliance",
      ],
      integrations_required: [
        "Zoom",
        "Salesforce",
        "Slack",
        "Jira",
        "Google Calendar",
      ],
      pricing_expectation: "$50-100 per user/month",
      expected_time_savings: "5-8 hours per week",
    },
    tags: [
      "user-research",
      "sales-teams",
      "requirements",
      "checkpoint",
      "high-value",
    ],
    created_at: "2024-01-10T18:00:00Z",
  },
  // ... (repeat for all other context objects from your JSON) ...
];

export default function OldWorkflowPage() {
  return (
    <div className="h-full">
      <header className="h-16 bg-gray-300 px-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Context</h1>
      </header>
      <div className="relative h-full overflow-y-auto">
        <div className="space-y-4 p-12 select-none">
          {contexts.map((context, idx) => (
            <div className="relative group" key={context.id}>
              {/* Number badge */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center font-semibold text-base border border-gray-200 shadow-sm">
                {idx + 1}
              </div>
              {/* Card content */}
              <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-md border border-gray-100 p-8 flex flex-col min-h-[220px]">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-gray-500 font-medium truncate">
                    {context.upload.original_name}
                  </div>
                  <div className="text-xs text-gray-400 font-medium">
                    {new Date(context.upload.recorded_on).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-900 mb-1 truncate">
                  {context.upload.file_name}
                </div>
                <div className="text-base text-gray-700 mb-2 truncate">
                  {context.upload.description}
                </div>
                <div className="text-gray-700 text-base leading-relaxed mb-4 line-clamp-4">
                  {context.upload.summary}
                </div>
                {context.upload.is_checkpoint && (
                  <div className="flex items-center gap-2 mt-2">
                    <CircleCheck className="w-5 h-5 text-emerald-700" />
                    <span className="text-emerald-700 font-semibold text-sm">
                      Checkpoint
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
