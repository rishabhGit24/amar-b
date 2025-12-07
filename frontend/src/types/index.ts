/**
 * TypeScript type definitions for AMAR MVP Frontend
 */

export interface UserRequest {
  description: string;
}

export interface GenerateResponse {
  session_id: string;
  message: string;
}

export interface ProgressUpdate {
  type: 'connection' | 'progress' | 'error' | 'complete';
  agent?: 'planner' | 'builder' | 'deployer';
  status?: 'running' | 'completed' | 'failed';
  message: string;
  details?: string;
  session_id?: string;
}

export interface DeploymentResult {
  success: boolean;
  url?: string;
  error?: string;
  execution_time: number;
  project_summary: {
    page_count: number;
    component_count: number;
    file_count: number;
  };
}

export interface SessionResult {
  session_id: string;
  status: string;
  result: DeploymentResult | null;
  created_at: string;
}