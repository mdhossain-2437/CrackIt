# Contributing to CrackIt

Thank you for your interest in contributing to CrackIt! Every contribution helps make exam preparation more accessible for students across Bangladesh and beyond.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Question Bank Contributions](#question-bank-contributions)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/CrackIt.git
   cd CrackIt
   ```
3. **Install** dependencies:
   ```bash
   npm install
   ```
4. **Run** the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Setup

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Git

### Environment

No environment variables are required for basic development. The app uses client-side mock data by default.

## Project Structure

```
src/
├── app/                # Next.js App Router pages
│   ├── dashboard/      # Main dashboard
│   ├── exam/           # Exam practice & mock setup
│   ├── leaderboard/    # Rankings
│   ├── live/           # Live exams
│   ├── onboarding/     # First-time user flow
│   ├── profile/        # User profile & settings
│   ├── result/         # Exam result analytics
│   ├── subjects/       # Subjects & topics
│   ├── globals.css     # Design system & theme
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Root redirect
├── components/         # Shared components
├── data/               # Mock data (Bengali)
├── store/              # Zustand state stores
└── types/              # TypeScript type definitions
```

## Coding Standards

### General

- Use **TypeScript** for all new files
- Use **functional components** with hooks
- Follow the existing code style — run `npm run lint` before committing
- Keep components focused on a single responsibility
- Use CSS custom properties (defined in `globals.css`) for colors and theming

### Naming Conventions

- **Files**: PascalCase for components (`BottomNav.tsx`), camelCase for utilities (`mock.ts`)
- **Variables**: camelCase
- **Types/Interfaces**: PascalCase
- **CSS variables**: kebab-case with `--color-` prefix

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add quiz timer component
fix: correct score calculation in result page
docs: update API documentation
chore: update dependencies
refactor: simplify exam store logic
```

## Submitting Changes

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Make your changes with descriptive commits
3. Ensure the build passes:
   ```bash
   npm run build
   npm run lint
   ```
4. Push to your fork and submit a **Pull Request** to `main`
5. Fill out the PR template with a clear description

### Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR
- Include screenshots for UI changes
- Update documentation if you change behavior
- Ensure all existing tests still pass

## Question Bank Contributions

We welcome question contributions! Questions should follow this format in `src/data/mock.ts`:

```typescript
{
  id: "unique-id",
  text: "প্রশ্নের টেক্সট বাংলায়",
  options: ["অপশন ১", "অপশন ২", "অপশন ৩", "অপশন ৪"],
  correctIndex: 0, // 0-based index of correct answer
  explanation: "বিস্তারিত ব্যাখ্যা বাংলায়",
  subjectId: "subject-id",
  topicId: "topic-id",
  difficulty: "easy" | "medium" | "hard",
  tags: ["tag1", "tag2"]
}
```

### Guidelines for Questions

- Write questions and explanations in **Bengali**
- Provide detailed explanations, not just the answer
- Include the source exam and year if applicable
- Verify all answers for accuracy before submitting
- Follow the difficulty rating guidelines:
  - **Easy**: Direct recall / basic understanding
  - **Medium**: Application / analysis required
  - **Hard**: Multi-step reasoning / creative thinking

## Reporting Bugs

Open an issue with:

1. **Title**: Brief description of the bug
2. **Steps to reproduce**: Numbered steps
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Screenshots**: If applicable
6. **Device/Browser**: OS, browser, screen size

## Requesting Features

Open an issue with the `enhancement` label. Include:

1. **Problem**: What problem does this solve?
2. **Proposed solution**: How should it work?
3. **Alternatives considered**: Any other approaches?
4. **Target audience**: Who benefits?

## Code of Conduct

By participating, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

---

Thank you for helping make education more accessible! 🎓
