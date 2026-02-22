"use client";

import { questionBank } from "@/data/questionBank";
import { useExamStore, useUserStore } from "@/store";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

function formatTimer(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function PracticeExamContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    currentQuestionIndex,
    answers,
    markedForReview,
    remainingTime,
    isExamActive,
    showPalette,
    initExam,
    selectAnswer,
    toggleReview,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    tick,
    togglePalette,
    endExam,
    resetExam,
  } = useExamStore();
  const { user, recordExamResult, addXP, addCoins } = useUserStore();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);
  const [examQuestions, setExamQuestions] = useState(questionBank);

  // Initialize exam
  useEffect(() => {
    const subjectFilter = searchParams.get("subject");
    let filtered = questionBank;
    if (subjectFilter) {
      filtered = questionBank.filter((q) => q.subjectId === subjectFilter);
      if (filtered.length === 0) filtered = questionBank;
    }
    setExamQuestions(filtered);
    initExam(filtered.length, filtered.length * 60); // 1 minute per question
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer
  useEffect(() => {
    if (isExamActive) {
      timerRef.current = setInterval(() => tick(), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isExamActive, tick]);

  // Auto submit when time is up
  useEffect(() => {
    if (remainingTime === 0 && answers.length > 0) {
      handleSubmit();
    }
  }, [remainingTime]);

  // Anti-cheat: tab visibility
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && isExamActive) {
        // Could show warning or end exam
        console.warn("Tab switch detected during exam");
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [isExamActive]);

  // Anti-cheat: disable copy/paste
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      if (isExamActive) e.preventDefault();
    };
    const handlePaste = (e: ClipboardEvent) => {
      if (isExamActive) e.preventDefault();
    };
    const handleContextMenu = (e: MouseEvent) => {
      if (isExamActive) e.preventDefault();
    };
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [isExamActive]);

  const handleSubmit = useCallback(() => {
    endExam();
    // Calculate score
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    answers.forEach((ans, i) => {
      if (ans === null) skipped++;
      else if (ans === examQuestions[i]?.correctIndex) correct++;
      else wrong++;
    });

    // Record result in user store
    const timeTaken = examQuestions.length * 60 - (useExamStore.getState().remainingTime || 0);
    const score = Math.max(0, correct * 1 - wrong * 0.25);
    recordExamResult({
      id: `exam-${Date.now()}`,
      date: new Date().toISOString(),
      totalQuestions: examQuestions.length,
      correct,
      wrong,
      skipped,
      score,
      timeTaken,
      subjectId: searchParams.get("subject") || undefined,
    });

    // Award XP & coins
    addXP(correct * 10 + (correct === examQuestions.length ? 50 : 0));
    addCoins(Math.floor(correct * 2));

    // Navigate to result
    const resultData = encodeURIComponent(
      JSON.stringify({
        correct,
        wrong,
        skipped,
        total: examQuestions.length,
        answers,
        timeTaken,
      }),
    );
    router.push(`/result?data=${resultData}`);
  }, [answers, examQuestions, endExam, router, recordExamResult, addXP, addCoins, searchParams]);

  if (!isExamActive && answers.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-primary)]" />
      </div>
    );
  }

  const currentQuestion = examQuestions[currentQuestionIndex];
  if (!currentQuestion) return null;

  const answeredCount = answers.filter((a) => a !== null).length;
  const skippedCount = answers.filter((a) => a === null).length;
  const reviewCount = markedForReview.filter(Boolean).length;

  const optionLabels = ["ক", "খ", "গ", "ঘ"];

  return (
    <div className="flex min-h-screen flex-col select-none">
      {/* Sticky Timer Header */}
      <div
        className="sticky top-0 z-40 border-b px-4 py-2 safe-top"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-medium"
              style={{ color: "var(--color-text-muted)" }}
            >
              {currentQuestionIndex + 1}/{examQuestions.length}
            </span>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5"
            style={{
              backgroundColor:
                remainingTime < 60
                  ? "rgb(239 68 68 / 0.08)"
                  : remainingTime < 300
                    ? "rgb(245 158 11 / 0.08)"
                    : "var(--color-surface-alt)",
            }}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke={
                remainingTime < 60
                  ? "var(--color-danger)"
                  : remainingTime < 300
                    ? "var(--color-warning)"
                    : "var(--color-text-secondary)"
              }
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span
              className="text-sm font-bold tabular-nums"
              style={{
                color:
                  remainingTime < 60
                    ? "var(--color-danger)"
                    : remainingTime < 300
                      ? "var(--color-warning)"
                      : "var(--color-text-primary)",
              }}
            >
              {formatTimer(remainingTime)}
            </span>
          </div>
          <button
            onClick={togglePalette}
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: "var(--color-surface-alt)" }}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="var(--color-text-secondary)"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Question Palette Overlay */}
      {showPalette && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          onClick={togglePalette}
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgb(0 0 0 / 0.4)" }}
          />
          <div
            className="relative z-10 w-full max-w-lg rounded-t-2xl p-6"
            style={{ backgroundColor: "var(--bg-card)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3
                className="text-base font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                প্রশ্ন নেভিগেটর
              </h3>
              <button onClick={togglePalette}>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="var(--color-text-muted)"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Legend */}
            <div
              className="mb-4 flex flex-wrap gap-3 text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              <span className="flex items-center gap-1">
                <span
                  className="h-3 w-3 rounded"
                  style={{ backgroundColor: "var(--color-success)" }}
                />{" "}
                উত্তর দেওয়া ({answeredCount})
              </span>
              <span className="flex items-center gap-1">
                <span
                  className="h-3 w-3 rounded"
                  style={{ backgroundColor: "var(--color-border)" }}
                />{" "}
                বাদ দেওয়া ({skippedCount})
              </span>
              <span className="flex items-center gap-1">
                <span
                  className="h-3 w-3 rounded"
                  style={{ backgroundColor: "var(--color-warning)" }}
                />{" "}
                পরে দেখবো ({reviewCount})
              </span>
            </div>

            {/* Grid */}
            <div className="mb-4 grid grid-cols-8 gap-2">
              {examQuestions.map((_, i) => {
                const isAnswered = answers[i] !== null;
                const isReview = markedForReview[i];
                const isCurrent = i === currentQuestionIndex;
                let bg = "var(--color-surface-alt)";
                let border = "2px solid transparent";
                if (isAnswered) bg = "rgb(34 197 94 / 0.15)";
                if (isReview) bg = "rgb(245 158 11 / 0.15)";
                if (isCurrent) border = "2px solid var(--color-primary)";
                return (
                  <button
                    key={i}
                    className="flex h-9 w-full items-center justify-center rounded-lg text-xs font-semibold"
                    style={{
                      backgroundColor: bg,
                      border,
                      color: isAnswered
                        ? "var(--color-success)"
                        : "var(--color-text-primary)",
                    }}
                    onClick={() => {
                      goToQuestion(i);
                      togglePalette();
                    }}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            <button
              className="w-full rounded-lg py-3 text-sm font-semibold"
              style={{ backgroundColor: "var(--color-danger)", color: "#fff" }}
              onClick={() => {
                togglePalette();
                setShowConfirmEnd(true);
              }}
            >
              পরীক্ষা শেষ করুন
            </button>
          </div>
        </div>
      )}

      {/* Confirm End Modal */}
      {showConfirmEnd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgb(0 0 0 / 0.5)" }}
            onClick={() => setShowConfirmEnd(false)}
          />
          <div
            className="relative z-10 w-full max-w-sm rounded-2xl p-6"
            style={{ backgroundColor: "var(--bg-card)" }}
          >
            <h3
              className="mb-2 text-lg font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              পরীক্ষা শেষ করবেন?
            </h3>
            <p
              className="mb-4 text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              আপনি {answeredCount}/{examQuestions.length} প্রশ্নের উত্তর
              দিয়েছেন।{" "}
              {examQuestions.length - answeredCount > 0 &&
                `বাকি ${examQuestions.length - answeredCount}টি প্রশ্নের উত্তর দেওয়া হয়নি।`}
            </p>
            <div className="flex gap-3">
              <button
                className="btn-secondary flex-1"
                onClick={() => setShowConfirmEnd(false)}
              >
                ফিরে যান
              </button>
              <button
                className="flex-1 rounded-lg py-2.5 text-sm font-semibold"
                style={{
                  backgroundColor: "var(--color-danger)",
                  color: "#fff",
                }}
                onClick={handleSubmit}
              >
                সাবমিট করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Content */}
      <div className="flex-1 px-4 py-6">
        <div className="mx-auto max-w-lg">
          {/* Question Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="badge"
                style={{
                  backgroundColor:
                    currentQuestion.difficulty === "easy"
                      ? "rgb(34 197 94 / 0.08)"
                      : currentQuestion.difficulty === "medium"
                        ? "rgb(245 158 11 / 0.08)"
                        : "rgb(239 68 68 / 0.08)",
                  color:
                    currentQuestion.difficulty === "easy"
                      ? "var(--color-success)"
                      : currentQuestion.difficulty === "medium"
                        ? "var(--color-warning)"
                        : "var(--color-danger)",
                }}
              >
                {currentQuestion.difficulty === "easy"
                  ? "সহজ"
                  : currentQuestion.difficulty === "medium"
                    ? "মাঝারি"
                    : "কঠিন"}
              </span>
              {currentQuestion.examSource && (
                <span
                  className="badge"
                  style={{
                    backgroundColor: "var(--color-surface-alt)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {currentQuestion.examSource} {currentQuestion.year}
                </span>
              )}
            </div>
            <button
              onClick={() => toggleReview(currentQuestionIndex)}
              className="flex items-center gap-1 text-xs"
              style={{
                color: markedForReview[currentQuestionIndex]
                  ? "var(--color-warning)"
                  : "var(--color-text-muted)",
              }}
            >
              {markedForReview[currentQuestionIndex] ? "⭐" : "☆"} রিভিউ
            </button>
          </div>

          {/* Question Text */}
          <div className="mb-6">
            <p
              className="text-base font-medium leading-relaxed"
              style={{
                color: "var(--color-text-primary)",
                fontFamily: "var(--font-bengali)",
              }}
            >
              প্রশ্ন {currentQuestionIndex + 1}: {currentQuestion.text}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, i) => {
              const isSelected = answers[currentQuestionIndex] === i;
              return (
                <button
                  key={i}
                  className={`option-btn ${isSelected ? "selected" : ""}`}
                  onClick={() => selectAnswer(currentQuestionIndex, i)}
                >
                  <span
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: isSelected
                        ? "var(--color-primary)"
                        : "var(--color-surface-alt)",
                      color: isSelected
                        ? "#fff"
                        : "var(--color-text-secondary)",
                    }}
                  >
                    {optionLabels[i]}
                  </span>
                  <span
                    className="text-sm leading-relaxed"
                    style={{
                      color: "var(--color-text-primary)",
                      fontFamily: "var(--font-bengali)",
                    }}
                  >
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div
        className="sticky bottom-0 border-t px-4 py-3 safe-bottom"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <button
            className="btn-secondary flex-1"
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            style={{ opacity: currentQuestionIndex === 0 ? 0.4 : 1 }}
          >
            ← পিছনে
          </button>
          <button
            className="btn-secondary px-4"
            onClick={() => {
              if (currentQuestionIndex < examQuestions.length - 1) {
                nextQuestion();
              }
            }}
          >
            বাদ দিন
          </button>
          {currentQuestionIndex === examQuestions.length - 1 ? (
            <button
              className="flex-1 rounded-lg py-2.5 text-sm font-semibold"
              style={{ backgroundColor: "var(--color-success)", color: "#fff" }}
              onClick={() => setShowConfirmEnd(true)}
            >
              সাবমিট ✓
            </button>
          ) : (
            <button className="btn-primary flex-1" onClick={nextQuestion}>
              পরবর্তী →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PracticeExamPage() {
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
              পরীক্ষা লোড হচ্ছে...
            </p>
          </div>
        </div>
      }
    >
      <PracticeExamContent />
    </Suspense>
  );
}
