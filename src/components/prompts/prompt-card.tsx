import { useState } from "react"
import { Prompt } from "./prompts-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pencil, Trash2, MessageSquare } from "lucide-react"
import { EditPromptDialog } from "./edit-prompt-dialog"

interface PromptCardProps {
  prompt: Prompt
  onDelete: (id: string) => void
  onEdit: (prompt: Prompt) => void
}

export function PromptCard({ prompt, onDelete, onEdit }: PromptCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)

  return (
    <>
      <Card className="relative">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base font-semibold">
            {prompt.name}
          </CardTitle>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0 hover:bg-muted"
              onClick={() => setShowEditDialog(true)}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit prompt</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onDelete(prompt.id)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete prompt</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {prompt.description}
          </p>
          <div className="space-y-3 pt-2">
            {prompt.messages.map((message, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 text-sm rounded-md bg-muted/50 p-3"
              >
                <MessageSquare className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium capitalize">{message.role}: </span>
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <EditPromptDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        prompt={prompt}
        onSubmit={onEdit}
      />
    </>
  )
} 