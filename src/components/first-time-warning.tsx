"use client"

import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/contexts/settings-context"

export function FirstTimeWarning() {
  const { globalSettings, updateGlobalSettings } = useSettings()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!globalSettings.hasSeenWarning) {
      setOpen(true)
    }
  }, [globalSettings.hasSeenWarning])

  const handleClose = () => {
    updateGlobalSettings({ hasSeenWarning: true })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Warning
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Just so you know - sillywriter keeps everything in your local storage:
          </p>
          <ul className="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
            <li>All your stuff is saved right here on your browser</li>
            <li>It won't show up on other browsers</li>
            <li>If you clear your browser data, or if the browser deletes it, it'll wipe everything</li>
            <li>We don't store data on servers</li>
          </ul>
          <p className="font-medium text-sm text-muted-foreground">
            If you want to keep your data safe:
          </p>
          <ul className="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
            <li>Click the export .json button on the Story page once in a while</li>
            <li>Maybe backup everything too (Settings → Data Management → Export All)</li>
          </ul>
        </div>
        <DialogFooter>
          <Button onClick={handleClose}>Ok</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
