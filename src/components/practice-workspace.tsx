"use client"

import { useEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"
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
import { PracticeFeedback } from "@/components/practice-feedback"
import { ThinkingFace } from "@/components/thinking-face"
import { cn } from "@/lib/utils"
import {
  usePracticeStore,
  type LevelId,
  type TopicId,
  type PracticeStatus,
} from "@/stores/practice-store"

type Question = { category: string; prompt: string }

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
    },
    {
      category: "Frontend Architecture",
      prompt:
        "A core application bundle has grown significantly as the product scaled. How would you identify the biggest opportunities to improve load time without compromising the user experience?",
    },
  ],
  react: [
    {
      category: "React Internals",
      prompt:
        "A complex screen feels sluggish during user interactions even though its components use memoization. How would you investigate the render path and decide what to optimize?",
    },
    {
      category: "React Internals",
      prompt:
        "Explain how concurrent rendering changes the way you think about expensive work, effects, and state updates in a React application.",
    },
  ],
  "system-design": [
    {
      category: "System Design",
      prompt:
        "Imagine you are building a real-time dashboard with high-frequency updates. How would you prevent excessive re-renders and structure the state management architecture?",
    },
    {
      category: "System Design",
      prompt:
        "Design a frontend architecture for a dashboard that streams updates from thousands of devices. How would you balance data freshness, rendering cost, and resilience to reconnects?",
    },
  ],
  behavioral: [
    {
      category: "Behavioral (STAR)",
      prompt:
        "Tell me about a time you had to align several teams around a technical direction. How did you handle disagreement, and what changed because of your approach?",
    },
    {
      category: "Behavioral (STAR)",
      prompt:
        "Describe a difficult technical decision you made with incomplete information. What trade-offs did you consider, and what did you learn from the outcome?",
    },
  ],
}

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
          V1 PRACTICE
        </Badge>
        <span className="hidden h-6 w-px bg-white/10 sm:block" aria-hidden="true" />
        <Avatar className="size-9 border border-white/10 bg-[#1a2224] text-xs text-primary">
          <AvatarFallback className="bg-[#1a2224] font-semibold text-primary">
            HQ
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}

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
          className="h-11 w-full rounded-xl bg-primary px-5 font-semibold text-[#061414] shadow-[0_0_24px_-10px_rgba(45,212,191,.7)] transition hover:-translate-y-0.5 hover:bg-[#7af2dd] sm:w-auto"
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
  const levelLabel = level === "senior" ? "Senior Level" : "Staff Level"
  return (
    <Card className="question-card relative min-h-[252px] overflow-hidden rounded-2xl border-white/[0.08] bg-[#101316] text-white shadow-[0_20px_90px_-48px_rgba(45,212,191,.22)] sm:min-h-[270px]">
      <div className="question-orbit" aria-hidden="true" />
      <CardContent className="relative flex h-full min-h-[252px] flex-col justify-between p-5 sm:min-h-[270px] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            <span className="inline-flex size-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.035] text-primary">
              <AudioLines className="size-3.5" />
            </span>
            Interview question
          </div>
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/[0.07] px-2.5 py-1 text-[11px] font-medium text-primary"
          >
            {question.category}
            <span className="mx-1.5 text-primary/40">•</span>
            {levelLabel}
          </Badge>
        </div>

        <div className="relative z-10 max-w-[900px] py-8 sm:py-9">
          <p className="mb-3 font-mono text-[11px] tracking-[0.16em] text-primary/75">
            QUESTION {String(questionNumber).padStart(2, "0")}
          </p>
          <h1 className="text-[21px] leading-[1.42] font-medium tracking-[-0.035em] text-zinc-100 sm:text-[27px] sm:leading-[1.38] lg:text-[30px]">
            {question.prompt}
          </h1>
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

