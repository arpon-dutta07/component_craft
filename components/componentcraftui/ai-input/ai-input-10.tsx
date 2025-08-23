"use client"

import { Search, Mic, ArrowRight } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea"

// Input with integrated icon inside and search-like appearance
export default function AIInput_10() {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 50,
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
        <div className="relative flex items-start bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center pl-4 pr-2 py-3">
            <Search className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>

          <Textarea
            placeholder="Search or ask AI..."
            className={cn(
              "flex-1 bg-transparent border-none rounded-full",
              "placeholder:text-gray-500 dark:placeholder:text-gray-400",
              "text-gray-900 dark:text-white",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "min-h-[50px] max-h-[200px] resize-none overflow-y-auto",
              "py-3 pr-2",
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

          <div className="flex items-center gap-1 pr-2 py-3">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <Mic className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>

            {inputValue && (
              <button
                onClick={handleSubmit}
                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
