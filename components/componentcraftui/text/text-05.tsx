// Unique: Gentle breathing pulse to keep the headline alive.
"use client"

import { motion, useReducedMotion } from "framer-motion"

export default function Text_05({ text = "Pulse Breathing" }: { text?: string }) {
  const prefersReducedMotion = useReducedMotion()
  return (
    <motion.span
      className="inline-block font-sans text-4xl md:text-6xl font-semibold text-white select-none"
      animate={
        prefersReducedMotion
          ? {}
          : { scale: [1, 1.03, 1], filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"] }
      }
      transition={{ duration: prefersReducedMotion ? 0 : 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
    >
      {text}
    </motion.span>
  )
}
