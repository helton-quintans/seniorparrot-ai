import { NextResponse } from "next/server"
import { practiceFeedbackSchema } from "@/lib/schemas/feedback"

type PracticeFeedbackInput = {
  question?: unknown
  topic?: unknown
  level?: unknown
  answer?: unknown
}

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash"
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b"
const MAX_ANSWER_CHARS = 4000
const PROVIDER_TIMEOUT_MS = 12000
const MAX_GEMINI_RETRIES = 1

function extractGeminiText(geminiData: unknown): string {
  if (!geminiData || typeof geminiData !== "object") return ""

  const candidates = (geminiData as { candidates?: unknown }).candidates
  if (!Array.isArray(candidates) || candidates.length === 0) return ""

  const firstCandidate = candidates[0]
  if (!firstCandidate || typeof firstCandidate !== "object") return ""

  const content = (firstCandidate as { content?: unknown }).content
  if (!content || typeof content !== "object") return ""

  const parts = (content as { parts?: unknown }).parts
  if (!Array.isArray(parts)) return ""

  return parts
    .map((part) => {
      if (
        part &&
        typeof part === "object" &&
        "text" in part &&
        typeof (part as { text?: unknown }).text === "string"
      ) {
        return (part as { text: string }).text
      }
      return ""
    })
    .join("")
    .trim()
}

function extractGroqText(groqData: unknown): string {
  if (!groqData || typeof groqData !== "object") return ""

  const choices = (groqData as { choices?: unknown }).choices
  if (!Array.isArray(choices) || choices.length === 0) return ""

  const firstChoice = choices[0]
  if (!firstChoice || typeof firstChoice !== "object") return ""

  const message = (firstChoice as { message?: unknown }).message
  if (!message || typeof message !== "object") return ""

  const content = (message as { content?: unknown }).content
  return typeof content === "string" ? content.trim() : ""
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs = PROVIDER_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeoutId)
  }
}

async function callGemini(apiKey: string, prompt: string): Promise<Response> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    GEMINI_MODEL
  )}:generateContent?key=${encodeURIComponent(apiKey)}`

  const payload = JSON.stringify({
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 2048,
      responseMimeType: "application/json",
    },
  })

  let lastResponse: Response | null = null
  let lastError: unknown = null

  for (let attempt = 0; attempt <= MAX_GEMINI_RETRIES; attempt++) {
    try {
      const response = await fetchWithTimeout(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      })

      lastResponse = response

      if (
        (response.status === 503 || response.status === 429) &&
        attempt < MAX_GEMINI_RETRIES
      ) {
        await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)))
        continue
      }

      return response
    } catch (err) {
      lastError = err
      if (err instanceof Error && err.name === "AbortError") {
        throw err
      }
      if (attempt < MAX_GEMINI_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)))
        continue
      }
    }
  }

  if (lastResponse) return lastResponse
  throw lastError ?? new Error("Failed to reach Gemini API")
}

async function callGroq(apiKey: string, prompt: string): Promise<Response> {
  return fetchWithTimeout("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.3,
      max_tokens: 2048,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an expert engineering mentor. Always respond with valid JSON matching the requested schema.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  })
}

function parseAndValidateFeedback(rawText: string) {
  let parsedJson: unknown
  try {
    parsedJson = JSON.parse(rawText)
  } catch (parseError) {
    return {
      ok: false as const,
      error: "Invalid JSON returned by AI service",
      details:
        parseError instanceof Error ? parseError.message : "JSON parse failed",
    }
  }

  const validated = practiceFeedbackSchema.safeParse(parsedJson)
  if (!validated.success) {
    return {
      ok: false as const,
      error: "AI response did not match expected feedback schema",
      details: JSON.stringify(validated.error.flatten()),
    }
  }

  return {
    ok: true as const,
    data: validated.data,
  }
}

export async function POST(request: Request) {
  try {
    let body: PracticeFeedbackInput
    try {
      body = (await request.json()) as PracticeFeedbackInput
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body" },
        { status: 400 }
      )
    }

    const question = typeof body.question === "string" ? body.question.trim() : ""
    const topic = typeof body.topic === "string" ? body.topic.trim() : ""
    const level = body.level
    const answer = typeof body.answer === "string" ? body.answer : ""

    if (!question) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 })
    }
    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }
    if (level !== "senior" && level !== "staff") {
      return NextResponse.json({ error: "Invalid level" }, { status: 400 })
    }
    if (!answer.trim()) {
      return NextResponse.json({ error: "Answer is required" }, { status: 400 })
    }
    if (answer.length > MAX_ANSWER_CHARS) {
      return NextResponse.json(
        { error: `Answer exceeds maximum length of ${MAX_ANSWER_CHARS} characters` },
        { status: 400 }
      )
    }

    const geminiKey = process.env.GEMINI_API_KEY
    const groqKey = process.env.GROQ_API_KEY

    if (!geminiKey && !groqKey) {
      return NextResponse.json(
        { error: "AI evaluation service is not configured" },
        { status: 500 }
      )
    }

    const prompt = `You are an expert engineering mentor providing feedback on a practice interview answer. Evaluate the response realistically and constructively for the target seniority level.

Question: ${question}
Topic: ${topic}
Level: ${level}

Answer: ${answer}

