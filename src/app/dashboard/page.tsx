"use client";

import { useAuth } from "@/components/AuthProvider";
import {
  scheduledExams as staticScheduledExams,
  subjects as staticSubjects,
} from "@/data/questionBank";
import { apiGetLiveExams, apiGetSubjects } from "@/lib/api";
import { cacheSubjects, getCachedSubjects } from "@/lib/offline";
import { useUserStore } from "@/store";
import type { Subject } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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
  const { isAuthenticated, loading: authLoading } = useAuth();
  const {
    user,
    isOnboarded,
    totalExamsTaken,
    totalQuestionsAttempted,
    totalCorrectAnswers,
  } = useUserStore();
  const router = useRouter();

  const [subjects, setSubjects] = useState<Subject[]>(staticSubjects);
  const [liveExams, setLiveExams] = useState<LiveExamItem[]>(
    staticScheduledExams as unknown as LiveExamItem[],
  );
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (!isOnboarded || !user) {
      router.replace("/onboarding");
    }
  }, [isOnboarded, user, router, isAuthenticated, authLoading]);

  const fetchData = useCallback(async () => {
    try {
      const [apiSubjects, apiLive] = await Promise.allSettled([
        apiGetSubjects(),
        apiGetLiveExams(),
      ]);
      if (apiSubjects.status === "fulfilled") {
        const subs = (apiSubjects.value as any).subjects || apiSubjects.value;
        if (Array.isArray(subs) && subs.length > 0) {
          setSubjects(subs);
          cacheSubjects(subs).catch(() => {});
        }
      } else {
        // Try IndexedDB cache
        const cached = await getCachedSubjects();
        if (cached && cached.length > 0) setSubjects(cached);
      }
      if (apiLive.status === "fulfilled") {
        const exams = (apiLive.value as any).exams || apiLive.value;
        if (Array.isArray(exams)) setLiveExams(exams);
      }
    } catch {
      // Fallback: use static data (already set as default)
      const cached = await getCachedSubjects().catch(() => null);
      if (cached && cached.length > 0) setSubjects(cached);
    }
    setDataLoaded(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated && isOnboarded) {
      fetchData();
    }
  }, [isAuthenticated, isOnboarded, fetchData]);

  if (!user) return null;

  const upcomingLive = liveExams
    .filter((e) => new Date(e.scheduledAt) > new Date())
    .slice(0, 2);
  const topSubjects = subjects.slice(0, 4);
  const overallAccuracy =
    totalQuestionsAttempted > 0
      ? Math.round((totalCorrectAnswers / totalQuestionsAttempted) * 100)
      : 0;

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

      {/* Stats Summary */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="card flex flex-col items-center p-3">
          <span
            className="text-lg font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            {totalExamsTaken}
          </span>
          <span
            className="text-[10px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            পরীক্ষা দিয়েছো
          </span>
        </div>
        <div className="card flex flex-col items-center p-3">
          <span
            className="text-lg font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            {totalQuestionsAttempted}
          </span>
          <span
            className="text-[10px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            প্রশ্ন সমাধান
          </span>
        </div>
        <div className="card flex flex-col items-center p-3">
          <span
            className="text-lg font-bold"
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
                  <span
                    className="badge"
                    style={{
                      backgroundColor: "rgb(37 99 235 / 0.08)",
                      color: "var(--color-primary)",
                    }}
                  >
                    আসছে
                  </span>
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

      {/* Subject List */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2
            className="text-sm font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            বিষয় সমূহ
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
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {subject.nameBn}
                </span>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {subject.totalTopics} টপিক
                </p>
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

      {/* AI Tip */}
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
              {totalExamsTaken === 0
                ? "আজকে তোমার প্রথম প্র্যাকটিস শুরু করো! প্রতিদিন কমপক্ষে ৩০ মিনিট অনুশীলন করলে দ্রুত উন্নতি হবে।"
                : overallAccuracy < 50
                  ? `তোমার সার্বিক নির্ভুলতা ${overallAccuracy}%। মৌলিক ধারণাগুলো আবার পড়ো এবং সহজ প্রশ্ন দিয়ে শুরু করো।`
                  : overallAccuracy < 70
                    ? `তোমার নির্ভুলতা ${overallAccuracy}%। ভালো চলছে! দুর্বল টপিকগুলোতে আরো বেশি প্র্যাকটিস করো।`
                    : `তোমার নির্ভুলতা ${overallAccuracy}%! দুর্দান্ত! কঠিন প্রশ্ন সলভ করে নিজেকে আরো এগিয়ে নাও।`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
