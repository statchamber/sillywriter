"use client"

import { createContext, useContext, useState, useEffect } from "react"

interface GlobalSettings {
  autoSave: boolean
  hasSeenWarning: boolean
}

interface TextSettings {
  fontFamily: string
  fontSize: number
  lineHeight: number
  lineIndent: number
  paragraphSpacing: number
  pageWidth: number
  textAlign: 'left' | 'center' | 'right' | 'justify'
  textOpacity: number
}

interface SettingsContextType {
  textSettings: TextSettings
  updateTextSettings: (settings: Partial<TextSettings>) => void
  globalSettings: GlobalSettings
  updateGlobalSettings: (settings: Partial<GlobalSettings>) => void
  importSettings: (settings: { textSettings?: TextSettings, globalSettings?: GlobalSettings }) => void
}

const defaultGlobalSettings: GlobalSettings = {
  autoSave: true,
  hasSeenWarning: false
}

const defaultTextSettings: TextSettings = {
  fontFamily: 'system',
  fontSize: 16,
  lineHeight: 1.5,
  lineIndent: 0,
  paragraphSpacing: 1,
  pageWidth: 800,
  textAlign: 'left',
  textOpacity: 1
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [textSettings, setTextSettings] = useState<TextSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('textSettings')
      return saved ? JSON.parse(saved) : defaultTextSettings
    }
    return defaultTextSettings
  })

  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('globalSettings')
      return saved ? JSON.parse(saved) : defaultGlobalSettings
    }
    return defaultGlobalSettings
  })

  useEffect(() => {
    localStorage.setItem('textSettings', JSON.stringify(textSettings))
  }, [textSettings])

  useEffect(() => {
    localStorage.setItem('globalSettings', JSON.stringify(globalSettings))
  }, [globalSettings])

  const updateTextSettings = (settings: Partial<TextSettings>) => {
    setTextSettings(prev => ({ ...prev, ...settings }))
  }

  const updateGlobalSettings = (settings: Partial<GlobalSettings>) => {
    setGlobalSettings(prev => ({ ...prev, ...settings }))
  }

  const importSettings = (settings: { textSettings?: TextSettings, globalSettings?: GlobalSettings }) => {
    if (settings.textSettings) {
      setTextSettings(settings.textSettings)
    }
    if (settings.globalSettings) {
      setGlobalSettings(settings.globalSettings)
    }
  }

  return (
    <SettingsContext.Provider value={{
      textSettings,
      updateTextSettings,
      globalSettings,
      updateGlobalSettings,
      importSettings
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) throw new Error('useSettings must be used within a SettingsProvider')
  return context
} 