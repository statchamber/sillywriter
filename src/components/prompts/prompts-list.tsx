"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { PromptCard } from "./prompt-card"
import { CreatePromptDialog } from "./create-prompt-dialog"

export type Prompt = {
  id: string
  name: string
  description: string
  messages: {
    role: "system" | "user" | "assistant"
    content: string
  }[]
}

const DEFAULT_PROMPTS: Prompt[] = [
  {
    id: "expand",
    name: "Expand Text",
    description: "Make the selected text longer while maintaining the same meaning",
    messages: [
      {
        role: "system",
        content: "You are an expert fiction writer. Your task is to expand the given text while maintaining the same tone, style, and meaning. Add descriptive details, dialogue, or internal thoughts as appropriate."
      },
      {
        role: "user",
        content: "Please expand this text: {{text}}"
      }
    ]
  },
  {
    id: "rephrase",
    name: "Rephrase Text",
    description: "Rewrite the selected text in a different way",
    messages: [
      {
        role: "system",
        content: "You are an expert fiction writer. Your task is to rephrase the given text while maintaining the same meaning but using different words and sentence structures."
      },
      {
        role: "user",
        content: "Please rephrase this text: {{text}}"
      }
    ]
  }
]

export function PromptsList() {
  const [prompts, setPrompts] = useState<Prompt[]>(DEFAULT_PROMPTS)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Prompt
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {prompts.map((prompt) => (
          <PromptCard 
            key={prompt.id}
            prompt={prompt}
            onDelete={(id) => setPrompts(prompts.filter(p => p.id !== id))}
            onEdit={(updatedPrompt) => {
              setPrompts(prompts.map(p => 
                p.id === updatedPrompt.id ? updatedPrompt : p
              ))
            }}
          />
        ))}
      </div>

      <CreatePromptDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={(newPrompt) => {
          setPrompts([...prompts, newPrompt])
          setShowCreateDialog(false)
        }}
      />
    </div>
  )
} 