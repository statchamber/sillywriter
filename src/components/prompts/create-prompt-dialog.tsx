import { useState } from "react"
import { Prompt } from "./prompts-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MessageEditor } from "./message-editor"

interface CreatePromptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (prompt: Prompt) => void
}

export function CreatePromptDialog({ open, onOpenChange, onSubmit }: CreatePromptDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [messages, setMessages] = useState([
    { role: "system", content: "" },
    { role: "user", content: "" }
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      id: crypto.randomUUID(),
      name,
      description,
      messages
    })
    setName("")
    setDescription("")
    setMessages([
      { role: "system", content: "" },
      { role: "user", content: "" }
    ])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create Prompt</DialogTitle>
          <DialogDescription>
            Create a new AI prompt template for your writing tasks.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Prompt name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Prompt description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <MessageEditor
              messages={messages}
              onChange={setMessages}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Create Prompt</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 