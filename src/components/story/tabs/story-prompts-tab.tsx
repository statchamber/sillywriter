import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Trash2 } from "lucide-react"

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface Prompt {
  id: string
  name: string
  description: string
  messages: Message[]
}

const DEFAULT_PROMPTS: Prompt[] = [
  {
    id: 'expand',
    name: 'Expand Text',
    description: 'Make the selected text longer while maintaining the style',
    messages: [
      {
        role: 'system',
        content: 'You are an expert fiction writer. Your task is to expand the given text while maintaining the original style, tone, and context. Keep the following in mind:\n- Maintain consistent voice\n- Add meaningful details\n- Preserve the original meaning\n- Keep the flow natural'
      },
      {
        role: 'user',
        content: 'Please expand this text while maintaining the style: {{text}}'
      }
    ]
  },
  {
    id: 'rephrase',
    name: 'Rephrase Text',
    description: 'Rewrite the selected text in a different way',
    messages: [
      {
        role: 'system',
        content: 'You are an expert fiction writer. Your task is to rephrase the given text while maintaining the same meaning and emotional impact. Keep the following in mind:\n- Preserve the core message\n- Maintain the tone\n- Use fresh language\n- Keep the same level of detail'
      },
      {
        role: 'user',
        content: 'Please rephrase this text while maintaining the impact: {{text}}'
      }
    ]
  },
  {
    id: 'shorten',
    name: 'Shorten Text',
    description: 'Make the selected text more concise',
    messages: [
      {
        role: 'system',
        content: 'You are an expert fiction writer. Your task is to shorten the given text while preserving its essential meaning and impact. Keep the following in mind:\n- Maintain key information\n- Preserve emotional resonance\n- Remove redundancy\n- Keep the core message clear'
      },
      {
        role: 'user',
        content: 'Please make this text more concise while maintaining impact: {{text}}'
      }
    ]
  }
]

export function StoryPromptsTab() {
  const [prompts, setPrompts] = useState<Prompt[]>(DEFAULT_PROMPTS)
  const [newPrompt, setNewPrompt] = useState<Partial<Prompt>>({
    messages: [{ role: 'system', content: '' }]
  })

  const handleAddPrompt = () => {
    if (!newPrompt.name || !newPrompt.messages?.[0]?.content) return

    const prompt: Prompt = {
      id: crypto.randomUUID(),
      name: newPrompt.name,
      description: newPrompt.description || '',
      messages: newPrompt.messages as Message[]
    }

    setPrompts([...prompts, prompt])
    setNewPrompt({ messages: [{ role: 'system', content: '' }] })
  }

  const handleDeletePrompt = (id: string) => {
    setPrompts(prompts.filter(p => p.id !== id))
  }

  const handleAddMessage = (promptId: string) => {
    setPrompts(prompts.map(p => {
      if (p.id === promptId) {
        return {
          ...p,
          messages: [...p.messages, { role: 'user', content: '' }]
        }
      }
      return p
    }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">AI Prompts</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Prompt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Prompt</DialogTitle>
              <DialogDescription>
                Create a new AI prompt with custom messages.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  placeholder="Prompt name"
                  value={newPrompt.name || ''}
                  onChange={(e) => setNewPrompt(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  placeholder="Prompt description"
                  value={newPrompt.description || ''}
                  onChange={(e) => setNewPrompt(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>System Message</Label>
                <Textarea
                  placeholder="System message"
                  value={newPrompt.messages?.[0]?.content || ''}
                  onChange={(e) => setNewPrompt(prev => ({
                    ...prev,
                    messages: [{ role: 'system', content: e.target.value }]
                  }))}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddPrompt}>Add Prompt</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {prompts.map((prompt) => (
          <AccordionItem key={prompt.id} value={prompt.id}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-2">
                  <span>{prompt.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeletePrompt(prompt.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">{prompt.description}</p>
              {prompt.messages.map((message, index) => (
                <div key={index} className="space-y-2">
                  <Label>{message.role.charAt(0).toUpperCase() + message.role.slice(1)}</Label>
                  <Textarea
                    value={message.content}
                    onChange={(e) => {
                      const newPrompts = prompts.map(p => {
                        if (p.id === prompt.id) {
                          const newMessages = [...p.messages]
                          newMessages[index] = { ...message, content: e.target.value }
                          return { ...p, messages: newMessages }
                        }
                        return p
                      })
                      setPrompts(newPrompts)
                    }}
                    className="min-h-[100px]"
                  />
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => handleAddMessage(prompt.id)}
              >
                Add Message
              </Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
} 