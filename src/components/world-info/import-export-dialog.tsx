"use client"

import { useState } from "react"
import { useWorldInfo } from "@/contexts/world-info-context"
import { Button } from "@/components/ui/button"
import { Download, Upload } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { WorldInfoCollection } from "@/types/world-info"

interface ImportExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportExportDialog({ open, onOpenChange }: ImportExportDialogProps) {
  const { collections, addCollection, updateCollection } = useWorldInfo()
  const [error, setError] = useState<string | null>(null)

  const handleExport = () => {
    const dataStr = JSON.stringify(collections, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `world-info-collections-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const imported = JSON.parse(content)
        
        console.log('Imported collections:', imported)
        console.log('Existing collections:', collections)
        
        if (!Array.isArray(imported)) {
          throw new Error("Invalid format: Expected an array of collections")
        }

        const isValid = imported.every(collection => 
          typeof collection === 'object' &&
          typeof collection.id === 'string' &&
          typeof collection.name === 'string' &&
          typeof collection.description === 'string' &&
          Array.isArray(collection.entries)
        )

        if (!isValid) {
          throw new Error("Invalid collection format")
        }

        // Create a map of existing collections for faster lookup
        const existingCollections = new Map(collections.map(c => [c.id, c]))
        console.log('Existing collections map:', existingCollections)

        // Process each imported collection
        imported.forEach(collection => {
          console.log('Processing collection:', collection.name)
          if (existingCollections.has(collection.id)) {
            console.log('Updating existing collection:', collection.name)
            updateCollection(collection.id, {
              name: collection.name,
              description: collection.description,
              entries: collection.entries,
            })
          } else {
            console.log('Adding new collection:', collection.name)
            addCollection(
              collection.name, 
              collection.description,
              collection.entries,
              collection.id
            )
          }
        })

        onOpenChange(false)
        setError(null)
      } catch (err) {
        console.error('Import error:', err)
        setError("Failed to import collections. Please check the file format.")
      }
    }
    reader.readAsText(file)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import/Export Collections</DialogTitle>
          <DialogDescription>
            Import collections from a JSON file or export your current collections
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {error && (
            <div className="text-sm text-destructive mb-4">
              {error}
            </div>
          )}
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => document.getElementById('file-import')?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Import Collections
            </Button>
            <input
              id="file-import"
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
            <Button 
              variant="outline"
              className="w-full"
              onClick={handleExport}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Collections
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 