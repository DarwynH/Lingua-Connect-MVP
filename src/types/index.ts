export interface User {
  id: string;
  email: string;
  fullName: string;
  institution: string;
  nativeLanguages: string[];
  learningLanguages: string[];
  proficiencyLevels: { [language: string]: string };
  bio: string;
  avatar: string | null;
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
}

export interface LanguageMatch {
  id: string;
  userId: string;
  matchedUserId: string;
  sharedLanguages: string[];
  matchScore: number;
  status: 'pending' | 'active' | 'completed';
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'system';
  language: string;
  createdAt: Date;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: ChatMessage;
  isActive: boolean;
  createdAt: Date;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'native';