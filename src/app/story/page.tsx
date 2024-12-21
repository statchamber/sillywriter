"use client"

import { Plus, Import, Search } from "lucide-react"
import { useState } from "react"
import { useStories } from "@/contexts/stories-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StoryList } from "@/components/story/story-list"
import { CreateStoryDialog } from "@/components/story/create-story-dialog"
import { ImportStoryDialog } from "@/components/story/import-story-dialog"

export default function StoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const { stories } = useStories()

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Stories</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Story
          </Button>
          <Button variant="outline" onClick={() => setShowImportDialog(true)}>
            <Import className="mr-2 h-4 w-4" />
            Import
          </Button>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search stories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <StoryList stories={filteredStories} />
      
      <CreateStoryDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
      <ImportStoryDialog 
        open={showImportDialog} 
        onOpenChange={setShowImportDialog}
      />
    </div>
  )
} 