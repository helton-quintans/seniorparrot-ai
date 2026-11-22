import type { CSSProperties } from "react"
import {
  Check,
  CircleCheck,
  Lightbulb,
  MessageSquareText,
  Quote,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PracticeFeedback as PracticeFeedbackData } from "@/lib/schemas/feedback"
import { FormattedFeedbackText } from "@/components/formatted-feedback-text"

type DisplayNote = {
  positive: boolean
  text: string
}

type DisplayDeliveryItem = {
  label: string
  text: string
}

const DEFAULT_TECHNICAL_NOTES: DisplayNote[] = [
  {
    positive: true,
    text: "Clear separation between the incoming data pipeline and the UI state.",
  },
  {
    positive: true,
    text: "Selective subscriptions can keep unrelated widgets from re-rendering.",
  },
  {
    positive: false,
    text: "Call out backpressure, reconnect behavior, and acceptable data staleness.",
  },
]

const DEFAULT_DELIVERY_NOTES: DisplayDeliveryItem[] = [
  {
    label: "Be specific",
    text: "Name the update cadence or batching strategy you would measure.",
  },
  {
    label: "Surface trade-offs",
    text: "Use a phrase like “The trade-off is freshness versus render cost.”",
  },
  {
    label: "Sound natural",
    text: "Replace repeated “I would” with “I’d start by…” or “From there…”",
  },
]

const DEFAULT_MODEL_ANSWER =
  "Well, it depends on the freshness guarantees the dashboard needs. I’d separate event ingestion from UI state, normalize updates by entity, and batch them at a measured cadence. In React, I’d keep server state in a query cache and transient state close to each feature, using focused selectors so only affected widgets update. Then I’d measure render cost and end-to-end latency. The trade-off is a small amount of staleness and buffering complexity in exchange for predictable rendering under load."

function ScoreRing({ score }: { score: number }) {
  const clampedScore = Math.max(0, Math.min(10, score))
  return (
    <div
      className="score-ring"
      role="img"
      aria-label={`Technical content score: ${clampedScore} out of 10`}
      style={
        {
          "--score-angle": `${(clampedScore / 10) * 360}deg`,
        } as CSSProperties
      }
    >
      <span className="score-ring-inner">
        <strong>{clampedScore}</strong>
        <span>/10</span>
      </span>
    </div>
  )
}

