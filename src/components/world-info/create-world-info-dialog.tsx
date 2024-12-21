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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { WorldInfoCategory } from "@/types/world-info"

interface CreateWorldInfoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collectionId: string | null
}

export function CreateWorldInfoDialog({ open, onOpenChange, collectionId }: CreateWorldInfoDialogProps) {
  const { collections, addEntryToCollection } = useWorldInfo()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "" as WorldInfoCategory,
    keywords: "",
    selectedCollection: collectionId || ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const targetCollectionId = collectionId || formData.selectedCollection
    if (!targetCollectionId) return

    addEntryToCollection(targetCollectionId, {
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      keywords: formData.keywords.split(",").map(k => k.trim()).filter(Boolean),
      isEnabled: true
    })

    setFormData({
      name: "",
      description: "",
      category: "" as WorldInfoCategory,
      keywords: "",
      selectedCollection: targetCollectionId
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create World Info Entry</DialogTitle>
            <DialogDescription>
              Add a new entry to your world info.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select
              value={formData.selectedCollection}
              onValueChange={(value: string) => 
                setFormData(prev => ({ ...prev, selectedCollection: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select collection" />
              </SelectTrigger>
              <SelectContent>
                {collections.map(collection => (
                  <SelectItem key={collection.id} value={collection.id}>
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Entry name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
            <Select
              value={formData.category}
              onValueChange={(value: WorldInfoCategory) => 
                setFormData(prev => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="location">Location</SelectItem>
                <SelectItem value="object">Object/Item</SelectItem>
                <SelectItem value="lore">Lore</SelectItem>
                <SelectItem value="subplot">Subplot</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="global">Global Entry</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-[100px]"
            />
            <Input
              placeholder="Keywords (comma-separated)"
              value={formData.keywords}
              onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!formData.name.trim() || !formData.selectedCollection}
            >
              Create Entry
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 