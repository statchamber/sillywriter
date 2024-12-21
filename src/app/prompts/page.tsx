  import { Metadata } from "next"
  import { PromptsList } from "@/components/prompts/prompts-list"

  export const metadata: Metadata = {
    title: "Prompts",
    description: "Manage your AI prompts",
  }

  export default function PromptsPage() {
    return (
      <div className="container p-8 max-w-5xl">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Prompts</h1>
          <p className="text-muted-foreground">
            Manage your AI prompts for different writing tasks
          </p>
        </div>
        <PromptsList />
      </div>
    )
  } 