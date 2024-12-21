"use client"

import { WorldInfoEntry, WorldInfoCategory } from "@/types/world-info"
import { useWorldInfo } from "@/contexts/world-info-context"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Pencil, Trash2, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { EditWorldInfoDialog } from "@/components/world-info/edit-world-info-dialog"

interface WorldInfoListProps {
  category: WorldInfoCategory | "all"
  searchQuery: string
  collectionId: string | null
}

export function WorldInfoList({ category, searchQuery, collectionId }: WorldInfoListProps) {
  const { collections, deleteEntry } = useWorldInfo()
  const [selectedEntry, setSelectedEntry] = useState<WorldInfoEntry | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const currentCollection = collectionId 
    ? collections.find(c => c.id === collectionId)
    : null

  const allEntries = collectionId
    ? (currentCollection?.entries || [])
    : collections.reduce<WorldInfoEntry[]>((acc, collection) => {
        return acc.concat(collection.entries || [])
      }, [])

  const filteredEntries = allEntries.filter(entry => {
    const matchesCategory = category === "all" || entry.category === category
    const matchesSearch = entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  return (
    <>
      <ScrollArea className="h-[600px] rounded-md border p-4">
        <div className="space-y-4">
          {filteredEntries.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No entries found.
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <div key={entry.id} className="flex items-start justify-between space-x-4 rounded-lg border p-4">
                <div className="space-y-1">
                  <h3 className="font-semibold">{entry.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {entry.description}
                  </p>
                  {entry.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {entry.keywords.map((keyword, i) => (
                        <span key={i} className="text-xs bg-muted px-2 py-1 rounded">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {
                      setSelectedEntry(entry)
                      setShowEditDialog(true)
                    }}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => deleteEntry(collectionId!, entry.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      <EditWorldInfoDialog
        entry={selectedEntry}
        collectionId={collectionId}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
    </>
  )
} 