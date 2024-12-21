"use client"

import { useState } from "react"
import { useStories } from "@/contexts/stories-context"
import { useWorldInfo } from "@/contexts/world-info-context"
import { useSettings } from "@/contexts/settings-context"
import { Button } from "@/components/ui/button"
import { Download, Upload, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function DataManagement() {
  const { stories, importStory } = useStories()
  const { collections, importCollections } = useWorldInfo()
  const { textSettings, globalSettings, importSettings } = useSettings()
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)

  const handleExportAll = () => {
    const exportData = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      data: {
        stories,
        worldInfo: collections,
        settings: {
          textSettings,
          globalSettings
        }
      }
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sillywriter-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportAll = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string
        const importData = JSON.parse(content)

        // Validate the import data structure
        if (!importData.version || !importData.data) {
          throw new Error('Invalid backup file format')
        }

        // Import stories
        if (Array.isArray(importData.data.stories)) {
          for (const story of importData.data.stories) {
            await importStory(JSON.stringify(story))
          }
        }

        // Import world info
        if (Array.isArray(importData.data.worldInfo)) {
          await importCollections(JSON.stringify(importData.data.worldInfo))
        }

        // Import settings
        if (importData.data.settings) {
          importSettings(importData.data.settings)
        }

        setShowImportDialog(false)
      } catch (error) {
        console.error('Failed to import data:', error)
        alert('Failed to import data. Please check the file format.')
      }
    }
    reader.readAsText(file)
  }

  const handleResetAll = () => {
    // Clear all localStorage
    localStorage.clear()
    // Reload the page to reset all contexts
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Data Management</h3>
          <p className="text-sm text-muted-foreground">
            Export or import all your data including stories, world info, and settings.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowImportDialog(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import All
          </Button>
          <Button onClick={handleExportAll}>
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Importing data will merge with your existing data. Make sure to export your current data as a backup first.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Danger Zone</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>Reset all settings and data. This action cannot be undone.</span>
          <Button 
            variant="destructive" 
            onClick={() => setShowResetDialog(true)}
          >
            Reset All
          </Button>
        </AlertDescription>
      </Alert>

      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import All Data</DialogTitle>
            <DialogDescription>
              Select a backup file to import. This will merge with your existing data.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <input
              type="file"
              accept=".json"
              onChange={handleImportAll}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset All Data</DialogTitle>
            <DialogDescription>
              This will permanently delete all your stories, world info, and settings. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleResetAll}>
              Reset Everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 