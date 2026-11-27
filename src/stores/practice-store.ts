import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import {
  practiceFeedbackSchema,
  type PracticeFeedback,
} from "@/lib/schemas/feedback"

export type TopicId = "frontend" | "react" | "system-design" | "behavioral"
export type LevelId = "senior" | "staff"

const MAX_ANSWER_CHARS = 4000

export type PracticeStatus =
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
  question: string
  answer: string
  status: PracticeStatus
  speechMessage: string
  feedback: PracticeFeedback | null
  setTopic: (topic: TopicId) => void
  setLevel: (level: LevelId) => void
  generateNextQuestion: () => void
  setAnswer: (nextAnswer: string) => void
  setStatus: (status: PracticeStatus) => void
  setSpeechMessage: (message: string) => void
  submitMockFeedback: () => boolean
  resetSession: () => void
  clearAnswer: () => void
  submitFeedback: () => Promise<void>
}

export const usePracticeStore = create<PracticeState>()(
  persist(
    (set, get) => ({
      topic: "system-design",
      level: "senior",
      questionIndex: 0,
      question:
        "How would you structure a large React application so product teams can ship independently without creating duplicated design systems or tightly coupled features?",
      answer: "",
      status: "idle",
      speechMessage: "",
      feedback: null,

      setTopic: (topic) =>
        set({
          topic,
          questionIndex: 0,
          question:
            "How would you structure a large React application so product teams can ship independently without creating duplicated design systems or tightly coupled features?",
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

      setAnswer: (nextAnswer) =>
        set((state) => {
          if (nextAnswer.length > MAX_ANSWER_CHARS) {
            return {
              answer: nextAnswer.slice(0, MAX_ANSWER_CHARS),
              feedback: null,
              status: "error",
              speechMessage: `Answer is capped at ${MAX_ANSWER_CHARS} characters. Extra text was trimmed.`,
            }
          }

          const shouldResetStatus =
            state.status === "feedback" || state.status === "error"

          return {
            answer: nextAnswer,
            feedback: null,
            status: shouldResetStatus ? "idle" : state.status,
            speechMessage: state.status === "error" ? "" : state.speechMessage,
          }
        }),

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
        if (get().answer.length > MAX_ANSWER_CHARS) {
          set({
            status: "error",
            speechMessage: `Answer exceeds ${MAX_ANSWER_CHARS} character limit. Please trim your response.`,
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

      submitFeedback: async () => {
        const state = get()

        if (!state.answer.trim()) {
          set({
            feedback: null,
            status: "error",
            speechMessage: "Write or dictate an answer before submitting.",
          })
          return
        }
        if (state.answer.length > MAX_ANSWER_CHARS) {
          set({
            feedback: null,
            status: "error",
            speechMessage: `Answer exceeds ${MAX_ANSWER_CHARS} character limit. Please trim your response.`,
          })
          return
        }

        set({ status: "submitting" })

        try {
          const response = await fetch("/api/practice/feedback", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              question: state.question,
              topic: state.topic,
              level: state.level,
              answer: state.answer,
            }),
          })

          if (response.ok) {
            const data = await response.json()
            set({
              feedback: data,
              status: "feedback",
              speechMessage: "",
            })
          } else {
            const errData = await response.json().catch(() => ({}))
            set({
              feedback: null,
              status: "error",
              speechMessage:
                errData.error || "Erro ao obter feedback. Tente novamente.",
            })
          }
        } catch {
          set({
            feedback: null,
            status: "error",
            speechMessage:
              "Erro de rede. Verifique a conexão ou tente novamente mais tarde.",
          })
        }
      },

      resetSession: () =>
        set({
          answer: "",
          status: "idle",
          speechMessage: "",
          feedback: null,
        }),

      clearAnswer: () =>
        set({
          answer: "",
          status: "idle",
          speechMessage: "",
          feedback: null,
        }),
    }),
    {
      name: "seniorparrot-practice-session",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Exclude transient UI/recording states from storage
      partialize: (state) => ({
        topic: state.topic,
        level: state.level,
        questionIndex: state.questionIndex,
        question: state.question,
        answer: state.answer,
        feedback: state.feedback,
      }),
      // Avoid restoring stale "recording" or "submitting" states after reload
      onRehydrateStorage: () => (state) => {
        if (!state) return
        state.speechMessage = ""
        state.status = state.feedback ? "feedback" : "idle"
      },
    }
  )
)