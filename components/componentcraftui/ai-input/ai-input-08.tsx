"use client"

import { ArrowUp, Mic } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea"

// Minimal outline style with clean borders
export default function AIInput_08() {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 48,
    maxHeight: 200,
  })
  const [inputValue, setInputValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)

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
        <Textarea
          placeholder="Type your message here..."
          className={cn(
            "bg-transparent border-2 rounded-xl pl-4 pr-20",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
            "text-gray-900 dark:text-white",
            "transition-all duration-200",
            "min-h-[48px] max-h-[200px] resize-none overflow-y-auto",
            isFocused
              ? "border-blue-500 shadow-sm"
              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
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

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Mic className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>

          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim()}
            className={cn(
              "p-2 rounded-lg transition-all",
              inputValue.trim()
                ? "bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed",
            )}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
