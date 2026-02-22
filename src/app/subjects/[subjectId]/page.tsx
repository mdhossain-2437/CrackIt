"use client";

import { subjects, topicsBySubject } from "@/data/mock";
import Link from "next/link";
import { use } from "react";

export default function SubjectDetailPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const { subjectId } = use(params);
  const subject = subjects.find((s) => s.id === subjectId);
  const topics = topicsBySubject[subjectId] || [];

  if (!subject) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <p style={{ color: "var(--color-text-muted)" }}>বিষয় পাওয়া যায়নি</p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-4 safe-top">
      {/* Back button + Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/subjects"
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ backgroundColor: "var(--color-surface-alt)" }}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="var(--color-text-primary)"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{subject.icon}</span>
          <div>
            <h1
              className="text-lg font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {subject.nameBn}
            </h1>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {subject.name}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Card */}
      <div className="card mb-6 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span
            className="text-sm font-medium"
            style={{ color: "var(--color-text-secondary)" }}
          >
            সার্বিক প্রগতি
          </span>
          <span
            className="text-lg font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            {subject.progress}%
          </span>
        </div>
        <div className="progress-bar mb-2">
          <div
            className="progress-bar-fill"
            style={{ width: `${subject.progress}%` }}
          />
        </div>
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          {subject.completedTopics}/{subject.totalTopics} টপিক সম্পন্ন
        </p>
      </div>

      {/* Quick Start Button */}
      <Link
        href={`/exam/practice?subject=${subjectId}`}
        className="btn-primary mb-6 flex w-full items-center justify-center gap-2 py-3"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
          />
        </svg>
        সব টপিক — দ্রুত প্র্যাকটিস
      </Link>

      {/* Topics */}
      <h2
        className="mb-3 text-sm font-semibold"
        style={{ color: "var(--color-text-primary)" }}
      >
        টপিক সমূহ
      </h2>
      <div className="space-y-3">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            href={`/exam/practice?subject=${subjectId}&topic=${topic.id}`}
            className="card flex items-center justify-between p-4 transition-all active:scale-[0.99]"
          >
            <div className="flex-1 min-w-0">
              <h3
                className="mb-0.5 text-sm font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {topic.nameBn}
              </h3>
              <p
                className="text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                {topic.name}
              </p>
              <div
                className="mt-2 flex items-center gap-4 text-xs"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <span>📄 {topic.totalQuestions} প্রশ্ন</span>
                <span>✅ {topic.attempted} চেষ্টা</span>
                <span
                  style={{
                    color:
                      topic.accuracy >= 70
                        ? "var(--color-success)"
                        : topic.accuracy >= 50
                          ? "var(--color-warning)"
                          : "var(--color-danger)",
                  }}
                >
                  🎯 {topic.accuracy}%
                </span>
              </div>
            </div>
            <svg
              className="h-5 w-5 flex-shrink-0 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="var(--color-text-muted)"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </Link>
        ))}

        {topics.length === 0 && (
          <div className="card flex items-center justify-center p-8">
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              এই বিষয়ের টপিক শীঘ্রই আসছে...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
