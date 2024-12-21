"use client"

import { useState, useEffect } from "react"
import { Character } from "@/types/story"
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

interface EditCharacterDialogProps {
  character: Character | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (character: Partial<Character>) => void
}

export function EditCharacterDialog({ 
  character, 
  open, 
  onOpenChange,
  onSave 
}: EditCharacterDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    alias: "",
    description: ""
  })

  useEffect(() => {
    if (character) {
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
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 