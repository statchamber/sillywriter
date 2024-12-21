"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { Story } from "@/types/story"
import { useStories } from "@/contexts/stories-context"
import { useSettings } from "@/contexts/settings-context"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Save, Download, Wand2, FileText } from "lucide-react"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { 
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SceneBeatDialog } from "./scene-beat-dialog"
import { FloatingEditorMenu } from "./floating-editor-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface ChapterEditorProps {
  story: Story
  selectedChapterId?: string
}

export function ChapterEditor({ story, selectedChapterId }: ChapterEditorProps) {
  const { updateChapter } = useStories()
  const { textSettings, globalSettings, updateGlobalSettings } = useSettings()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [showCommandMenu, setShowCommandMenu] = useState(false)
  const [cursorPosition, setCursorPosition] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [showSceneBeatDialog, setShowSceneBeatDialog] = useState(false)
  const [selection, setSelection] = useState<{
    text: string
    rect: {
      top: number
      left: number
      width: number
      height: number
    }
    mousePosition?: {
      x: number
      y: number
    }
  } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const selectedChapter = story.chapters.find(c => c.id === selectedChapterId)

  useEffect(() => {
    if (selectedChapter) {
      setTitle(selectedChapter.title)
      setContent(selectedChapter.content)
    }
  }, [selectedChapter])

  const handleSave = () => {
    if (!selectedChapterId) return
    setIsSaving(true)
    updateChapter(story.id, selectedChapterId, {
      title,
      content
    })
    setIsSaving(false)
  }

  const handleExportChapter = () => {
    if (!selectedChapter) return
    
    const blob = new Blob([selectedChapter.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedChapter.title}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getFontFamily = (fontFamily: string) => {
    switch (fontFamily) {
      case 'geist': return 'var(--font-geist-sans)'
      case 'geist-mono': return 'var(--font-geist-mono)'
      case 'georgia': return 'Georgia, serif'
      case 'garamond': return 'Garamond, serif'
      case 'palatino': return 'Palatino, serif'
      case 'times': return 'Times New Roman, serif'
      case 'baskerville': return 'Baskerville, serif'
      case 'bookman': return 'Bookman, serif'
      case 'merriweather': return 'Merriweather, serif'
      case 'crimson': return 'Crimson Text, serif'
      case 'lora': return 'Lora, serif'
      case 'source-serif': return 'Source Serif Pro, serif'
      case 'helvetica': return 'Helvetica, sans-serif'
      case 'arial': return 'Arial, sans-serif'
      case 'verdana': return 'Verdana, sans-serif'
      case 'open-sans': return 'Open Sans, sans-serif'
      case 'roboto': return 'Roboto, sans-serif'
      case 'nunito': return 'Nunito, sans-serif'
      default: return 'system-ui'
    }
  }

  const textareaStyle = {
    fontFamily: getFontFamily(textSettings.fontFamily),
    fontSize: `${textSettings.fontSize}px`,
    lineHeight: textSettings.lineHeight,
    textIndent: `${textSettings.lineIndent}px`,
    maxWidth: '100%',
    textAlign: textSettings.textAlign as 'left' | 'center' | 'right' | 'justify',
    marginLeft: 0,
    marginRight: 0,
    marginTop: `${textSettings.paragraphSpacing}em`,
    opacity: textSettings.textOpacity
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === '/') {
      const textarea = e.currentTarget
      const cursorPosition = textarea.selectionStart
      const textBeforeCursor = content.slice(0, cursorPosition)
      
      // Only trigger command menu if "/" is at start of line or after a space
      const lastChar = textBeforeCursor.slice(-1)
      if (lastChar === '' || lastChar === '\n' || lastChar === ' ') {
        e.preventDefault()
        setCursorPosition(cursorPosition)
        setShowCommandMenu(true)
      }
    }
  }

  const handleCommand = (command: string) => {
    setShowCommandMenu(false)
    
    switch (command) {
      case 'scene-beat':
        setShowSceneBeatDialog(true)
        break
      case 'continue':
        // TODO: Implement AI continuation
        console.log("Continue writing with AI")
        break
    }
  }

  const handleSceneBeatSubmit = (description: string) => {
    const newContent = content.slice(0, cursorPosition) + 
      `\n[Scene Beat: ${description}]\n` + 
      content.slice(cursorPosition)
    setContent(newContent)
    
    // Restore focus to textarea
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const handleSelectionChange = useCallback((e?: Event) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      
      if (start !== end) {
        const selectedText = content.substring(start, end)
        
        // Get mouse position from event if it's a MouseEvent
        const mousePosition = e instanceof MouseEvent ? {
          x: e.clientX,
          y: e.clientY
        } : undefined
        
        // Get the text content up to the selection
        const textBeforeSelection = content.substring(0, start)
        const lines = textBeforeSelection.split('\n')
        
        // Calculate position based on textarea
        const rect = textarea.getBoundingClientRect()
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight)
        const currentLineNumber = lines.length - 1
        
        // Calculate position
        const top = rect.top + (currentLineNumber * lineHeight)
        const left = rect.left + (textarea.selectionEnd - textarea.selectionStart) / 2
        
        setSelection({
          text: selectedText,
          rect: {
            top: top,
            left: left,
            width: (end - start) * 8, // Approximate width based on character count
            height: lineHeight
          },
          mousePosition
        })
      } else {
        setSelection(null)
      }
    }
  }, [content])

  const handleFloatingMenuAction = async (promptId: string) => {
    if (!selection) return
    
    const selectedText = selection.toString()
    setIsExecutingPrompt(true)
    
    try {
      const result = await executePrompt(promptId, selectedText)
      // Insert the result at the current selection
      const start = textareaRef.current?.selectionStart || 0
      const end = textareaRef.current?.selectionEnd || 0
      const newContent = content.substring(0, start) + result + content.substring(end)
      setContent(newContent)
    } catch (error) {
      console.error('Failed to execute prompt:', error)
      // TODO: Show error toast
    } finally {
      setIsExecutingPrompt(false)
    }
  }

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange)
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
    }
  }, [handleSelectionChange])

  // Add mousedown handler to start drag
  const handleMouseDown = () => {
    setIsDragging(true)
    setSelection(null)
  }

  // Modify mouseup handler
  const handleMouseUp = (e: MouseEvent) => {
    setIsDragging(false)
    handleSelectionChange(e)
  }

  useEffect(() => {
    if (!globalSettings.autoSave || !selectedChapterId) return
    
    const saveTimeout = setTimeout(() => {
      updateChapter(story.id, selectedChapterId, {
        title,
        content
      })
      setLastSaved(new Date())
    }, 2000) // Save 2 seconds after last change

    return () => clearTimeout(saveTimeout)
  }, [globalSettings.autoSave, content, title, selectedChapterId, story.id, updateChapter])

  if (!selectedChapter) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Select a chapter to start writing
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex-1">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold bg-transparent border-none px-0 flex-1"
            placeholder="Chapter title"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Switch
              checked={globalSettings.autoSave}
              onCheckedChange={(checked) => updateGlobalSettings({ autoSave: checked })}
              id="autosave"
            />
            <Label htmlFor="autosave">
              {globalSettings.autoSave 
                ? lastSaved 
                  ? `Last saved ${new Date(lastSaved).toLocaleTimeString()}` 
                  : "Autosave on"
                : "Autosave off"
              }
            </Label>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleExportChapter} 
              title="Export chapter as TXT"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving || globalSettings.autoSave}
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onMouseDown={handleMouseDown}
          onMouseUp={(e) => handleMouseUp(e.nativeEvent)}
          onSelect={(e) => {
            // Only handle selection events that aren't from mouse
            if (!e.nativeEvent.type.includes('mouse')) {
              handleSelectionChange()
            }
          }}
          className="min-h-full w-full p-4 bg-background text-foreground resize-none border-none focus-visible:ring-0"
          placeholder="Start writing, or press '/' to open the command menu."
          style={textareaStyle}
        />
      </div>

      <CommandDialog open={showCommandMenu} onOpenChange={setShowCommandMenu}>
        <DialogHeader>
          <DialogTitle className="sr-only">Command Menu</DialogTitle>
        </DialogHeader>
        <Command>
          <CommandInput placeholder="Type a command..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="AI">
              <CommandItem onSelect={() => handleCommand('scene-beat')}>
                <FileText className="mr-2 h-4 w-4" />
                Scene Beat
              </CommandItem>
              <CommandItem onSelect={() => handleCommand('continue')}>
                <Wand2 className="mr-2 h-4 w-4" />
                Continue Writing from Selection
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>

      <SceneBeatDialog
        open={showSceneBeatDialog}
        onOpenChange={setShowSceneBeatDialog}
        onSubmit={handleSceneBeatSubmit}
      />

      <FloatingEditorMenu 
        selection={selection} 
        onAction={handleFloatingMenuAction} 
        isDragging={isDragging}
      />
    </div>
  )
} 
// @typescript-eslint/no-unused-vars
function setIsExecutingPrompt(value: boolean) {
  throw new Error(`setIsExecutingPrompt not implemented (value: ${value})`)
}

function executePrompt(promptId: string, selectedText: string) {
  throw new Error(`executePrompt not implemented (promptId: ${promptId}, text length: ${selectedText.length})`)
}
