"use client";

import { subjects } from "@/data/mock";
import Link from "next/link";

export default function SubjectsPage() {
  return (
    <div className="px-4 pt-6 pb-4 safe-top">
      <h1
        className="mb-1 text-xl font-bold"
        style={{ color: "var(--color-text-primary)" }}
      >
        বিষয় সমূহ
      </h1>
      <p
        className="mb-6 text-sm"
        style={{ color: "var(--color-text-secondary)" }}
      >
        যেকোনো বিষয়ে ক্লিক করে টপিক ভিত্তিক প্র্যাকটিস করো
      </p>
      <div className="space-y-3">
        {subjects.map((subject) => (
          <Link
            key={subject.id}
            href={`/subjects/${subject.id}`}
            className="card flex items-center gap-4 p-4 transition-all active:scale-[0.99]"
          >
            <span
              className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
              style={{ backgroundColor: "var(--color-surface-alt)" }}
            >
              {subject.icon}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <h3
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {subject.nameBn}
                </h3>
                <span
                  className="text-xs font-bold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {subject.progress}%
                </span>
              </div>
              <p
                className="mb-2 text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                {subject.completedTopics}/{subject.totalTopics} টপিক সম্পন্ন
              </p>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${subject.progress}%` }}
                />
              </div>
            </div>
            <svg
              className="h-5 w-5 flex-shrink-0"
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
      </div>
    </div>
  );
}
