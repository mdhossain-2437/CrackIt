<div align="center">

# 📖 CrackIt

**বাংলাদেশের সকল প্রতিযোগিতামূলক পরীক্ষার জন্য AI-Powered প্রিপারেশন প্ল্যাটফর্ম**

BCS · Medical · Engineering · Varsity · Bank · Primary — সব এক জায়গায়

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)](#pwa)

</div>

---

## Overview

CrackIt is a mobile-first Progressive Web App built for competitive exam preparation in Bangladesh. It offers AI-powered MCQ practice, mock exams, live competitions, leaderboards, and detailed analytics — all in Bengali.

### Key Features

| Feature                | Description                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| **3-Step Onboarding**  | Quick setup — name, exam category selection (BCS, Medical, etc.)      |
| **Dashboard**          | Daily streak, XP, coins, progress tracking, and AI study tips         |
| **Subject Browser**    | 8 subjects with topic-level accuracy breakdown                        |
| **Practice Arena**     | Timed MCQ practice with question palette, mark-for-review, anti-cheat |
| **Mock Tests**         | Customizable tests — choose subjects, question count, duration        |
| **Live Exams**         | Real-time competitions with leaderboard rankings                      |
| **Result Analytics**   | Animated score display, per-question review with Bengali explanations |
| **Leaderboard**        | Weekly / Monthly / All-time rankings with podium view                 |
| **Profile & Settings** | Dark mode, language toggle, notification preferences, badges          |
| **PWA**                | Installable, works offline with service worker caching                |

## Tech Stack

| Layer     | Technology                                                           |
| --------- | -------------------------------------------------------------------- |
| Framework | [Next.js 16](https://nextjs.org) (App Router)                        |
| Language  | [TypeScript 5](https://typescriptlang.org)                           |
| UI        | [Tailwind CSS 4](https://tailwindcss.com) + CSS Custom Properties    |
| State     | [Zustand 5](https://zustand.docs.pmnd.rs/) with `persist` middleware |
| Fonts     | Inter (Latin) + Noto Sans Bengali via `next/font`                    |
| PWA       | Custom service worker + Web App Manifest                             |

## Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/mdhossain-2437/CrackIt.git
cd CrackIt

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app redirects to onboarding on first visit.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Main dashboard with stats & quick actions
│   ├── exam/
│   │   ├── mock/           # Customizable mock test setup
│   │   └── practice/       # Full exam arena with timer & palette
│   ├── leaderboard/        # Rankings with podium view
│   ├── live/               # Live exam schedule & participation
│   ├── onboarding/         # 3-step first-time user flow
│   ├── profile/            # Settings, badges, theme toggle
│   ├── result/             # Score analytics & answer review
│   ├── subjects/           # Subject list & topic details
│   │   └── [subjectId]/    # Dynamic subject detail page
│   ├── globals.css         # Design system (CSS custom properties)
│   ├── layout.tsx          # Root layout with fonts & providers
│   └── page.tsx            # Root redirect (onboarding / dashboard)
├── components/
│   ├── BottomNav.tsx       # 5-tab bottom navigation (Bengali)
│   ├── ServiceWorkerRegister.tsx
│   └── ThemeProvider.tsx   # Light / Dark / System theme
├── data/
│   └── mock.ts             # Bengali mock data (subjects, questions, exams)
├── store/
│   └── index.ts            # Zustand stores (user, exam, settings)
└── types/
    └── index.ts            # TypeScript type definitions
```

## Design Philosophy

- **Mobile-first** — max-width container, touch-friendly targets
- **Flat & clean** — solid colors only, no gradients
- **Dark mode** — full dark theme via CSS custom properties + `.dark` class
- **Bengali-first** — all UI text in Bengali, data in Bengali
- **Performance** — Zustand (no context re-renders), Turbopack dev, static generation

## PWA

CrackIt is a fully installable PWA:

- **Manifest** at `/manifest.json` with Bengali app name and theme
- **Service Worker** at `/sw.js` using stale-while-revalidate caching
- **Offline support** — cached assets served when network is unavailable
- **Standalone mode** — native-like experience without browser chrome

## Scripts

| Command         | Description                     |
| --------------- | ------------------------------- |
| `npm run dev`   | Start dev server with Turbopack |
| `npm run build` | Create production build         |
| `npm start`     | Serve production build          |
| `npm run lint`  | Run ESLint                      |

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

We especially welcome:

- **Question bank additions** — Bengali MCQs with explanations
- **Bug reports** and **feature requests**
- **UI/UX improvements** and accessibility enhancements
- **Translations** and localization

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- Built for students preparing for competitive exams in Bangladesh
- Bengali question content sourced from public exam archives
- Powered by the Next.js, React, and open-source ecosystem

---

<div align="center">

**Made with ❤️ for Bangladeshi students**

[Report Bug](https://github.com/mdhossain-2437/CrackIt/issues) · [Request Feature](https://github.com/mdhossain-2437/CrackIt/issues) · [Contribute](CONTRIBUTING.md)

</div>
