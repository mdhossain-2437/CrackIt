"use client";

import { liveExams, subjects } from "@/data/mock";
import { useUserStore } from "@/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function formatTime(date: string) {
  const d = new Date(date);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (diff < 0) return "চলছে";
  if (hours > 24) return `${Math.floor(hours / 24)} দিন পরে`;
  if (hours > 0) return `${hours} ঘণ্টা ${mins} মিনিট পরে`;
  return `${mins} মিনিট পরে`;
}

export default function DashboardPage() {
  const { user, isOnboarded } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!isOnboarded || !user) {
      router.replace("/onboarding");
    }
  }, [isOnboarded, user, router]);

  if (!user) return null;

  const upcomingLive = liveExams
    .filter((e) => e.status !== "completed")
    .slice(0, 2);
  const topSubjects = subjects.slice(0, 4);
  const overallProgress = Math.round(
    subjects.reduce((a, s) => a + s.progress, 0) / subjects.length,
  );

  return (
    <div className="px-4 pt-6 pb-4 safe-top">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p
            className="text-xs font-medium"
            style={{ color: "var(--color-text-muted)" }}
          >
            স্বাগতম 👋
          </p>
          <h1
            className="text-lg font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {user.name}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Streak */}
          <div
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5"
            style={{ backgroundColor: "rgb(245 158 11 / 0.08)" }}
          >
            <span className="text-sm">🔥</span>
            <span
              className="text-xs font-bold"
              style={{ color: "var(--color-warning)" }}
            >
              {user.streak}
            </span>
          </div>
          {/* Coins */}
          <div
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5"
            style={{ backgroundColor: "rgb(37 99 235 / 0.08)" }}
          >
            <span className="text-sm">🪙</span>
            <span
              className="text-xs font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              {user.coins}
            </span>
          </div>
          {/* XP */}
          <div
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5"
            style={{ backgroundColor: "rgb(34 197 94 / 0.08)" }}
          >
            <span className="text-sm">⭐</span>
            <span
              className="text-xs font-bold"
              style={{ color: "var(--color-success)" }}
            >
              {user.xp} XP
            </span>
          </div>
        </div>
      </div>

      {/* Overall Progress Card */}
      <div className="card mb-4 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2
            className="text-sm font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            সার্বিক প্রস্তুতি
          </h2>
          <span
            className="text-xl font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            {overallProgress}%
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <p
          className="mt-2 text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          আজকে কমপক্ষে ৩০ মিনিট প্র্যাকটিস করো!
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <Link
          href="/exam/practice"
          className="card flex flex-col items-center gap-2 p-3 transition-all active:scale-[0.97]"
        >
          <span className="text-2xl">📝</span>
          <span
            className="text-center text-xs font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            প্র্যাকটিস
          </span>
        </Link>
        <Link
          href="/exam/mock"
          className="card flex flex-col items-center gap-2 p-3 transition-all active:scale-[0.97]"
        >
          <span className="text-2xl">🎯</span>
          <span
            className="text-center text-xs font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            মক টেস্ট
          </span>
        </Link>
        <Link
          href="/live"
          className="card flex flex-col items-center gap-2 p-3 transition-all active:scale-[0.97]"
        >
          <span className="text-2xl">🔴</span>
          <span
            className="text-center text-xs font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            লাইভ পরীক্ষা
          </span>
        </Link>
      </div>

      {/* Live Exams Banner */}
      {upcomingLive.length > 0 && (
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2
              className="text-sm font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              আসন্ন লাইভ পরীক্ষা
            </h2>
            <Link
              href="/live"
              className="text-xs font-medium"
              style={{ color: "var(--color-primary)" }}
            >
              সব দেখুন →
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {upcomingLive.map((exam) => (
              <div
                key={exam.id}
                className="card min-w-[260px] flex-shrink-0 p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  {exam.status === "live" ? (
                    <span
                      className="badge"
                      style={{
                        backgroundColor: "rgb(239 68 68 / 0.08)",
                        color: "var(--color-danger)",
                      }}
                    >
                      ● LIVE
                    </span>
                  ) : (
                    <span
                      className="badge"
                      style={{
                        backgroundColor: "rgb(37 99 235 / 0.08)",
                        color: "var(--color-primary)",
                      }}
                    >
                      আসছে
                    </span>
                  )}
                  {exam.isPremium && (
                    <span
                      className="badge"
                      style={{
                        backgroundColor: "rgb(245 158 11 / 0.08)",
                        color: "var(--color-warning)",
                      }}
                    >
                      ⭐ Premium
                    </span>
                  )}
                </div>
                <h3
                  className="mb-1 text-sm font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {exam.titleBn}
                </h3>
                <div
                  className="flex items-center gap-3 text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <span>⏱ {formatTime(exam.scheduledAt)}</span>
                  <span>👥 {exam.registeredCount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subject Progress */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2
            className="text-sm font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            বিষয় ভিত্তিক প্রগতি
          </h2>
          <Link
            href="/subjects"
            className="text-xs font-medium"
            style={{ color: "var(--color-primary)" }}
          >
            সব দেখুন →
          </Link>
        </div>
        <div className="space-y-3">
          {topSubjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/subjects/${subject.id}`}
              className="card flex items-center gap-3 p-3 transition-all active:scale-[0.99]"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
                style={{ backgroundColor: "var(--color-surface-alt)" }}
              >
                {subject.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {subject.nameBn}
                  </span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {subject.progress}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${subject.progress}%` }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Daily Tip */}
      <div
        className="card p-4"
        style={{ backgroundColor: "rgb(37 99 235 / 0.04)" }}
      >
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <h3
              className="mb-1 text-sm font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              AI পরামর্শ
            </h3>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              তোমার Chemistry এ Organic Chemistry টপিকে আরো প্র্যাকটিস প্রয়োজন।
              Accuracy মাত্র ৫৫%। আজকে এই টপিক থেকে ২০টি MCQ সলভ করো!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
