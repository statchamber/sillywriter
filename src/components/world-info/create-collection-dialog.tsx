"use client"

import { useState } from "react"
import { useWorldInfo } from "@/contexts/world-info-context"
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

interface CreateCollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCollectionDialog({ open, onOpenChange }: CreateCollectionDialogProps) {
  const { addCollection } = useWorldInfo()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addCollection(formData.name, formData.description)
    setFormData({ name: "", description: "" })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Collection</DialogTitle>
            <DialogDescription>
              Create a new collection to organize your world info entries.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Collection name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
            <Textarea
              placeholder="Collection description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
              Cancel
            </Button>
            <Button type="submit">Create Collection</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 