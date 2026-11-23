import React from "react"

function renderInlineBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={index} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return <React.Fragment key={index}>{part}</React.Fragment>
  })
}

export function FormattedFeedbackText({ content }: { content: string }) {
  const normalized = content.replace(/\r\n/g, "\n").trim()
  if (!normalized) return null

  const blocks = normalized.split(/\n{2,}/)

  return (
    <div className="space-y-3.5 text-sm leading-relaxed text-zinc-200">
      {blocks.map((block, blockIndex) => {
        const lines = block
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)

        const isBulletList =
          lines.length > 0 &&
          lines.every((line) => /^([-*•]|\d+\.)\s+/.test(line))

        if (isBulletList) {
          const isOrdered = /^\d+\.\s+/.test(lines[0])
          const ListTag = isOrdered ? "ol" : "ul"

          return (
            <ListTag
              key={blockIndex}
              className={`space-y-2 pl-5 ${isOrdered ? "list-decimal" : "list-disc"
                } marker:text-emerald-400`}
            >
              {lines.map((line, lineIndex) => {
                const cleanItem = line.replace(/^([-*•]|\d+\.)\s+/, "")
                const parsedNumber = line.match(/^(\d+)\.\s+/)?.[1]
                const itemValue = parsedNumber ? Number(parsedNumber) : lineIndex + 1

                return (
                  <li
                    key={lineIndex}
                    value={isOrdered ? itemValue : undefined}
                    className="pl-1"
                  >
                    {renderInlineBold(cleanItem)}
                  </li>
                )
              })}
            </ListTag>
          )
        }

        return (
          <p key={blockIndex} className="whitespace-pre-line">
            {renderInlineBold(block)}
          </p>
        )
      })}
    </div>
  )
}