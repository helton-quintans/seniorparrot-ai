"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import {
  ArrowRight,
  AudioLines,
  Bird,
  Check,
  CircleHelp,
  Code2,
  Headphones,
  Mic,
  MicOff,
  PanelsTopLeft,
  Sparkles,
  Trash2,
  UserRound,
  Volume2,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FormattedFeedbackText } from "@/components/formatted-feedback-text"
import { PracticeFeedback } from "@/components/practice-feedback"
import { ThinkingFace } from "@/components/thinking-face"
import { cn } from "@/lib/utils"
import {
  usePracticeStore,
  type LevelId,
  type TopicId,
  type PracticeStatus,
} from "@/stores/practice-store"

type Question = {
  category: string
  prompt: string
  translation: string
}

type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  onresult:
  | ((event: {
    results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>
  }) => void)
  | null
  onerror: (() => void) | null
  onend: (() => void) | null
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike

const topics: { id: TopicId; label: string; icon: typeof PanelsTopLeft }[] = [
  { id: "frontend", label: "Frontend Architecture", icon: PanelsTopLeft },
  { id: "react", label: "React Internals", icon: Code2 },
  { id: "system-design", label: "System Design", icon: CircleHelp },
  { id: "behavioral", label: "Behavioral (STAR)", icon: UserRound },
]

const questions: Record<TopicId, Question[]> = {
  frontend: [
    {
      category: "Frontend Architecture",
      prompt:
        "How would you structure a large React application so product teams can ship independently without creating duplicated design systems or tightly coupled features?",
      translation:
        "Como você estruturaria uma aplicação React de grande porte para que as equipes de produto pudessem entregar funcionalidades de forma independente, sem duplicar sistemas de design ou criar dependências fortes entre funcionalidades?",
    },
    {
      category: "Frontend Architecture",
      prompt:
        "A core application bundle has grown significantly as the product scaled. How would you identify the biggest opportunities to improve load time without compromising the user experience?",
      translation:
        "O bundle principal da aplicação cresceu bastante à medida que o produto escalou. Como você identificaria as melhores oportunidades para reduzir o tempo de carregamento sem comprometer a experiência do usuário?",
    },
  ],
  react: [
    {
      category: "React Internals",
      prompt:
        "A complex screen feels sluggish during user interactions even though its components use memoization. How would you investigate the render path and decide what to optimize?",
      translation:
        "Uma tela complexa parece lenta durante as interações, embora seus componentes usem memoização. Como você investigaria o fluxo de renderização e decidiria o que otimizar?",
    },
    {
      category: "React Internals",
      prompt:
        "Explain how concurrent rendering changes the way you think about expensive work, effects, and state updates in a React application.",
      translation:
        "Explique como a renderização concorrente muda a forma de pensar sobre operações custosas, effects e atualizações de estado em uma aplicação React.",
    },
  ],
  "system-design": [
    {
      category: "System Design",
      prompt:
        "Imagine you are building a real-time dashboard with high-frequency updates. How would you prevent excessive re-renders and structure the state management architecture?",
      translation:
        "Imagine que você está criando um dashboard em tempo real com atualizações frequentes. Como evitaria renderizações excessivas e estruturaria a arquitetura de gerenciamento de estado?",
    },
    {
      category: "System Design",
      prompt:
        "Design a frontend architecture for a dashboard that streams updates from thousands of devices. How would you balance data freshness, rendering cost, and resilience to reconnects?",
      translation:
        "Desenhe uma arquitetura frontend para um dashboard que recebe atualizações de milhares de dispositivos. Como equilibraria a atualização dos dados, o custo de renderização e a resiliência durante reconexões?",
    },
  ],
  behavioral: [
    {
      category: "Behavioral (STAR)",
      prompt:
        "Tell me about a time you had to align several teams around a technical direction. How did you handle disagreement, and what changed because of your approach?",
      translation:
        "Conte sobre uma ocasião em que você precisou alinhar várias equipes em torno de uma direção técnica. Como lidou com as divergências e o que mudou por causa da sua abordagem?",
    },
    {
      category: "Behavioral (STAR)",
      prompt:
        "Describe a difficult technical decision you made with incomplete information. What trade-offs did you consider, and what did you learn from the outcome?",
      translation:
        "Descreva uma decisão técnica difícil que você tomou com informações incompletas. Quais trade-offs considerou e o que aprendeu com o resultado?",
    },
  ],
}

