import { useState, useEffect } from 'react';
import { PlaybookProject, PlaybookContext, PlaybookInsight, PlaybookStep } from '@/lib/playbookData';

interface PlaybookApiResponse {
  project: PlaybookProject;
  contexts: PlaybookContext[];
  insights: PlaybookInsight[];
  insight_evolution: {
    summary: string;
    phases: any[];
    insight_relationships: any[];
  };
  playbook: {
    id: string;
    project_id: string;
    name: string;
    description: string;
    created_at: string;
    generated_from_contexts: string[];
    steps: PlaybookStep[];
  };
}

interface UsePlaybookDataReturn {
  data: PlaybookApiResponse | null;
  loading: boolean;
  error: string | null;
}

export const usePlaybookData = (id: string | null): UsePlaybookDataReturn => {
  const [data, setData] = useState<PlaybookApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('=== usePlaybookData hook called with ID:', id); // Debug log
    console.log('=== ID type:', typeof id, 'ID value:', JSON.stringify(id));
    
    if (!id) {
      console.log('=== No ID provided, skipping API call'); // Debug log
      return;
    }
    
    console.log('=== ID is valid, proceeding with API call');

    const fetchPlaybookData = async () => {
      console.log('Starting API fetch for ID:', id); // Debug log
      setLoading(true);
      setError(null);
      
      try {
        // Using the provided API endpoint
        console.log('Making fetch request to API...'); // Debug log
        const response = await fetch(`https://mocki.io/v1/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const apiData: PlaybookApiResponse = await response.json();
        console.log('API response received:', apiData); // Debug log
        
        // Validate that the response has required structure
        if (!apiData.project || !apiData.playbook || !apiData.playbook.steps) {
          throw new Error('Invalid API response structure');
        }
        
        console.log('API data validated, setting data...'); // Debug log
        setData(apiData);
      } catch (err) {
        console.error('Error fetching playbook data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch playbook data');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaybookData();
  }, [id]);

  return { data, loading, error };
};

export default usePlaybookData;