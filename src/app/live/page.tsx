"use client";

import { scheduledExams as staticScheduledExams } from "@/data/questionBank";
import { apiGetLiveExams } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface LiveExamItem {
  id: string;
  title: string;
  titleBn: string;
  category: string;
  scheduledAt: string;
  duration: number;
  totalQuestions: number;
  registeredCount: number;
  status: string;
  isPremium: boolean;
}

export default function LiveExamsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"upcoming" | "live" | "past">("upcoming");
  const [allExams, setAllExams] = useState<LiveExamItem[]>(staticScheduledExams as unknown as LiveExamItem[]);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiGetLiveExams();
        const data = (res as any).exams || res;
        if (Array.isArray(data) && data.length > 0) setAllExams(data);
      } catch { /* use static fallback */ }
    })();
  }, []);

  const now = new Date();

  const categorized = {
    upcoming: allExams.filter((e) => new Date(e.scheduledAt) > now),
    live: allExams.filter(
      (e) =>
        new Date(e.scheduledAt) <= now &&
        new Date(e.scheduledAt).getTime() + e.duration * 1000 > now.getTime(),
    ),
    past: [] as LiveExamItem[],
  };

  // Show empty state when no exams match the current category
  if (categorized.upcoming.length === 0 && categorized.live.length === 0) {
    categorized.upcoming = allExams;
  }

  const tabs = [
    {
      key: "upcoming" as const,
      label: "আসন্ন",
      count: categorized.upcoming.length,
    },
    { key: "live" as const, label: "চলমান", count: categorized.live.length },
    {
      key: "past" as const,
      label: "শেষ হয়েছে",
      count: categorized.past.length,
    },
  ];

  const activeExams = categorized[tab];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const months = [
      "জানু",
      "ফেব",
      "মার্চ",
      "এপ্রিল",
      "মে",
      "জুন",
      "জুলাই",
      "আগ",
      "সেপ্ট",
      "অক্টো",
      "নভে",
      "ডিসে",
    ];
    return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  return (
    <div className="px-4 pt-6 pb-24 safe-top">
      {/* Header */}
      <div className="mb-5">
        <h1
          className="text-xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          🔴 লাইভ পরীক্ষা
        </h1>
        <p
          className="mt-0.5 text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          সবার সাথে একসাথে পরীক্ষা দিন
        </p>
      </div>

      {/* Tabs */}
      <div
        className="mb-5 flex gap-2 rounded-xl p-1"
        style={{ backgroundColor: "var(--color-surface-alt)" }}
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-xs font-medium transition-all"
            style={{
              backgroundColor:
                tab === t.key ? "var(--color-surface)" : "transparent",
              color:
                tab === t.key
                  ? "var(--color-primary)"
                  : "var(--color-text-muted)",
              boxShadow: tab === t.key ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            {t.count > 0 && (
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
                style={{
                  backgroundColor:
                    tab === t.key
                      ? "var(--color-primary)"
                      : "var(--color-text-muted)",
                }}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Exam Cards */}
      {activeExams.length === 0 ? (
        <div className="flex flex-col items-center py-16">
          <span className="text-4xl">📭</span>
          <p
            className="mt-3 text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            এই বিভাগে কোনো পরীক্ষা নেই
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeExams.map((exam) => (
            <div key={exam.id} className="card overflow-hidden">
              {/* Exam Header */}
              <div className="flex items-start gap-3 p-4">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
                  style={{ backgroundColor: "rgb(37 99 235 / 0.06)" }}
                >
                  📋
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className="text-sm font-semibold leading-snug"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {exam.title}
                    </h3>
                    {tab === "live" && (
                      <span
                        className="badge shrink-0 text-[9px]"
                        style={{
                          backgroundColor: "rgb(239 68 68 / 0.1)",
                          color: "#ef4444",
                        }}
                      >
                        🔴 LIVE
                      </span>
                    )}
                  </div>
                  <p
                    className="mt-0.5 text-[10px]"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {exam.category.toUpperCase()} |{" "}
                    {exam.isPremium ? "প্রিমিয়াম" : "ফ্রি"}
                  </p>
                </div>
              </div>

              {/* Exam Details */}
              <div
                className="border-t px-4 py-3"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span>📅</span>
                    <span style={{ color: "var(--color-text-muted)" }}>
                      {formatDate(exam.scheduledAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>⏰</span>
                    <span style={{ color: "var(--color-text-muted)" }}>
                      {formatTime(exam.scheduledAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>📄</span>
                    <span style={{ color: "var(--color-text-muted)" }}>
                      {exam.totalQuestions} প্রশ্ন
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>⏱</span>
                    <span style={{ color: "var(--color-text-muted)" }}>
                      {Math.floor(exam.duration / 60)} মিনিট
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>👥</span>
                    <span style={{ color: "var(--color-text-muted)" }}>
                      {exam.registeredCount} জন নিবন্ধিত
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>💰</span>
                    <span style={{ color: "var(--color-text-muted)" }}>
                      {exam.isPremium ? "প্রিমিয়াম" : "ফ্রি"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div
                className="border-t px-4 py-3"
                style={{ borderColor: "var(--color-border)" }}
              >
                {tab === "live" ? (
                  <button
                    className="btn-primary w-full py-2.5 text-sm"
                    onClick={() => router.push("/exam/practice")}
                  >
                    এখনই যোগ দিন 🔴
                  </button>
                ) : tab === "upcoming" ? (
                  <button className="btn-secondary w-full py-2.5 text-sm">
                    নিবন্ধন করুন ✅
                  </button>
                ) : (
                  <button
                    className="w-full rounded-xl py-2.5 text-sm font-medium"
                    style={{
                      backgroundColor: "var(--color-surface-alt)",
                      color: "var(--color-text-secondary)",
                    }}
                    onClick={() => router.push("/result")}
                  >
                    ফলাফল দেখুন 📊
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
