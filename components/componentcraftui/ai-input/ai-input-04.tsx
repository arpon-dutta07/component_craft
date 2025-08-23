"use client"

import { Send, Mic, Figma, Sparkles, Code, Brain, ChevronRight } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea"

const agents = [
  { id: "creative", name: "Creative Writer", icon: Sparkles, color: "bg-purple-500" },
  { id: "developer", name: "Code Assistant", icon: Code, color: "bg-blue-500" },
  { id: "designer", name: "UI Designer", icon: Figma, color: "bg-pink-500" },
  { id: "analyst", name: "Data Analyst", icon: Brain, color: "bg-green-500" },
]

const suggestions = [
  { text: "Create a modern dashboard", category: "Design" },
  { text: "Build a React component", category: "Code" },
  { text: "Write engaging copy", category: "Content" },
  { text: "Analyze user data", category: "Analytics" },
  { text: "Design a mobile app", category: "UI/UX" },
  { text: "Optimize performance", category: "Technical" },
]

export default function AIInput_04() {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  })
  const [inputValue, setInputValue] = useState("")
  const [selectedAgent, setSelectedAgent] = useState(agents[0])

  const handleSubmit = () => {
    if (!inputValue.trim()) return
    console.log("Submitted to", selectedAgent.name, ":", inputValue)
    setInputValue("")
    adjustHeight(true)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    adjustHeight()
  }

  const handleAgentSelect = (agent: (typeof agents)[0]) => {
    setSelectedAgent(agent)
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      {/* Agent Selection Card */}
      <div className="mb-6 bg-card border border-border rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-card-foreground">Select AI Agent</h3>
          <Badge variant="secondary" className="bg-accent text-accent-foreground">
            {selectedAgent.name}
          </Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {agents.map((agent) => (
            <Button
              key={agent.id}
              variant={selectedAgent.id === agent.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleAgentSelect(agent)}
              className={cn(
                "h-12 flex-col gap-1 transition-all duration-200",
                selectedAgent.id === agent.id && "bg-primary text-primary-foreground shadow-sm",
              )}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-md flex items-center justify-center",
                  selectedAgent.id === agent.id ? "bg-primary-foreground/20" : agent.color,
                )}
              >
                <agent.icon
                  className={cn("w-3 h-3", selectedAgent.id === agent.id ? "text-primary-foreground" : "text-white")}
                />
              </div>
              <span className="text-xs">{agent.name.split(" ")[0]}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Main Input Card */}
      <div className="bg-card border border-border rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Figma className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-card-foreground">AI Assistant</h2>
              <p className="text-xs text-muted-foreground">Powered by {selectedAgent.name}</p>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="relative p-6">
          <Textarea
            ref={textareaRef}
            placeholder={`Ask ${selectedAgent.name} anything...`}
            className={cn(
              "border-0 bg-transparent resize-none",
              "placeholder:text-muted-foreground",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "px-0 py-0 pr-16",
              "min-h-[60px] max-h-[200px]",
              "text-sm leading-relaxed",
            )}
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

          {/* Action Buttons */}
          <div className="absolute right-0 top-0 flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-muted rounded-lg">
              <Mic className="w-4 h-4 text-muted-foreground" />
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              size="sm"
              className={cn(
                "h-9 w-9 p-0 rounded-lg transition-all duration-200",
                inputValue.trim()
                  ? "bg-accent hover:bg-accent/90 text-accent-foreground shadow-sm"
                  : "bg-muted text-muted-foreground cursor-not-allowed",
              )}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Suggestion Chips */}
        {!inputValue && (
          <div className="px-6 pb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium text-muted-foreground">Quick suggestions:</span>
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="h-8 text-xs bg-accent/10 hover:bg-accent hover:text-accent-foreground transition-all duration-200 border-accent/20"
                >
                  <span className="text-accent/70 mr-1.5">{suggestion.category}</span>
                  {suggestion.text}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Character Count */}
        {inputValue && (
          <div className="px-6 pb-4">
            <div className="text-xs text-muted-foreground text-right">{inputValue.length} characters</div>
          </div>
        )}
      </div>
    </div>
  )
}
