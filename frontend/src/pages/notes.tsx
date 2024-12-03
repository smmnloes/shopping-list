import { useEffect, useState } from 'react'
import { getNotes, newNote } from '../api/api.ts'
import { useNavigate } from 'react-router-dom'
import { NoteOverview } from '../types/types.ts'


const Notes = () => {
  const [ notes, setNotes ] = useState<NoteOverview[]>([])

  const navigate = useNavigate()

  useEffect(() => {
    (async () => getNotes().then(response => setNotes(response.notes)))()
  }, [])

  const newNoteHandler = async () => {
    const id = await newNote().then(response => response.id)
    navigate(`/notes/${ id }`)
  }

  return (
    <div>
        <h1>Notizen</h1>
      <div className="listContainer">
          { notes.length === 0 ? (<div className='noElementsMessage'>Noch keine Notizen angelegt...</div>) :
          notes.map((note, index) => (
            <div key={ index } className="listElementContainer">
              <div className="listElement" onClick={ () => navigate(`/notes/${ note.id }`) }>
                <div className="label">{ note.title }</div>
              </div>
            </div>
          )) }
      </div>
      <div className="notesListControls">
        <button className="my-button noteListNewButton" onClick={ newNoteHandler }>Neue Notiz</button>
      </div>
    </div>
  )

}

export default Notes