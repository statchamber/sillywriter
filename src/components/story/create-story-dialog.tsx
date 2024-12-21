"use client"

import { useState } from "react"
import { useStories } from "@/contexts/stories-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CreateStoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateStoryDialog({ open, onOpenChange }: CreateStoryDialogProps) {
  const [title, setTitle] = useState("")
  const { addStory } = useStories()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    addStory(title)
    setTitle("")
    onOpenChange(false)
  }

  const handleCancel = () => {
    setTitle("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Story</DialogTitle>
          <DialogDescription>
            Give your story a title.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Story title"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Create Story</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 