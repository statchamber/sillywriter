"use client"

import { useState } from "react"
import { Story } from "@/types/story"
import { useStories } from "@/contexts/stories-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface ChapterSidebarProps {
  story: Story
  selectedChapterId?: string
  onChapterSelect?: (chapterId: string) => void
}

export function ChapterSidebar({ 
  story, 
  selectedChapterId,
  onChapterSelect 
}: ChapterSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { addChapter, deleteChapter, updateChapter } = useStories()

  const handleRenameChapter = (chapterId: string, currentTitle: string) => {
    const newTitle = prompt("Enter new chapter title:", currentTitle)
    if (newTitle && newTitle !== currentTitle) {
      updateChapter(story.id, chapterId, { title: newTitle })
    }
  }

  const filteredChapters = story.chapters.filter(chapter =>
    chapter.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-80 border-r flex flex-col bg-muted/30 h-full overflow-hidden">
      <div className="shrink-0 p-4 border-b">
        <h2 className="text-lg font-semibold mb-4">{story.title}</h2>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search chapters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          className="w-full"
          onClick={() => addChapter(story.id, "")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Chapter
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredChapters.map((chapter) => (
          <div
            key={chapter.id}
            className={cn(
              "flex items-center justify-between p-3 hover:bg-accent/50 cursor-pointer",
              selectedChapterId === chapter.id && "bg-accent"
            )}
            onClick={() => onChapterSelect?.(chapter.id)}
          >
            <span className="truncate">{chapter.title}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRenameChapter(chapter.id, chapter.title)
                  }}
                >
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteChapter(story.id, chapter.id)
                  }}
                  className="text-destructive"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  )
} 