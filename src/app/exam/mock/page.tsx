"use client";

import { subjects as staticSubjects } from "@/data/questionBank";
import { apiGetSubjects } from "@/lib/api";
import { getCachedSubjects } from "@/lib/offline";
import type { Subject } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MockExamSetupPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>(staticSubjects);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(30);
  const [duration, setDuration] = useState(30);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiGetSubjects();
        const data = (res as any).subjects || res;
        if (Array.isArray(data) && data.length > 0) setSubjects(data);
      } catch {
        const cached = await getCachedSubjects().catch(() => null);
        if (cached && cached.length > 0) setSubjects(cached);
      }
    })();
  }, []);

  const toggleSubject = (id: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const startExam = () => {
    const query =
      selectedSubjects.length > 0
        ? `?subjects=${selectedSubjects.join(",")}&count=${questionCount}`
        : `?count=${questionCount}`;
    router.push(`/exam/practice${query}`);
  };

  return (
    <div className="px-4 pt-6 pb-4 safe-top">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.back()}
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
        </button>
        <div>
          <h1
            className="text-lg font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            মক টেস্ট সেটআপ
          </h1>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            আপনার পছন্দ অনুযায়ী পরীক্ষা কাস্টমাইজ করুন
          </p>
        </div>
      </div>

      {/* Subject Selection */}
      <div className="mb-6">
        <h2
          className="mb-3 text-sm font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          বিষয় নির্বাচন (ঐচ্ছিক)
        </h2>
        <div className="flex flex-wrap gap-2">
          {subjects.map((sub) => {
            const isSelected = selectedSubjects.includes(sub.id);
            return (
              <button
                key={sub.id}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all"
                style={{
                  backgroundColor: isSelected
                    ? "rgb(37 99 235 / 0.08)"
                    : "var(--color-surface-alt)",
                  border: isSelected
                    ? "1.5px solid var(--color-primary)"
                    : "1.5px solid transparent",
                  color: isSelected
                    ? "var(--color-primary)"
                    : "var(--color-text-secondary)",
                }}
                onClick={() => toggleSubject(sub.id)}
              >
                <span>{sub.icon}</span>
                {sub.nameBn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Count */}
      <div className="card mb-4 p-4">
        <h3
          className="mb-3 text-sm font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          প্রশ্ন সংখ্যা
        </h3>
        <div className="flex gap-2">
          {[10, 20, 30, 50, 100].map((count) => (
            <button
              key={count}
              className="flex-1 rounded-lg py-2.5 text-sm font-medium transition-all"
              style={{
                backgroundColor:
                  questionCount === count
                    ? "var(--color-primary)"
                    : "var(--color-surface-alt)",
                color:
                  questionCount === count
                    ? "#fff"
                    : "var(--color-text-secondary)",
              }}
              onClick={() => setQuestionCount(count)}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div className="card mb-6 p-4">
        <h3
          className="mb-3 text-sm font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          সময় (মিনিট)
        </h3>
        <div className="flex gap-2">
          {[15, 30, 45, 60, 90].map((min) => (
            <button
              key={min}
              className="flex-1 rounded-lg py-2.5 text-sm font-medium transition-all"
              style={{
                backgroundColor:
                  duration === min
                    ? "var(--color-primary)"
                    : "var(--color-surface-alt)",
                color:
                  duration === min ? "#fff" : "var(--color-text-secondary)",
              }}
              onClick={() => setDuration(min)}
            >
              {min}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div
        className="card mb-6 p-4"
        style={{ backgroundColor: "rgb(37 99 235 / 0.04)" }}
      >
        <h3
          className="mb-2 text-sm font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          সারসংক্ষেপ
        </h3>
        <div
          className="space-y-1 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <p>
            📄 প্রশ্ন সংখ্যা: <strong>{questionCount}</strong>
          </p>
          <p>
            ⏱ সময়: <strong>{duration} মিনিট</strong>
          </p>
          <p>
            📚 বিষয়:{" "}
            <strong>
              {selectedSubjects.length > 0
                ? selectedSubjects.length + "টি নির্বাচিত"
                : "সব বিষয়"}
            </strong>
          </p>
        </div>
      </div>

      {/* Start Button */}
      <button
        className="btn-primary w-full py-3.5 text-base"
        onClick={startExam}
      >
        পরীক্ষা শুরু করুন 🚀
      </button>
    </div>
  );
}
