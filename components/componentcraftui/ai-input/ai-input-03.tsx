"use client"

import { Send, Sparkles, Code, ImageIcon, Mic, X, ChevronDown, Bot } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea"

const agents = [
  {
    id: "creative",
    name: "Creative Writer",
    icon: Sparkles,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    description: "Generate creative content and stories",
  },
  {
    id: "developer",
    name: "Code Assistant",
    icon: Code,
    color: "bg-gradient-to-r from-blue-500 to-cyan-500",
    description: "Help with coding and technical tasks",
  },
  {
    id: "analyst",
    name: "Data Analyst",
    icon: ImageIcon,
    color: "bg-gradient-to-r from-green-500 to-emerald-500",
    description: "Analyze data and create reports",
  },
  {
    id: "designer",
    name: "Visual Designer",
    icon: ImageIcon,
    color: "bg-gradient-to-r from-orange-500 to-red-500",
    description: "Create and edit visual content",
  },
]

export default function AIInput_03() {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 240,
  })
  const [inputValue, setInputValue] = useState("")
  const [selectedAgent, setSelectedAgent] = useState(agents[0])
  const [showAgents, setShowAgents] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const handleSubmit = () => {
    if (!inputValue.trim()) return
    console.log("Submitted to", selectedAgent.name, ":", inputValue)
    setInputValue("")
    adjustHeight(true)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      {/* Agent Selector */}
      <div className="mb-4">
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setShowAgents(!showAgents)}
            className="w-full justify-between h-12 px-4 border-2 border-dashed hover:border-solid transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", selectedAgent.color)}>
                <selectedAgent.icon className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <div className="font-medium text-sm">{selectedAgent.name}</div>
                <div className="text-xs text-muted-foreground">{selectedAgent.description}</div>
              </div>
            </div>
            <ChevronDown className={cn("w-4 h-4 transition-transform", showAgents && "rotate-180")} />
          </Button>

          {showAgents && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden">
              {agents.map((agent) => (
                <Button
                  key={agent.id}
                  variant="ghost"
                  onClick={() => {
                    setSelectedAgent(agent)
                    setShowAgents(false)
                  }}
                  className="w-full justify-start h-auto p-4 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", agent.color)}>
                      <agent.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-sm">{agent.name}</div>
                      <div className="text-xs text-muted-foreground">{agent.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Input Container */}
      <div className="relative">
        <div className="relative border-2 border-border rounded-2xl bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          {/* Agent Badge */}
          <div className="absolute -top-3 left-4 z-10">
            <Badge variant="secondary" className="bg-card border border-border shadow-sm">
              <Bot className="w-3 h-3 mr-1" />
              {selectedAgent.name}
            </Badge>
          </div>

          <Textarea
            ref={textareaRef}
            placeholder={`Ask ${selectedAgent.name} anything...`}
            className={cn(
              "border-0 bg-transparent resize-none",
              "placeholder:text-muted-foreground/60",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "px-6 py-6 pr-20",
              "min-h-[60px] max-h-[240px]",
              "text-sm leading-relaxed",
              "pt-8",
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
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleRecording}
              className={cn(
                "h-9 w-9 p-0 rounded-full transition-all duration-200",
                isRecording ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" : "hover:bg-muted/50",
              )}
            >
              {isRecording ? <X className="w-4 h-4" /> : <Mic className="w-4 h-4 text-muted-foreground" />}
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              size="sm"
              className={cn(
                "h-9 w-9 p-0 rounded-full transition-all duration-300",
                inputValue.trim()
                  ? cn("text-white shadow-lg hover:shadow-xl", selectedAgent.color)
                  : "bg-muted text-muted-foreground cursor-not-allowed",
              )}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Status Bar */}
        {(inputValue || isRecording) && (
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              {isRecording && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Recording...
                </div>
              )}
            </div>
            <div>{inputValue.length} / 2000</div>
          </div>
        )}
      </div>
    </div>
  )
}
