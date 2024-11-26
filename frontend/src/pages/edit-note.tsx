import { useEffect, useState } from 'react'
import ReactQuill, { DeltaStatic } from 'react-quill-new'
import '../styles/quill/quill.snow.scss'
import { deleteNote, getNote, saveNote } from '../api/api.ts'
import { useNavigate, useParams } from 'react-router-dom'
import { postImageInsertProcessing } from '../utils/image-processing.ts'

enum SAVE_STATE {
  SAVED = 'gespeichert',
  UNSAVED = 'nicht gespeichert',
  SAVING= 'speichert...'
}

export const EditNote = () => {
  const [ noteContent, setNoteContent ] = useState<string>('')

  const [saveState, setSaveState] = useState<SAVE_STATE>(SAVE_STATE.SAVED)

  const navigate = useNavigate()

  const noteIdParam = useParams<{ id: string }>().id
  if (!noteIdParam) {
    throw new Error('Id is required')
  }

  const noteId = parseInt(noteIdParam)

  useEffect(() => {
    (async () => {
      const {content} = await getNote(noteId)
      setNoteContent(content)
    })()
  }, [])

  const handleOnChange = async (value: string, delta: DeltaStatic) => {
    setNoteContent(await postImageInsertProcessing(value, delta))
    setSaveState(SAVE_STATE.UNSAVED)
  }


  const handleSaveNote = async () => {
    setSaveState(SAVE_STATE.SAVING)
    await saveNote(noteId, noteContent)
    setSaveState(SAVE_STATE.SAVED)
  }

  const handleDeleteNote = async () => {
    await deleteNote(noteId)
    navigate('/notes')
  }

  const modules = {
      toolbar: {
        container: [
          [
            {'header': [ 1, 2, false ]},
            'bold', 'italic', 'underline', 'strike',
            {'list': 'ordered'}, {'list': 'bullet'}, {'list': 'check'},
            {'indent': '-1'}, {'indent': '+1'},
            'image' ],
        ],
      }
    },

    formats = [
      'header',
      'bold', 'italic', 'underline', 'strike',
      'list', 'indent',
      'image'
    ]

  return (
    <div className="editor-wrapper">
      <div className="editorControls">
        <div className="saveControls">
          <button className="my-button" onClick={ handleSaveNote }>Speichern</button>
          <span className="saveState">{saveState}</span>
        </div>
        <button className="my-button" onClick={handleDeleteNote}>Löschen</button>
      </div>
      <div id="quill">
        <ReactQuill theme="snow" value={ noteContent } modules={ modules } formats={ formats }
                    onChange={ handleOnChange }/>
      </div>
    </div>
  )
}


