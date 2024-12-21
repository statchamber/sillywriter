"use client"

import { useState, useEffect } from "react"
import { Character } from "@/types/story"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useStories } from "@/contexts/stories-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface EditCharacterDialogProps {
  character: Character | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (character: Partial<Character>) => void
  storyId: string
  currentChapterId?: string
  currentTitle?: string
  currentContent?: string
}

export function EditCharacterDialog({ 
  character, 
  open, 
  onOpenChange,
  onSave,
  storyId,
  currentChapterId,
  currentTitle,
  currentContent
}: EditCharacterDialogProps) {
  const { updateChapter } = useStories()
  const [formData, setFormData] = useState({
    name: "",
    alias: "",
    description: ""
  })

  useEffect(() => {
    if (character && open) {
      setFormData({
        name: character.name,
        alias: character.alias || "",
        description: character.description
      })
    }
  }, [character])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    handleClose()
  }

  const handleClose = () => {
    // Save current chapter if it exists
    if (currentChapterId && storyId) {
      updateChapter(storyId, currentChapterId, {
        title: currentTitle || "",
        content: currentContent || ""
      })
    }

    // Reset form data when closing
    setFormData({
      name: "",
      alias: "",
      description: ""
    })
    onOpenChange(false)
    
    // Refresh the page
    window.location.reload()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Character</DialogTitle>
            <DialogDescription>
              Update character details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Character name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="Character alias"
              value={formData.alias}
              onChange={(e) => setFormData(prev => ({ ...prev, alias: e.target.value }))}
            />
            <Textarea
              placeholder="Character description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose} type="button">
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 