"use client"

import { useState } from "react"
import { useWorldInfo } from "@/contexts/world-info-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Pencil, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ManageCollectionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ManageCollectionsDialog({ open, onOpenChange }: ManageCollectionsDialogProps) {
  const { collections, updateCollection, deleteCollection } = useWorldInfo()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    description: ""
  })

  const handleEdit = (id: string) => {
    const collection = collections.find(c => c.id === id)
    if (collection) {
      setEditForm({
        name: collection.name,
        description: collection.description
      })
      setEditingId(id)
    }
  }

  const handleSave = () => {
    if (editingId && editForm.name.trim()) {
      updateCollection(editingId, {
        name: editForm.name.trim(),
        description: editForm.description.trim()
      })
      setEditingId(null)
      setEditForm({ name: "", description: "" })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Collections</DialogTitle>
          <DialogDescription>
            Edit or delete your world info collections.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          {collections.map(collection => (
            <Card key={collection.id}>
              {editingId === collection.id ? (
                <CardContent className="pt-6 space-y-4">
                  <Input
                    placeholder="Collection name"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Collection description"
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>Save</Button>
                  </div>
                </CardContent>
              ) : (
                <>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{collection.name}</CardTitle>
                        <CardDescription>{collection.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(collection.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => deleteCollection(collection.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {collection.entries.length} entries
                    </p>
                  </CardContent>
                </>
              )}
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
} 