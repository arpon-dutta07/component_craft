"use client"

import { CornerRightUp, Mic, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea"

// Glassmorphism background with backdrop blur
export default function AIInput_06() {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 52,
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

  const handleClear = () => {
    setInputValue("")
    adjustHeight(true)
  }

  return (
    <div className="w-full py-4">
      <div className="relative max-w-xl w-full mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl" />
        <Textarea
          placeholder="Ask me anything..."
          className={cn(
            "relative backdrop-blur-md bg-white/20 dark:bg-black/20 rounded-3xl pl-6 pr-20",
            "border border-white/30 dark:border-white/10",
            "placeholder:text-gray-600 dark:placeholder:text-gray-400",
            "text-gray-900 dark:text-white",
            "focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-0",
            "transition-all duration-200",
            "min-h-[52px] max-h-[200px] resize-none overflow-y-auto",
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

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {inputValue && (
            <button
              onClick={handleClear}
              className="p-1.5 rounded-lg bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 transition-colors"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          )}
          <button
            onClick={handleSubmit}
            className="p-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors"
          >
            <CornerRightUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </button>
        </div>

        <button className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 transition-colors">
          <Mic className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </div>
  )
}
