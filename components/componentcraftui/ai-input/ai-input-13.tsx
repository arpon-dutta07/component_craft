"use client"

import { Send, Mic, Sparkles } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea"

// Two-tone theme style with accent colors
export default function AIInput_13() {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 54,
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
        <div className="relative bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-2xl p-1">
          <div className="bg-white dark:bg-gray-900 rounded-xl">
            <div className="flex items-start p-3 gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>

              <Textarea
                placeholder="Chat with AI assistant..."
                className={cn(
                  "flex-1 bg-transparent border-none",
                  "placeholder:text-gray-500 dark:placeholder:text-gray-400",
                  "text-gray-900 dark:text-white",
                  "focus-visible:ring-0 focus-visible:ring-offset-0",
                  "min-h-[54px] max-h-[200px] resize-none overflow-y-auto",
                  "py-2",
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

              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Mic className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={!inputValue.trim()}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    inputValue.trim()
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-400",
                  )}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
