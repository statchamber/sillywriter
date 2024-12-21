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

interface EditPromptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prompt: Prompt
  onSubmit: (prompt: Prompt) => void
}

export function EditPromptDialog({ 
  open, 
  onOpenChange, 
  prompt, 
  onSubmit 
}: EditPromptDialogProps) {
  const [name, setName] = useState(prompt.name)
  const [description, setDescription] = useState(prompt.description)
  const [messages, setMessages] = useState(prompt.messages)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...prompt,
      name,
      description,
      messages
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Edit Prompt</DialogTitle>
          <DialogDescription>
            Modify your AI prompt template.
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
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 