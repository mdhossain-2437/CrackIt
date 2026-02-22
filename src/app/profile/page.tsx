"use client";

import { useSettingsStore, useUserStore } from "@/store";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const totalExamsTaken = useUserStore((s) => s.totalExamsTaken);
  const totalQuestionsAttempted = useUserStore((s) => s.totalQuestionsAttempted);
  const totalCorrectAnswers = useUserStore((s) => s.totalCorrectAnswers);
  const settings = useSettingsStore((s) => s.settings);
  const updateTheme = useSettingsStore((s) => s.updateTheme);
  const setLanguage = useSettingsStore((s) => s.setLanguage);
  const toggleNotifications = useSettingsStore((s) => s.toggleNotifications);
  const [showLogout, setShowLogout] = useState(false);

  const themeOptions = [
    { key: "light" as const, label: "লাইট", icon: "☀️" },
    { key: "dark" as const, label: "ডার্ক", icon: "🌙" },
    { key: "system" as const, label: "সিস্টেম", icon: "💻" },
  ];

  const statsItems = [
    { label: "স্ট্রিক", value: `${user?.streak || 0} দিন`, icon: "🔥" },
    { label: "ব্যাজ", value: user?.badges?.length || 0, icon: "🏅" },
    { label: "XP পয়েন্ট", value: user?.xp || 0, icon: "⭐" },
    { label: "কয়েন", value: user?.coins || 0, icon: "🪙" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="px-4 pt-6 pb-24 safe-top">
      {/* Profile Header */}
      <div className="mb-6 flex items-center gap-4">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
          style={{ backgroundColor: "var(--color-surface-alt)" }}
        >
          🧑‍🎓
        </div>
        <div className="flex-1">
          <h1
            className="text-lg font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {user?.name || "ব্যবহারকারী"}
          </h1>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {user?.examCategory || "BCS"} পরীক্ষার্থী
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs" style={{ color: "var(--color-primary)" }}>
              🔥 {user?.streak || 0} দিন স্ট্রিক
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        {statsItems.map((item) => (
          <div key={item.label} className="card flex items-center gap-3 p-3">
            <span className="text-xl">{item.icon}</span>
            <div>
              <p
                className="text-lg font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {item.value}
              </p>
              <p
                className="text-[10px]"
                style={{ color: "var(--color-text-muted)" }}
              >
                {item.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Streak & Level Card */}
      <div className="card mb-6 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            লেভেল প্রগ্রেস
          </h3>
          <span
            className="badge text-[10px]"
            style={{
              backgroundColor: "rgb(37 99 235 / 0.08)",
              color: "var(--color-primary)",
            }}
          >
            লেভেল {Math.floor((user?.xp || 0) / 500) + 1}
          </span>
        </div>
        <div className="progress-bar mb-1">
          <div
            style={{
              width: `${((user?.xp || 0) % 500) / 5}%`,
              height: "100%",
              backgroundColor: "var(--color-primary)",
              borderRadius: "inherit",
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <p
          className="text-[10px] text-right"
          style={{ color: "var(--color-text-muted)" }}
        >
          {(user?.xp || 0) % 500} / 500 XP
        </p>
      </div>

      {/* Badges */}
      <div className="card mb-6 p-4">
        <h3
          className="mb-3 text-sm font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          🏅 অর্জিত ব্যাজ
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {[
            { icon: "🌟", name: "প্রথম পরীক্ষা", earned: totalExamsTaken >= 1 },
            { icon: "🔥", name: "৭ দিন স্ট্রিক", earned: (user?.streak || 0) >= 7 },
            { icon: "🎯", name: "৮০%+ নির্ভুল", earned: totalQuestionsAttempted > 0 && (totalCorrectAnswers / totalQuestionsAttempted) * 100 >= 80 },
            { icon: "📚", name: "১০০ প্রশ্ন", earned: totalQuestionsAttempted >= 100 },
            { icon: "🏆", name: "৫০ পরীক্ষা", earned: totalExamsTaken >= 50 },
          ].map((badge) => (
            <div
              key={badge.name}
              className="flex shrink-0 flex-col items-center gap-1"
              style={{ opacity: badge.earned ? 1 : 0.35, minWidth: 64 }}
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-xl"
                style={{ backgroundColor: "var(--color-surface-alt)" }}
              >
                {badge.icon}
              </div>
              <span
                className="text-center text-[9px]"
                style={{ color: "var(--color-text-muted)" }}
              >
                {badge.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Section */}
      <div className="mb-6">
        <h3
          className="mb-3 text-sm font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          ⚙️ সেটিংস
        </h3>

        {/* Theme */}
        <div className="card mb-3 p-4">
          <p
            className="mb-2.5 text-xs font-medium"
            style={{ color: "var(--color-text-secondary)" }}
          >
            থিম
          </p>
          <div className="flex gap-2">
            {themeOptions.map((opt) => (
              <button
                key={opt.key}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-medium transition-all"
                style={{
                  backgroundColor:
                    settings.theme === opt.key
                      ? "var(--color-primary)"
                      : "var(--color-surface-alt)",
                  color:
                    settings.theme === opt.key
                      ? "#fff"
                      : "var(--color-text-secondary)",
                }}
                onClick={() => updateTheme(opt.key)}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="card mb-3 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-xs font-medium"
                style={{ color: "var(--color-text-secondary)" }}
              >
                ভাষা
              </p>
              <p
                className="mt-0.5 text-[10px]"
                style={{ color: "var(--color-text-muted)" }}
              >
                অ্যাপের ভাষা পরিবর্তন করুন
              </p>
            </div>
            <div className="flex gap-1.5">
              {[
                { key: "bn" as const, label: "বাংলা" },
                { key: "en" as const, label: "EN" },
              ].map((lang) => (
                <button
                  key={lang.key}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
                  style={{
                    backgroundColor:
                      settings.language === lang.key
                        ? "var(--color-primary)"
                        : "var(--color-surface-alt)",
                    color:
                      settings.language === lang.key
                        ? "#fff"
                        : "var(--color-text-secondary)",
                  }}
                  onClick={() => setLanguage(lang.key)}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card mb-3 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-xs font-medium"
                style={{ color: "var(--color-text-secondary)" }}
              >
                🔔 নোটিফিকেশন
              </p>
              <p
                className="mt-0.5 text-[10px]"
                style={{ color: "var(--color-text-muted)" }}
              >
                পরীক্ষার রিমাইন্ডার পান
              </p>
            </div>
            <button
              className="relative h-6 w-11 rounded-full transition-all"
              style={{
                backgroundColor: settings.notifications
                  ? "var(--color-primary)"
                  : "var(--color-surface-alt)",
              }}
              onClick={() => toggleNotifications()}
            >
              <div
                className="absolute top-0.5 h-5 w-5 rounded-full transition-all"
                style={{
                  backgroundColor: "#fff",
                  left: settings.notifications ? "calc(100% - 22px)" : "2px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* About & Logout */}
      <div className="space-y-2">
        <button className="card flex w-full items-center gap-3 p-4">
          <span>📋</span>
          <span
            className="flex-1 text-left text-xs font-medium"
            style={{ color: "var(--color-text-secondary)" }}
          >
            গোপনীয়তা নীতি
          </span>
          <svg
            className="h-4 w-4"
            style={{ color: "var(--color-text-muted)" }}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
        <button className="card flex w-full items-center gap-3 p-4">
          <span>ℹ️</span>
          <span
            className="flex-1 text-left text-xs font-medium"
            style={{ color: "var(--color-text-secondary)" }}
          >
            অ্যাপ সম্পর্কে
          </span>
          <svg
            className="h-4 w-4"
            style={{ color: "var(--color-text-muted)" }}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
        <button
          className="card flex w-full items-center gap-3 p-4"
          onClick={() => setShowLogout(true)}
        >
          <span>🚪</span>
          <span
            className="flex-1 text-left text-xs font-medium"
            style={{ color: "#ef4444" }}
          >
            লগআউট
          </span>
        </button>
      </div>

      <p
        className="mt-6 text-center text-[10px]"
        style={{ color: "var(--color-text-muted)" }}
      >
        CrackIt v1.0 - Made with ❤️ in Bangladesh
      </p>

      {/* Logout Modal */}
      {showLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-8">
          <div className="card w-full max-w-sm p-6">
            <h3
              className="text-base font-bold"
              style={{ color: "var(--color-text-primary)" }}
            >
              লগআউট করবেন?
            </h3>
            <p
              className="mt-1 text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              আপনার সব ডেটা মুছে যাবে। আপনি কি নিশ্চিত?
            </p>
            <div className="mt-5 flex gap-3">
              <button
                className="btn-secondary flex-1 py-2.5 text-sm"
                onClick={() => setShowLogout(false)}
              >
                বাতিল
              </button>
              <button
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white"
                style={{ backgroundColor: "#ef4444" }}
                onClick={handleLogout}
              >
                লগআউট
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
