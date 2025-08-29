// Unique: Letter-by-letter hover lift with cyan tint.
"use client"

import { motion } from "framer-motion"

export default function Text_04({ text = "Letter Hover" }: { text?: string }) {
  const chars = Array.from(text)
  return (
    <span className="inline-flex select-none">
      {chars.map((c, i) => (
        <motion.span
          key={i}
          className="font-sans text-4xl md:text-6xl font-semibold text-white"
          whileHover={{ y: -4, color: "rgb(34 211 238)" }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          {c === " " ? "\u00A0" : c}
        </motion.span>
      ))}
    </span>
  )
}
