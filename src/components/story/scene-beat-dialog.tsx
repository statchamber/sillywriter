import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SceneBeatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (description: string) => void
}

export function SceneBeatDialog({ open, onOpenChange, onSubmit }: SceneBeatDialogProps) {
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (description.trim()) {
      onSubmit(description.trim())
      setDescription("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Scene Beat</DialogTitle>
            <DialogDescription>
              Describe what changes or happens in this scene.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="The protagonist realizes the truth about..."
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
              Cancel
            </Button>
            <Button type="submit">Add Scene Beat</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 