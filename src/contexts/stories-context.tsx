"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { Story, Chapter, Character } from "@/types/story"
import { v4 as uuidv4 } from "uuid"

interface StoriesContextType {
  stories: Story[]
  currentStory: Story | null
  setCurrentStory: (story: Story | null) => void
  addStory: (title: string) => void
  updateStory: (storyId: string, updates: Partial<Story>) => void
  deleteStory: (id: string) => void
  addChapter: (storyId: string, title: string) => void
  updateChapter: (storyId: string, chapterId: string, updates: Partial<Chapter>) => void
  deleteChapter: (storyId: string, chapterId: string) => void
  addCharacter: (storyId: string, name: string, description: string, aiGenerated?: boolean) => void
  updateCharacter: (storyId: string, characterId: string, updates: Partial<Character>) => void
  deleteCharacter: (storyId: string, characterId: string) => void
  exportStory: (id: string) => void
  importStory: (storyData: string) => void
}

const StoriesContext = createContext<StoriesContextType | undefined>(undefined)

export function StoriesProvider({ children }: { children: React.ReactNode }) {
  const [stories, setStories] = useState<Story[]>([])
  const [currentStory, setCurrentStory] = useState<Story | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("stories")
    if (saved) {
      setStories(JSON.parse(saved))
    }
  }, [])

  const saveStories = (newStories: Story[]) => {
    localStorage.setItem("stories", JSON.stringify(newStories))
    setStories(newStories)
  }

  const addStory = (title: string) => {
    const newStory: Story = {
      id: uuidv4(),
      title,
      chapters: [],
      characters: [],
      authorNotes: "",
      aiSettings: {
        contextLimit: 200000,
        contextWindow: 2000
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    saveStories([...stories, newStory])
  }

  const updateStory = (storyId: string, updates: Partial<Story>) => {
    setStories(stories => stories.map(story => 
      story.id === storyId ? { ...story, ...updates } : story
    ))
  }

  const deleteStory = (id: string) => {
    const newStories = stories.filter(story => story.id !== id)
    saveStories(newStories)
    if (currentStory?.id === id) setCurrentStory(null)
  }

  const addChapter = (storyId: string, title: string) => {
    const story = stories.find(s => s.id === storyId)
    const newChapter: Chapter = {
      id: uuidv4(),
      title,
      content: "",
      order: story?.chapters.length ?? 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    const newStories = stories.map(story => 
      story.id === storyId 
        ? { 
            ...story, 
            chapters: [...story.chapters, newChapter],
            updatedAt: new Date().toISOString()
          }
        : story
    )
    saveStories(newStories)
  }

  const updateChapter = (storyId: string, chapterId: string, updates: Partial<Chapter>) => {
    const newStories = stories.map(story => 
      story.id === storyId 
        ? {
            ...story,
            chapters: story.chapters.map(chapter =>
              chapter.id === chapterId
                ? { ...chapter, ...updates, updatedAt: new Date().toISOString() }
                : chapter
            ),
            updatedAt: new Date().toISOString()
          }
        : story
    )
    saveStories(newStories)
  }

  const deleteChapter = (storyId: string, chapterId: string) => {
    const newStories = stories.map(story =>
      story.id === storyId
        ? {
            ...story,
            chapters: story.chapters.filter(chapter => chapter.id !== chapterId),
            updatedAt: new Date().toISOString()
          }
        : story
    )
    saveStories(newStories)
  }

  const addCharacter = (storyId: string, name: string, description: string, aiGenerated = false) => {
    const newCharacter: Character = {
      id: uuidv4(),
      name,
      alias: "",
      description,
      aiGenerated,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    const newStories = stories.map(story => 
      story.id === storyId 
        ? { 
            ...story, 
            characters: [...(story.characters || []), newCharacter],
            updatedAt: new Date().toISOString()
          }
        : story
    )
    saveStories(newStories)
  }

  const updateCharacter = (storyId: string, characterId: string, updates: Partial<Character>) => {
    const newStories = stories.map(story => 
      story.id === storyId 
        ? {
            ...story,
            characters: story.characters?.map(character =>
              character.id === characterId
                ? { ...character, ...updates, updatedAt: new Date().toISOString() }
                : character
            ),
            updatedAt: new Date().toISOString()
          }
        : story
    )
    saveStories(newStories)
  }

  const deleteCharacter = (storyId: string, characterId: string) => {
    const newStories = stories.map(story =>
      story.id === storyId
        ? {
            ...story,
            characters: story.characters?.filter(character => character.id !== characterId),
            updatedAt: new Date().toISOString()
          }
        : story
    )
    saveStories(newStories)
  }

  const exportStory = (id: string) => {
    const story = stories.find(s => s.id === id)
    if (story) {
      const blob = new Blob([JSON.stringify(story, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${story.title}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const importStory = (storyData: string) => {
    try {
      const story: Story = JSON.parse(storyData)
      if (!story.id || !story.title || !Array.isArray(story.chapters)) {
        throw new Error('Invalid story format')
      }
      // Ensure we don't duplicate IDs
      story.id = uuidv4()
      story.chapters = story.chapters.map(chapter => ({ ...chapter, id: uuidv4() }))
      saveStories([...stories, story])
    } catch (error) {
      console.error('Failed to import story:', error)
      throw error
    }
  }

  return (
    <StoriesContext.Provider value={{
      stories,
      currentStory,
      setCurrentStory,
      addStory,
      updateStory,
      deleteStory,
      addChapter,
      updateChapter,
      deleteChapter,
      addCharacter,
      updateCharacter,
      deleteCharacter,
      exportStory,
      importStory,
    }}>
      {children}
    </StoriesContext.Provider>
  )
}

export function useStories() {
  const context = useContext(StoriesContext)
  if (!context) throw new Error("useStories must be used within StoriesProvider")
  return context
} 