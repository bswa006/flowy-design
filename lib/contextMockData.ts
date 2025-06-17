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
export interface InsightWithSource {
  text: string;
  source: string;
  source_id: string;
}

export interface CumulativeInsights {
  key_pain_points?: InsightWithSource[];
  desired_features?: InsightWithSource[];
  integrations_required?: InsightWithSource[];
  market_gaps?: InsightWithSource[];
  technical_achievements?: InsightWithSource[];
  design_principles?: InsightWithSource[];
  beta_metrics?: InsightWithSource[];
}

export interface ExtractedMetadata {
  insight_sources?: string[];
  cumulative_insights?: CumulativeInsights;
  [key: string]: unknown;
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
  extracted_metadata?: ExtractedMetadata;
  tags?: string[];
  created_at: string;
}

// Load data from JSON file - this will be replaced with the cumulative insights data
import contextData from '@/docs/context.json';

export const initialContexts: Context[] = contextData.map((item: any) => ({
  id: item.id,
  processing_request_id: item.processing_request_id,
  upload: item.upload,
  text_content: item.text_content,
  summary: item.summary,
  priority_score: item.priority_score,
  is_checkpoint: item.is_checkpoint,
  is_invalidated: item.is_invalidated,
  extracted_metadata: item.extracted_metadata,
  tags: item.tags,
  created_at: item.created_at,
}));
