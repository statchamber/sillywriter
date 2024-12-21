"use client"

import { useState, useEffect } from "react"
import { Character } from "@/types/story"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useStories } from "@/contexts/stories-context"
import { Card, CardContent } from "@/components/ui/card"

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
  }, [character, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    handleClose()
  }

  const handleClose = () => {
    if (currentChapterId && storyId) {
      updateChapter(storyId, currentChapterId, {
        title: currentTitle || "",
        content: currentContent || ""
      })
    }

    setFormData({
      name: "",
      alias: "",
      description: ""
    })
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Edit Character</h3>
              <p className="text-sm text-muted-foreground">
                Update character details.
              </p>
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
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleClose} type="button">
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 