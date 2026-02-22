"use client";

import { useUserStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isOnboarded } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (isOnboarded) {
      router.replace("/dashboard");
    } else {
      router.replace("/onboarding");
    }
  }, [isOnboarded, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-fade-in text-center">
        <div className="mb-4 text-4xl">📖</div>
        <p
          className="text-sm font-medium"
          style={{ color: "var(--color-text-muted)" }}
        >
          লোড হচ্ছে...
        </p>
      </div>
    </div>
  );
}
