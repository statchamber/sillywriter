"use client"

import { useState } from "react"
import { Story, Character } from "@/types/story"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Wand2, Pencil, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useStories } from "@/contexts/stories-context"
import { EditCharacterDialog } from "@/components/story/edit-character-dialog"

interface StoryCharactersTabProps {
  story: Story
}

export function StoryCharactersTab({ story }: StoryCharactersTabProps) {
  const { updateStory, deleteCharacter } = useStories()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [newCharacter, setNewCharacter] = useState({ 
    name: "", 
    alias: "",
    description: "" 
  })

  const filteredCharacters = story.characters?.filter(character =>
    character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    character.alias?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const handleAddCharacter = () => {
    const character: Character = {
      id: crypto.randomUUID(),
      name: newCharacter.name,
      alias: newCharacter.alias,
      description: newCharacter.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    updateStory(story.id, {
      characters: [...(story.characters || []), character]
    })
    setNewCharacter({ name: "", alias: "", description: "" })
  }

  const handleEditCharacter = (updates: Partial<Character>) => {
    if (!selectedCharacter) return
    
    const updatedCharacters = story.characters.map(char => 
      char.id === selectedCharacter.id 
        ? { ...char, ...updates, updatedAt: new Date().toISOString() }
        : char
    )
    
    updateStory(story.id, {
      characters: updatedCharacters
    })
  }

  const handleAutoDetect = () => {
    // Placeholder function for auto detect functionality
    console.log("Auto detect functionality is not implemented yet.");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search characters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={handleAutoDetect}>
          <Wand2 className="h-4 w-4" />
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Character</DialogTitle>
              <DialogDescription>
                Add a new character to your story.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Character name"
                value={newCharacter.name}
                onChange={(e) => setNewCharacter(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                placeholder="Character alias"
                value={newCharacter.alias}
                onChange={(e) => setNewCharacter(prev => ({ ...prev, alias: e.target.value }))}
              />
              <Textarea
                placeholder="Character description"
                value={newCharacter.description}
                onChange={(e) => setNewCharacter(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>
            <DialogFooter>
              <Button onClick={handleAddCharacter}>Add Character</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {filteredCharacters.map((character) => (
          <div
            key={character.id}
            className="p-3 rounded-lg border bg-card hover:bg-accent/50"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{character.name}</div>
                {character.alias && (
                  <div className="text-sm text-muted-foreground">
                    {character.alias}
                  </div>
                )}
                <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {character.description}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedCharacter(character)
                      setShowEditDialog(true)
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => deleteCharacter(story.id, character.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>

      <EditCharacterDialog
        character={selectedCharacter}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSave={handleEditCharacter}
      />
    </div>
  )
} 