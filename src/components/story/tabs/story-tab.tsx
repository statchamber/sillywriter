"use client"

import { Chapter, Story } from "@/types/story"
import { useStories } from "@/contexts/stories-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Plus, Minus } from "lucide-react"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface StoryTabProps {
  story: Story
  selectedChapterId?: string
}

export function StoryTab({ story, selectedChapterId }: StoryTabProps) {
  const { updateStory, updateChapter } = useStories()
  const [customStyleSections, setCustomStyleSections] = useState<string[]>(
    Object.keys(story.styleDescription?.custom || {})
  )

  const selectedChapter = story.chapters.find(c => c.id === selectedChapterId)

  const handleStoryUpdate = (updates: Partial<Story>) => {
    updateStory(story.id, updates)
  }

  const handleChapterUpdate = (updates: Partial<Chapter>) => {
    if (!selectedChapterId || !selectedChapter) return
    updateChapter(story.id, selectedChapterId, updates)
  }

  const handleAddCustomStyle = () => {
    const name = prompt("Enter section name:")
    if (!name) return

    setCustomStyleSections([...customStyleSections, name])
    handleStoryUpdate({
      styleDescription: {
        ...story.styleDescription,
        custom: {
          ...story.styleDescription?.custom,
          [name]: ""
        }
      }
    })
  }

  const handleRemoveCustomStyle = (name: string) => {
    setCustomStyleSections(customStyleSections.filter(s => s !== name))
    const custom = { ...story.styleDescription?.custom }
    delete custom[name]
    handleStoryUpdate({
      styleDescription: {
        ...story.styleDescription,
        custom
      }
    })
  }

  return (
    <div className="h-full space-y-6">
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-4 pr-4">
          <div className="space-y-2">
            <Label>Story Plot</Label>
            <Textarea
              value={story.storyPlot || ""}
              onChange={(e) => handleStoryUpdate({ storyPlot: e.target.value })}
              placeholder="Describe the overall plot of your story..."
              className="min-h-[100px]"
            />
          </div>

          {selectedChapter && (
            <>
              <div className="space-y-2">
                <Label>Chapter Plot</Label>
                <Textarea
                  value={selectedChapter.chapterPlot || ""}
                  onChange={(e) => handleChapterUpdate({ chapterPlot: e.target.value })}
                  placeholder="Describe the plot for this chapter..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Chapter Notes (not sent to AI)</Label>
                <Textarea
                  value={selectedChapter.notes || ""}
                  onChange={(e) => handleChapterUpdate({ notes: e.target.value })}
                  placeholder="Add private notes for this chapter..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Past Events</Label>
                <Textarea
                  value={selectedChapter.pastEvents?.join("\n") || ""}
                  onChange={(e) => handleChapterUpdate({ 
                    pastEvents: e.target.value.split("\n").filter(Boolean)
                  })}
                  placeholder="Add past events (one per line)..."
                  className="min-h-[100px]"
                />
              </div>
            </>
          )}

          <Accordion type="multiple" className="w-full">
            <AccordionItem value="style">
              <AccordionTrigger>Style Description</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>General Style</Label>
                    <Textarea
                      value={story.styleDescription?.general || ""}
                      onChange={(e) => handleStoryUpdate({
                        styleDescription: {
                          ...story.styleDescription,
                          general: e.target.value
                        }
                      })}
                      placeholder="Describe the general writing style..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tone</Label>
                    <Textarea
                      value={story.styleDescription?.tone || ""}
                      onChange={(e) => handleStoryUpdate({
                        styleDescription: {
                          ...story.styleDescription,
                          tone: e.target.value
                        }
                      })}
                      placeholder="Describe the tone of the story..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Pacing</Label>
                    <Textarea
                      value={story.styleDescription?.pacing || ""}
                      onChange={(e) => handleStoryUpdate({
                        styleDescription: {
                          ...story.styleDescription,
                          pacing: e.target.value
                        }
                      })}
                      placeholder="Describe the pacing style..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Point of View</Label>
                    <Textarea
                      value={story.styleDescription?.pointOfView || ""}
                      onChange={(e) => handleStoryUpdate({
                        styleDescription: {
                          ...story.styleDescription,
                          pointOfView: e.target.value
                        }
                      })}
                      placeholder="Describe the point of view..."
                      className="min-h-[100px]"
                    />
                  </div>

                  {customStyleSections.map((name) => (
                    <div key={name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>{name}</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCustomStyle(name)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={story.styleDescription?.custom?.[name] || ""}
                        onChange={(e) => handleStoryUpdate({
                          styleDescription: {
                            ...story.styleDescription,
                            custom: {
                              ...story.styleDescription?.custom,
                              [name]: e.target.value
                            }
                          }
                        })}
                        className="min-h-[100px]"
                      />
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleAddCustomStyle}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Style Section
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  )
} 