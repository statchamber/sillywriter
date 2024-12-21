import { StoryEditor } from './story-editor'

export function generateStaticParams() {
  return [{ id: 'default' }]
}

export default function StoryPage() {
  return <StoryEditor />
}