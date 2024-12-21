import { Button } from "@/components/ui/button"
import { Wand2, RefreshCw, Expand, MessageSquare } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SelectionInfo {
  text: string
  rect: {
    top: number
    left: number
    width: number
  }
  mousePosition?: {
    x: number
    y: number
  }
}

interface FloatingEditorMenuProps {
  selection: SelectionInfo | null
  onAction: (action: string) => void
  isDragging?: boolean
}

export function FloatingEditorMenu({ selection, onAction, isDragging }: FloatingEditorMenuProps) {
  if (!selection || isDragging) return null

  // Get viewport dimensions
  const viewportHeight = window.innerHeight
  const viewportWidth = window.innerWidth
  const menuHeight = 48 // Height of our menu including padding
  const menuWidth = 320 // Approximate width of the menu
  const verticalOffset = 8 // Gap between menu and selection

  // Calculate position
  let top, left

  if (selection.mousePosition) {
    // Use mouse position when available
    top = selection.mousePosition.y - menuHeight - verticalOffset
    left = selection.mousePosition.x
  } else {
    // Fallback to selection rect
    top = selection.rect.top - menuHeight - verticalOffset
    left = selection.rect.left + (selection.rect.width / 2)
  }

  // Adjust position if it would go above viewport
  if (top < 0) {
    top = selection.mousePosition 
      ? selection.mousePosition.y + verticalOffset
      : selection.rect.top + selection.rect.height + verticalOffset
  }

  // Adjust horizontal position if it would go outside viewport
  left = Math.max(menuWidth / 2, Math.min(left, viewportWidth - menuWidth / 2))

  // Ensure menu stays within viewport vertically
  top = Math.max(verticalOffset, Math.min(top, viewportHeight - menuHeight - verticalOffset))

  return (
    <TooltipProvider>
      <div 
        className="fixed z-50 flex items-center gap-1 p-1 bg-popover border rounded-md shadow-md"
        style={{ 
          top: `${top}px`,
          left: `${left}px`,
          transform: 'translateX(-50%)',
          maxWidth: 'calc(100vw - 32px)',
        }}
      >
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-3 flex items-center gap-2"
                onClick={() => onAction('expand')}
              >
                <Expand className="h-4 w-4" />
                <span className="text-sm">Expand</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Make it longer</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-3 flex items-center gap-2"
                onClick={() => onAction('rewrite')}
              >
                <RefreshCw className="h-4 w-4" />
                <span className="text-sm">Rephrase</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rewrite in a different way</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-3 flex items-center gap-2"
                onClick={() => onAction('continue')}
              >
                <Wand2 className="h-4 w-4" />
                <span className="text-sm">Shorten</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Make it more concise</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-3 flex items-center gap-2"
                onClick={() => onAction('explain')}
              >
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm">Custom</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Custom AI instruction</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
} 