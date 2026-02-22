"use client";

import { questionBank } from "@/data/questionBank";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

interface ResultData {
  answers: Record<number, number>;
  totalQuestions: number;
  timeTaken: number;
  totalTime: number;
}

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showExplanations, setShowExplanations] = useState(false);
  const [expandedQ, setExpandedQ] = useState<number | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  const resultData: ResultData | null = useMemo(() => {
    const raw = searchParams.get("data");
    if (!raw) return null;
    try {
      return JSON.parse(decodeURIComponent(raw));
    } catch {
      return null;
    }
  }, [searchParams]);

  const questions = questionBank;

  const stats = useMemo(() => {
    if (!resultData)
      return { correct: 0, wrong: 0, skipped: 0, score: 0, percentage: 0 };
    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    questions.forEach((_q, idx) => {
      const answer = resultData.answers[idx];
      if (answer === undefined || answer === -1) {
        skipped++;
      } else if (answer === questions[idx].correctIndex) {
        correct++;
      } else {
        wrong++;
      }
    });

    const score = correct * 1 - wrong * 0.25;
    const percentage = Math.round((correct / questions.length) * 100);
    return { correct, wrong, skipped, score: Math.max(0, score), percentage };
  }, [resultData, questions]);

  // Animate score
  useEffect(() => {
    if (!stats.percentage) return;
    let current = 0;
    const step = stats.percentage / 40;
    const timer = setInterval(() => {
      current += step;
      if (current >= stats.percentage) {
        setAnimatedScore(stats.percentage);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, 25);
    return () => clearInterval(timer);
  }, [stats.percentage]);

  const getGrade = (pct: number) => {
    if (pct >= 90) return { label: "অসাধারণ!", emoji: "🏆", color: "#22c55e" };
    if (pct >= 75) return { label: "চমৎকার!", emoji: "🌟", color: "#2563eb" };
    if (pct >= 60) return { label: "ভালো!", emoji: "👍", color: "#eab308" };
    if (pct >= 40)
      return { label: "আরও চেষ্টা করুন", emoji: "📚", color: "#f97316" };
    return { label: "আরও প্র্যাক্টিস দরকার", emoji: "💪", color: "#ef4444" };
  };

  const grade = getGrade(stats.percentage);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!resultData) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <p
            className="text-lg font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            ফলাফল পাওয়া যায়নি
          </p>
          <button
            className="btn-primary mt-4 px-6 py-2"
            onClick={() => router.push("/dashboard")}
          >
            ড্যাশবোর্ডে ফিরুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-24 safe-top">
      {/* Score Circle */}
      <div className="mb-6 flex flex-col items-center">
        <div className="relative flex h-36 w-36 items-center justify-center">
          <svg className="absolute inset-0" viewBox="0 0 144 144">
            <circle
              cx="72"
              cy="72"
              r="64"
              fill="none"
              stroke="var(--color-surface-alt)"
              strokeWidth="8"
            />
            <circle
              cx="72"
              cy="72"
              r="64"
              fill="none"
              stroke={grade.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${animatedScore * 4.02} 402`}
              transform="rotate(-90 72 72)"
              style={{ transition: "stroke-dasharray 0.3s ease" }}
            />
          </svg>
          <div className="text-center">
            <span
              className="text-3xl font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {animatedScore}%
            </span>
          </div>
        </div>
        <span className="mt-3 text-2xl">{grade.emoji}</span>
        <p
          className="mt-1 text-base font-semibold"
          style={{ color: grade.color }}
        >
          {grade.label}
        </p>
        <p
          className="mt-1 text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          মোট স্কোর: {stats.score.toFixed(2)} / {questions.length}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="card flex flex-col items-center p-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: "rgb(34 197 94 / 0.1)" }}
          >
            <span className="text-sm">✓</span>
          </div>
          <span
            className="mt-1.5 text-lg font-bold"
            style={{ color: "#22c55e" }}
          >
            {stats.correct}
          </span>
          <span
            className="text-[10px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            সঠিক
          </span>
        </div>
        <div className="card flex flex-col items-center p-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: "rgb(239 68 68 / 0.1)" }}
          >
            <span className="text-sm">✗</span>
          </div>
          <span
            className="mt-1.5 text-lg font-bold"
            style={{ color: "#ef4444" }}
          >
            {stats.wrong}
          </span>
          <span
            className="text-[10px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            ভুল
          </span>
        </div>
        <div className="card flex flex-col items-center p-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: "rgb(234 179 8 / 0.1)" }}
          >
            <span className="text-sm">—</span>
          </div>
          <span
            className="mt-1.5 text-lg font-bold"
            style={{ color: "#eab308" }}
          >
            {stats.skipped}
          </span>
          <span
            className="text-[10px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            এড়িয়ে গেছে
          </span>
        </div>
      </div>

      {/* Time & Negative */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="card flex items-center gap-3 p-3">
          <span className="text-xl">⏱</span>
          <div>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              সময় নেওয়া
            </p>
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {formatTime(resultData.timeTaken || 0)}
            </p>
          </div>
        </div>
        <div className="card flex items-center gap-3 p-3">
          <span className="text-xl">⚖️</span>
          <div>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              নেগেটিভ মার্ক
            </p>
            <p className="text-sm font-semibold" style={{ color: "#ef4444" }}>
              −{(stats.wrong * 0.25).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Review Answers Toggle */}
      <button
        className="card mb-4 flex w-full items-center justify-between p-4"
        onClick={() => setShowExplanations(!showExplanations)}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">📝</span>
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            উত্তর পর্যালোচনা করুন
          </span>
        </div>
        <svg
          className="h-5 w-5 transition-transform"
          style={{
            color: "var(--color-text-muted)",
            transform: showExplanations ? "rotate(180deg)" : "rotate(0deg)",
          }}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {/* Answer Review */}
      {showExplanations && (
        <div className="mb-6 space-y-3">
          {questions.map((q, idx) => {
            const userAns = resultData.answers[idx];
            const isCorrect = userAns === q.correctIndex;
            const isSkipped = userAns === undefined || userAns === -1;
            const isExpanded = expandedQ === idx;

            const labels = ["ক", "খ", "গ", "ঘ"];

            return (
              <div
                key={idx}
                className="card overflow-hidden"
                style={{
                  borderLeft: `3px solid ${isSkipped ? "#eab308" : isCorrect ? "#22c55e" : "#ef4444"}`,
                }}
              >
                <button
                  className="flex w-full items-start gap-2 p-3 text-left"
                  onClick={() => setExpandedQ(isExpanded ? null : idx)}
                >
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white"
                    style={{
                      backgroundColor: isSkipped
                        ? "#eab308"
                        : isCorrect
                          ? "#22c55e"
                          : "#ef4444",
                    }}
                  >
                    {idx + 1}
                  </span>
                  <p
                    className="flex-1 text-xs leading-relaxed"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {q.text}
                  </p>
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 transition-transform"
                    style={{
                      color: "var(--color-text-muted)",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>

                {isExpanded && (
                  <div
                    className="border-t px-3 pb-3 pt-2"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <div className="space-y-1.5">
                      {q.options.map((opt, oi) => {
                        const isUserChoice = userAns === oi;
                        const isCorrectOpt = q.correctIndex === oi;
                        let bgColor = "transparent";
                        let textColor = "var(--color-text-secondary)";

                        if (isCorrectOpt) {
                          bgColor = "rgb(34 197 94 / 0.08)";
                          textColor = "#22c55e";
                        } else if (isUserChoice && !isCorrect) {
                          bgColor = "rgb(239 68 68 / 0.08)";
                          textColor = "#ef4444";
                        }

                        return (
                          <div
                            key={oi}
                            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs"
                            style={{
                              backgroundColor: bgColor,
                              color: textColor,
                            }}
                          >
                            <span className="font-semibold">{labels[oi]}.</span>
                            <span>{opt}</span>
                            {isCorrectOpt && (
                              <span className="ml-auto text-xs">✓</span>
                            )}
                            {isUserChoice && !isCorrect && (
                              <span className="ml-auto text-xs">✗</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {q.explanation && (
                      <div
                        className="mt-2 rounded-lg p-2.5"
                        style={{ backgroundColor: "rgb(37 99 235 / 0.04)" }}
                      >
                        <p
                          className="text-[10px] font-semibold"
                          style={{ color: "var(--color-primary)" }}
                        >
                          ব্যাখ্যা:
                        </p>
                        <p
                          className="mt-0.5 text-xs leading-relaxed"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Action Buttons */}
      <div
        className="fixed bottom-0 left-0 right-0 border-t p-4 safe-bottom"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto flex max-w-lg gap-3">
          <button
            className="btn-secondary flex-1 py-3 text-sm"
            onClick={() => router.push("/dashboard")}
          >
            ড্যাশবোর্ড
          </button>
          <button
            className="btn-primary flex-1 py-3 text-sm"
            onClick={() => router.push("/exam/practice")}
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div
              className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
              style={{
                borderColor: "var(--color-primary)",
                borderTopColor: "transparent",
              }}
            />
            <p
              className="mt-3 text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              ফলাফল লোড হচ্ছে...
            </p>
          </div>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
