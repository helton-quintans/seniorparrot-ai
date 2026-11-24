import { cn } from "@/lib/utils"

type ThinkingFaceProps = {
  className?: string
}

export function ThinkingFace({ className }: ThinkingFaceProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("thinking-face text-primary", className)}
      fill="none"
      viewBox="0 0 100 100"
    >
      <circle className="thinking-face-outline" cx="50" cy="50" r="36" stroke="currentColor" strokeWidth="1.6" />
      <ellipse className="thinking-face-eye thinking-face-eye-left" cx="38" cy="45" rx="2.7" ry="3.5" fill="currentColor" />
      <ellipse className="thinking-face-eye thinking-face-eye-right" cx="62" cy="45" rx="2.7" ry="3.5" fill="currentColor" />
      <path
        className="thinking-face-mouth"
        d="M39 61.5c3.2 4.1 7.1 6.2 11 6.2s7.8-2.1 11-6.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  )
}