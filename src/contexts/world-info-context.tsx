"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { WorldInfoEntry, WorldInfoCollection } from "@/types/world-info"
import { v4 as uuidv4 } from "uuid"

interface WorldInfoContextType {
  collections: WorldInfoCollection[]
  entries: WorldInfoEntry[]
  importCollections: (collectionsJson: string) => Promise<void>
  addCollection: (name: string, description: string, entries?: WorldInfoEntry[], id?: string) => void
  updateCollection: (id: string, updates: Partial<WorldInfoCollection>) => void
  deleteCollection: (id: string) => void
  addEntryToCollection: (collectionId: string, entry: Omit<WorldInfoEntry, "id" | "createdAt" | "updatedAt">) => void
  updateEntry: (collectionId: string, entryId: string, updates: Partial<WorldInfoEntry>) => void
  deleteEntry: (collectionId: string, entryId: string) => void
}

const WorldInfoContext = createContext<WorldInfoContextType | undefined>(undefined)

export function useWorldInfo() {
  const context = useContext(WorldInfoContext)
  if (!context) {
    throw new Error("useWorldInfo must be used within a WorldInfoProvider")
  }
  return context
}

export function WorldInfoProvider({ children }: { children: React.ReactNode }) {
  const [collections, setCollections] = useState<WorldInfoCollection[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("worldInfoCollections")
    if (saved) {
      setCollections(JSON.parse(saved))
    }
  }, [])

  const saveCollections = (newCollections: WorldInfoCollection[]) => {
    console.log('Saving collections:', newCollections)
    localStorage.setItem("worldInfoCollections", JSON.stringify(newCollections))
    setCollections(newCollections)
  }

  const addCollection = (name: string, description: string, entries: WorldInfoEntry[] = [], id?: string) => {
    const newCollection: WorldInfoCollection = {
      id: id || uuidv4(),
      name,
      description,
      entries: entries.map(entry => ({
        ...entry,
        isEnabled: true,
        createdAt: entry.createdAt || new Date().toISOString(),
        updatedAt: entry.updatedAt || new Date().toISOString(),
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Get the current collections from localStorage to ensure we have the latest state
    const currentCollections = JSON.parse(localStorage.getItem("worldInfoCollections") || "[]")
    const updatedCollections = [...currentCollections, newCollection]
    
    saveCollections(updatedCollections)
  }

  const addEntryToCollection = (collectionId: string, entry: Omit<WorldInfoEntry, "id" | "createdAt" | "updatedAt">) => {
    const newEntry: WorldInfoEntry = {
      ...entry,
      id: uuidv4(),
      isEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const newCollections = collections.map(collection =>
      collection.id === collectionId
        ? { ...collection, entries: [...collection.entries, newEntry] }
        : collection
    )
    saveCollections(newCollections)
  }

  const updateEntry = (collectionId: string, entryId: string, updates: Partial<WorldInfoEntry>) => {
    const newCollections = collections.map(collection =>
      collection.id === collectionId
        ? {
          ...collection,
          entries: collection.entries.map(entry =>
            entry.id === entryId
              ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
              : entry
          )
        }
        : collection
    )
    saveCollections(newCollections)
  }

  const deleteEntry = (collectionId: string, entryId: string) => {
    const newCollections = collections.map(collection =>
      collection.id === collectionId
        ? {
          ...collection,
          entries: collection.entries.filter(entry => entry.id !== entryId)
        }
        : collection
    )
    saveCollections(newCollections)
  }

  const updateCollection = (id: string, updates: Partial<WorldInfoCollection>) => {
    const newCollections = collections.map(collection =>
      collection.id === id
        ? { ...collection, ...updates, updatedAt: new Date().toISOString() }
        : collection
    )
    saveCollections(newCollections)
  }

  const deleteCollection = (id: string) => {
    const newCollections = collections.filter(collection => collection.id !== id)
    saveCollections(newCollections)
  }

  const importCollections = async (collectionsJson: string) => {
    const imported = JSON.parse(collectionsJson)
    if (!Array.isArray(imported)) return

    // Get current collections from localStorage
    const currentCollections = JSON.parse(localStorage.getItem("worldInfoCollections") || "[]")
    
    // Process each imported collection
    imported.forEach(collection => {
      const existingIndex = currentCollections.findIndex((c: WorldInfoCollection) => c.id === collection.id)
      if (existingIndex >= 0) {
        currentCollections[existingIndex] = {
          ...collection,
          updatedAt: new Date().toISOString()
        }
      } else {
        currentCollections.push({
          ...collection,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
    })

    saveCollections(currentCollections)
  }

  return (
    <WorldInfoContext.Provider value={{
      collections,
      entries: collections.flatMap(c => c.entries),
      importCollections,
      addCollection,
      updateCollection,
      deleteCollection,
      addEntryToCollection,
      updateEntry,
      deleteEntry,
    }}>
      {children}
    </WorldInfoContext.Provider>
  )
} 