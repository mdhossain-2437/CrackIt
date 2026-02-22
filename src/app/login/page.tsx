"use client";

import { useAuth } from "@/components/AuthProvider";
import {
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "@/lib/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setError("");
    setIsLoading(true);

    try {
      if (!auth) throw new Error("Auth not configured");
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/dashboard");
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("এই ইমেইল দিয়ে কোন অ্যাকাউন্ট পাওয়া যায়নি");
      } else if (err.code === "auth/wrong-password") {
        setError("পাসওয়ার্ড ভুল হয়েছে");
      } else if (err.code === "auth/invalid-email") {
        setError("ইমেইল সঠিক নয়");
      } else if (err.code === "auth/invalid-credential") {
        setError("ইমেইল বা পাসওয়ার্ড সঠিক নয়");
      } else {
        setError("লগইন করতে সমস্যা হয়েছে");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      if (!auth || !googleProvider) throw new Error("Auth not configured");
      await signInWithPopup(auth, googleProvider);
      router.replace("/dashboard");
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Google লগইন করতে সমস্যা হয়েছে");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col px-6 safe-top">
      <div className="flex flex-1 flex-col items-center justify-center pb-8">
        {/* Logo */}
        <div
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl text-4xl"
          style={{ backgroundColor: "rgb(37 99 235 / 0.08)" }}
        >
          📖
        </div>
        <h1
          className="mb-1 text-2xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          CrackIt
        </h1>
        <p
          className="mb-8 text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          আপনার অ্যাকাউন্টে লগইন করুন
        </p>

        {/* Error */}
        {error && (
          <div
            className="mb-4 w-full max-w-sm rounded-lg px-4 py-3 text-sm"
            style={{
              backgroundColor: "rgb(239 68 68 / 0.08)",
              color: "#ef4444",
            }}
          >
            {error}
          </div>
        )}

        {/* Email Form */}
        <form onSubmit={handleEmailLogin} className="w-full max-w-sm space-y-3">
          <input
            type="email"
            className="input-field w-full text-sm"
            placeholder="ইমেইল"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            type="password"
            className="input-field w-full text-sm"
            placeholder="পাসওয়ার্ড"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button
            type="submit"
            className="btn-primary w-full py-3 text-sm"
            disabled={isLoading || !email.trim() || !password}
            style={{
              opacity: isLoading || !email.trim() || !password ? 0.6 : 1,
            }}
          >
            {isLoading ? "লগইন হচ্ছে..." : "লগইন"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex w-full max-w-sm items-center gap-3">
          <div
            className="h-px flex-1"
            style={{ backgroundColor: "var(--color-border)" }}
          />
          <span
            className="text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            অথবা
          </span>
          <div
            className="h-px flex-1"
            style={{ backgroundColor: "var(--color-border)" }}
          />
        </div>

        {/* Google Login */}
        <button
          className="btn-secondary flex w-full max-w-sm items-center justify-center gap-2 py-3 text-sm"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google দিয়ে লগইন
        </button>

        {/* Sign up link */}
        <p
          className="mt-6 text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/signup"
            className="font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            রেজিস্টার করুন
          </Link>
        </p>
      </div>
    </div>
  );
}
