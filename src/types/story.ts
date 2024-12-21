export interface Chapter {
  id: string
  title: string
  content: string
  order: number
  createdAt: string
  updatedAt: string
  chapterPlot?: string
  notes?: string
  pastEvents?: string[]
}

export interface Character {
  id: string
  name: string
  alias: string
  description: string
  createdAt: string
  updatedAt: string
  aiGenerated?: boolean
}

export interface Story {
  id: string
  title: string
  chapters: Chapter[]
  characters: Character[]
  authorNotes?: string
  storyPlot?: string
  styleDescription?: {
    general?: string
    tone?: string
    pacing?: string
    pointOfView?: string
    custom?: Record<string, string>
  }
  aiSettings: {
    contextLimit: number
    contextWindow: number
  }
  createdAt: string
  updatedAt: string
} 