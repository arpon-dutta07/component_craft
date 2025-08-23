"use client"

import { Send, Mic } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea"

// Floating placeholder animation with modern styling
export default function AIInput_09() {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  })
  const [inputValue, setInputValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const hasContent = inputValue.length > 0
  const showFloatingLabel = isFocused || hasContent

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
          <Textarea
            className={cn(
              "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl",
              "pl-4 pr-16 pt-6 pb-4",
              "text-gray-900 dark:text-white",
              "focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500",
              "transition-all duration-200",
              "min-h-[60px] max-h-[200px] resize-none overflow-y-auto",
            )}
            ref={textareaRef}
            value={inputValue}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
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

          <label
            className={cn(
              "absolute left-4 transition-all duration-200 pointer-events-none",
              "text-gray-500 dark:text-gray-400",
              showFloatingLabel ? "top-2 text-xs font-medium" : "top-1/2 -translate-y-1/2 text-base",
            )}
          >
            Ask me anything...
          </label>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <Mic className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>

            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              className={cn(
                "p-2 rounded-full transition-all",
                inputValue.trim()
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400",
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
