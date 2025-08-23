"use client"

import { Send, Mic, Square } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea"

// Gradient border with animated glow
export default function AIInput_07() {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 56,
    maxHeight: 200,
  })
  const [inputValue, setInputValue] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = () => {
    if (inputValue.trim()) {
      setIsProcessing(true)
      setTimeout(() => setIsProcessing(false), 2000)
      console.log("Submitted:", inputValue)
      setInputValue("")
      adjustHeight(true)
    }
  }

  return (
    <div className="w-full py-4">
      <div className="relative max-w-xl w-full mx-auto">
        <div className="relative p-[2px] rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-pulse">
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl">
            <Textarea
              placeholder="What's on your mind?"
              className={cn(
                "bg-transparent border-none rounded-2xl pl-12 pr-16",
                "placeholder:text-gray-500 dark:placeholder:text-gray-400",
                "text-gray-900 dark:text-white",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
                "min-h-[56px] max-h-[200px] resize-none overflow-y-auto",
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

            <button className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Mic className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>

            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim() || isProcessing}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all",
                inputValue.trim() && !isProcessing
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:scale-105"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400",
              )}
            >
              {isProcessing ? <Square className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {inputValue && (
          <div className="absolute -bottom-6 right-0 text-xs text-gray-500">{inputValue.length} characters</div>
        )}
      </div>
    </div>
  )
}
