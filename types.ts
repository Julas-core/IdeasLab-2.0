import { LatLngExpression } from 'leaflet';

export enum Sentiment {
  Positive = 'Positive',
  Neutral = 'Neutral',
  Negative = 'Negative',
}

export enum Priority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export interface User {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
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
  createdAt: number;
  searchQueries?: string[];
  locationName?: string;
  latitude?: number;
  longitude?: number;
}

export interface WatchlistItem {
  problemId: string;
  priority: Priority;
}

export interface Solution {
  id: string;
  title: string;
  description: string;
  upvotes: number;
  author: string; // Changed from 'AI' | 'User' to string
  authorId?: string; // UID of the user who created it
  effectivenessScore?: number;
  noCodePrompt?: string;
  noCodePromptJson?: object;
}

export interface TrendData {
  name: string;
  trend: number;
}

export interface Challenge {
  id: string;
  problemId: string;
  problemTitle: string;
  title: string;
  description: string;
  prize: string;
  deadline: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}