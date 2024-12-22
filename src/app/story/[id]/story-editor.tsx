"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useStories } from "@/contexts/stories-context"
import { ChapterSidebar } from "@/components/story/chapter-sidebar"
import { ChapterEditor } from "@/components/story/chapter-editor"
import { StoryDetails } from "@/components/story/story-details"

export function StoryEditor() {
    const { id } = useParams()
    const router = useRouter()
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
  
    useEffect(() => {
      // If no stories exist yet, redirect to home
      if (stories.length === 0) {
        router.push('/')
        return
      }

      // If ID doesn't exist in stories, redirect to first story
      if (id !== 'default' && !stories.find(s => s.id === id)) {
        router.push(`/story/${stories[0].id}`)
      }
    }, [id, stories, router])
  
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