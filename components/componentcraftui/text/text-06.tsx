// Unique: Morphs between words using Framer Motion crossfade.
"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"

const WORDS = ["Morphing", "Switching", "Adapting", "Evolving"]

export default function Text_06({ text }: { text?: string }) {
  const prefersReducedMotion = useReducedMotion()
  const items = text ? text.split("|") : WORDS
  const [i, setI] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % items.length), 2000)
    return () => clearInterval(id)
  }, [items.length])

  return (
    <div className="relative inline-block min-w-[8ch] select-none">
      <AnimatePresence mode="wait">
        <motion.span
          key={items[i]}
          className="font-sans text-4xl md:text-6xl font-semibold text-white"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? {} : { opacity: 0, y: -8 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: "easeOut" }}
        >
          {items[i]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
