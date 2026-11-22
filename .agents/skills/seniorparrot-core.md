# SeniorParrot AI — Core Architecture & Project Rules

## 1. Stack Baseline & Conventions

- **Framework:** Next.js 15+ (App Router, React 19).
- **Styling:** Tailwind CSS + Shadcn UI (Dark mode by default, clean minimalist aesthetic).
- **Database & ORM:** Supabase + Prisma (PostgreSQL).
- **State Management:** Zustand (for live transcript and UI states) + Server Actions / React Query.
- **AI Integration:** Gemini API (Structured JSON output via Zod schemas).

## 2. Core Principles & Lean Scope (MVP Rules)

- **Single-Page First:** Focus entirely on the `/practice` screen workflow (Question Selection -> Live Audio/Text -> AI Feedback Grid).
- **No Over-Engineering:** Avoid premature micro-abstractions. Co-locate code inside features/components until reuse is strictly required.
- **Strict Accessibility & UX:** All interactive elements must have proper ARIA labels, focus-visible outlines, and smooth loading/recording states.

## 3. UI Theme & Tokens

- **Background:** Dark `#09090b` (zinc-950).
- **Borders:** Subtle `#27272a` (zinc-800).
- **Accents:** Emerald/Teal (`emerald-500` / `teal-400`).

## 4. AI Feedback Schema Requirements

Every evaluation response from the AI must validate against a Zod schema and return 3 distinct blocks:

1. `technicalContent`: score (1-10) + array of key strengths and missing trade-offs.
2. `englishDelivery`: clarity, filler word reduction, and high-impact vocabulary suggestions.
3. `seniorModelAnswer`: a model answer embodying the "It depends..." trade-off mentality.
