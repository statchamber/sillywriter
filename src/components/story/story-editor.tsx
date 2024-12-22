"use client"

import { useStories } from "@/contexts/stories-context"
import { ChapterSidebar } from "@/components/story/chapter-sidebar"
import { ChapterEditor } from "@/components/story/chapter-editor"
import { StoryDetails } from "@/components/story/story-details"
import { useState, useEffect } from "react"

interface StoryEditorProps {
  storyId: string
  onClose: () => void
}

export function StoryEditor({ storyId, onClose }: StoryEditorProps) {
  const { stories, setCurrentStory } = useStories()
  const [selectedChapterId, setSelectedChapterId] = useState<string | undefined>()
  const story = stories.find(s => s.id === storyId)

  useEffect(() => {
    if (story) {
      setCurrentStory(story)
      if (story.chapters.length > 0 && !selectedChapterId) {
        setSelectedChapterId(story.chapters[0].id)
      }
    }
    return () => setCurrentStory(null)
  }, [story, setCurrentStory, selectedChapterId])

  useEffect(() => {
    const handleNavigate = () => {
      onClose()
    }

    window.addEventListener('navigateToStories', handleNavigate)
    return () => {
      window.removeEventListener('navigateToStories', handleNavigate)
    }
  }, [onClose])

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