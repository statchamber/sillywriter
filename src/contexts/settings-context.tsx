"use client"

import { createContext, useContext, useState, useEffect } from "react"

interface GlobalSettings {
  autoSave: boolean
}

interface TextSettings {
  fontSize: number
  fontFamily: string
  lineHeight: number
  lineIndent: number
  textAlign: string
  paragraphSpacing: number
}

interface SettingsContextType {
  textSettings: TextSettings
  updateTextSettings: (settings: Partial<TextSettings>) => void
  globalSettings: GlobalSettings
  updateGlobalSettings: (settings: Partial<GlobalSettings>) => void
  importSettings: (settings: { textSettings?: TextSettings, globalSettings?: GlobalSettings }) => void
}

const defaultGlobalSettings: GlobalSettings = {
  autoSave: false
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [textSettings, setTextSettings] = useState<TextSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('textSettings')
      return saved ? JSON.parse(saved) : { fontSize: 16, fontFamily: 'geist', lineHeight: 1.6, lineIndent: 20, textAlign: 'left', paragraphSpacing: 1.0 }
    }
    return { fontSize: 16, fontFamily: 'geist', lineHeight: 1.6, lineIndent: 20, textAlign: 'left', paragraphSpacing: 1.0 }
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