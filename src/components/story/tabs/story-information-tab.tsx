"use client"

import { useMemo } from "react"
import { Story } from "@/types/story"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface StoryInformationTabProps {
  story: Story
  selectedChapterId?: string
}

export function StoryInformationTab({ story, selectedChapterId }: StoryInformationTabProps) {
  const selectedChapter = story.chapters.find(c => c.id === selectedChapterId)
  
  const stats = useMemo(() => {
    const totalWords = story.chapters.reduce((acc, chapter) => 
      acc + chapter.content.split(/\s+/).filter(Boolean).length, 0
    )
    
    const chapterCount = story.chapters.length
    const characterCount = story.characters?.length || 0
    const selectedChapterWords = selectedChapter 
      ? selectedChapter.content.split(/\s+/).filter(Boolean).length 
      : 0

    return {
      totalWords,
      chapterCount,
      characterCount,
      selectedChapterWords
    }
  }, [story, selectedChapter])

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Story Statistics</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Words:</span>
              <span className="font-medium">{stats.totalWords.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Chapters:</span>
              <span className="font-medium">{stats.chapterCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Characters:</span>
              <span className="font-medium">{stats.characterCount}</span>
            </div>
          </CardContent>
        </Card>

        {selectedChapter && (
          <Card>
            <CardHeader>
              <CardTitle>Current Chapter</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Words:</span>
                <span className="font-medium">{stats.selectedChapterWords.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">
                  {new Date(selectedChapter.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="font-medium">
                  {new Date(selectedChapter.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  )
} 