/* ============================================================================
   HEADER, STEP HEADINGS & EMPTY STATES
   ============================================================================ */

function BrandMark() {
  return (
    <div className="brand-mark" aria-hidden="true">
      <Bird className="brand-bird" strokeWidth={1.8} />
      <Headphones className="brand-headphones" strokeWidth={2.2} />
    </div>
  )
}

function AppHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-5 sm:pb-6">
      <a
        href="#main"
        className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="SeniorParrot AI home"
      >
        <BrandMark />
        <span className="text-[15px] font-semibold tracking-[-0.035em] text-white sm:text-base">
          SeniorParrot <span className="text-primary">AI</span>
        </span>
      </a>
      <div className="flex items-center gap-3 sm:gap-4">
        <Badge
          variant="outline"
          className="border-white/10 bg-white/[0.035] px-2.5 py-1 font-mono text-[10px] font-medium tracking-[0.08em] text-zinc-400"
        >
          <span className="mr-1.5 inline-block size-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
          PRACTICE WORKSPACE
        </Badge>
        <span
          className="hidden h-6 w-px bg-white/10 sm:block"
          aria-hidden="true"
        />
        <Avatar className="size-9 border border-white/10 bg-[#1a2224] text-xs text-primary">
          <AvatarFallback className="bg-[#1a2224] font-semibold text-primary">
            HQ
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}

function StepHeading({
  number,
  title,
  detail,
  status = "standby",
}: {
  number: string
  title: string
  detail?: string
  status?: "active" | "complete" | "standby"
}) {
  const indicatorStyles = {
    active:
      "border-primary/35 bg-primary/[0.08] text-primary shadow-[0_0_14px_-8px_rgb(94_234_212/70%)]",
    complete: "border-zinc-700 bg-zinc-900 text-primary/75",
    standby: "border-zinc-800 bg-[#101316] text-zinc-600",
  }

  return (
    <div className="mb-3 flex items-center gap-3">
      <span
        aria-current={status === "active" ? "step" : undefined}
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-[10px] transition-colors",
          indicatorStyles[status]
        )}
      >
        {status === "complete" ? (
          <Check className="size-3" aria-hidden="true" />
        ) : (
          number
        )}
      </span>
      <div className="flex min-w-0 items-baseline gap-2.5">
        <h2
          className={cn(
            "text-sm font-medium",
            status === "standby" ? "text-zinc-500" : "text-zinc-200"
          )}
        >
          {title}
        </h2>
        {detail && (
          <span className="hidden text-xs text-zinc-600 sm:inline">
            {detail}
          </span>
        )}
      </div>
    </div>
  )
}

function QuestionEmptyState() {
  return (
    <div className="group relative flex min-h-[280px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0e11] p-8 text-center transition-all duration-500 hover:border-primary/30">
      {/* Background Subtle Grid & Ambient Glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#5eead4_1px,transparent_1px)] opacity-[0.12] [background-size:20px_20px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute size-64 rounded-full bg-primary/10 blur-3xl transition-all duration-700 group-hover:bg-primary/20"
        aria-hidden="true"
      />

      {/* Interactive Visual Core */}
      <div className="relative flex items-center justify-center">
        {/* Outer Pulsing Rings */}
        <div className="absolute size-44 rounded-full border border-primary/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-40" />
        <div className="absolute size-36 rounded-full border border-dashed border-primary/30 animate-[spin_30s_linear_infinite]" />

        {/* Central Hex/Core Icon */}
        <div className="relative flex size-16 items-center justify-center rounded-2xl border border-primary/50 bg-[#101418] shadow-[0_0_30px_rgba(94,234,212,0.25)] transition-transform duration-300 group-hover:scale-105">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent" />
          <span className="font-mono text-2xl font-black tracking-tighter text-primary">
            &lt;/&gt;
          </span>
        </div>
      </div>

      {/* Minimal Tech Tagline */}
      <div className="relative z-10 mt-8 flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-primary" />
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400">
          SELECT TOPIC TO START SESSION
        </span>
      </div>
    </div>
  )
}

