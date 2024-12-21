"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useSettings } from "@/contexts/settings-context"

const WRITING_FONTS = [
  { value: "geist", label: "Geist Sans", category: "Modern" },
  { value: "geist-mono", label: "Geist Mono", category: "Modern" },
  { value: "georgia", label: "Georgia", category: "Serif" },
  { value: "garamond", label: "Garamond", category: "Serif" },
  { value: "palatino", label: "Palatino", category: "Serif" },
  { value: "times", label: "Times New Roman", category: "Serif" },
  { value: "baskerville", label: "Baskerville", category: "Serif" },
  { value: "bookman", label: "Bookman", category: "Serif" },
  { value: "merriweather", label: "Merriweather", category: "Serif" },
  { value: "crimson", label: "Crimson Text", category: "Serif" },
  { value: "lora", label: "Lora", category: "Serif" },
  { value: "source-serif", label: "Source Serif Pro", category: "Serif" },
  { value: "helvetica", label: "Helvetica", category: "Sans" },
  { value: "arial", label: "Arial", category: "Sans" },
  { value: "verdana", label: "Verdana", category: "Sans" },
  { value: "open-sans", label: "Open Sans", category: "Sans" },
  { value: "roboto", label: "Roboto", category: "Sans" },
  { value: "nunito", label: "Nunito", category: "Sans" },
  { value: "system", label: "System Default", category: "System" }
]

export function TextFormatSettings() {
  const { textSettings, updateTextSettings } = useSettings()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Font Family</Label>
        <Select 
          value={textSettings.fontFamily} 
          onValueChange={(value) => updateTextSettings({ fontFamily: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {Object.entries(
              WRITING_FONTS.reduce((acc, font) => ({
                ...acc,
                [font.category]: [...(acc[font.category] || []), font]
              }), {} as Record<string, typeof WRITING_FONTS>)
            ).map(([category, fonts]) => (
              <div key={category}>
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                  {category}
                </div>
                {fonts.map((font) => (
                  <SelectItem 
                    key={font.value} 
                    value={font.value}
                    className="font-[system-ui]"
                  >
                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Text Align</Label>
        <Select 
          value={textSettings.textAlign} 
          onValueChange={(value) => updateTextSettings({ textAlign: value as 'left' | 'center' | 'right' | 'justify' })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
            <SelectItem value="justify">Justify</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Font Size ({textSettings.fontSize}px)</Label>
        <Slider 
          value={[textSettings.fontSize]}
          min={12}
          max={24}
          step={1}
          onValueChange={([value]) => updateTextSettings({ fontSize: value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Line Height ({textSettings.lineHeight})</Label>
        <Slider 
          value={[textSettings.lineHeight]}
          min={1}
          max={2}
          step={0.1}
          onValueChange={([value]) => updateTextSettings({ lineHeight: value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Line Indent ({textSettings.lineIndent}px)</Label>
        <Slider 
          value={[textSettings.lineIndent]}
          min={0}
          max={50}
          step={2}
          onValueChange={([value]) => updateTextSettings({ lineIndent: value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Paragraph Spacing ({textSettings.paragraphSpacing}em)</Label>
        <Slider 
          value={[textSettings.paragraphSpacing]}
          min={0.5}
          max={3}
          step={0.1}
          onValueChange={([value]) => updateTextSettings({ paragraphSpacing: value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Page Width ({textSettings.pageWidth}px)</Label>
        <Slider 
          value={[textSettings.pageWidth]}
          min={400}
          max={1200}
          step={50}
          onValueChange={([value]) => updateTextSettings({ pageWidth: value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Text Opacity ({Math.round(textSettings.textOpacity * 100)}%)</Label>
        <Slider 
          value={[textSettings.textOpacity]}
          min={0.3}
          max={1}
          step={0.05}
          onValueChange={([value]) => updateTextSettings({ textOpacity: value })}
        />
      </div>
    </div>
  )
} 