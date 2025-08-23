"use client"

import { Send, Mic, Figma, Sparkles, Code, Zap, ChevronDown } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea"

const agents = [
  { id: "creative", name: "Creative", icon: Sparkles },
  { id: "code", name: "Code", icon: Code },
  { id: "design", name: "Design", icon: Figma },
  { id: "automation", name: "Automation", icon: Zap },
]

const suggestions = [
  "Design a modern landing page",
  "Write clean React components",
  "Create a color palette",
  "Generate marketing copy",
]

export default function AIInput_05() {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 56,
    maxHeight: 200,
  })
  const [inputValue, setInputValue] = useState("")
  const [selectedAgent, setSelectedAgent] = useState(agents[0])
  const [showAgentDropdown, setShowAgentDropdown] = useState(false)
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
      {/* Suggestion Chips */}
      {showSuggestions && !inputValue && (
        <div className="mb-4 space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Try these prompts:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-8 text-xs bg-muted hover:bg-accent hover:text-accent-foreground transition-all duration-200 border-border"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Main Input Container */}
      <div className="relative bg-input rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
        {/* Agent Selection */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAgentDropdown(!showAgentDropdown)}
            className="absolute left-4 top-4 h-8 px-2 text-xs bg-card hover:bg-muted border border-border z-10"
          >
            <selectedAgent.icon className="w-3 h-3 mr-1.5" />
            {selectedAgent.name}
            <ChevronDown className={cn("w-3 h-3 ml-1 transition-transform", showAgentDropdown && "rotate-180")} />
          </Button>

          {showAgentDropdown && (
            <div className="absolute left-4 top-12 bg-card border border-border rounded-lg shadow-lg z-20 min-w-[120px]">
              {agents.map((agent) => (
                <Button
                  key={agent.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedAgent(agent)
                    setShowAgentDropdown(false)
                  }}
                  className="w-full justify-start h-8 px-3 text-xs hover:bg-muted"
                >
                  <agent.icon className="w-3 h-3 mr-1.5" />
                  {agent.name}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Figma Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-accent rounded-md flex items-center justify-center">
          <Figma className="w-4 h-4 text-accent-foreground" />
        </div>

        <Textarea
          ref={textareaRef}
          placeholder="Ask AI to design, code, or create..."
          className={cn(
            "border-0 bg-transparent resize-none",
            "placeholder:text-muted-foreground",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
            "pl-16 pr-20 py-4",
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
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted rounded-lg">
            <Mic className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!inputValue.trim()}
            size="sm"
            className={cn(
              "h-8 w-8 p-0 rounded-lg transition-all duration-200",
              inputValue.trim()
                ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground cursor-not-allowed",
            )}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
