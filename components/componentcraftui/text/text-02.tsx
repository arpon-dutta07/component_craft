"use client"

import { motion } from "framer-motion"

// Unique: Floating characters with subtle per-letter bob and stagger; polished and playful.
export default function Text_02() {
  const text = "Floating Characters"
  return (
    <div className="bg-black text-white w-full flex items-center justify-center py-10 px-6">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="flex gap-0.5 sm:gap-1 md:gap-1.5"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.035 } },
        }}
        aria-label="Floating Characters"
        role="heading"
        aria-level={1}
      >
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            className="font-sans text-4xl sm:text-5xl md:text-6xl font-bold leading-none"
            variants={{
              hidden: { y: 8, opacity: 0 },
              show: { y: [0, -3, 0], opacity: 1 },
            }}
            transition={{
              duration: 0.9,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 2 + i * 0.001,
            }}
            style={{ display: "inline-block" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}
