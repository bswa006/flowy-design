export interface ContextUpload {
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
export interface Context {
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

export const initialContexts: Context[] = [
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
  {
    id: "c2222222-2222-2222-2222-222222222222",
    processing_request_id: "pr222222-2222-2222-2222-222222222222",
    upload: {
      id: "u2222222-2222-2222-2222-222222222222",
      file_name: "competitor_analysis_meeting_tools.pdf",
      original_name:
        "AI Meeting Assistant Competitive Landscape Analysis 2024.pdf",
      content_type: "application/pdf",
      upload_type: "document",
      description:
        "Detailed analysis of existing meeting assistant tools and market opportunities",
      status: "completed",
      priority: "high",
      is_checkpoint: false,
      recorded_on: "2024-01-12T10:00:00Z",
      summary:
        "Market analysis reveals fragmented landscape with no true AI-native solution. Opportunity for seamless, context-aware assistant that requires zero user interaction.",
    },
    text_content:
      "AI Meeting Assistant Market Analysis 2024\n\n1. Otter.ai - $17-30/user/month\n   Strengths:\n   - Good transcription accuracy (90-95%)\n   - Real-time collaborative notes\n   - Speaker identification\n   \n   Weaknesses:\n   - Requires manual highlighting for action items\n   - No automatic CRM integration\n   - Limited context understanding\n   - Participants must join Otter room separately\n\n2. Fireflies.ai - $10-19/user/month\n   Strengths:\n   - Automatic Zoom/Meet joining\n   - Basic action item detection\n   - Search functionality\n   \n   Weaknesses:\n   - Poor context understanding\n   - Generic summaries\n   - No task management integration\n   - Treats all meetings the same\n\n3. Gong.io - $12,000+/year (enterprise)\n   Strengths:\n   - Excellent sales-specific features\n   - Deal intelligence\n   - Coaching capabilities\n   \n   Weaknesses:\n   - Extremely expensive\n   - Sales-only focus\n   - Complex setup\n   - Overkill for most teams\n\n4. Fellow.app - $7-10/user/month\n   Strengths:\n   - Good meeting agenda features\n   - Action item tracking\n   \n   Weaknesses:\n   - Manual note-taking required\n   - No AI transcription\n   - Limited intelligence\n\n5. Tactiq - $8-16/user/month\n   Strengths:\n   - Chrome extension simplicity\n   - GPT-powered summaries\n   \n   Weaknesses:\n   - Browser-only\n   - No deep integrations\n   - Unreliable for long meetings\n\nMARKET GAPS IDENTIFIED:\n\n1. Zero-Touch Operation\n   - Current tools require setup, buttons, manual highlighting\n   - Opportunity: Truly invisible assistant\n\n2. Context Intelligence\n   - No tool understands meeting types, participants, or history\n   - Opportunity: AI that adapts based on meeting context\n\n3. Commitment Detection\n   - No automatic parsing of 'I'll do X by Y' statements\n   - Opportunity: Natural language commitment understanding\n\n4. Deep Integration\n   - Most tools are siloed, require manual exports\n   - Opportunity: Native integration with entire work stack\n\n5. Team Intelligence\n   - No tool learns team patterns, terminology, processes\n   - Opportunity: AI that becomes smarter about your specific team\n\nPRICING OPPORTUNITY:\n- Premium positioning at $75/user/month\n- 10x value vs. transcription tools\n- Undercut enterprise solutions by 90%\n\nUNIQUE POSITIONING:\n'The AI team member that never misses a meeting'",
    summary:
      "Competitive analysis reveals market gap for truly intelligent, zero-touch meeting assistant with deep integrations and context awareness.",
    priority_score: 85,
    is_checkpoint: false,
    is_invalidated: false,
    extracted_metadata: {
      competitors_analyzed: 5,
      price_range: "$7-30/user/month for SMB tools",
      key_pain_points: [
        "Manual setup required for all competitors",
        "No context understanding across tools",
        "Limited integration capabilities",
        "Generic one-size-fits-all approach",
        "High enterprise costs vs limited SMB options",
      ],
      desired_features: [
        "Zero-touch operation",
        "AI that learns team patterns",
        "Deep native integrations",
        "Context-aware processing",
      ],
      market_gaps: [
        "Zero-touch operation",
        "Context intelligence",
        "Commitment detection",
        "Deep integration",
        "Team-specific learning",
      ],
      integrations_required: [
        "Zoom",
        "Slack",
        "Salesforce",
        "HubSpot",
        "Microsoft Teams",
      ],
      positioning_opportunity: "Premium at $75/user/month",
      key_differentiators: [
        "Truly invisible operation",
        "Learns team patterns",
        "Automatic commitment parsing",
        "Native work stack integration",
      ],
    },
    tags: ["competitive-analysis", "market-research", "pricing-strategy"],
    created_at: "2024-01-12T14:00:00Z",
  },
  {
    id: "c3333333-3333-3333-3333-333333333333",
    processing_request_id: "pr333333-3333-3333-3333-333333333333",
    upload: {
      id: "u3333333-3333-3333-3333-333333333333",
      file_name: "technical_poc_demo.mov",
      original_name: "AI Meeting Assistant Technical POC Demo - 2024-01-15.mov",
      content_type: "video/quicktime",
      upload_type: "video",
      description:
        "Technical proof of concept demonstration showing real-time transcription, action item extraction, and Slack integration",
      status: "completed",
      priority: "high",
      is_checkpoint: true,
      recorded_on: "2024-01-15T15:00:00Z",
      summary:
        "Successful POC demonstrates real-time transcription with 97% accuracy, intelligent action item extraction, and working Slack integration. WebRTC implementation enables seamless Zoom joining.",
    },
    text_content:
      "Technical POC Demo Transcript:\n\nAlex Chen (Lead Engineer): Alright team, let me demo what we've built in the last sprint. I'm going to start a Zoom meeting, and our AI assistant will join automatically.\n\n[Screen shows Zoom meeting starting]\n\nAlex: Notice how 'AI Meeting Assistant' joined within 3 seconds. No manual intervention. It's using our WebRTC bridge to appear as a regular participant.\n\nPriya Patel (CTO): How's the audio quality?\n\nAlex: We're capturing at 16kHz, which is perfect for speech. Let me show the real-time transcription...\n\n[Screen shows live transcription appearing with <2 second delay]\n\nAlex: We're using Whisper for the base transcription, then GPT-4 for speaker diarization and context enhancement. Accuracy is around 97% even with technical terms.\n\nJames Wu (Backend Engineer): Show them the action item detection!\n\nAlex: Right! So watch this - 'James, can you deploy the WebSocket service to staging by Thursday?' \n\n[UI highlights the sentence and creates an action item card]\n\nAlex: The AI detected: Assignee: James, Task: Deploy WebSocket service to staging, Due: Thursday. It understands context and relative dates.\n\nPriya: What about complex commitments?\n\nAlex: Great question. 'Priya, I'll review the security audit after Sarah sends it, probably early next week.'\n\n[System creates linked action items with dependency]\n\nAlex: See? It created two linked items - one waiting on Sarah, one for Priya conditional on the first.\n\nMaria Rodriguez (Product Manager): This is incredible! How does the Slack integration work?\n\nAlex: Let me end this meeting... Now watch our Slack channel.\n\n[Slack notification appears with formatted summary]\n\nAlex: Within 30 seconds, we get a summary with: key discussion points, all action items with owners and dates, and a link to the full transcript.\n\nJames: Show them the CRM integration mockup.\n\nAlex: We've simulated Salesforce integration. When it detects sales context - pricing, timeline, objections - it drafts opportunity updates.\n\n[Shows Salesforce update draft]\n\nPriya: Performance metrics?\n\nAlex: Running on a single GPU instance: \n- Handles 50 concurrent meetings\n- 2-second transcription delay\n- 5-second action item detection\n- 30-second post-meeting summary\n- Total cost: ~$0.10 per meeting hour\n\nMaria: What's left for MVP?\n\nAlex: Main gaps:\n1. Polish the UI/UX\n2. Implement user authentication  \n3. Add more integrations (Jira, Notion, Google Tasks)\n4. Build the learning system for team-specific patterns\n5. Security hardening for enterprise\n\nPriya: Timeline?\n\nAlex: 6 weeks for MVP. 2 for core features, 2 for integrations, 2 for testing and polish.\n\nJames: Don't forget about the manual override feature - users need to edit action items.\n\nAlex: Absolutely. Everything the AI generates is editable. Users maintain full control.\n\nPriya: This is exactly what we envisioned. Green light to continue. Fantastic work, team!",
    summary:
      "Technical POC successfully demonstrates core features: automatic meeting joining, 97% accurate transcription, intelligent action item extraction with dependencies, and working Slack integration.",
    priority_score: 95,
    is_checkpoint: true,
    is_invalidated: false,
    extracted_metadata: {
      key_pain_points: [
        "WebRTC implementation complexity",
        "Real-time processing latency challenges",
        "Action item accuracy in technical discussions",
        "Scaling concurrent meeting handling",
        "Cost optimization for processing",
      ],
      desired_features: [
        "Sub-second transcription latency",
        "Advanced dependency tracking",
        "Technical terminology learning",
        "Multi-modal input processing",
        "Enterprise-grade security",
      ],
      technical_achievements: [
        "WebRTC Zoom integration working",
        "97% transcription accuracy",
        "2-second transcription delay",
        "Intelligent action item extraction",
        "Dependency detection between tasks",
        "30-second meeting summaries",
        "Slack integration complete",
      ],
      integrations_required: [
        "Zoom WebRTC",
        "Slack API",
        "Salesforce REST API",
        "Jira webhooks",
        "Google Tasks API",
      ],
      market_gaps: [
        "Real-time AI processing at scale",
        "Intelligent dependency detection",
        "Cost-effective concurrent processing",
        "Technical context understanding",
        "Seamless multi-platform integration",
      ],
      key_differentiators: [
        "97% accuracy in real-time",
        "Automatic dependency linking",
        "$0.10 per meeting hour cost",
        "50 concurrent meeting capacity",
        "Zero-latency meeting joining",
      ],
      performance_metrics: {
        concurrent_meetings: 50,
        transcription_delay: "2 seconds",
        action_item_detection: "5 seconds",
        summary_generation: "30 seconds",
        cost_per_meeting_hour: "$0.10",
      },
      remaining_work: [
        "UI/UX polish",
        "User authentication",
        "Additional integrations",
        "Team pattern learning",
        "Security hardening",
      ],
      timeline_to_mvp: "6 weeks",
    },
    tags: ["technical-poc", "demo", "checkpoint", "successful-validation"],
    created_at: "2024-01-15T17:00:00Z",
  },
  {
    id: "c4444444-4444-4444-4444-444444444444",
    processing_request_id: "pr444444-4444-4444-4444-444444444444",
    upload: {
      id: "u4444444-4444-4444-4444-444444444444",
      file_name: "design_review_mockups.pdf",
      original_name: "AI Meeting Assistant - UX Design Review v2.pdf",
      content_type: "application/pdf",
      upload_type: "document",
      description:
        "UX design review with mockups for dashboard, meeting view, and settings",
      status: "completed",
      priority: "medium",
      is_checkpoint: false,
      recorded_on: "2024-01-18T11:00:00Z",
      summary:
        "Design review establishes clean, minimal interface with focus on 'invisible until needed' principle. Three main views: Dashboard (today's meetings), Live Meeting (real-time insights), and Review (post-meeting summaries).",
    },
    text_content:
      "AI Meeting Assistant - Design Review Notes\n\n1. DESIGN PRINCIPLES\n   - Invisible until needed\n   - Zero cognitive load during meetings\n   - Delight with intelligence, not features\n   - Progressive disclosure of capabilities\n\n2. DASHBOARD VIEW\n   Today's Meetings:\n   - Calendar integration shows all meetings\n   - Status indicators: Upcoming, In Progress, Completed\n   - One-click summary access\n   - Action items bubble count\n   \n   Key Metrics Widget:\n   - Hours saved this week\n   - Action items completed\n   - Meeting efficiency score\n\n3. LIVE MEETING VIEW\n   Minimal Floating Widget:\n   - Transcription confidence indicator\n   - Action item counter (pulsing when detected)\n   - Participant list\n   - Hide/show toggle\n   \n   Expanded View (on demand):\n   - Real-time transcription\n   - Highlighted action items\n   - Key points extraction\n   - Quick note capability\n\n4. POST-MEETING REVIEW\n   Smart Summary:\n   - 3-5 key discussion points\n   - All commitments with owners\n   - Decisions made\n   - Next steps\n   \n   Interactive Transcript:\n   - Searchable\n   - Clickable timestamps\n   - Edit capability\n   - Export options\n\n5. SETTINGS\n   Integration Management:\n   - OAuth flows for each service\n   - Custom field mapping\n   - Notification preferences\n   \n   AI Preferences:\n   - Summary style (brief/detailed)\n   - Action item sensitivity\n   - Custom team terminology\n\n6. MOBILE EXPERIENCE\n   - Meeting summaries via app\n   - Push notifications for assigned tasks\n   - Quick transcript search\n   - Voice note additions\n\n7. UNIQUE INTERACTIONS\n   Magic Moments:\n   - Auto-joining meetings with subtle sound\n   - Action items appearing with gentle animation\n   - 'Aha' detection - highlighting key insights\n   - End-of-day digest with all commitments\n\nUSER FEEDBACK FROM MOCKUP TESTING:\n- 'Feels like having a really smart EA'\n- 'Love that I don't have to think about it'\n- 'The daily digest is gold'\n- 'Finally, something that gets out of my way'",
    summary:
      "UX design focuses on invisible operation with three key views: Dashboard, Live Meeting, and Review. Emphasis on zero cognitive load and delightful intelligence.",
    priority_score: 80,
    is_checkpoint: false,
    is_invalidated: false,
    extracted_metadata: {
      key_pain_points: [
        "Users confused by cluttered interfaces",
        "Cognitive load during meetings reduces focus",
        "Existing tools don't feel intelligent",
        "Too many features create decision paralysis",
        "Mobile experience often overlooked",
      ],
      desired_features: [
        "Invisible operation principle",
        "Smart contextual interface",
        "Mobile-first experience",
        "Progressive disclosure of capabilities",
        "Delightful micro-interactions",
      ],
      design_principles: [
        "Invisible until needed",
        "Zero cognitive load",
        "Intelligence over features",
        "Progressive disclosure",
      ],
      key_views: [
        "Dashboard - Today's meetings and metrics",
        "Live Meeting - Minimal floating widget",
        "Post-Meeting Review - Smart summary and transcript",
      ],
      integrations_required: [
        "Calendar services",
        "Slack/Teams",
        "Mobile notifications",
        "Jira/Linear",
        "Voice note systems",
      ],
      market_gaps: [
        "Truly invisible interfaces",
        "Zero-setup user experience",
        "Intelligence-driven simplicity",
        "Mobile meeting management",
        "Delightful micro-interactions",
      ],
      key_differentiators: [
        "Invisible until needed principle",
        "AI-driven interface adaptation",
        "Magic moment detection",
        "Mobile-first design",
        "Smart EA experience",
      ],
      unique_features: [
        "Auto-joining with subtle feedback",
        "Real-time action item animation",
        "Aha moment detection",
        "End-of-day commitment digest",
      ],
      user_feedback_themes: [
        "Feels like smart EA",
        "Appreciates invisibility",
        "Values daily digest",
        "Gets out of the way",
      ],
    },
    tags: ["design", "ux", "mockups", "user-feedback"],
    created_at: "2024-01-18T15:00:00Z",
  },
  {
    id: "c5555555-5555-5555-5555-555555555555",
    processing_request_id: "pr555555-5555-5555-5555-555555555555",
    upload: {
      id: "u5555555-5555-5555-5555-555555555555",
      file_name: "beta_user_feedback_week1.xlsx",
      original_name: "AI Meeting Assistant - Beta User Feedback Week 1.xlsx",
      content_type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      upload_type: "spreadsheet",
      description:
        "First week of beta testing feedback from 10 users across sales, product, and engineering teams",
      status: "completed",
      priority: "high",
      is_checkpoint: true,
      recorded_on: "2024-01-25T16:00:00Z",
      summary:
        "Beta feedback overwhelmingly positive: 4.8/5 rating, 90% daily active use, average 6.5 hours saved per week. Key requests: better handling of technical discussions and custom vocabulary support.",
    },
    text_content:
      "Beta User Feedback Summary - Week 1\n\nOVERALL METRICS:\n- Average Rating: 4.8/5\n- Daily Active Use: 9/10 users (90%)\n- Average Time Saved: 6.5 hours/week\n- Would Recommend: 10/10 (100%)\n- Renewal Intent: $85/month average willingness to pay\n\nUSER FEEDBACK BY ROLE:\n\n1. Tom Bradley (Sales Director):\n   Rating: 5/5\n   Time Saved: 8 hours/week\n   Quote: 'This is the first tool that actually delivers on the promise. My CRM is always up to date now.'\n   Favorite Feature: Automatic Salesforce updates\n   Request: Integration with HubSpot\n\n2. Sarah Kim (Product Manager):\n   Rating: 5/5\n   Time Saved: 7 hours/week\n   Quote: 'I've stopped taking notes entirely. The AI catches nuances I would miss.'\n   Favorite Feature: Commitment detection across multiple speakers\n   Request: Jira epic/story creation\n\n3. Marcus Lee (Engineering Manager):\n   Rating: 4/5\n   Time Saved: 5 hours/week\n   Quote: 'Great for standup summaries. Struggles a bit with technical architecture discussions.'\n   Favorite Feature: Daily digest of all commitments\n   Request: Better code/technical term recognition\n\n4. Jennifer Walsh (Customer Success):\n   Rating: 5/5\n   Time Saved: 9 hours/week\n   Quote: 'Game changer for customer calls. I'm fully present instead of scrambling to take notes.'\n   Favorite Feature: Sentiment analysis in summaries\n   Request: Integration with Zendesk\n\n5. David Chen (VP Engineering):\n   Rating: 4/5\n   Time Saved: 4 hours/week\n   Quote: 'Excellent for 1-1s and planning. Needs better handling of whiteboard sessions.'\n   Favorite Feature: Action items with automatic due dates\n   Request: Miro/Figma integration for visual meetings\n\nCOMMON THEMES:\n\nPositive:\n- 'Invisible' operation loved by all\n- Accuracy exceeds expectations\n- Time savings are real and measurable\n- Reduces meeting anxiety\n- Improves meeting attendance (can focus on discussion)\n\nNeeds Improvement:\n- Technical discussions need specialized vocabulary\n- Visual meeting components not captured\n- Some missed context in cross-talk situations\n- Want ability to train on company-specific terms\n- Mobile app highly requested\n\nBUGS REPORTED:\n- Zoom connection dropped 2x for one user\n- Delayed Slack notifications (>5 min) 3x\n- Duplicate action items when same task mentioned multiple times\n- Speaker identification confused similar voices\n\nFEATURE REQUESTS (by frequency):\n1. Custom vocabulary training (8 users)\n2. Mobile app (7 users)\n3. More integrations - HubSpot, Zendesk, Linear (6 users)\n4. Whiteboard/visual capture (5 users)\n5. Meeting templates for common types (4 users)\n6. Team analytics dashboard (3 users)\n7. Voice commands during meeting (2 users)\n\nRENEWAL INSIGHTS:\n- Current manual solution cost: ~$200-300/week in lost productivity\n- Willingness to pay: $60-120/month\n- Decision factors: ROI clear, integration depth matters\n- Enterprise needs: SSO, SOC2, admin controls",
    summary:
      "Beta week 1: 4.8/5 rating, 90% daily use, 6.5 hours saved weekly. Users love invisible operation but want custom vocabulary training and more integrations.",
    priority_score: 100,
    is_checkpoint: true,
    is_invalidated: false,
    extracted_metadata: {
      beta_metrics: {
        average_rating: 4.8,
        daily_active_use: "90%",
        time_saved_weekly: "6.5 hours",
        recommendation_rate: "100%",
        willingness_to_pay: "$85/month average",
      },
      top_positive_feedback: [
        "Invisible operation",
        "Exceeds accuracy expectations",
        "Real time savings",
        "Reduces meeting anxiety",
        "Improves focus on discussion",
      ],
      improvement_areas: [
        "Technical vocabulary handling",
        "Visual meeting components",
        "Cross-talk situations",
        "Company-specific terms",
        "Mobile app needed",
      ],
      top_feature_requests: [
        "Custom vocabulary training",
        "Mobile app",
        "More integrations (HubSpot, Zendesk, Linear)",
        "Whiteboard/visual capture",
        "Meeting templates",
      ],
      bugs_identified: [
        "Zoom connection stability",
        "Slack notification delays",
        "Duplicate action items",
        "Voice similarity confusion",
      ],
    },
    tags: [
      "beta-feedback",
      "user-testing",
      "checkpoint",
      "validation",
      "feature-requests",
    ],
    created_at: "2024-01-25T18:00:00Z",
  },
];
