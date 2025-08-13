export interface LeadData {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  company: string;
  signal_strength: number;
  sector: string;
  message: string;
  status: 'captured' | 'analyzing' | 'processed' | 'stored' | 'notified';
}

export interface GPTAnalysis {
  score: number;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  next_actions: string[];
  confidence: number;
}

export interface ProcessedLead extends LeadData {
  analysis?: GPTAnalysis;
  airtable_id?: string;
  notification_sent?: boolean;
}

export interface SystemStats {
  total_leads: number;
  processed_today: number;
  success_rate: number;
  avg_processing_time: number;
  top_sector: string;
}

export interface GPTAnalysis { /* ... */ }