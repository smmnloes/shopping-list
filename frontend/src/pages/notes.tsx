import { useEffect, useState } from 'react'
import { getNotes, newNote } from '../api/notes.ts'
import { useNavigate } from 'react-router-dom'
import type { NoteOverview } from '../../../shared/types/notes.ts'
import { getStoredValueForKey, NOTES_ORDER, NOTES_ORDER_KEY, storeValueForKey } from '../local-storage/local-storage.ts'


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
  const [ selectedSortCriteria, setSelectedSortCriteria ] = useState(0)
  const [ selectedSortOrder, setSelectedSortOrder ] = useState(0)

  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      const localSortingInfo = getStoredValueForKey<NOTES_ORDER>(NOTES_ORDER_KEY)
      setSelectedSortOrder(localSortingInfo?.sortOrder ?? 0)
      setSelectedSortCriteria(localSortingInfo?.sortCriteria ?? 0)

      getNotes()
        .then(response => setNotes(response.notes))
    })()
  }, [])

  const newNoteHandler = async () => {
    const id = await newNote().then(response => response.id)
    navigate(`/notes/${ id }`)
  }

  const sortNotes = (notes: NoteOverview[]): NoteOverview[] => {
    const criteria = SORT_CRITERIA[selectedSortCriteria]
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

    const order = SORT_ORDER[selectedSortOrder]
    if (order === 'ASCENDING') {
      notes.reverse()
    }
    return notes
  }

  // TODO: Local storage backed state? like query param backed?
  const handleSortOrderChange = () => {
    const newValue = (selectedSortOrder + 1) % SORT_ORDER.length
    setSelectedSortOrder(newValue)
    storeValueForKey<NOTES_ORDER>(NOTES_ORDER_KEY, { sortCriteria: selectedSortCriteria, sortOrder: newValue })
  }

  const handleSortCriteriaChange = () => {
    const newValue = (selectedSortCriteria + 1) % SORT_CRITERIA.length
    setSelectedSortCriteria(newValue)
    storeValueForKey<NOTES_ORDER>(NOTES_ORDER_KEY, { sortCriteria: newValue, sortOrder: selectedSortOrder })
  }

  return (
    <div>
      <h1>Notizen</h1>

      <div className="listContainer notes">
        <div className="notesListControls">
          <button className="my-button" onClick={ handleSortOrderChange }><img
            src={ iconForSortOrder[SORT_ORDER[selectedSortOrder]] } alt="Sorting order"/></button>

          <button className="my-button" onClick={ handleSortCriteriaChange }>
            <img src={ iconForSortCriteria[SORT_CRITERIA[selectedSortCriteria]] } alt="Sorting criteria"/>
          </button>
        </div>

        <div className="listElement newElement" onClick={ newNoteHandler }>Neue Notiz</div>
        { sortNotes([ ...notes ]).map((note, index) => (
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