import { Note } from '../../data/entities/note'
import type { NoteOverview } from '../../../../shared/types/notes'

export const transformNoteToOverview = (note: Note): NoteOverview => {
  const UNKNOWN = '???'
  return {
    id: note.id,
    createdAt: note.createdAt.toISOString(),
    createdBy: note.createdBy?.name ?? UNKNOWN,
    lastUpdatedAt: note.lastUpdatedAt.toISOString(),
    lastUpdatedBy: note.lastUpdatedBy?.name ?? UNKNOWN,
    title: extractTitleFromContent(note.content),
    publiclyVisible: note.publiclyVisible
  }
}

export const extractTitleFromContent = (html: string): string => {
  // Use a regular expression to find the first HTML tag
  const match = html.match(/<(\w+)\b[^>]*>(.*?)<\/\1>/)

  const DEFAULT_TITLE = 'Ohne Titel'
  if (match && match[2]) {
    // Return the inner text of the first HTML tag without any inner tags
    const innerTagsRemoved = match[2].replace(/<[^>]+>/g, '')
    return innerTagsRemoved || DEFAULT_TITLE
  }

  // Return fallback string if no valid HTML tag is found
  return DEFAULT_TITLE
}