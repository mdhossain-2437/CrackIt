"use client";

import { leaderboardData } from "@/data/mock";
import { useState } from "react";

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState<
    "weekly" | "monthly" | "allTime"
  >("weekly");

  const filters = [
    { key: "weekly" as const, label: "সাপ্তাহিক" },
    { key: "monthly" as const, label: "মাসিক" },
    { key: "allTime" as const, label: "সর্বকালের" },
  ];

  const leaderboard = leaderboardData;
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  const medalColors: Record<number, string> = {
    0: "#FFD700",
    1: "#C0C0C0",
    2: "#CD7F32",
  };

  return (
    <div className="px-4 pt-6 pb-24 safe-top">
      {/* Header */}
      <div className="mb-5">
        <h1
          className="text-xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          🏆 লিডারবোর্ড
        </h1>
        <p
          className="mt-0.5 text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          সেরা পরীক্ষার্থীদের র‍্যাংকিং
        </p>
      </div>

      {/* Time Filters */}
      <div
        className="mb-5 flex gap-2 rounded-xl p-1"
        style={{ backgroundColor: "var(--color-surface-alt)" }}
      >
        {filters.map((f) => (
          <button
            key={f.key}
            className="flex-1 rounded-lg py-2 text-xs font-medium transition-all"
            style={{
              backgroundColor:
                timeFilter === f.key ? "var(--color-surface)" : "transparent",
              color:
                timeFilter === f.key
                  ? "var(--color-primary)"
                  : "var(--color-text-muted)",
              boxShadow:
                timeFilter === f.key ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}
            onClick={() => setTimeFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Your Rank Card */}
      <div
        className="card mb-5 flex items-center gap-3 p-3"
        style={{
          border: "1.5px solid var(--color-primary)",
          backgroundColor: "rgb(37 99 235 / 0.03)",
        }}
      >
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
          style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
        >
          42
        </div>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-lg"
          style={{ backgroundColor: "var(--color-surface-alt)" }}
        >
          🧑‍💻
        </div>
        <div className="flex-1">
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            আপনি
          </p>
          <p
            className="text-[10px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            মোট পয়েন্ট: ২,৪৫০
          </p>
        </div>
        <div className="text-right">
          <p
            className="text-xs font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            ২,৪৫০ XP
          </p>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div
        className="mb-6 flex items-end justify-center gap-2"
        style={{ minHeight: 160 }}
      >
        {[1, 0, 2].map((idx) => {
          const entry = top3[idx];
          if (!entry) return null;
          const isFirst = idx === 0;
          const heights = { 0: "h-32", 1: "h-24", 2: "h-20" };
          const ranks = ["🥇", "🥈", "🥉"];

          return (
            <div
              key={entry.userId}
              className="flex flex-col items-center"
              style={{ flex: 1, maxWidth: isFirst ? 120 : 100 }}
            >
              <div className="relative mb-2">
                <div
                  className="flex items-center justify-center rounded-full text-xl"
                  style={{
                    width: isFirst ? 56 : 44,
                    height: isFirst ? 56 : 44,
                    backgroundColor: "var(--color-surface-alt)",
                    border: `2px solid ${medalColors[idx]}`,
                  }}
                >
                  🧑‍🎓
                </div>
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-lg">
                  {ranks[idx]}
                </span>
              </div>
              <p
                className="mb-1 text-center text-[10px] font-semibold leading-tight"
                style={{ color: "var(--color-text-primary)" }}
              >
                {entry.name}
              </p>
              <p
                className="mb-1 text-[9px]"
                style={{ color: "var(--color-text-muted)" }}
              >
                {entry.score} পয়েন্ট
              </p>
              <div
                className={`w-full rounded-t-lg ${heights[idx as keyof typeof heights]}`}
                style={{
                  backgroundColor: medalColors[idx] + "20",
                  borderTop: `3px solid ${medalColors[idx]}`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Rest of Rankings */}
      <div className="space-y-2">
        {rest.map((entry, idx) => (
          <div key={entry.userId} className="card flex items-center gap-3 p-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
              style={{
                backgroundColor: "var(--color-surface-alt)",
                color: "var(--color-text-secondary)",
              }}
            >
              {idx + 4}
            </div>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-base"
              style={{ backgroundColor: "var(--color-surface-alt)" }}
            >
              🧑‍🎓
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="truncate text-sm font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                {entry.name}
              </p>
              <p
                className="text-[10px]"
                style={{ color: "var(--color-text-muted)" }}
              >
                {entry.college || "—"}
              </p>
            </div>
            <div className="text-right">
              <p
                className="text-xs font-bold"
                style={{ color: "var(--color-primary)" }}
              >
                {entry.score} পয়েন্ট
              </p>
              <p
                className="text-[9px]"
                style={{ color: "var(--color-text-muted)" }}
              >
                সময়: {Math.floor(entry.timeTaken / 60)}m
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
