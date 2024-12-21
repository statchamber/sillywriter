"use client"

import { useState, useEffect } from "react"
import { WorldInfoEntry, WorldInfoCategory } from "@/types/world-info"
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

interface EditWorldInfoDialogProps {
  entry: WorldInfoEntry | null
  collectionId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditWorldInfoDialog({ entry, collectionId, open, onOpenChange }: EditWorldInfoDialogProps) {
  const { updateEntry, collections } = useWorldInfo()
  const [formData, setFormData] = useState({
    name: "",
    category: "location" as WorldInfoCategory,
    description: "",
    keywords: "",
    selectedCollection: collectionId || ""
  })

  useEffect(() => {
    if (entry) {
      setFormData({
        name: entry.name,
        category: entry.category,
        description: entry.description,
        keywords: entry.keywords.join(", "),
        selectedCollection: collectionId || ""
      })
    }
  }, [entry, collectionId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!entry || !formData.name.trim() || !formData.selectedCollection) return

    updateEntry(
      formData.selectedCollection,
      entry.id,
      {
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim(),
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
      }
    )
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit World Info Entry</DialogTitle>
            <DialogDescription>
              Modify your world info entry.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!collectionId && (
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
            )}
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
              disabled={!formData.name.trim() || (!collectionId && !formData.selectedCollection)}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 