"use client"

import { Story } from "@/types/story"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StoryAITab } from "./tabs/story-ai-tab"
import { StoryCharactersTab } from "./tabs/story-characters-tab"
import { StoryInformationTab } from "./tabs/story-information-tab"
import { StoryTab } from "./tabs/story-tab"

interface StoryDetailsProps {
  story: Story
  selectedChapterId?: string
}

export function StoryDetails({ story, selectedChapterId }: StoryDetailsProps) {
  return (
    <div className="w-80 border-l flex flex-col bg-muted/30 h-full overflow-hidden">
      <Tabs defaultValue="story" className="flex-1 flex flex-col">
        <div className="shrink-0 p-4 border-b">
          <TabsList className="w-full">
            <TabsTrigger value="story" className="flex-1">Story</TabsTrigger>
            <TabsTrigger value="ai" className="flex-1">AI</TabsTrigger>
            <TabsTrigger value="characters" className="flex-1">Characters</TabsTrigger>
            <TabsTrigger value="info" className="flex-1">Info</TabsTrigger>
          </TabsList>
        </div>
        <div className="flex-1 overflow-y-auto">
          <TabsContent value="story" className="p-4 m-0">
            <StoryTab story={story} selectedChapterId={selectedChapterId} />
          </TabsContent>
          <TabsContent value="ai" className="p-4 m-0">
            <StoryAITab story={story} selectedChapterId={selectedChapterId} />
          </TabsContent>
          <TabsContent value="characters" className="p-4 m-0">
            <StoryCharactersTab story={story} />
          </TabsContent>
          <TabsContent value="info" className="p-4 m-0">
            <StoryInformationTab story={story} selectedChapterId={selectedChapterId} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
} 