function TechnicalCard({
  score,
  notes,
}: {
  score: number
  notes: DisplayNote[]
}) {
  return (
    <Card className="feedback-card h-full rounded-2xl border-white/[0.08] bg-[#101316] text-white">
      <CardHeader className="gap-3 px-5 pt-5 pb-0 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <span className="feedback-icon border-primary/15 bg-primary/[0.08] text-primary">
            <Lightbulb className="size-4" />
          </span>
          <ScoreRing score={score} />
        </div>
        <div>
          <CardTitle className="text-sm font-semibold text-zinc-100">
            Technical Content
          </CardTitle>
          <p className="mt-1 text-xs text-zinc-500">
            Architecture &amp; trade-offs
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-5 pt-4 pb-5">
        <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.11em] text-zinc-500">
          <CircleCheck className="size-3.5 text-primary" />
          What stands out
        </div>
        <ul className="flex flex-col gap-3">
          {notes.map((note, index) => (
            <li
              key={`${index}-${note.text}`}
              className="flex items-start gap-2.5 text-xs leading-[1.6] text-zinc-400"
            >
              <span
                className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full ${
                  note.positive
                    ? "bg-primary/10 text-primary"
                    : "bg-amber-400/10 text-amber-300"
                }`}
              >
                {note.positive ? (
                  <Check className="size-2.5" />
                ) : (
                  <span className="text-[9px] font-bold">!</span>
                )}
              </span>
              {note.text.trim()}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function DeliveryCard({ items }: { items: DisplayDeliveryItem[] }) {
  return (
    <Card className="feedback-card h-full rounded-2xl border-white/[0.08] bg-[#101316] text-white">
      <CardHeader className="gap-3 px-5 pt-5 pb-0 sm:px-5">
        <span className="feedback-icon border-sky-300/15 bg-sky-300/[0.07] text-sky-200">
          <MessageSquareText className="size-4" />
        </span>
        <div>
          <CardTitle className="text-sm font-semibold text-zinc-100">
            English &amp; Delivery
          </CardTitle>
          <p className="mt-1 text-xs text-zinc-500">
            Clarity, pace &amp; vocabulary
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-5 pt-4 pb-5">
        <div className="flex flex-col gap-3.5">
          {items.map((note, index) => (
            <div key={`${index}-${note.label}`} className="flex gap-3">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border border-white/[0.07] bg-white/[0.025] font-mono text-[9px] text-zinc-500">
                0{index + 1}
              </span>
              <div>
                <p className="text-xs font-medium text-zinc-300">
                  {note.label}
                </p>
                <p className="mt-1 text-[11px] leading-[1.55] text-zinc-500">
                  {note.text.trim()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ModelAnswerCard({
  answer,
  takeaway,
}: {
  answer: string
  takeaway: string
}) {
  return (
    <Card className="feedback-card h-full rounded-2xl border-primary/[0.16] bg-[linear-gradient(145deg,rgba(45,212,191,.055),rgba(16,19,22,.98)_38%)] text-white">
      <CardHeader className="gap-3 px-5 pt-5 pb-0 sm:px-5">
        <div className="flex items-start justify-between gap-3">
          <span className="feedback-icon border-violet-300/15 bg-violet-300/[0.07] text-violet-200">
            <Quote className="size-4" />
          </span>
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/[0.06] text-[9px] font-medium tracking-[0.08em] text-primary"
          >
            MODEL ANSWER
          </Badge>
        </div>
        <div>
          <CardTitle className="text-sm font-semibold text-zinc-100">
            Senior Model Answer
          </CardTitle>
          <p className="mt-1 text-xs text-zinc-500">
            Concise, with the trade-off up front
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-5 pt-4 pb-5">
        <div className="border-l-2 border-primary/40 pl-3.5">
          <FormattedFeedbackText content={answer} />
        </div>
        <div className="mt-4 flex items-center gap-2 border-t border-white/6 pt-3 text-[10px] text-zinc-500">
          <Sparkles className="size-3.5 shrink-0 text-primary/70" />
          <span>{takeaway.trim()}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function PracticeFeedback({
  submitted,
  feedback,
}: {
  submitted: boolean
  feedback?: PracticeFeedbackData | null
}) {
  const activeFeedback = submitted && feedback ? feedback : null

  // Ajustado: nota direta sem dividir por 10
  const technicalScore = activeFeedback
    ? activeFeedback.technicalContent.score
    : 8

  const technicalNotes: DisplayNote[] = activeFeedback
    ? [
        ...activeFeedback.technicalContent.strengths.map((text) => ({
          positive: true,
          text,
        })),
        ...activeFeedback.technicalContent.improvements.map((text) => ({
          positive: false,
          text,
        })),
      ]
    : DEFAULT_TECHNICAL_NOTES

  const deliveryItems: DisplayDeliveryItem[] = activeFeedback
    ? [
        ...activeFeedback.englishDelivery.clarityNotes.map((text, idx) => ({
          label: `Clarity ${idx + 1}`,
          text,
        })),
        ...activeFeedback.englishDelivery.grammarTips.map((text, idx) => ({
          label: `Delivery Tip ${idx + 1}`,
          text,
        })),
      ]
    : DEFAULT_DELIVERY_NOTES

  const modelAnswer = activeFeedback
    ? activeFeedback.seniorModelAnswer.answer
    : DEFAULT_MODEL_ANSWER

  const takeaway =
    activeFeedback?.seniorModelAnswer.keyTakeaways[0] ??
    "Lead with constraints. Close with how you'd measure success."

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <TechnicalCard score={technicalScore} notes={technicalNotes} />
      <DeliveryCard items={deliveryItems} />
      <ModelAnswerCard answer={modelAnswer} takeaway={takeaway} />
      <p className="sr-only" aria-live="polite">
        {submitted
          ? "Sample review state is active."
          : "Feedback panel shows a sample review."}
      </p>
    </div>
  )
}