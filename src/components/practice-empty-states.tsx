export function QuestionEmptyState() {
  return (
    <div className="group relative flex min-h-[290px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0e11] p-8 text-center transition-all duration-500 hover:border-primary/30 sm:min-h-[300px]">
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
        <div className="pointer-events-none absolute size-44 rounded-full border border-primary/20 opacity-40 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
        <div className="pointer-events-none absolute size-36 rounded-full border border-dashed border-primary/30 animate-[spin_30s_linear_infinite]" />

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

export function ResponseEmptyState() {
  return (
    <div className="group relative flex min-h-[220px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0e11] p-6 text-center transition-all duration-500 hover:border-primary/30">
      {/* Glow Effect */}
      <div
        className="pointer-events-none absolute -bottom-10 size-48 rounded-full bg-primary/[0.07] blur-2xl transition-all duration-500 group-hover:bg-primary/[0.15]"
        aria-hidden="true"
      />

      {/* High-Tech Equalizer Spectrum Visual */}
      <div className="relative mb-4 flex h-12 items-end gap-1.5 rounded-2xl border border-white/[0.08] bg-[#12151a]/80 px-6 py-2 shadow-inner">
        {[40, 70, 25, 90, 55, 30, 80, 100, 65, 45, 85, 35, 95, 50, 75, 20, 60].map(
          (h, i) => (
            <span
              key={i}
              className="w-1 rounded-full bg-gradient-to-t from-primary/30 to-primary transition-all"
              style={{
                height: `${h}%`,
                animation: `pulse 1.5s ease-in-out infinite ${i * 90}ms`,
              }}
            />
          )
        )}
      </div>

      {/* Minimal Status Capsule */}
      <div className="relative z-10 flex items-center gap-2 rounded-full border border-white/10 bg-[#161a20] px-3.5 py-1 font-mono text-[11px] text-zinc-400">
        <span className="size-2 animate-ping rounded-full bg-primary/80" />
        <span className="text-zinc-300">USE YOUR VOICE OR TYPE</span>
      </div>
    </div>
  )
}

export function FeedbackEmptyState() {
  return (
    <div className="group relative flex min-h-[220px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0e11] p-6 text-center transition-all duration-500 hover:border-violet-500/30">
      {/* Radar HUD Visual */}
      <div className="relative mb-5 flex items-center justify-center gap-8">
        {/* Metric Node 1 */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex size-12 items-center justify-center rounded-full border border-primary/40 bg-primary/5">
            <div className="absolute inset-1 animate-[spin_10s_linear_infinite] rounded-full border border-dashed border-primary/30" />
            <span className="font-mono text-xs font-bold text-primary">00</span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
            TECH_DEPTH
          </span>
        </div>

        {/* Neural Line */}
        <div className="h-px w-8 bg-gradient-to-r from-primary/40 via-white/20 to-violet-500/40" />

        {/* Metric Node 2 */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex size-12 items-center justify-center rounded-full border border-white/20 bg-white/5">
            <div className="absolute inset-1 animate-[spin_15s_linear_infinite_reverse] rounded-full border border-dashed border-white/20" />
            <span className="font-mono text-xs font-bold text-zinc-400">00</span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
            DELIVERY
          </span>
        </div>

        {/* Neural Line */}
        <div className="h-px w-8 bg-gradient-to-r from-white/20 via-violet-500/30 to-violet-400/40" />

        {/* Metric Node 3 */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex size-12 items-center justify-center rounded-full border border-violet-500/40 bg-violet-500/5">
            <div className="absolute inset-1 animate-[spin_8s_linear_infinite] rounded-full border border-dashed border-violet-400/30" />
            <span className="font-mono text-xs font-bold text-violet-400">
              AI
            </span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">
            MODEL_ANS
          </span>
        </div>
      </div>

      {/* Minimal Tech Tagline */}
      <div className="relative z-10 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
        <span className="size-1.5 animate-pulse rounded-full bg-violet-400" />
        AWAITING SUBMISSION FOR ANALYTICS
      </div>
    </div>
  )
}