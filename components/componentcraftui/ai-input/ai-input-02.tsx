"use client"

import { Send, Sparkles, Zap, Brain, Mic, Paperclip } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea"

const suggestions = [
  { icon: Sparkles, text: "Generate creative content", color: "text-purple-500" },
  { icon: Brain, text: "Analyze and summarize", color: "text-blue-500" },
  { icon: Zap, text: "Quick automation", color: "text-yellow-500" },
]

export default function AIInput_02() {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 56,
    maxHeight: 200,
  })
  const [inputValue, setInputValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(true)

  const handleSubmit = () => {
    if (!inputValue.trim()) return
    console.log("Submitted:", inputValue)
    setInputValue("")
    adjustHeight(true)
    setShowSuggestions(true)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    setShowSuggestions(false)
    adjustHeight()
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Suggestions */}
      {showSuggestions && !inputValue && (
        <div className="mb-4 space-y-2">
          <p className="text-sm text-muted-foreground font-medium">Try these:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-8 text-xs border-dashed hover:border-solid transition-all duration-200 bg-transparent"
                onClick={() => handleSuggestionClick(suggestion.text)}
              >
                <suggestion.icon className={cn("w-3 h-3 mr-1.5", suggestion.color)} />
                {suggestion.text}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Container */}
      <div className="relative">
        <div className="relative border border-border rounded-2xl bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
          <Textarea
            ref={textareaRef}
            placeholder="Ask AI anything..."
            className={cn(
              "border-0 bg-transparent resize-none",
              "placeholder:text-muted-foreground/70",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "px-4 py-4 pr-24",
              "min-h-[56px] max-h-[200px]",
              "text-sm leading-relaxed",
            )}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setShowSuggestions(false)
              adjustHeight()
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
          />

          {/* Action Buttons */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted/50">
              <Paperclip className="w-4 h-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted/50">
              <Mic className="w-4 h-4 text-muted-foreground" />
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              size="sm"
              className={cn(
                "h-8 w-8 p-0 transition-all duration-200",
                inputValue.trim()
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "bg-muted text-muted-foreground cursor-not-allowed",
              )}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Character Count */}
        {inputValue && (
          <div className="mt-2 text-xs text-muted-foreground text-right">{inputValue.length} characters</div>
        )}
      </div>
    </div>
  )
}
