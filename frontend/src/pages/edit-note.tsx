import { useEffect, useState } from 'react'
import ReactQuill, { DeltaStatic, EmitterSource } from 'react-quill-new'
import '../styles/quill/quill.snow.scss'
import { deleteNote, getNote, saveNote } from '../api/api.ts'
import { useNavigate, useParams } from 'react-router-dom'
import { postImageInsertProcessing } from '../utils/image-processing.ts'

enum SAVE_STATE {
  SAVED,
  UNSAVED,
  SAVING
}

const iconForSaveState = {
  [SAVE_STATE.SAVED]: '/checkmark-circle.svg',
  [SAVE_STATE.UNSAVED]: '/alert.svg',
  [SAVE_STATE.SAVING]: '---'
}

const classForSaveState = {
  [SAVE_STATE.SAVED]: 'saved',
  [SAVE_STATE.UNSAVED]: 'unsaved',
  [SAVE_STATE.SAVING]: 'saving'
}

export const EditNote = () => {
  const [ noteContent, setNoteContent ] = useState<string>('')

  const [ saveState, setSaveState ] = useState<SAVE_STATE>(SAVE_STATE.SAVED)
  const [ modalVisible, setModalVisible ] = useState<boolean>(false)

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
  }, [noteId])

  const handleOnChange = async (value: string, delta: DeltaStatic, source: EmitterSource) => {
    setNoteContent(await postImageInsertProcessing(value, delta))
    if (source === 'user') {
      setSaveState(SAVE_STATE.UNSAVED)
    }
  }


  const handleSaveNote = async () => {
    if(saveState !== SAVE_STATE.UNSAVED) {
      return
    }
    setSaveState(SAVE_STATE.SAVING)
    try {
      await saveNote(noteId, noteContent)
      setSaveState(SAVE_STATE.SAVED)
    } catch (e) {
      setSaveState(SAVE_STATE.UNSAVED)
    }
  }

  const handleDeleteNote = async () => {
    await deleteNote(noteId)
    navigate(-1)
  }

  const modules = {
      toolbar: {
        container: [
          [ {'header': [ 2, 3, false ]}, 'bold', 'italic', 'underline', 'strike' ],
          [ {'list': 'ordered'}, {'list': 'bullet'}, {'list': 'check'}, {'indent': '-1'}, {'indent': '+1'}, 'image' ],
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
          <button className={`my-button saveButton ${classForSaveState[saveState]}`} onClick={handleSaveNote}><img
              src="/save.svg"
              alt="speichern"/>
            {saveState === SAVE_STATE.SAVING ? (<div className="spinner"></div>) : (
                <img src={iconForSaveState[saveState]} alt="saveState"/>)}
          </button>

        </div>
        <button className="my-button deleteButton" onClick={ () => setModalVisible(true) }><img src="/paper-bin.svg"
                                                                                                alt="löschen"/></button>
        <div id="modal-overlay" className={ `modal-overlay ${ modalVisible ? 'visible' : '' }` } onClick={ (e) => {
          if ((e.target as any).id === 'modal-overlay') setModalVisible(false)
        } }>
          <div className="choiceModal">
            <span>Notiz wirklich löschen?</span>
            <div className="choiceModalButtons">
              <button className="my-button" onClick={ handleDeleteNote }>Ja</button>
              <button className="my-button" onClick={ () => setModalVisible(false) }>Nein</button>
            </div>

          </div>
        </div>
      </div>
      <div id="quill">
        <ReactQuill theme="snow" value={ noteContent } modules={ modules } formats={ formats }
                    onChange={ handleOnChange }/>
      </div>
    </div>
  )
}


