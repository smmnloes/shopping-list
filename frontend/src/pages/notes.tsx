import { useEffect, useState } from 'react'
import { getNotes, newNote } from '../api/notes.ts'
import { useNavigate } from 'react-router-dom'
import type { NoteOverview } from '../../../shared/types/notes.ts'


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

const sortNotesByCreatedDescending = (notes: NoteOverview[]) => [ ...notes.sort(
  (noteA, noteB) => new Date(noteB.createdAt).getTime() - new Date(noteA.createdAt).getTime()
) ]

const Notes = () => {
  const [ notes, setNotes ] = useState<NoteOverview[]>([])
  const [ sortCriteria, setSortCriteria ] = useState(0)
  const [ sortOrder, setSortOrder ] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    (async () => getNotes()
      .then(response => setNotes(sortNotesByCreatedDescending(response.notes))))()
  }, [])

  const newNoteHandler = async () => {
    const id = await newNote().then(response => response.id)
    navigate(`/notes/${ id }`)
  }

  return (
    <div>
      <h1>Notizen</h1>

      <div className="listContainer notes">
        <div className="notesListControls">
          <button className="my-button" onClick={ () => {
            setSortOrder((before) => (before + 1) % SORT_ORDER.length)
          } }><img src={ iconForSortOrder[SORT_ORDER[sortOrder]] } alt="Sorting order"/></button>

          <button className="my-button multi-img" onClick={ () => {
            setSortCriteria(before => (before + 1) % SORT_CRITERIA.length)
          } }>
            <img src={ iconForSortCriteria[SORT_CRITERIA[sortCriteria]] } alt="Sorting criteria"/>
          </button>
        </div>

        <div className="listElement newElement" onClick={ newNoteHandler }>Neue Notiz</div>
        { notes.map((note, index) => (
          <div key={ index } className="listElementContainer">
            <div className="listElement" onClick={ () => navigate(`/notes/${ note.id }`) }>
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