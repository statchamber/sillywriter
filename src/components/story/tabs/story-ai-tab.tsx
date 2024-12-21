"use client"

import { useState } from "react"
import { useWorldInfo } from "@/contexts/world-info-context"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Wand2 } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"

const AI_MODELS = [
  { value: "gpt-4", label: "GPT-4" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
]

export function StoryAITab() {
  const { collections = [] } = useWorldInfo()
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [contextLimit, setContextLimit] = useState([200000])
  
  // AI Settings
  const [model, setModel] = useState("gpt-4")
  const [temperature, setTemperature] = useState([0.7])
  const [topP, setTopP] = useState([0.9])
  const [minP, setMinP] = useState([0.1])
  const [freqPenalty, setFreqPenalty] = useState([0.0])
  const [presencePenalty, setPresencePenalty] = useState([0.0])

  const handleGenerate = (option: number) => {
    // TODO: Implement AI generation
    console.log(`Generating with option ${option}, word count: ${contextLimit}`)
  }

  const handleCollectionChange = (value: string) => {
    setSelectedCollections(prev => {
      if (value === "none") return []
      if (prev.includes(value)) {
        return prev.filter(id => id !== value)
      }
      return [...prev, value]
    })
  }

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="space-y-4 pr-4">
        <div className="space-y-2">
          <Label>Context Limit</Label>
          <Slider
            value={contextLimit}
            onValueChange={setContextLimit}
            min={500}
            max={2000000}
            step={100}
            className="my-4"
          />
          <div className="text-sm text-muted-foreground">
            {contextLimit[0].toLocaleString()} tokens
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="ai-settings">
            <AccordionTrigger>AI Settings</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                <Label>Model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_MODELS.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Temperature ({temperature})</Label>
                <Slider
                  value={temperature}
                  onValueChange={setTemperature}
                  min={0}
                  max={2}
                  step={0.1}
                  className="my-4"
                />
                <div className="text-sm text-muted-foreground">
                  Controls randomness: 0 is focused, 2 is more creative
                </div>
              </div>

              <div className="space-y-2">
                <Label>Top P ({topP})</Label>
                <Slider
                  value={topP}
                  onValueChange={setTopP}
                  min={0}
                  max={1}
                  step={0.1}
                  className="my-4"
                />
                <div className="text-sm text-muted-foreground">
                  Controls diversity via nucleus sampling
                </div>
              </div>

              <div className="space-y-2">
                <Label>Min P ({minP})</Label>
                <Slider
                  value={minP}
                  onValueChange={setMinP}
                  min={0}
                  max={1}
                  step={0.1}
                  className="my-4"
                />
                <div className="text-sm text-muted-foreground">
                  Sets minimum probability threshold
                </div>
              </div>

              <div className="space-y-2">
                <Label>Frequency Penalty ({freqPenalty})</Label>
                <Slider
                  value={freqPenalty}
                  onValueChange={setFreqPenalty}
                  min={-2}
                  max={2}
                  step={0.1}
                  className="my-4"
                />
                <div className="text-sm text-muted-foreground">
                  Reduces repetition of token sequences
                </div>
              </div>

              <div className="space-y-2">
                <Label>Presence Penalty ({presencePenalty})</Label>
                <Slider
                  value={presencePenalty}
                  onValueChange={setPresencePenalty}
                  min={-2}
                  max={2}
                  step={0.1}
                  className="my-4"
                />
                <div className="text-sm text-muted-foreground">
                  Encourages discussing new topics
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="space-y-2">
          <Label>World Info Collections</Label>
          <Select onValueChange={handleCollectionChange}>
            <SelectTrigger>
              <SelectValue placeholder={
                selectedCollections.length === 0 
                  ? "Select collections..." 
                  : `${selectedCollections.length} selected`
              } />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {collections.map((collection) => (
                <SelectItem 
                  key={collection.id} 
                  value={collection.id}
                >
                  {collection.name} {selectedCollections.includes(collection.id) ? " ✓" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button className="w-full">
              <Wand2 className="mr-2 h-4 w-4" />
              Generate with AI
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-2">
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={() => handleGenerate(1)}
              >
                Generate Option 1
              </Button>
              <Button 
                variant="secondary"
                className="w-full"
                onClick={() => handleGenerate(2)}
              >
                Generate Option 2
              </Button>
              <Button 
                variant="secondary"
                className="w-full"
                onClick={() => handleGenerate(3)}
              >
                Generate Option 3
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </ScrollArea>
  )
} 