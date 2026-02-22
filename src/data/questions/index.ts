import type { Question } from "@/types";

import banglaQuestions from "./bangla";
import biologyQuestions from "./biology";
import chemistryQuestions from "./chemistry";
import englishQuestions from "./english";
import gkQuestions from "./gk";
import ictQuestions from "./ict";
import mathQuestions from "./math";
import physicsQuestions from "./physics";

/** All questions from every subject combined into a single array */
export const allQuestions: Question[] = [
  ...physicsQuestions,
  ...chemistryQuestions,
  ...biologyQuestions,
  ...mathQuestions,
  ...englishQuestions,
  ...banglaQuestions,
  ...gkQuestions,
  ...ictQuestions,
];

/** Get questions filtered by subject */
export function getQuestionsBySubject(subjectId: string): Question[] {
  return allQuestions.filter((q) => q.subjectId === subjectId);
}

/** Get questions filtered by topic */
export function getQuestionsByTopic(topicId: string): Question[] {
  return allQuestions.filter((q) => q.topicId === topicId);
}

/** Get questions filtered by difficulty */
export function getQuestionsByDifficulty(
  difficulty: "easy" | "medium" | "hard",
): Question[] {
  return allQuestions.filter((q) => q.difficulty === difficulty);
}

/** Get questions filtered by subject and topic */
export function getQuestionsBySubjectAndTopic(
  subjectId: string,
  topicId: string,
): Question[] {
  return allQuestions.filter(
    (q) => q.subjectId === subjectId && q.topicId === topicId,
  );
}

/** Get random questions for an exam */
export function getRandomQuestions(
  count: number,
  subjectId?: string,
): Question[] {
  let pool = subjectId ? getQuestionsBySubject(subjectId) : allQuestions;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/** Get question count stats by subject */
export function getQuestionStats(): Record<string, number> {
  const stats: Record<string, number> = {};
  for (const q of allQuestions) {
    stats[q.subjectId] = (stats[q.subjectId] || 0) + 1;
  }
  return stats;
}

/** Total number of questions in the bank */
export const totalQuestionCount = allQuestions.length;

// Re-export individual subject arrays for direct access
export {
  banglaQuestions,
  biologyQuestions,
  chemistryQuestions,
  englishQuestions,
  gkQuestions,
  ictQuestions,
  mathQuestions,
  physicsQuestions,
};
