import { Note } from '../../data/entities/note'
import { NoteOverview } from '../notes.api.controller'

export const transformNoteToOverview = (note: Note): NoteOverview => {
  return {
    id: note.id,
    createdAt: note.createdAt,
    createdBy: note.createdBy,
    lastUpdatedAt: note.lastUpdatedAt,
    title: extractTitleFromContent(note.content)
  }
}

export const extractTitleFromContent = (html: string): string => {
    // Use a regular expression to find the first HTML tag
    const match = html.match(/<(\w+)\b[^>]*>(.*?)<\/\1>/);

    if (match && match[2]) {
      // Return the inner text of the first HTML tag without any inner tags
      return match[2].replace(/<[^>]+>/g, '');
    }

  // Return fallback string if no valid HTML tag is found
  return 'Titel';
}