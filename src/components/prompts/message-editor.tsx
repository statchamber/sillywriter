import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Message {
  role: "system" | "user" | "assistant"
  content: string
}

interface MessageEditorProps {
  messages: Message[]
  onChange: (messages: Message[]) => void
}

export function MessageEditor({ messages, onChange }: MessageEditorProps) {
  const addMessage = () => {
    onChange([...messages, { role: "user", content: "" }])
  }

  const removeMessage = (index: number) => {
    onChange(messages.filter((_, i) => i !== index))
  }

  const updateMessage = (index: number, field: keyof Message, value: string) => {
    onChange(
      messages.map((msg, i) =>
        i === index ? { ...msg, [field]: value } : msg
      )
    )
  }

  return (
    <div className="space-y-6">
      {messages.map((message, index) => (
        <div key={index} className="space-y-3 p-4 rounded-lg border bg-muted/30">
          <div className="flex items-center gap-3">
            <Select
              value={message.role}
              onValueChange={(value: "system" | "user" | "assistant") =>
                updateMessage(index, "role", value)
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="assistant">Assistant</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeMessage(index)}
              disabled={messages.length === 1}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Textarea
            value={message.content}
            onChange={(e) => updateMessage(index, "content", e.target.value)}
            placeholder={`${message.role} message...`}
            className="min-h-[100px] bg-background"
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={addMessage}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Message
      </Button>
    </div>
  )
} 