function ResponseEmptyState() {
  return (
    <div className="group relative flex min-h-[220px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0e11] p-6 text-center transition-all duration-500 hover:border-primary/30">
      {/* Glow Effect */}
      <div
        className="pointer-events-none absolute -bottom-10 size-48 rounded-full bg-primary/[0.07] blur-2xl transition-all duration-500 group-hover:bg-primary/[0.15]"
        aria-hidden="true"
      />

      {/* High-Tech Equalizer Spectrum Visual */}
      <div className="relative mb-4 flex items-end gap-1.5 h-12 px-6 py-2 rounded-2xl border border-white/[0.08] bg-[#12151a]/80 shadow-inner">
        {[40, 70, 25, 90, 55, 30, 80, 100, 65, 45, 85, 35, 95, 50, 75, 20, 60].map((h, i) => (
          <span
            key={i}
            className="w-1 rounded-full bg-gradient-to-t from-primary/30 to-primary transition-all"
            style={{
              height: `${h}%`,
              animation: `pulse 1.5s ease-in-out infinite ${i * 90}ms`,
            }}
          />
        ))}
      </div>

      {/* Minimal Status Capsule */}
      <div className="relative z-10 flex items-center gap-2 rounded-full border border-white/10 bg-[#161a20] px-3.5 py-1 text-[11px] font-mono text-zinc-400">
        <span className="size-2 rounded-full bg-primary-400/80 animate-ping" />
        <span className="text-zinc-300">USE YOU VOICE OR TYPE</span>
      </div>
    </div>
  )
}

