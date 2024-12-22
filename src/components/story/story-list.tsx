"use client"

import { Story } from "@/types/story"
import { useStories } from "@/contexts/stories-context"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, FileEdit, Download, Trash, FileJson, FileText, FileType } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx"
import { useRouter } from 'next/navigation'

interface StoryListProps {
  stories: Story[]
}

export function StoryList({ stories }: StoryListProps) {
  const { deleteStory, exportStory } = useStories()
  const [storyToDelete, setStoryToDelete] = useState<Story | null>(null)
  const router = useRouter()

  const exportToDocx = async (story: Story) => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: story.title,
            heading: HeadingLevel.TITLE,
            spacing: {
              after: 400
            }
          }),

          ...(story.storyPlot ? [
            new Paragraph({
              text: "Story Plot",
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              text: story.storyPlot,
              spacing: {
                after: 400
              }
            })
          ] : []),

          ...story.chapters
            .sort((a, b) => a.order - b.order)
            .flatMap(chapter => [
              new Paragraph({
                text: chapter.title,
                heading: HeadingLevel.HEADING_1,
                pageBreakBefore: true,
              }),

              ...(chapter.chapterPlot ? [
                new Paragraph({
                  text: "Chapter Plot",
                  heading: HeadingLevel.HEADING_2,
                }),
                new Paragraph({
                  text: chapter.chapterPlot,
                  spacing: {
                    after: 400
                  }
                })
              ] : []),

              ...chapter.content.split('\n\n').map(paragraph => 
                new Paragraph({
                  children: [
                    new TextRun({
                      text: paragraph,
                    })
                  ],
                  spacing: {
                    after: 200
                  }
                })
              )
            ])
        ]
      }]
    })

    const blob = await Packer.toBlob(doc)
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${story.title}.docx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExport = async (storyId: string, format: 'json' | 'txt' | 'docx') => {
    const story = stories.find(s => s.id === storyId)
    if (!story) return

    switch (format) {
      case 'json':
        exportStory(storyId)
        break
      case 'txt':
        const content = story.chapters
          .sort((a, b) => a.order - b.order)
          .map(chapter => `# ${chapter.title}\n\n${chapter.content}`)
          .join('\n\n---\n\n')
        
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${story.title}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        break
      case 'docx':
        await exportToDocx(story)
        break
    }
  }

  const handleDelete = (story: Story) => {
    setStoryToDelete(story)
  }

  const confirmDelete = () => {
    if (storyToDelete) {
      deleteStory(storyToDelete.id)
      setStoryToDelete(null)
      window.location.reload()
    }
  }

  const handleEditClick = (e: React.MouseEvent, storyId: string) => {
    e.preventDefault()
    router.push(`/story/${storyId}`)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Chapters</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stories.map((story) => (
            <TableRow key={story.id}>
              <TableCell>{story.title}</TableCell>
              <TableCell>{story.chapters.length}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(story.updatedAt), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => handleEditClick(e, story.id)}>
                      <div className="flex items-center">
                        <FileEdit className="mr-2 h-4 w-4" />
                        Edit
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Download className="mr-2 h-4 w-4" />
                        Export as...
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem onClick={() => handleExport(story.id, 'json')}>
                            <FileJson className="mr-2 h-4 w-4" />
                            .json
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExport(story.id, 'txt')}>
                            <FileText className="mr-2 h-4 w-4" />
                            .txt
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExport(story.id, 'docx')}>
                            <FileType className="mr-2 h-4 w-4" />
                            .docx
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(story)}
                      className="text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!storyToDelete} onOpenChange={(open) => !open && setStoryToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Story</DialogTitle>
            <DialogDescription>
              This will permanently delete &quot;{storyToDelete?.title}&quot; and all its chapters.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setStoryToDelete(null)
                window.location.reload()
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete Story
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 