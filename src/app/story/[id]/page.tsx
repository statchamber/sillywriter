import { StoryEditor } from './story-editor'

// This generates the static paths at build time
export async function generateStaticParams() {
  return [
    { id: 'default' },
    // Add a catch-all route
    { id: '[...id]' }
  ]
}

// Make the page static
export const dynamic = 'force-static'

export default function StoryPage() {
  return <StoryEditor />
}