Return ONLY valid JSON with these exact top-level keys (no other top-level keys, no markdown fences):
{
  "technicalContent": {
    "score": number,
    "summary": string,
    "strengths": string[],
    "improvements": string[]
  },
  "englishDelivery": {
    "score": number,
    "summary": string,
    "clarityNotes": string[],
    "grammarTips": string[]
  },
  "seniorModelAnswer": {
    "answer": string,
    "keyTakeaways": string[]
  }
}`

    let geminiErrorDetail = ""
    let geminiTimedOut = false

    if (geminiKey) {
      try {
        const geminiResponse = await callGemini(geminiKey, prompt)

        if (geminiResponse.ok) {
          const geminiData = await geminiResponse.json().catch(() => null)
          const rawText = extractGeminiText(geminiData)

          if (!rawText) {
            return NextResponse.json(
              {
                error: "Empty response from AI service",
                ...(process.env.NODE_ENV !== "production" && {
                  details: "No text part found in Gemini candidate response",
                }),
              },
              { status: 502 }
            )
          }

          const result = parseAndValidateFeedback(rawText)
          if (!result.ok) {
            console.error("Gemini feedback validation failed:", result.details)
            return NextResponse.json(
              {
                error: result.error,
                ...(process.env.NODE_ENV !== "production" && {
                  details: result.details,
                }),
              },
              { status: 502 }
            )
          }

          return NextResponse.json(result.data, { status: 200 })
        }

        const errorText = await geminiResponse.text().catch(() => "")
        geminiErrorDetail = `Gemini status ${geminiResponse.status}: ${errorText.slice(0, 300)}`
        console.error("Gemini API error:", geminiErrorDetail)

        const shouldFallbackToGroq =
          (geminiResponse.status === 503 || geminiResponse.status === 429) &&
          Boolean(groqKey)

        if (!shouldFallbackToGroq) {
          return NextResponse.json(
            {
              error:
                geminiResponse.status === 429
                  ? "Rate limit exceeded. Please try again shortly."
                  : geminiResponse.status === 503
                    ? "AI service is temporarily experiencing high demand. Please try again in a moment."
                    : "Failed to get AI feedback",
              ...(process.env.NODE_ENV !== "production" && {
                details: geminiErrorDetail,
              }),
            },
            { status: geminiResponse.status >= 400 ? geminiResponse.status : 502 }
          )
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          geminiTimedOut = true
          geminiErrorDetail = "Gemini request timed out"
          if (!groqKey) {
            return NextResponse.json(
              { error: "AI request timed out. Please try again." },
              { status: 504 }
            )
          }
        } else {
          geminiErrorDetail =
            err instanceof Error ? err.message : "Unknown Gemini network error"
          console.error("Gemini unexpected error:", geminiErrorDetail)
          if (!groqKey) {
            throw err
          }
        }
      }
    }

    if (groqKey) {
      try {
        const groqResponse = await callGroq(groqKey, prompt)

        if (groqResponse.status === 429) {
          return NextResponse.json(
            {
              error: "Rate limit exceeded. Please try again shortly.",
              ...(process.env.NODE_ENV !== "production" &&
                geminiErrorDetail && { details: geminiErrorDetail }),
            },
            { status: 429 }
          )
        }

        if (!groqResponse.ok) {
          const errorText = await groqResponse.text().catch(() => "")
          const groqDetail = `Groq status ${groqResponse.status}: ${errorText.slice(0, 300)}`
          console.error("Groq API error:", groqDetail)
          return NextResponse.json(
            {
              error: "Failed to get AI feedback",
              ...(process.env.NODE_ENV !== "production" && {
                details: [geminiErrorDetail, groqDetail].filter(Boolean).join(" | "),
              }),
            },
            { status: groqResponse.status >= 400 ? groqResponse.status : 502 }
          )
        }

        const groqData = await groqResponse.json().catch(() => null)
        const rawText = extractGroqText(groqData)

        if (!rawText) {
          return NextResponse.json(
            {
              error: "Empty response from AI service",
              ...(process.env.NODE_ENV !== "production" && {
                details: "No content found in Groq completion response",
              }),
            },
            { status: 502 }
          )
        }

        const result = parseAndValidateFeedback(rawText)
        if (!result.ok) {
          console.error("Groq feedback validation failed:", result.details)
          return NextResponse.json(
            {
              error: result.error,
              ...(process.env.NODE_ENV !== "production" && {
                details: result.details,
              }),
            },
            { status: 502 }
          )
        }

        return NextResponse.json(result.data, { status: 200 })
      } catch (groqErr) {
        if (groqErr instanceof Error && groqErr.name === "AbortError") {
          return NextResponse.json(
            { error: "AI request timed out. Please try again." },
            { status: 504 }
          )
        }
        throw groqErr
      }
    }

    if (geminiTimedOut) {
      return NextResponse.json(
        { error: "AI request timed out. Please try again." },
        { status: 504 }
      )
    }

    return NextResponse.json(
      { error: "Failed to get AI feedback" },
      { status: 502 }
    )
  } catch (error) {
    console.error("Unexpected error in POST /api/practice/feedback:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        ...(process.env.NODE_ENV !== "production" && {
          details: error instanceof Error ? error.message : "Unknown error",
        }),
      },
      { status: 500 }
    )
  }
}