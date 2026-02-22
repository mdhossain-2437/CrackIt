import type { Question, Subject, Topic } from "@/types";
import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "crackit-offline";
const DB_VERSION = 1;

interface CrackItDB {
  subjects: Subject[];
  topics: Topic[];
  questions: Question[];
  cachedAt: { key: string; timestamp: number };
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Subjects store
        if (!db.objectStoreNames.contains("subjects")) {
          db.createObjectStore("subjects", { keyPath: "id" });
        }
        // Topics store
        if (!db.objectStoreNames.contains("topics")) {
          const topicStore = db.createObjectStore("topics", { keyPath: "id" });
          topicStore.createIndex("subjectId", "subjectId");
        }
        // Questions store
        if (!db.objectStoreNames.contains("questions")) {
          const qStore = db.createObjectStore("questions", { keyPath: "id" });
          qStore.createIndex("subjectId", "subjectId");
          qStore.createIndex("topicId", "topicId");
        }
        // Cache timestamps
        if (!db.objectStoreNames.contains("meta")) {
          db.createObjectStore("meta", { keyPath: "key" });
        }
      },
    });
  }
  return dbPromise;
}

// ──────────────────────────────────────────────
// Cache management
// ──────────────────────────────────────────────

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function isCacheValid(key: string): Promise<boolean> {
  try {
    const db = await getDB();
    const meta = await db.get("meta", key);
    if (!meta) return false;
    return Date.now() - meta.timestamp < CACHE_TTL;
  } catch {
    return false;
  }
}

async function setCacheTimestamp(key: string): Promise<void> {
  try {
    const db = await getDB();
    await db.put("meta", { key, timestamp: Date.now() });
  } catch {
    // Silently fail
  }
}

// ──────────────────────────────────────────────
// Subjects
// ──────────────────────────────────────────────

export async function cacheSubjects(subjects: Subject[]): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction("subjects", "readwrite");
    for (const subject of subjects) {
      await tx.store.put(subject);
    }
    await tx.done;
    await setCacheTimestamp("subjects");
  } catch {
    // Silently fail
  }
}

export async function getCachedSubjects(): Promise<Subject[] | null> {
  try {
    if (!(await isCacheValid("subjects"))) return null;
    const db = await getDB();
    const subjects = await db.getAll("subjects");
    return subjects.length > 0 ? subjects : null;
  } catch {
    return null;
  }
}

// ──────────────────────────────────────────────
// Topics
// ──────────────────────────────────────────────

export async function cacheTopics(topics: Topic[]): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction("topics", "readwrite");
    for (const topic of topics) {
      await tx.store.put(topic);
    }
    await tx.done;
    await setCacheTimestamp("topics");
  } catch {
    // Silently fail
  }
}

export async function getCachedTopics(
  subjectId?: string,
): Promise<Topic[] | null> {
  try {
    if (!(await isCacheValid("topics"))) return null;
    const db = await getDB();

    if (subjectId) {
      const topics = await db.getAllFromIndex("topics", "subjectId", subjectId);
      return topics.length > 0 ? topics : null;
    }

    const topics = await db.getAll("topics");
    return topics.length > 0 ? topics : null;
  } catch {
    return null;
  }
}

// ──────────────────────────────────────────────
// Questions
// ──────────────────────────────────────────────

export async function cacheQuestions(questions: Question[]): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction("questions", "readwrite");
    for (const q of questions) {
      await tx.store.put(q);
    }
    await tx.done;
    await setCacheTimestamp("questions");
  } catch {
    // Silently fail
  }
}

export async function getCachedQuestions(params?: {
  subjectId?: string;
  topicId?: string;
  limit?: number;
}): Promise<Question[] | null> {
  try {
    const db = await getDB();
    let questions: Question[];

    if (params?.subjectId) {
      questions = await db.getAllFromIndex(
        "questions",
        "subjectId",
        params.subjectId,
      );
    } else if (params?.topicId) {
      questions = await db.getAllFromIndex(
        "questions",
        "topicId",
        params.topicId,
      );
    } else {
      questions = await db.getAll("questions");
    }

    if (questions.length === 0) return null;

    // Random shuffle for exams
    if (params?.limit) {
      const shuffled = questions.sort(() => Math.random() - 0.5);
      return shuffled.slice(0, params.limit);
    }

    return questions;
  } catch {
    return null;
  }
}

export async function getCachedQuestionsByIds(
  ids: string[],
): Promise<Question[]> {
  try {
    const db = await getDB();
    const questions: Question[] = [];
    for (const id of ids) {
      const q = await db.get("questions", id);
      if (q) questions.push(q);
    }
    return questions;
  } catch {
    return [];
  }
}

// ──────────────────────────────────────────────
// Clear all cached data
// ──────────────────────────────────────────────

export async function clearOfflineCache(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear("subjects");
    await db.clear("topics");
    await db.clear("questions");
    await db.clear("meta");
  } catch {
    // Silently fail
  }
}

// ──────────────────────────────────────────────
// Check if offline data is available
// ──────────────────────────────────────────────

export async function hasOfflineData(): Promise<boolean> {
  try {
    const db = await getDB();
    const count = await db.count("questions");
    return count > 0;
  } catch {
    return false;
  }
}
