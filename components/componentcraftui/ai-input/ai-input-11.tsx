"use client"

import { Zap, Mic, ArrowUp } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea"

// Futuristic neon/glow style with electric theme
export default function AIInput_11() {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 58,
    maxHeight: 200,
  })
  const [inputValue, setInputValue] = useState("")

  const handleSubmit = () => {
    if (inputValue.trim()) {
      console.log("Submitted:", inputValue)
      setInputValue("")
      adjustHeight(true)
    }
  }

  return (
    <div className="w-full py-4">
      <div className="relative max-w-xl w-full mx-auto">
        <div className="relative">
          {/* Neon glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl animate-pulse" />

          <div className="relative bg-black/90 dark:bg-black/95 border border-cyan-500/30 rounded-2xl overflow-hidden">
            {/* Electric border animation */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-30 animate-pulse"
              style={{
                background: "linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899)",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "xor",
                padding: "1px",
              }}
            />

            <div className="relative bg-black/90 dark:bg-black/95 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg">
                  <Zap className="w-4 h-4 text-white" />
                </div>

                <Textarea
                  placeholder="Enter the matrix..."
                  className={cn(
                    "flex-1 bg-transparent border-none",
                    "placeholder:text-cyan-400/70 dark:placeholder:text-cyan-400/70",
                    "text-cyan-100 dark:text-cyan-100",
                    "focus-visible:ring-0 focus-visible:ring-offset-0",
                    "min-h-[58px] max-h-[200px] resize-none overflow-y-auto",
                    "py-2 font-mono",
                  )}
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value)
                    adjustHeight()
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit()
                    }
                  }}
                />

                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 transition-colors border border-cyan-500/30">
                    <Mic className="w-4 h-4 text-cyan-400" />
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={!inputValue.trim()}
                    className={cn(
                      "p-2 rounded-lg transition-all border",
                      inputValue.trim()
                        ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-transparent shadow-lg shadow-cyan-500/25"
                        : "bg-gray-800 text-gray-500 border-gray-700",
                    )}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
