import { create } from "zustand"
import {
  practiceFeedbackSchema,
  type PracticeFeedback,
} from "@/lib/schemas/feedback"

export type TopicId = "frontend" | "react" | "system-design" | "behavioral"
export type LevelId = "senior" | "staff"

type PracticeStatus =
  | "idle"
  | "recording"
  | "submitting"
  | "feedback"
  | "error"

const MOCK_FEEDBACK: PracticeFeedback = practiceFeedbackSchema.parse({
  technicalContent: {
    score: 84,
    summary:
      "Strong initial framing around isolating high-frequency updates and avoiding unnecessary component tree re-renders.",
    strengths: [
      "Identified state granularity as the primary lever to contain render impact.",
      "Highlighted trade-offs between push/streaming updates and UI responsiveness.",
    ],
    improvements: [
      "Be more explicit about batching/throttling strategy and selector subscriptions.",
      "Call out memory/backpressure risks when bursts exceed frame budgets.",
    ],
  },
  englishDelivery: {
    score: 79,
    summary:
      "Clear technical vocabulary and logical flow, with minor opportunities to tighten transitions between trade-offs.",
    clarityNotes: [
      "Easy to follow structure from problem constraints to architectural choices.",
    ],
    grammarTips: [
      "Prefer concise active phrasing when contrasting two trade-offs in real-time systems.",
    ],
  },
  seniorModelAnswer: {
    answer:
      "I would start by clarifying update frequency, latency targets, and UI granularity. Instead of storing high-frequency ticks in a broad top-level context, I would keep volatile stream state isolated in a dedicated store or subscription layer with fine-grained selectors, throttle or batch UI commits to match frame/readability needs, and explicitly cover stale-connection recovery and memory bounds.",
    keyTakeaways: [
      "State with constraints and requirements before naming tools.",
      "Isolate high-frequency state from broad layout subscribers.",
      "Address backpressure, batching, and edge cases proactively.",
    ],
  },
})

interface PracticeState {
  topic: TopicId
  level: LevelId
  questionIndex: number
  answer: string
  status: PracticeStatus
  speechMessage: string
  feedback: PracticeFeedback | null
  setTopic: (topic: TopicId) => void
  setLevel: (level: LevelId) => void
  generateNextQuestion: () => void
  setAnswer: (answer: string) => void
  setStatus: (status: PracticeStatus) => void
  setSpeechMessage: (message: string) => void
  submitMockFeedback: () => boolean
  resetSession: () => void
}

export const usePracticeStore = create<PracticeState>((set, get) => ({
  topic: "system-design",
  level: "senior",
  questionIndex: 0,
  answer: "",
  status: "idle",
  speechMessage: "",
  feedback: null,

  setTopic: (topic) =>
    set({
      topic,
      questionIndex: 0,
      answer: "",
      status: "idle",
      speechMessage: "",
      feedback: null,
    }),

  setLevel: (level) =>
    set({
      level,
    }),

  generateNextQuestion: () =>
    set((state) => ({
      questionIndex: state.questionIndex + 1,
      answer: "",
      status: "idle",
      speechMessage: "",
      feedback: null,
    })),

  setAnswer: (answer) =>
    set((state) => ({
      answer,
      feedback: null,
      status: state.status === "feedback" ? "idle" : state.status,
    })),

  setStatus: (status) => set({ status }),

  setSpeechMessage: (speechMessage) => set({ speechMessage }),

  submitMockFeedback: () => {
    const currentAnswer = get().answer.trim()
    if (!currentAnswer) {
      set({
        status: "error",
        speechMessage: "Write or dictate an answer before submitting.",
      })
      return false
    }

    const parsed = practiceFeedbackSchema.safeParse(MOCK_FEEDBACK)
    if (!parsed.success) {
      set({
        status: "error",
        speechMessage: "Could not validate mock feedback structure.",
      })
      return false
    }

    set({
      feedback: parsed.data,
      status: "feedback",
      speechMessage:
        "This is a sample review. A live AI evaluation is not connected yet.",
    })
    return true
  },

  resetSession: () =>
    set({
      answer: "",
      status: "idle",
      speechMessage: "",
      feedback: null,
    }),
}))