function RecordingButton({
  isRecording,
  onClick,
}: {
  isRecording: boolean
  onClick: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-white/[0.07] bg-[#0d0f12] px-4 py-5 sm:min-h-[246px] sm:px-6">
      <button
        type="button"
        onClick={onClick}
        aria-label={isRecording ? "Stop recording" : "Start speech recognition"}
        aria-pressed={isRecording}
        className={`record-button relative flex size-[76px] items-center justify-center rounded-full border transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#0d0f12] sm:size-[86px] ${
          isRecording
            ? "is-recording border-rose-400/50 bg-rose-500/10 text-rose-300"
            : "border-primary/25 bg-primary/[0.09] text-primary hover:scale-[1.04] hover:border-primary/50 hover:bg-primary/[0.15]"
        }`}
      >
        {isRecording ? (
          <MicOff className="relative z-10 size-6" />
        ) : (
          <Mic className="relative z-10 size-6" />
        )}
        {isRecording && <span className="recording-ripple" aria-hidden="true" />}
      </button>
      <div className="text-center">
        <p className="text-sm font-semibold text-zinc-200">
          {isRecording ? "Listening..." : "Click to Speak"}
        </p>
        <p className="mt-1 text-[11px] text-zinc-500">Web Speech API</p>
      </div>
      <div
        className={`flex h-5 items-center gap-[3px] ${
          isRecording ? "" : "opacity-35"
        }`}
        aria-hidden="true"
      >
        {[10, 18, 13, 22, 14, 19, 9, 16, 11, 20, 12, 17, 8].map(
          (height, index) => (
            <span
              key={index}
              className={`visualizer-bar ${
                isRecording ? "visualizer-bar-active" : ""
              }`}
              style={
                {
                  "--bar-height": `${height}px`,
                  "--bar-delay": `${index * 65}ms`,
                } as CSSProperties
              }
            />
          )
        )}
      </div>
    </div>
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

  return (
    <section aria-labelledby="response-heading">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2 px-0.5">
        <div>
          <p className="section-kicker">YOUR TURN</p>
          <h2
            id="response-heading"
            className="mt-1 text-lg font-semibold tracking-tight text-zinc-100"
          >
            Your response
          </h2>
        </div>
        <span className="text-xs text-zinc-500">
          Aim for a clear, structured answer
        </span>
      </div>
      <Card className="overflow-hidden rounded-2xl border-white/[0.08] bg-[#101316] text-white">
        <CardContent className="grid gap-4 p-4 sm:grid-cols-[210px_minmax(0,1fr)] sm:p-5 lg:grid-cols-[225px_minmax(0,1fr)]">
          <RecordingButton isRecording={isRecording} onClick={onToggleRecording} />
          <div className="flex min-w-0 flex-col">
            <label
              htmlFor="answer-transcript"
              className="mb-2.5 flex items-center justify-between gap-3 text-xs font-medium text-zinc-400"
            >
              <span>Or type/edit your response here...</span>
              <span className="font-mono text-[10px] text-zinc-600">
                ENGLISH
              </span>
            </label>
            <Textarea
              id="answer-transcript"
              value={response}
              onChange={(event) => onResponseChange(event.target.value)}
              placeholder="Start with the constraints, then walk through your approach and trade-offs..."
              className="min-h-[174px] flex-1 resize-y rounded-xl border-white/[0.08] bg-[#0c0e11] p-4 text-[13px] leading-6 text-zinc-200 placeholder:text-zinc-600 focus-visible:border-primary/40 focus-visible:ring-primary/20 sm:min-h-[188px]"
              aria-describedby="response-help response-status"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <span id="response-help" className="text-[11px] text-zinc-600">
                {wordCount} {wordCount === 1 ? "word" : "words"}
              </span>
              {isNearLimit && (
                <span className="text-[11px] text-amber-400">
                  — {charCount}/{charLimit} chars
                </span>
              )}
              {isAtLimit && (
                <span className="text-[11px] text-red-500">
                  — {charCount}/{charLimit} chars (limit reached)
                </span>
              )}
              <Button
                onClick={onSubmit}
                disabled={status !== "idle" || !response.trim() || isAtLimit}
                size="lg"
                className="h-10 w-full rounded-xl bg-primary px-4 font-semibold text-[#061414] hover:bg-[#7af2dd] sm:w-auto"
              >
                {submitted ? (
                  <Check data-icon="inline-start" />
                ) : (
                  <Sparkles data-icon="inline-start" />
                )}
                {submitted ? "Answer submitted" : "Submit Answer for Feedback"}
                {!submitted && <ArrowRight data-icon="inline-end" />}
              </Button>
              {(response.length > 0 || status === "feedback" || status === "error") && (
                <Button
                  onClick={onClearAnswer}
                  disabled={status === "submitting"}
                  size="lg"
                  className="mt-2 h-10 w-full rounded-xl bg-destructive px-4 font-semibold text-white hover:bg-[var(--destructive)] sm:mt-0 sm:w-auto"
                >
                  <Trash2 data-icon="inline-start" />
                  Clear Answer
                </Button>
              )}
            </div>
            <p
              id="response-status"
              role="status"
              aria-live="polite"
              className={`mt-2 min-h-4 text-[11px] ${
                speechMessage ? "text-primary/80" : "text-zinc-600"
              }`}
            >
              {speechMessage ||
                (submitted ? "Feedback below is ready to review." : "")}
            </p>
          </div>
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

  const currentQuestion = questions[topic][questionIndex % questions[topic].length]

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
    generateNextQuestion()
    requestAnimationFrame(() => {
      focusAndHighlight("question")
    })
  }

  function handleToggleRecording() {
    if (isRecording || isSubmitting) {
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
              Make your next answer your best one.
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
          <QuestionCard
            question={currentQuestion}
            level={level}
            questionNumber={questionIndex + 1}
          />
        </div>

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
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3 px-0.5">
              <div>
                <p className="section-kicker">THE DEBRIEF</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
                  <h2 className="text-lg font-semibold tracking-tight text-zinc-100">
                    AI feedback
                  </h2>
                  <Badge
                    variant="outline"
                    className="border-white/10 bg-white/[0.035] text-[10px] font-medium text-zinc-500"
                  >
                    {submitted ? "LIVE REVIEW" : "SAMPLE REVIEW"}
                  </Badge>
                </div>
              </div>
              <span className="max-w-[340px] text-xs leading-5 text-zinc-500">
                {submitted
                  ? "Feedback generated for your submitted answer."
                  : "Example feedback for this question. Submit a response to see your evaluation."}
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