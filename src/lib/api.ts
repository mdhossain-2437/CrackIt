import type { Question, Subject, Topic } from "@/types";
import { auth } from "./firebase";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * Get the current Firebase ID token for authenticated requests.
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  if (!auth) return {};
  const user = auth.currentUser;
  if (!user) return {};

  try {
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
  } catch {
    return {};
  }
}

/**
 * Generic fetch wrapper with auth and error handling.
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const authHeaders = await getAuthHeaders();

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ──────────────────────────────────────────────
// Auth API
// ──────────────────────────────────────────────

export async function apiRegister(
  name: string,
  examCategory: string,
): Promise<{ user: any }> {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, examCategory }),
  });
}

export async function apiGetMe(): Promise<{ user: any }> {
  return apiFetch("/auth/me");
}

// ──────────────────────────────────────────────
// Subjects API
// ──────────────────────────────────────────────

export async function apiGetSubjects(): Promise<{
  subjects: (Subject & { subjectId: string })[];
}> {
  return apiFetch("/subjects");
}

export async function apiGetSubjectDetail(
  subjectId: string,
): Promise<{ subject: any; topics: Topic[] }> {
  return apiFetch(`/subjects/${subjectId}`);
}

// ──────────────────────────────────────────────
// Questions API
// ──────────────────────────────────────────────

export async function apiGetQuestions(params: {
  subjectId?: string;
  topicId?: string;
  difficulty?: string;
  limit?: number;
  random?: boolean;
}): Promise<{ questions: Question[]; total: number }> {
  const searchParams = new URLSearchParams();
  if (params.subjectId) searchParams.set("subjectId", params.subjectId);
  if (params.topicId) searchParams.set("topicId", params.topicId);
  if (params.difficulty) searchParams.set("difficulty", params.difficulty);
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.random) searchParams.set("random", "true");

  const data = await apiFetch<{ questions: any[]; total: number }>(
    `/questions?${searchParams.toString()}`,
  );

  // Map server questionId → client id format
  return {
    ...data,
    questions: data.questions.map((q) => ({
      id: q.questionId || q.id,
      text: q.text,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
      subjectId: q.subjectId,
      topicId: q.topicId,
      difficulty: q.difficulty,
      year: q.year,
      examSource: q.examSource,
      tags: q.tags || [],
    })),
  };
}

export async function apiGetQuestionStats(): Promise<{
  stats: any[];
  totalQuestions: number;
}> {
  return apiFetch("/questions/stats");
}

// ──────────────────────────────────────────────
// Exams API
// ──────────────────────────────────────────────

export async function apiSubmitExam(data: {
  examType: string;
  subjectId?: string;
  topicId?: string;
  title: string;
  answers: (number | null)[];
  questionIds: string[];
  timeTaken?: number;
  duration?: number;
}): Promise<any> {
  return apiFetch("/exams/submit", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiGetExamHistory(
  limit = 20,
  skip = 0,
): Promise<{ attempts: any[]; total: number }> {
  return apiFetch(`/exams/history?limit=${limit}&skip=${skip}`);
}

export async function apiGetLiveExams(): Promise<{ exams: any[] }> {
  return apiFetch("/exams/live");
}

// ──────────────────────────────────────────────
// Leaderboard API
// ──────────────────────────────────────────────

export async function apiGetLeaderboard(
  limit = 50,
): Promise<{ leaderboard: any[]; myRank: number | null }> {
  return apiFetch(`/leaderboard?limit=${limit}`);
}

// ──────────────────────────────────────────────
// Profile API
// ──────────────────────────────────────────────

export async function apiGetProfile(): Promise<{ user: any }> {
  return apiFetch("/profile");
}

export async function apiUpdateProfile(data: {
  name?: string;
  avatar?: string;
  examCategory?: string;
}): Promise<{ user: any }> {
  return apiFetch("/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ──────────────────────────────────────────────
// Health check
// ──────────────────────────────────────────────

export async function apiHealthCheck(): Promise<boolean> {
  try {
    await apiFetch("/health");
    return true;
  } catch {
    return false;
  }
}
