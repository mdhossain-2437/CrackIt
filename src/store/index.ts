import type { AppSettings, ExamCategory, ThemeMode, User } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ==========================================
// User Store
// ==========================================
interface UserState {
  user: User | null;
  isOnboarded: boolean;
  setUser: (user: User) => void;
  setExamCategory: (category: ExamCategory) => void;
  setOnboarded: (value: boolean) => void;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  incrementStreak: () => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isOnboarded: false,
      setUser: (user) => set({ user }),
      setExamCategory: (category) =>
        set((state) => ({
          user: state.user ? { ...state.user, examCategory: category } : null,
        })),
      setOnboarded: (value) => set({ isOnboarded: value }),
      addXP: (amount) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, xp: state.user.xp + amount }
            : null,
        })),
      addCoins: (amount) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, coins: state.user.coins + amount }
            : null,
        })),
      incrementStreak: () =>
        set((state) => ({
          user: state.user
            ? { ...state.user, streak: state.user.streak + 1 }
            : null,
        })),
      logout: () => set({ user: null, isOnboarded: false }),
    }),
    { name: "exam-prep-user" },
  ),
);

// ==========================================
// Exam Store
// ==========================================
interface ExamState {
  currentQuestionIndex: number;
  answers: (number | null)[];
  markedForReview: boolean[];
  timeSpent: number[];
  totalTime: number;
  remainingTime: number;
  isExamActive: boolean;
  showPalette: boolean;

  initExam: (totalQuestions: number, duration: number) => void;
  selectAnswer: (questionIndex: number, optionIndex: number) => void;
  toggleReview: (questionIndex: number) => void;
  goToQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  tick: () => void;
  addTimeSpent: (questionIndex: number, seconds: number) => void;
  togglePalette: () => void;
  endExam: () => void;
  resetExam: () => void;
}

export const useExamStore = create<ExamState>()((set, get) => ({
  currentQuestionIndex: 0,
  answers: [],
  markedForReview: [],
  timeSpent: [],
  totalTime: 0,
  remainingTime: 0,
  isExamActive: false,
  showPalette: false,

  initExam: (totalQuestions, duration) =>
    set({
      currentQuestionIndex: 0,
      answers: new Array(totalQuestions).fill(null),
      markedForReview: new Array(totalQuestions).fill(false),
      timeSpent: new Array(totalQuestions).fill(0),
      totalTime: duration,
      remainingTime: duration,
      isExamActive: true,
      showPalette: false,
    }),

  selectAnswer: (questionIndex, optionIndex) =>
    set((state) => {
      const newAnswers = [...state.answers];
      newAnswers[questionIndex] =
        newAnswers[questionIndex] === optionIndex ? null : optionIndex;
      return { answers: newAnswers };
    }),

  toggleReview: (questionIndex) =>
    set((state) => {
      const newMarked = [...state.markedForReview];
      newMarked[questionIndex] = !newMarked[questionIndex];
      return { markedForReview: newMarked };
    }),

  goToQuestion: (index) => set({ currentQuestionIndex: index }),

  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.min(
        state.currentQuestionIndex + 1,
        state.answers.length - 1,
      ),
    })),

  prevQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
    })),

  tick: () =>
    set((state) => {
      const newRemaining = Math.max(state.remainingTime - 1, 0);
      const newTimeSpent = [...state.timeSpent];
      newTimeSpent[state.currentQuestionIndex] =
        (newTimeSpent[state.currentQuestionIndex] || 0) + 1;
      return {
        remainingTime: newRemaining,
        timeSpent: newTimeSpent,
        isExamActive: newRemaining > 0,
      };
    }),

  addTimeSpent: (questionIndex, seconds) =>
    set((state) => {
      const newTimeSpent = [...state.timeSpent];
      newTimeSpent[questionIndex] =
        (newTimeSpent[questionIndex] || 0) + seconds;
      return { timeSpent: newTimeSpent };
    }),

  togglePalette: () => set((state) => ({ showPalette: !state.showPalette })),

  endExam: () => set({ isExamActive: false }),

  resetExam: () =>
    set({
      currentQuestionIndex: 0,
      answers: [],
      markedForReview: [],
      timeSpent: [],
      totalTime: 0,
      remainingTime: 0,
      isExamActive: false,
      showPalette: false,
    }),
}));

// ==========================================
// Settings Store
// ==========================================
interface SettingsState {
  settings: AppSettings;
  updateTheme: (theme: ThemeMode) => void;
  toggleNotifications: () => void;
  toggleSoundEffects: () => void;
  setLanguage: (lang: "bn" | "en") => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: {
        theme: "light",
        language: "bn",
        notifications: true,
        soundEffects: true,
      },
      updateTheme: (theme) =>
        set((state) => ({
          settings: { ...state.settings, theme },
        })),
      toggleNotifications: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            notifications: !state.settings.notifications,
          },
        })),
      toggleSoundEffects: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            soundEffects: !state.settings.soundEffects,
          },
        })),
      setLanguage: (lang) =>
        set((state) => ({
          settings: { ...state.settings, language: lang },
        })),
    }),
    { name: "exam-prep-settings" },
  ),
);
