import { useEffect, useState } from 'react'
import { getNotes, newNote } from '../api/notes.ts'
import { useNavigate } from 'react-router-dom'
import type { NoteOverview } from '../../../shared/types/notes.ts'
import useLocalStorageState from '../hooks/use-local-storage-state.ts'
import '../styles/notes.scss'

export type NOTES_ORDER = { sortCriteria: number, sortOrder: number }
export const NOTES_ORDER_KEY = 'notesOrder'

const SORT_CRITERIA = [ 'CREATION_TIME', 'EDIT_TIME', 'ALPHABETICAL' ] as const
type SORT_CRITERIA = (typeof SORT_CRITERIA)[number]

const SORT_ORDER = [ 'DESCENDING', 'ASCENDING' ] as const
type SORT_ORDER = (typeof SORT_ORDER)[number]

const iconForSortCriteria: { [sortCriteria in SORT_CRITERIA]: string } = {
  EDIT_TIME: '/edit-document.svg',
  CREATION_TIME: '/add-document.svg',
  ALPHABETICAL: '/sort-alphabet.svg'
}

const iconForSortOrder: { [sortOrder in SORT_ORDER]: string } = {
  ASCENDING: '/sort-up.svg',
  DESCENDING: '/sort-down.svg',

}

const formatDate = (date: Date): string => {
  return `${ date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  }) }`
}

const Notes = () => {
  const [ notes, setNotes ] = useState<NoteOverview[]>([])

  const [notesOrder, setNotesOrder] = useLocalStorageState<NOTES_ORDER>(NOTES_ORDER_KEY, {sortCriteria: 0, sortOrder: 0})

  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      getNotes()
        .then(response => setNotes(response.notes))
    })()
  }, [])

  const newNoteHandler = async () => {
    const id = await newNote().then(response => response.id)
    navigate(`/notes/${ id }`)
  }

  const sortNotes = (notes: NoteOverview[]): NoteOverview[] => {
    const criteria = SORT_CRITERIA[notesOrder.sortCriteria]
    switch (criteria) {
      case 'CREATION_TIME':
        notes.sort((noteA, noteB) => new Date(noteB.createdAt).getTime() - new Date(noteA.createdAt).getTime())
        break
      case 'EDIT_TIME':
        notes.sort((noteA, noteB) => new Date(noteB.lastUpdatedAt).getTime() - new Date(noteA.lastUpdatedAt).getTime())
        break
      case 'ALPHABETICAL':
        notes.sort((noteA, noteB) => ('' + noteB.title).localeCompare(noteA.title))
        break
    }

    const order = SORT_ORDER[notesOrder.sortOrder]
    if (order === 'ASCENDING') {
      notes.reverse()
    }
    return notes
  }

  const handleSortOrderChange = () => {
    const newValue = (notesOrder.sortOrder + 1) % SORT_ORDER.length
    setNotesOrder({...notesOrder, sortOrder: newValue})
  }

  const handleSortCriteriaChange = () => {
    const newValue = (notesOrder.sortCriteria + 1) % SORT_CRITERIA.length
    setNotesOrder({...notesOrder, sortCriteria: newValue})
  }

  return (
    <div className="notesContainer">

      <div className="listContainer notes">
        <div className="notesListControls">
          <button className="my-button" onClick={ handleSortOrderChange }><img
            src={ iconForSortOrder[SORT_ORDER[notesOrder.sortOrder]] } alt="Sorting order"/></button>

          <button className="my-button" onClick={ handleSortCriteriaChange }>
            <img src={ iconForSortCriteria[SORT_CRITERIA[notesOrder.sortCriteria]] } alt="Sorting criteria"/>
          </button>
        </div>

        <div className="newNoteElement" onClick={ newNoteHandler }>Neue Notiz</div>
        { sortNotes([ ...notes ]).map((note, index) => (
          <div key={ index }>
            <div className="notesListElement" onClick={ () => navigate(`/notes/${ note.id }`) }>
              <div className="noteContainer">
                <img className="visibilityIcon" hidden={ note.publiclyVisible } src="/padlock-locked.svg"
                     alt="Note is private"/>
                <div className="noteTitle">{ note.title }</div>
                <div className="noteDetails">
                  <div><b>erstellt:</b> { formatDate(new Date(note.createdAt)) } ({ note.createdBy })</div>
                  <div><b>zuletzt geändert:</b> { formatDate(new Date(note.lastUpdatedAt)) } ({ note.lastUpdatedBy })
                  </div>
                </div>
              </div>
            </div>
          </div>
        )) }
      </div>
    </div>
  )

}

export default Notes