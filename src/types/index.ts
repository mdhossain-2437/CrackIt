// ==========================================
// Core Types for Exam Prep BD
// ==========================================

export type ExamCategory =
  | "bcs"
  | "medical"
  | "engineering"
  | "varsity"
  | "cadet"
  | "school"
  | "bank"
  | "primary";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  examCategory: ExamCategory;
  streak: number;
  xp: number;
  coins: number;
  badges: Badge[];
  joinedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  nameBn: string;
  icon: string;
  totalTopics: number;
  completedTopics: number;
  progress: number;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  nameBn: string;
  totalQuestions: number;
  attempted: number;
  accuracy: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subjectId: string;
  topicId: string;
  difficulty: "easy" | "medium" | "hard";
  year?: string;
  examSource?: string;
  tags: string[];
}

export interface ExamConfig {
  id: string;
  title: string;
  titleBn: string;
  type: "practice" | "mock" | "live" | "adaptive";
  category: ExamCategory;
  subjectId?: string;
  topicId?: string;
  totalQuestions: number;
  duration: number; // in seconds
  questions: Question[];
  scheduledAt?: string;
  participants?: number;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  userId: string;
  answers: (number | null)[];
  markedForReview: boolean[];
  timeSpent: number[]; // seconds per question
  startedAt: string;
  completedAt?: string;
  score: number;
  totalCorrect: number;
  totalWrong: number;
  totalSkipped: number;
}

export interface ExamResult {
  attempt: ExamAttempt;
  exam: ExamConfig;
  rank?: number;
  totalParticipants?: number;
  topicWiseAnalysis: TopicAnalysis[];
}

export interface TopicAnalysis {
  topicId: string;
  topicName: string;
  total: number;
  correct: number;
  accuracy: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  score: number;
  timeTaken: number;
  college?: string;
  district?: string;
}

export interface LiveExam {
  id: string;
  title: string;
  titleBn: string;
  category: ExamCategory;
  scheduledAt: string;
  duration: number;
  totalQuestions: number;
  registeredCount: number;
  status: "upcoming" | "live" | "completed";
  isPremium: boolean;
}

export type ThemeMode = "light" | "dark" | "system";

export interface AppSettings {
  theme: ThemeMode;
  language: "bn" | "en";
  notifications: boolean;
  soundEffects: boolean;
}
