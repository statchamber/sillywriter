"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useStories } from "@/contexts/stories-context"
import { ChapterSidebar } from "@/components/story/chapter-sidebar"
import { ChapterEditor } from "@/components/story/chapter-editor"
import { StoryDetails } from "@/components/story/story-details"

export default function StoryEditorPage() {
  const { id } = useParams()
  const { stories, setCurrentStory } = useStories()
  const [selectedChapterId, setSelectedChapterId] = useState<string | undefined>()
  const story = stories.find(s => s.id === id)

  useEffect(() => {
    if (story) {
      setCurrentStory(story)
      if (story.chapters.length > 0 && !selectedChapterId) {
        setSelectedChapterId(story.chapters[0].id)
      }
    }
    return () => setCurrentStory(null)
  }, [story, setCurrentStory, selectedChapterId])

  if (!story) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3rem)]">
        <p className="text-muted-foreground">Story not found</p>
      </div>
    )
  }

  return (
    <div className="story-editor-layout flex h-screen w-full overflow-hidden">
      <ChapterSidebar 
        story={story} 
        selectedChapterId={selectedChapterId}
        onChapterSelect={setSelectedChapterId}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChapterEditor 
          story={story}
          selectedChapterId={selectedChapterId}
        />
      </div>
      <StoryDetails 
        story={story}
        selectedChapterId={selectedChapterId}
      />
    </div>
  )
} 