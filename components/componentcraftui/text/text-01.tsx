export default function Text_01() {
  return (
    <div className="bg-black text-white w-full flex items-center justify-center py-10 px-6">
      <div className="relative px-2 py-1 overflow-hidden">
        <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight shimmer-text">
          Classy Shimmer
        </h1>
      </div>
      <style>{`
        /* Unique: Subtle metallic shimmer tuned for black backgrounds (Linear/Vercel vibe) */
        .shimmer-text {
          --s-start: #e5e7eb; /* zinc-200 */
          --s-mid:   #a7f3d0; /* emerald-200 accent */
          --s-hi:    #67e8f9; /* cyan-300 highlight */
          background: linear-gradient(
            100deg,
            var(--s-start) 0%,
            var(--s-start) 32%,
            var(--s-hi)    50%,
            var(--s-mid)   58%,
            var(--s-start) 72%,
            var(--s-start) 100%
          );
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmer 3.2s ease-in-out infinite;
          letter-spacing: -0.01em;
          will-change: background-position;
        }
        @keyframes shimmer {
          0% { background-position: 120% 0; }
          100% { background-position: -120% 0; }
        }
        .shimmer-text:hover {
          animation-duration: 2.2s;
        }
        @media (prefers-color-scheme: light) {
          .shimmer-text {
            --s-start: #334155; /* slate-700 */
            --s-mid:   #64748b; /* slate-500 */
            --s-hi:    #94a3b8; /* slate-400 */
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .shimmer-text { animation: none; background-position: 0 0; }
        }
      `}</style>
    </div>
  )
}
