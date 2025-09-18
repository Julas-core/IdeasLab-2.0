export enum Sentiment {
  Positive = 'Positive',
  Neutral = 'Neutral',
  Negative = 'Negative',
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  sentiment: Sentiment;
  sentimentScore: number;
  trendScore: number;
  upvotes: number;
  sources?: string[];
}

export interface Solution {
  title: string;
  description: string;
  effectivenessScore: number;
  noCodePrompt: string;
  noCodePromptJson: object;
}

export interface TrendData {
  name: string;
  trend: number;
}