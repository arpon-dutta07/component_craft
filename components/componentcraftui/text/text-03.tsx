"use client"

import { motion } from "framer-motion"

// Unique: Holographic multi-hue shine sweeping across clipped text (holo card vibe).
export default function Text_03() {
  return (
    <div className="bg-black text-white w-full flex items-center justify-center py-10 px-6">
      <motion.h1
        className="font-sans text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-transparent bg-clip-text holo"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        Holographic Shine
      </motion.h1>

      <style>{`
        .holo {
          background-image: conic-gradient(
            from 180deg at 50% 50%,
            #e5e7eb,
            #93c5fd,
            #99f6e4,
            #fde68a,
            #fca5a5,
            #e5e7eb
          );
          background-size: 200% 200%;
          filter: drop-shadow(0 4px 20px rgba(147, 197, 253, 0.15));
          animation: holo-pan 3.6s linear infinite;
        }
        @keyframes holo-pan {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  )
}
