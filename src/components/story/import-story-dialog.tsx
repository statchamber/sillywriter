"use client"

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

interface ImportStoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportStoryDialog({ open, onOpenChange }: ImportStoryDialogProps) {
  const { importStory } = useStories()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const text = await file.text()
        importStory(text)
        onOpenChange(false)
      } catch (error) {
        console.error('Failed to import story:', error)
        // You might want to show an error message to the user here
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Story</DialogTitle>
          <DialogDescription>
            Select a story file to import (.json)
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 