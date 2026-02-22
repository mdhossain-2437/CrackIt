"use client";

import { examCategories } from "@/data/mock";
import { useUserStore } from "@/store";
import type { ExamCategory } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OnboardingPage() {
  const router = useRouter();
  const { setUser, setOnboarded } = useUserStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory | null>(
    null,
  );

  const handleFinish = () => {
    if (!name.trim() || !selectedCategory) return;
    setUser({
      id: "user-" + Date.now(),
      name: name.trim(),
      email: "",
      examCategory: selectedCategory,
      streak: 0,
      xp: 0,
      coins: 100,
      badges: [],
      joinedAt: new Date().toISOString(),
    });
    setOnboarded(true);
    router.replace("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col safe-top">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 px-4 pt-8 pb-4">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: step === s ? "2rem" : "0.5rem",
              backgroundColor:
                step >= s ? "var(--color-primary)" : "var(--color-border)",
            }}
          />
        ))}
      </div>

      {/* Step 1: Welcome */}
      {step === 1 && (
        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-8">
          <div
            className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl text-4xl"
            style={{ backgroundColor: "rgb(37 99 235 / 0.08)" }}
          >
            📖
          </div>
          <h1
            className="mb-2 text-center text-2xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            পরীক্ষা প্রস্তুতি
          </h1>
          <h2
            className="mb-1 text-center text-lg font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            Exam Prep BD
          </h2>
          <p
            className="mb-8 max-w-sm text-center text-sm leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            বাংলাদেশের সকল প্রতিযোগিতামূলক পরীক্ষার জন্য AI-powered প্রিপারেশন
            প্ল্যাটফর্ম। BCS, Medical, Engineering, Varsity — সব এক জায়গায়।
          </p>
          <button
            className="btn-primary w-full max-w-xs py-3 text-base"
            onClick={() => setStep(2)}
          >
            শুরু করুন
          </button>
        </div>
      )}

      {/* Step 2: Name */}
      {step === 2 && (
        <div className="flex flex-1 flex-col px-6 pt-8 pb-8">
          <h1
            className="mb-2 text-xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            আপনার নাম কী? 👋
          </h1>
          <p
            className="mb-6 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            আপনার প্রস্তুতি ট্র্যাক করতে নাম দিন
          </p>
          <input
            type="text"
            className="input-field mb-6 text-base"
            placeholder="আপনার নাম লিখুন..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <div className="mt-auto flex gap-3">
            <button
              className="btn-secondary flex-1 py-3"
              onClick={() => setStep(1)}
            >
              পিছনে
            </button>
            <button
              className="btn-primary flex-1 py-3"
              disabled={!name.trim()}
              onClick={() => setStep(3)}
              style={{ opacity: name.trim() ? 1 : 0.5 }}
            >
              পরবর্তী
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Exam Category Selection */}
      {step === 3 && (
        <div className="flex flex-1 flex-col px-6 pt-8 pb-8">
          <h1
            className="mb-2 text-xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            তুমি কোন পরীক্ষার প্রস্তুতি নিচ্ছো? 🎯
          </h1>
          <p
            className="mb-6 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            এটি পরবর্তীতে পরিবর্তন করা যাবে
          </p>
          <div className="mb-6 grid grid-cols-2 gap-3">
            {examCategories.map((cat) => (
              <button
                key={cat.id}
                className="flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all"
                style={{
                  backgroundColor:
                    selectedCategory === cat.id
                      ? "rgb(37 99 235 / 0.08)"
                      : "var(--color-surface-alt)",
                  border:
                    selectedCategory === cat.id
                      ? "2px solid var(--color-primary)"
                      : "2px solid transparent",
                }}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {cat.nameBn}
                </span>
                <span
                  className="text-xs leading-tight"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {cat.description}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-auto flex gap-3">
            <button
              className="btn-secondary flex-1 py-3"
              onClick={() => setStep(2)}
            >
              পিছনে
            </button>
            <button
              className="btn-primary flex-1 py-3"
              disabled={!selectedCategory}
              onClick={handleFinish}
              style={{ opacity: selectedCategory ? 1 : 0.5 }}
            >
              শুরু করো! 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
