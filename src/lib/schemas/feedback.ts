import { z } from "zod"

export const technicalContentSchema = z.object({
  score: z.number().min(0).max(100),
  summary: z.string().min(1),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
})

export const englishDeliverySchema = z.object({
  score: z.number().min(0).max(100),
  summary: z.string().min(1),
  clarityNotes: z.array(z.string()),
  grammarTips: z.array(z.string()),
})

export const seniorModelAnswerSchema = z.object({
  answer: z.string().min(1),
  keyTakeaways: z.array(z.string()),
})

export const practiceFeedbackSchema = z.object({
  technicalContent: technicalContentSchema,
  englishDelivery: englishDeliverySchema,
  seniorModelAnswer: seniorModelAnswerSchema,
})

export type PracticeFeedback = z.infer<typeof practiceFeedbackSchema>