function FeedbackEmptyState() {
  return (
    <div className="group relative flex min-h-[230px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0e11] p-6 text-center transition-all duration-500 hover:border-violet-500/30">
      {/* Radar HUD Visual */}
      <div className="relative mb-5 flex items-center justify-center gap-8">
        {/* Metric Node 1 */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex size-12 items-center justify-center rounded-full border border-primary/40 bg-primary/5">
            <div className="absolute inset-1 rounded-full border border-dashed border-primary/30 animate-[spin_10s_linear_infinite]" />
            <span className="font-mono text-xs font-bold text-primary">00</span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">TECH_DEPTH</span>
        </div>

        {/* Neural Line */}
        <div className="h-px w-8 bg-gradient-to-r from-primary/40 via-white/20 to-violet-500/40" />

        {/* Metric Node 2 */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex size-12 items-center justify-center rounded-full border border-white/20 bg-white/5">
            <div className="absolute inset-1 rounded-full border border-dashed border-white/20 animate-[spin_15s_linear_infinite_reverse]" />
            <span className="font-mono text-xs font-bold text-zinc-400">00</span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">DELIVERY</span>
        </div>

        {/* Neural Line */}
        <div className="h-px w-8 bg-gradient-to-r from-white/20 via-violet-500/30 to-violet-400/40" />

        {/* Metric Node 3 */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex size-12 items-center justify-center rounded-full border border-violet-500/40 bg-violet-500/5">
            <div className="absolute inset-1 rounded-full border border-dashed border-violet-400/30 animate-[spin_8s_linear_infinite]" />
            <span className="font-mono text-xs font-bold text-violet-400">AI</span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">MODEL_ANS</span>
        </div>
      </div>

      {/* Minimal Tech Tagline */}
      <div className="relative z-10 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
        <span className="size-1.5 rounded-full bg-violet-400 animate-pulse" />
        AWAITING SUBMISSION FOR ANALYTICS
      </div>
    </div>
  )
}

/* ============================================================================
   CONFIGURATION, QUESTION CARD & UNIFIED RESPONSE COMPOSER
   ============================================================================ */

function ConfigurationBar({
  topic,
  level,
  onTopicChange,
  onLevelChange,
  onGenerate,
}: {
  topic: TopicId
  level: LevelId
  onTopicChange: (topic: TopicId) => void
  onLevelChange: (level: LevelId) => void
  onGenerate: () => void
}) {
  return (
    <section
      aria-label="Question settings"
      className="rounded-2xl border border-white/[0.08] bg-[#0e1013]/90 p-4 shadow-[0_18px_60px_-40px_rgba(0,0,0,.9)] sm:p-5"
    >
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
        <div className="grid gap-2">
          <label
            htmlFor="topic-select"
            className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500"
          >
            Interview topic
          </label>
          <Select
            value={topic}
            onValueChange={(value) => value && onTopicChange(value as TopicId)}
          >
            <SelectTrigger
              id="topic-select"
              className="h-11 w-full rounded-xl border-white/10 bg-[#141619] px-3.5 text-sm text-zinc-200 hover:bg-[#191c20]"
            >
              <SelectValue>
                {topics.find((item) => item.id === topic)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#121417] text-zinc-200">
              <SelectGroup>
                {topics.map((item) => {
                  const Icon = item.icon
                  return (
                    <SelectItem key={item.id} value={item.id} className="py-2.5">
                      <Icon className="size-4 text-zinc-500" aria-hidden="true" />
                      {item.label}
                    </SelectItem>
                  )
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="level-select"
            className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-500"
          >
            Target level
          </label>
          <Select
            value={level}
            onValueChange={(value) => value && onLevelChange(value as LevelId)}
          >
            <SelectTrigger
              id="level-select"
              className="h-11 w-full rounded-xl border-white/10 bg-[#141619] px-3.5 text-sm text-zinc-200 hover:bg-[#191c20]"
            >
              <SelectValue>
                {level === "senior" ? "Senior Engineer" : "Staff Engineer"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#121417] text-zinc-200">
              <SelectGroup>
                <SelectItem value="senior" className="py-2.5">
                  Senior Engineer
                </SelectItem>
                <SelectItem value="staff" className="py-2.5">
                  Staff Engineer
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={onGenerate}
          size="lg"
          className="generate-button-glow h-11 w-full rounded-xl bg-primary px-5 font-semibold text-[#061414] shadow-[0_0_24px_-10px_rgba(45,212,191,.7)] transition hover:-translate-y-0.5 hover:bg-[#7af2dd] sm:w-auto"
        >
          <Sparkles data-icon="inline-start" />
          Generate Question
          <ArrowRight data-icon="inline-end" />
        </Button>
      </div>
    </section>
  )
}

function QuestionCard({
  question,
  level,
  questionNumber,
}: {
  question: Question
  level: LevelId
  questionNumber: number
}) {
  const [showTranslation, setShowTranslation] = useState(false)
  const levelLabel = level === "senior" ? "Senior Level" : "Staff Level"

  return (
    <Card className="question-card relative min-h-[252px] overflow-hidden rounded-2xl border-teal-400/20 bg-[#101316] text-white shadow-[0_0_28px_rgba(94,234,212,0.06),0_20px_90px_-48px_rgba(45,212,191,.25)] sm:min-h-[270px]">
      <div
        className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-[radial-gradient(circle,rgba(94,234,212,0.14)_0%,rgba(45,212,191,0.04)_45%,transparent_72%)] blur-xl"
        aria-hidden="true"
      />
      <div className="question-orbit" aria-hidden="true" />
      <CardContent className="relative z-10 flex h-full min-h-[252px] flex-col justify-between p-5 sm:min-h-[270px] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            <span className="inline-flex size-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.035] text-primary">
              <AudioLines className="size-3.5" />
            </span>
            Interview question
          </div>

          <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/[0.07] px-2.5 py-1 text-[11px] font-medium text-primary"
            >
              {question.category}
              <span className="mx-1.5 text-primary/40">•</span>
              {levelLabel}
            </Badge>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-expanded={showTranslation}
              aria-controls="question-translation-panel"
              onClick={() => setShowTranslation((prev) => !prev)}
              className="h-7 rounded-lg px-2.5 text-[11px] text-zinc-400 hover:bg-white/[0.04] hover:text-primary"
            >
              {showTranslation ? "Hide PT-BR" : "Translate to PT-BR"}
            </Button>
          </div>
        </div>

        <div className="relative z-10 max-w-[900px] py-7 sm:py-8">
          <p className="mb-3 font-mono text-[11px] tracking-[0.16em] text-primary/75">
            QUESTION {String(questionNumber).padStart(2, "0")}
          </p>
          <h1 className="text-[21px] leading-[1.42] font-medium tracking-[-0.035em] text-zinc-100 sm:text-[27px] sm:leading-[1.38] lg:text-[30px]">
            <FormattedFeedbackText content={question.prompt} />
          </h1>

          {showTranslation && (
            <div
              id="question-translation-panel"
              lang="pt-BR"
              className="mt-5 rounded-xl border border-white/[0.08] bg-[#0d0f12]/90 px-4 py-3 text-sm leading-6 text-zinc-300"
            >
              <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-primary/75">
                Tradução (PT-BR)
              </span>
              {question.translation}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-white/[0.07] pt-4">
          <span className="flex items-center gap-2 text-xs text-zinc-500">
            <Volume2 className="size-3.5" />
            Take a moment to structure your answer
          </span>
          <span className="hidden font-mono text-[10px] tracking-[0.1em] text-zinc-600 sm:block">
            OPEN ENDED
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function ResponseSection({
  response,
  onResponseChange,
  isRecording,
  onToggleRecording,
  speechMessage,
  onSubmit,
  submitted,
  status,
  onClearAnswer,
}: {
  response: string
  onResponseChange: (value: string) => void
  isRecording: boolean
  onToggleRecording: () => void
  speechMessage: string
  onSubmit: () => Promise<void>
  submitted: boolean
  status: PracticeStatus
  onClearAnswer: () => void
}) {
  const wordCount = response.trim() ? response.trim().split(/\s+/).length : 0
  const charCount = response.length
  const charLimit = 4000
  const isAtLimit = charCount >= charLimit
  const isNearLimit = charCount >= charLimit * 0.8 && !isAtLimit

  const waveBars = [
    4, 8, 12, 18, 11, 20, 14, 9, 19, 12, 22, 15, 10, 18, 12, 20, 14, 8, 16, 11, 4,
  ]

  return (
    <section aria-labelledby="response-heading">
      <StepHeading
        number="02"
        title="Your response"
        detail="Speak or type a clear, structured answer"
        status="active"
      />
      <Card
        className={cn(
          "overflow-hidden rounded-2xl border bg-[#101316] text-white transition-colors",
          isRecording ? "border-primary/35" : "border-white/[0.08]"
        )}
      >
        <CardContent className="p-4 sm:p-5">
          <div className="mb-2.5 flex items-center justify-between gap-3">
            <label
              htmlFor="answer-transcript"
              className="text-xs font-medium text-zinc-300"
            >
              Your answer
            </label>
            <span className="font-mono text-[10px] tracking-[0.12em] text-zinc-600">
              ENGLISH
            </span>
          </div>

          <Textarea
            id="answer-transcript"
            value={response}
            onChange={(event) => onResponseChange(event.target.value)}
            placeholder="Your spoken transcript will appear here, or type your answer..."
            className="min-h-[168px] resize-y rounded-xl border-white/[0.08] bg-[#0c0e11] p-4 text-[13px] leading-6 text-zinc-200 placeholder:text-zinc-600 focus-visible:border-primary/40 focus-visible:ring-primary/20 sm:min-h-[184px]"
            aria-describedby="response-help response-status"
          />

          <div className="mt-3.5 flex flex-col gap-3 border-t border-white/[0.06] pt-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span id="response-help" className="text-[11px] text-zinc-500">
                {wordCount} {wordCount === 1 ? "word" : "words"}
              </span>

              {isNearLimit && (
                <span className="text-[11px] text-amber-400">
                  {charCount}/{charLimit} chars
                </span>
              )}
              {isAtLimit && (
                <span className="text-[11px] text-red-500">
                  {charCount}/{charLimit} chars (limit reached)
                </span>
              )}

              {isRecording && (
                <div
                  className="flex items-center gap-2 text-[11px] text-primary"
                  aria-hidden="true"
                >
                  <span className="font-medium">Listening</span>
                  <div className="flex h-5 items-center gap-[3px]">
                    {waveBars.map((height, index) => (
                      <span
                        key={index}
                        className="visualizer-bar visualizer-bar-active bg-primary"
                        style={
                          {
                            "--bar-height": `${height}px`,
                            "--bar-delay": `${index * 60}ms`,
                          } as CSSProperties
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onToggleRecording}
                disabled={status === "submitting"}
                aria-label={
                  isRecording ? "Finish voice input" : "Start voice input"
                }
                aria-pressed={isRecording}
                className={cn(
                  "h-10 rounded-xl border-white/10 px-3.5 text-xs font-medium transition",
                  isRecording
                    ? "border-rose-400/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500/15"
                    : "bg-[#14171b] text-zinc-200 hover:border-primary/30 hover:text-primary"
                )}
              >
                {isRecording ? (
                  <>
                    <MicOff className="size-4" data-icon="inline-start" />
                    Finish
                  </>
                ) : (
                  <>
                    <Mic
                      className="size-4 text-primary"
                      data-icon="inline-start"
                    />
                    Voice
                  </>
                )}
              </Button>

              {(response.length > 0 ||
                status === "feedback" ||
                status === "error") && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={onClearAnswer}
                    disabled={status === "submitting"}
                    className="h-10 rounded-xl px-3.5 text-xs font-semibold"
                  >
                    <Trash2 className="size-4" data-icon="inline-start" />
                    Clear Answer
                  </Button>
                )}

              <Button
                type="button"
                onClick={onSubmit}
                disabled={status !== "idle" || !response.trim() || isAtLimit}
                size="lg"
                className="h-10 rounded-xl bg-primary px-4 text-xs font-semibold text-[#061414] hover:bg-[#7af2dd]"
              >
                {submitted ? (
                  <Check data-icon="inline-start" />
                ) : (
                  <Sparkles data-icon="inline-start" />
                )}
                {submitted ? "Answer submitted" : "Submit Answer for Feedback"}
                {!submitted && <ArrowRight data-icon="inline-end" />}
              </Button>
            </div>
          </div>

          <p
            id="response-status"
            role="status"
            aria-live="polite"
            className={cn(
              "mt-2 min-h-4 text-[11px]",
              speechMessage ? "text-primary/85" : "text-zinc-600"
            )}
          >
            {speechMessage ||
              (submitted ? "Feedback below is ready to review." : "")}
          </p>
        </CardContent>
      </Card>
    </section>
  )
}

function ThinkingPanel({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[252px] flex-col items-center justify-center gap-3 rounded-2xl border border-white/[0.08] bg-[#101316] px-5 text-center sm:min-h-[270px]"
    >
      <ThinkingFace className="size-16" />
      <p className="text-sm font-medium text-zinc-300">{message}</p>
      <span className="text-[11px] text-zinc-600">Please wait a moment</span>
    </div>
  )
}

/* ============================================================================
   MAIN WORKSPACE (GUIDED FLOW: EMPTY STATE -> GENERATE -> RESPOND -> EVALUATE)
   ============================================================================ */

export function PracticeWorkspace() {
  const topic = usePracticeStore((state) => state.topic)
  const level = usePracticeStore((state) => state.level)
  const questionIndex = usePracticeStore((state) => state.questionIndex)
  const response = usePracticeStore((state) => state.answer)
  const status = usePracticeStore((state) => state.status)
  const speechMessage = usePracticeStore((state) => state.speechMessage)
  const feedback = usePracticeStore((state) => state.feedback)

  const setTopic = usePracticeStore((state) => state.setTopic)
  const setLevel = usePracticeStore((state) => state.setLevel)
  const generateNextQuestion = usePracticeStore(
    (state) => state.generateNextQuestion
  )
  const setAnswer = usePracticeStore((state) => state.setAnswer)
  const setStatus = usePracticeStore((state) => state.setStatus)
  const setSpeechMessage = usePracticeStore((state) => state.setSpeechMessage)
  const submitFeedback = usePracticeStore((state) => state.submitFeedback)

  const [hasGeneratedQuestion, setHasGeneratedQuestion] = useState(false)
  const [highlightedPanel, setHighlightedPanel] = useState<
    "question" | "feedback" | null
  >(null)

  const isRecording = status === "recording"
  const isSubmitting = status === "submitting"
  const submitted = status === "feedback" && feedback !== null

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const highlightTimerRef = useRef<number | null>(null)
  const questionPanelRef = useRef<HTMLDivElement | null>(null)
  const feedbackPanelRef = useRef<HTMLElement | null>(null)

  const currentQuestion = hasGeneratedQuestion
    ? questions[topic][questionIndex % questions[topic].length]
    : null

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
      if (highlightTimerRef.current !== null) {
        window.clearTimeout(highlightTimerRef.current)
      }
    }
  }, [])

  function scrollToPanel(panel: HTMLElement | null) {
    if (!panel) return
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    panel.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "center",
    })
  }

  function focusAndHighlight(panelName: "question" | "feedback") {
    const panel =
      panelName === "question"
        ? questionPanelRef.current
        : feedbackPanelRef.current
    if (!panel) return

    scrollToPanel(panel)
    panel.focus({ preventScroll: true })
    setHighlightedPanel(panelName)

    if (highlightTimerRef.current !== null) {
      window.clearTimeout(highlightTimerRef.current)
    }
    highlightTimerRef.current = window.setTimeout(() => {
      setHighlightedPanel((current) => (current === panelName ? null : current))
      highlightTimerRef.current = null
    }, 1500)
  }

  function stopRecognition() {
    recognitionRef.current?.stop()
    if (usePracticeStore.getState().status === "recording") {
      setStatus("idle")
    }
  }

  function handleTopicChange(nextTopic: TopicId) {
    stopRecognition()
    setTopic(nextTopic)
  }

  function handleLevelChange(nextLevel: LevelId) {
    setLevel(nextLevel)
  }

  function handleGenerateQuestion() {
    if (isSubmitting) return
    stopRecognition()
    setHasGeneratedQuestion(true)
    generateNextQuestion()
    requestAnimationFrame(() => {
      focusAndHighlight("question")
    })
  }

  function handleToggleRecording() {
    if (!hasGeneratedQuestion || isSubmitting) return

    if (isRecording) {
      recognitionRef.current?.stop()
      setStatus("idle")
      return
    }

    const speechWindow = window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructor
      webkitSpeechRecognition?: SpeechRecognitionConstructor
    }
    const Recognition =
      speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition

    if (!Recognition) {
      setSpeechMessage(
        "Speech recognition isn't supported in this browser. Please type your answer instead."
      )
      return
    }

    try {
      const recognition = new Recognition()
      const startingText = response.trim()
      recognition.lang = "en-US"
      recognition.continuous = true
      recognition.interimResults = true
      recognition.onresult = (event) => {
        let finalTranscript = ""
        let interimTranscript = ""
        for (let index = 0; index < event.results.length; index += 1) {
          const result = event.results[index]
          if (!result) continue
          if (result.isFinal) finalTranscript += result[0]?.transcript ?? ""
          else interimTranscript += result[0]?.transcript ?? ""
        }
        const recognizedText = `${finalTranscript}${interimTranscript}`.trim()
        if (recognizedText) {
          setAnswer(
            `${startingText}${startingText ? " " : ""}${recognizedText}`
          )
        }
      }
      recognition.onerror = () => {
        setStatus("error")
        setSpeechMessage(
          "Microphone access was blocked. Check browser permissions, or type your answer."
        )
      }
      recognition.onend = () => {
        if (usePracticeStore.getState().status === "recording") {
          setStatus("idle")
        }
      }
      recognitionRef.current = recognition
      setSpeechMessage(
        "Speak clearly in English. Your transcript will appear in the response field."
      )
      setStatus("recording")
      recognition.start()
    } catch {
      setStatus("error")
      setSpeechMessage(
        "Could not start speech recognition. Please type your answer instead."
      )
    }
  }

  async function handleSubmit() {
    if (!hasGeneratedQuestion) return
    recognitionRef.current?.stop()
    requestAnimationFrame(() => {
      scrollToPanel(feedbackPanelRef.current)
    })
    await submitFeedback()
    requestAnimationFrame(() => {
      focusAndHighlight("feedback")
    })
  }

  function handleClearAnswer() {
    recognitionRef.current?.stop()
    usePracticeStore.getState().clearAnswer()
  }

  return (
    <main
      id="main"
      className="mx-auto w-full max-w-[1240px] px-4 pb-12 pt-5 sm:px-7 sm:pt-7 lg:px-10 lg:pt-8"
    >
      <AppHeader />

      <div className="mx-auto mt-7 flex max-w-[940px] flex-col gap-7 sm:mt-9 sm:gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary/80">
              <span className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(45,212,191,.75)]" />
              Practice session
            </div>
            <h2 className="text-[25px] leading-tight font-semibold tracking-[-0.045em] text-zinc-100 sm:text-[30px]">
              Practice with intention.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
              Sharpen your technical thinking and communication, one thoughtful
              answer at a time.
            </p>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[11px] text-zinc-500 md:flex">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            Ready to practice
          </div>
        </div>

        <ConfigurationBar
          topic={topic}
          level={level}
          onTopicChange={handleTopicChange}
          onLevelChange={handleLevelChange}
          onGenerate={handleGenerateQuestion}
        />

        {/* STEP 01: QUESTION */}
        <div
          ref={questionPanelRef}
          role="region"
          aria-label="Interview question"
          tabIndex={-1}
          className={cn(
            "scroll-mt-6 rounded-2xl outline-none transition-all duration-500",
            highlightedPanel === "question" &&
            "ring-2 ring-primary/50 shadow-[0_0_32px_-8px_rgba(94,234,212,0.35)]"
          )}
        >
          <StepHeading
            number="01"
            title="Question"
            detail={
              currentQuestion
                ? "Read carefully and structure your response"
                : "Choose a topic and level to begin"
            }
            status={currentQuestion ? "complete" : "active"}
          />

          {currentQuestion ? (
            <QuestionCard
              key={`${topic}-${questionIndex}`}
              question={currentQuestion}
              level={level}
              questionNumber={questionIndex + 1}
            />
          ) : (
            <QuestionEmptyState />
          )}
        </div>

        {/* STEP 02: RESPONSE */}
        {currentQuestion ? (
          <ResponseSection
            response={response}
            onResponseChange={(value) => {
              setAnswer(value)
              setSpeechMessage("")
            }}
            isRecording={isRecording}
            onToggleRecording={handleToggleRecording}
            speechMessage={speechMessage}
            onSubmit={handleSubmit}
            submitted={submitted}
            status={status}
            onClearAnswer={handleClearAnswer}
          />
        ) : (
          <section aria-labelledby="standby-response-heading">
            <StepHeading number="02" title="Your response" status="standby" />
            <ResponseEmptyState />
          </section>
        )}

        {/* STEP 03: FEEDBACK & MODEL ANSWER */}
        <section
          ref={feedbackPanelRef}
          id="feedback-panel"
          aria-label="AI feedback"
          tabIndex={-1}
          className={cn(
            "scroll-mt-6 rounded-2xl outline-none transition-all duration-500",
            highlightedPanel === "feedback" &&
            "ring-2 ring-primary/50 shadow-[0_0_32px_-8px_rgba(94,234,212,0.35)]"
          )}
        >
          <div className="border-t border-white/[0.07] pt-7 sm:pt-8">
            <StepHeading
              number="03"
              title="Feedback & model answer"
              detail={
                submitted
                  ? "Review your breakdown step by step"
                  : "Available after submitting your answer"
              }
              status={submitted ? "complete" : "standby"}
            />

            {!submitted && !isSubmitting ? (
              <FeedbackEmptyState />
            ) : (
              <>
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3 px-0.5">
                  <div>
                    <p className="section-kicker">THE DEBRIEF</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
                      <h3 className="text-lg font-semibold tracking-tight text-zinc-100">
                        AI feedback
                      </h3>
                      <Badge
                        variant="outline"
                        className="border-white/10 bg-white/[0.035] text-[10px] font-medium text-zinc-500"
                      >
                        LIVE REVIEW
                      </Badge>
                    </div>
                  </div>
                  <span className="max-w-[340px] text-xs leading-5 text-zinc-500">
                    Feedback generated for your submitted answer.
                  </span>
                </div>

                {isSubmitting ? (
                  <ThinkingPanel message="Evaluating your response..." />
                ) : (
                  <PracticeFeedback
                    key={
                      feedback
                        ? JSON.stringify(feedback.seniorModelAnswer.answer)
                        : "empty"
                    }
                    submitted={submitted}
                    feedback={feedback}
                  />
                )}
              </>
            )}
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-4 text-[11px] text-zinc-600">
          <span className="flex items-center gap-1.5">
            <Headphones className="size-3.5" />
            Built for the details that make a senior answer stand out.
          </span>
          <span className="font-mono tracking-[0.08em]">
            SENIORPARROT AI <span className="mx-1.5 text-zinc-800">/</span> 001
          </span>
        </footer>
      </div>
    </main>
  )
}