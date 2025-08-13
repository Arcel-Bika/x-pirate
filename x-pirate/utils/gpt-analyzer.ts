import { LeadData, GPTAnalysis } from '@/types/mission';

export async function analyzeLeadWithGPT(lead: LeadData): Promise<GPTAnalysis> {
  // ... renvoie un objet conforme à GPTAnalysis
  return {
    score: 87,
    category: 'Lead Stellaire',
    priority: 'high',
    summary: '...',
    next_actions: ['...'],
    confidence: 92
  };
}
