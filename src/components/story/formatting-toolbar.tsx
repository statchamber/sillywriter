import { Button } from "@/components/ui/button"
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Quote 
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface FormattingToolbarProps {
  onFormat: (format: string) => void
}

export function FormattingToolbar({ onFormat }: FormattingToolbarProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-1 p-1 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onFormat('**')}
            >
              <Bold className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            Bold (Ctrl+B)
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onFormat('*')}
            >
              <Italic className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            Italic (Ctrl+I)
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onFormat('~~')}
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            Strikethrough
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onFormat('>')}
            >
              <Quote className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            Quote
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
} 