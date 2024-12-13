import { useEffect, useState } from 'react'
import { getNotes, newNote } from '../api/api.ts'
import { useNavigate } from 'react-router-dom'
import { NoteOverview } from '../types/types.ts'


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
        <div className="listElement newElement" onClick={ newNoteHandler }>Neue Notiz</div>
        { notes.map((note, index) => (
          <div key={ index } className="listElementContainer">
            <div className="listElement" onClick={ () => navigate(`/notes/${ note.id }`) }>
              <div className="noteContainer">
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