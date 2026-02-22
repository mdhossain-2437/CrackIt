"use client";

import { useAuth } from "@/components/AuthProvider";
import { useUserStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const { isOnboarded } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (isOnboarded) {
      router.replace("/dashboard");
    } else {
      router.replace("/onboarding");
    }
  }, [isAuthenticated, isOnboarded, loading, router]);

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
