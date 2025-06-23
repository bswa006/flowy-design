// Enhanced playbook data loader that can handle rich content and context mapping
import { PlaybookProject } from './playbookData';

// Enhanced interfaces - standalone types for rich content
export interface EnhancedPlaybookStep {
  id: string;
  title: string;
  description: string;
  estimated_minutes: number;
  status: "not_started" | "in_progress" | "completed";
  completion_percentage: number;
  ai_automation?: {
    level: string;
    human_interaction: string;
    message: string;
  };
  execution: {
    type: "hybrid" | "manual" | "tool_guided" | "ai_review" | "llm_direct";
    stages: EnhancedStage[];
  };
}

export interface EnhancedStage {
  stage: number;
  name: string;
  type: "manual" | "tool_guided" | "ai_review" | "llm_direct" | "hybrid";
  tool: any;
  instructions: string;
  estimated_minutes: number;
  status: "not_started" | "in_progress" | "completed";
  completion_percentage: number;
  context: {
    required: string[];
    assumptions?: string[];
  };
  outcome_expected: {
    generated: string[];
    artifacts: string[];
  };
  ai_completion_badge?: {
    icon: string;
    message: string;
  };
  context_insights_used?: Array<{
    insight_id: string;
    application: string;
    confidence: number;
  }>;
  rich_content?: {
    ai_prompts?: Record<string, string>;
    reference_materials?: Array<{
      type: "document" | "video" | "image" | "link";
      title: string;
      url: string;
      description: string;
      timestamp_highlights?: Array<{
        time: string;
        description: string;
      }>;
    }>;
    execution_checklist?: Array<{
      task: string;
      estimated_time: string;
      ai_assisted: boolean;
      prompt_template?: string;
    }>;
    success_criteria?: string[];
    technical_specs?: Array<{
      title: string;
      content: string;
    }>;
    code_examples?: Array<{
      title: string;
      language: string;
      content: string;
    }>;
  };
  real_time_progress?: {
    artifacts_generated: string[];
    current_step: string;
    blockers: string[];
    next_actions: string[];
  };
}

export interface EnhancedPlaybookData {
  project: PlaybookProject;
  contexts: any[];
  insights: any[];
  insight_evolution: any;
  playbook: {
    id: string;
    project_id: string;
    name: string;
    description: string;
    created_at: string;
    generated_from_contexts: string[];
    steps: EnhancedPlaybookStep[];
  };
}

// Load enhanced data if available, otherwise fallback to static
export async function loadEnhancedPlaybookData(apiId?: string): Promise<any | null> {
  try {
    if (apiId) {
      // Try to load from API
      const response = await fetch(`https://mocki.io/v1/${apiId}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    }
    
    // Try to load enhanced static data
    try {
      const enhancedData = await import('@/docs/enhanced-playbook.json');
      return enhancedData.default;
    } catch {
      // Fallback to regular static data
      return null;
    }
  } catch (error) {
    console.error('Error loading enhanced playbook data:', error);
    return null;
  }
}

// Load enhanced context data
export async function loadEnhancedContextData(): Promise<any[] | null> {
  try {
    const enhancedContexts = await import('@/docs/enhanced-context.json');
    return enhancedContexts.default;
  } catch (error) {
    console.error('Error loading enhanced context data:', error);
    return null;
  }
}

// Helper function to check if data has enhanced features
export function hasEnhancedFeatures(step: any): boolean {
  const stages = step.execution.stages;
  if (!stages || stages.length === 0) return false;
  
  // Check if any stage has rich content
  return stages.some((stage: any) => 
    stage.rich_content ||
    stage.context_insights_used ||
    stage.real_time_progress
  );
}

// Map context insights to stages
export function mapContextInsightsToStage(
  stageId: string, 
  contextInsights: any[] = []
): any[] {
  if (!contextInsights) return [];
  
  return contextInsights
    .filter(insight => 
      insight.stage_relevance && 
      insight.stage_relevance.includes(stageId)
    )
    .map(insight => ({
      insight_id: insight.id,
      application: insight.implementation_notes || insight.content,
      confidence: insight.confidence || 0.8
    }));
}

export default {
  loadEnhancedPlaybookData,
  loadEnhancedContextData,
  hasEnhancedFeatures,
  mapContextInsightsToStage
};