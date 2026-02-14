
export enum ThreatLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export type Role = 'USER' | 'ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  role: Role;
  lastLogin: string;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  source: string;
  event: string;
  severity: ThreatLevel;
  details: string;
}

export interface AnalysisResult {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  logSnippet: string;
  summary: string;
  recommendations: string[];
  riskScore: number;
  tags: string[];
}

export interface SOSAlert {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
  };
  nearestStation: string;
  stationDetails?: string;
  status: 'ACTIVE' | 'RESOLVED';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
