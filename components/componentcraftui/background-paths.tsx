"use client"

import { motion, useReducedMotion, type Variants } from "framer-motion"
import { Button } from "@/components/ui/button"

const wordsContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const wordVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.02 },
  },
}

const letterVariants: Variants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 120, damping: 20, mass: 0.4 },
  },
}

function FloatingPaths({ position }: { position: number }) {
  const prefersReducedMotion = useReducedMotion()

  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full text-lime-400" viewBox="0 0 696 316" fill="none" aria-hidden="true">
        <title>Background Paths</title>
        <defs>
          {/* subtle neon glow */}
          <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* rotate around center to change perceived flow direction */}
        <g filter="url(#neon-glow)" transform="rotate(90 348 158)">
          {paths.map((path, i) => (
            <motion.path
              key={path.id}
              d={path.d}
              stroke="currentColor"
              strokeWidth={path.width}
              strokeLinecap="round"
              strokeOpacity={0.08 + i * 0.015}
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0.6, pathOffset: 0, opacity: 0.4 }}
              animate={
                prefersReducedMotion
                  ? { opacity: 0.35 }
                  : {
                      pathLength: [0.6, 1, 0.6],
                      pathOffset: position > 0 ? [0, 0.08, 0] : [0, -0.08, 0],
                      opacity: [0.35, 0.6, 0.35],
                    }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : {
                      duration: 16 + i * 0.25,
                      delay: i * 0.03,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "mirror",
                      ease: "easeInOut",
                    }
              }
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

export default function BackgroundPaths({
  title = "Background Paths",
}: {
  title?: string
}) {
  const words = title.split(" ")

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
          variants={wordsContainer}
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 tracking-tighter text-white">
            {words.map((word, wordIndex) => (
              <motion.span key={wordIndex} className="inline-block mr-4 last:mr-0" variants={wordVariants}>
                {word.split("").map((letter, letterIndex) => (
                  <motion.span key={`${wordIndex}-${letterIndex}`} variants={letterVariants} className="inline-block">
                    {letter}
                  </motion.span>
                ))}
              </motion.span>
            ))}
          </h1>

          <div className="inline-flex">
            <Button
              className="group inline-flex items-center rounded-[1.15rem] px-8 py-6 text-lg font-semibold
                         bg-lime-400 hover:bg-lime-300 text-black
                         transition-colors duration-200 focus-visible:outline-none
                         focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2
                         focus-visible:ring-offset-black"
            >
              <span className="opacity-100">Get Started</span>
              <span className="ml-3 transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
