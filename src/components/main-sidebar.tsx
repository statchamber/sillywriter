"use client"

import { Button } from "@/components/ui/button"
import { BookOpen, MessageSquare, Settings, Globe, Github } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { useRouter } from "next/navigation"

export function MainSidebar() {
  const router = useRouter()

  const handleStoryClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const event = new CustomEvent('navigateToStories')
    window.dispatchEvent(event)
    router.push('/story')
  }

  return (
    <div className="h-full">
      <div className="border-b px-4 py-2 flex justify-between items-center">
        <h2 className="text-lg font-semibold">sillywriter</h2>
        <ModeToggle />
      </div>
      <div className="p-4 space-y-4">
        <Button variant="ghost" className="w-full justify-start gap-2" asChild>
          <Link href="/story" onClick={handleStoryClick}>
            <BookOpen size={20} />
            Story
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2" asChild>
          <Link href="/world-info">
            <Globe size={20} />
            World Info / Lorebook
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2" asChild>
          <Link href="/prompts">
            <MessageSquare size={20} />
            Prompts
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2" asChild>
          <Link href="/settings">
            <Settings size={20} />
            Settings
          </Link>
        </Button>
        
        <div className="border-t my-4" />
        
        <Button variant="ghost" className="w-full justify-start gap-2" asChild>
          <Link 
            href="https://github.com/statchamber/sillywriter" 
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={20} />
            Source Code
          </Link>
        </Button>
      </div>
    </div>
  )
} 