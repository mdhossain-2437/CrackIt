"use client";

import { apiGetExamHistory, apiGetLeaderboard } from "@/lib/api";
import { useUserStore } from "@/store";
import { useEffect, useState } from "react";

interface LeaderEntry {
  rank: number;
  name: string;
  totalScore: number;
  totalExams: number;
  avgAccuracy: number;
  isCurrentUser: boolean;
}

export default function LeaderboardPage() {
  const {
    examHistory,
    totalExamsTaken,
    totalQuestionsAttempted,
    totalCorrectAnswers,
    user,
  } = useUserStore();
  const [tab, setTab] = useState<"history" | "stats" | "ranking">("history");
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([]);

  useEffect(() => {
    // Fetch leaderboard from API
    apiGetLeaderboard().then((res) => {
      const data = (res as any).leaderboard || res;
      if (Array.isArray(data)) setLeaderboard(data);
    }).catch(() => {});
    // Optionally sync exam history from API
    apiGetExamHistory().catch(() => {});
  }, []);

  const overallAccuracy =
    totalQuestionsAttempted > 0
      ? Math.round((totalCorrectAnswers / totalQuestionsAttempted) * 100)
      : 0;

  const recentExams = [...examHistory].reverse().slice(0, 20);

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
    return `${d.getDate()} ${months[d.getMonth()]}`;
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="px-4 pt-6 pb-24 safe-top">
      {/* Header */}
      <div className="mb-5">
        <h1
          className="text-xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          🏆 পারফরম্যান্স
        </h1>
        <p
          className="mt-0.5 text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          তোমার প্রস্তুতির বিস্তারিত বিশ্লেষণ
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        <div className="card flex flex-col items-center p-3">
          <span
            className="text-xl font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            {totalExamsTaken}
          </span>
          <span
            className="text-[10px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            পরীক্ষা
          </span>
        </div>
        <div className="card flex flex-col items-center p-3">
          <span
            className="text-xl font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            {totalQuestionsAttempted}
          </span>
          <span
            className="text-[10px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            প্রশ্ন
          </span>
        </div>
        <div className="card flex flex-col items-center p-3">
          <span
            className="text-xl font-bold"
            style={{
              color:
                overallAccuracy >= 70
                  ? "var(--color-success)"
                  : overallAccuracy >= 50
                    ? "var(--color-warning)"
                    : "var(--color-text-primary)",
            }}
          >
            {overallAccuracy}%
          </span>
          <span
            className="text-[10px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            নির্ভুলতা
          </span>
        </div>
      </div>

      {/* XP & Level Card */}
      <div
        className="card mb-5 flex items-center gap-3 p-3"
        style={{
          border: "1.5px solid var(--color-primary)",
          backgroundColor: "rgb(37 99 235 / 0.03)",
        }}
      >
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
          style={{ backgroundColor: "var(--color-surface-alt)" }}
        >
          🧑‍🎓
        </div>
        <div className="flex-1">
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {user?.name || "ব্যবহারকারী"}
          </p>
          <p
            className="text-[10px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            লেভেল {Math.floor((user?.xp || 0) / 500) + 1} • {user?.xp || 0} XP
          </p>
        </div>
        <div className="text-right">
          <p
            className="text-xs font-bold"
            style={{ color: "var(--color-warning)" }}
          >
            🔥 {user?.streak || 0}
          </p>
          <p
            className="text-[9px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            দিন স্ট্রিক
          </p>
        </div>
      </div>

      {/* Tab */}
      <div
        className="mb-5 flex gap-2 rounded-xl p-1"
        style={{ backgroundColor: "var(--color-surface-alt)" }}
      >
        {[
          { key: "history" as const, label: "পরীক্ষার ইতিহাস" },
          { key: "stats" as const, label: "বিশ্লেষণ" },
          { key: "ranking" as const, label: "র‍্যাংকিং" },
        ].map((t) => (
          <button
            key={t.key}
            className="flex-1 rounded-lg py-2 text-xs font-medium transition-all"
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
          </button>
        ))}
      </div>

      {tab === "history" ? (
        recentExams.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <span className="text-4xl">📭</span>
            <p
              className="mt-3 text-sm font-medium"
              style={{ color: "var(--color-text-muted)" }}
            >
              এখনো কোনো পরীক্ষা দেওয়া হয়নি
            </p>
            <p
              className="mt-1 text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              প্র্যাকটিস বা মক টেস্ট দিয়ে তোমার ফলাফল এখানে দেখো
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentExams.map((entry) => {
              const percentage =
                entry.totalQuestions > 0
                  ? Math.round((entry.correct / entry.totalQuestions) * 100)
                  : 0;
              return (
                <div
                  key={entry.id}
                  className="card flex items-center gap-3 p-3"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold"
                    style={{
                      backgroundColor:
                        percentage >= 70
                          ? "rgb(34 197 94 / 0.1)"
                          : percentage >= 50
                            ? "rgb(245 158 11 / 0.1)"
                            : "rgb(239 68 68 / 0.1)",
                      color:
                        percentage >= 70
                          ? "#22c55e"
                          : percentage >= 50
                            ? "#eab308"
                            : "#ef4444",
                    }}
                  >
                    {percentage}%
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {entry.correct}/{entry.totalQuestions} সঠিক
                    </p>
                    <p
                      className="text-[10px]"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {formatDate(entry.date)} • ⏱ {formatTime(entry.timeTaken)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-xs font-semibold"
                      style={{ color: "var(--color-primary)" }}
                    >
                      +{entry.score.toFixed(1)}
                    </p>
                    <p
                      className="text-[9px]"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      স্কোর
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="space-y-4">
          {/* Accuracy Breakdown */}
          <div className="card p-4">
            <h3
              className="mb-3 text-sm font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              📊 উত্তরের বিশ্লেষণ
            </h3>
            {totalQuestionsAttempted > 0 ? (
              <div className="space-y-3">
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span style={{ color: "#22c55e" }}>✓ সঠিক</span>
                    <span style={{ color: "var(--color-text-muted)" }}>
                      {totalCorrectAnswers} ({overallAccuracy}%)
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      style={{
                        width: `${overallAccuracy}%`,
                        height: "100%",
                        backgroundColor: "#22c55e",
                        borderRadius: "inherit",
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span style={{ color: "#ef4444" }}>✗ ভুল</span>
                    <span style={{ color: "var(--color-text-muted)" }}>
                      {totalQuestionsAttempted - totalCorrectAnswers} (
                      {100 - overallAccuracy}%)
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      style={{
                        width: `${100 - overallAccuracy}%`,
                        height: "100%",
                        backgroundColor: "#ef4444",
                        borderRadius: "inherit",
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p
                className="text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                পরীক্ষা দিলে বিশ্লেষণ দেখতে পাবে
              </p>
            )}
          </div>

          {/* Performance Trend */}
          <div className="card p-4">
            <h3
              className="mb-3 text-sm font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              📈 পারফরম্যান্স ট্রেন্ড
            </h3>
            {examHistory.length >= 2 ? (
              <div
                className="flex items-end justify-between gap-1"
                style={{ height: 80 }}
              >
                {examHistory.slice(-10).map((entry, i) => {
                  const pct =
                    entry.totalQuestions > 0
                      ? (entry.correct / entry.totalQuestions) * 100
                      : 0;
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-t"
                      style={{
                        height: `${Math.max(4, pct)}%`,
                        backgroundColor:
                          pct >= 70
                            ? "#22c55e"
                            : pct >= 50
                              ? "#eab308"
                              : "#ef4444",
                        opacity: 0.7,
                      }}
                      title={`${Math.round(pct)}%`}
                    />
                  );
                })}
              </div>
            ) : (
              <p
                className="text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                কমপক্ষে ২টি পরীক্ষা দিলে ট্রেন্ড দেখতে পাবে
              </p>
            )}
          </div>
        </div>
      )}

      {/* Ranking Tab */}
      {tab === "ranking" && (
        <div className="space-y-3">
          {leaderboard.length === 0 ? (
            <div className="card flex flex-col items-center gap-3 p-8">
              <span className="text-3xl">🏅</span>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                র‍্যাংকিং লোড হচ্ছে বা এখনো কোনো ডেটা নেই
              </p>
            </div>
          ) : (
            leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className="card flex items-center gap-3 p-3"
                style={{
                  border: entry.isCurrentUser ? "1.5px solid var(--color-primary)" : undefined,
                  backgroundColor: entry.isCurrentUser ? "rgb(37 99 235 / 0.03)" : undefined,
                }}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    backgroundColor:
                      entry.rank === 1
                        ? "rgb(245 158 11 / 0.15)"
                        : entry.rank === 2
                          ? "rgb(156 163 175 / 0.15)"
                          : entry.rank === 3
                            ? "rgb(180 83 9 / 0.15)"
                            : "var(--color-surface-alt)",
                    color:
                      entry.rank === 1
                        ? "#f59e0b"
                        : entry.rank === 2
                          ? "#6b7280"
                          : entry.rank === 3
                            ? "#b45309"
                            : "var(--color-text-secondary)",
                  }}
                >
                  {entry.rank <= 3 ? ["🥇", "🥈", "🥉"][entry.rank - 1] : `#${entry.rank}`}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {entry.name} {entry.isCurrentUser && "(তুমি)"}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                    {entry.totalExams} পরীক্ষা • {entry.avgAccuracy}% নির্ভুলতা
                  </p>
                </div>
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {entry.totalScore}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
