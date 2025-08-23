"use client"

import { Send, Mic } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea"

// Split input + button layout with modern spacing
export default function AIInput_12() {
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

  return (
    <div className="w-full py-4">
      <div className="max-w-xl w-full mx-auto">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <Textarea
              placeholder="Type your message..."
              className={cn(
                "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
                "rounded-2xl pl-12 pr-4",
                "placeholder:text-gray-500 dark:placeholder:text-gray-400",
                "text-gray-900 dark:text-white",
                "focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500",
                "transition-all duration-200",
                "min-h-[52px] max-h-[200px] resize-none overflow-y-auto",
                "py-4",
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

            <button className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <Mic className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim()}
            className={cn(
              "p-4 rounded-2xl transition-all shadow-sm",
              "flex items-center justify-center",
              inputValue.trim()
                ? "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed",
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {inputValue && (
          <div className="mt-2 text-xs text-gray-500 text-right">{inputValue.length} / 2000 characters</div>
        )}
      </div>
    </div>
  )
}
