import { useEffect, useMemo, useState } from 'react'
import ReactQuill, { DeltaStatic, EmitterSource, Quill } from 'react-quill-new'
import '../styles/quill/quill.snow.scss'
import { deleteNote, getNote, saveNote, setNoteVisibility } from '../api/notes.ts'
import { useNavigate, useParams } from 'react-router-dom'
import { postImageInsertProcessing } from '../utils/image-processing.ts'
import type { NoteDetails } from '../../../shared/types/notes.ts'

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
  const [ publiclyVisible, setPubliclyVisible ] = useState<boolean | undefined>()
  const [ permissions, setPermissions ] = useState<NoteDetails['permissions']>()

  const navigate = useNavigate()

  const noteIdParam = useParams<{ id: string }>().id
  if (!noteIdParam) {
    throw new Error('Id is required')
  }

  const noteId = parseInt(noteIdParam)
  let reactQuillRef: ReactQuill | null = null

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const icons: any = Quill.import('ui/icons')
      icons.undo = `<svg viewbox="0 0 18 18">
        <polygon class="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10"></polygon>
        <path class="ql-stroke" d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"></path>
      </svg>`
      icons.redo = `<svg viewbox="0 0 18 18">
        <polygon class="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10"></polygon>
        <path class="ql-stroke" d="M9.91,13.91A4.6,4.6,0,0,1,9,14A5,5,0,1,1,14,9"></path>
      </svg>`
    }
  }, [])

  useEffect(() => {
    (async () => {
      const { content, publiclyVisible, permissions } = await getNote(noteId)
      setNoteContent(content)
      setPubliclyVisible(publiclyVisible)
      setPermissions(permissions)
    })()
  }, [ noteId ])

  const handleOnChange = async (value: string, delta: DeltaStatic, source: EmitterSource) => {
    setNoteContent(await postImageInsertProcessing(value, delta))
    if (source === 'user') {
      setSaveState(SAVE_STATE.UNSAVED)
    }
  }


  const handleSaveNote = async () => {
    if (saveState !== SAVE_STATE.UNSAVED) {
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

  const handleVisibilityChanged = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPubliclyVisible = !e.target.checked
    await setNoteVisibility(noteId, newPubliclyVisible)
    setPubliclyVisible(newPubliclyVisible)
  }


  const { modules, formats } = useMemo(() => ({
    modules: {
      history: {
        delay: 1000,
        maxStack: 100,
        userOnly: false
      },
      toolbar: {
        container: [
          [ { 'header': [ 2, 3, false ] }, 'bold', 'italic', 'underline', 'strike' ],
          [ { 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }, { 'indent': '-1' }, { 'indent': '+1' }, 'image', 'undo', 'redo' ],
        ],
        handlers: {
          undo: () => {
            return reactQuillRef?.getEditor()?.history.undo()
          },
          redo: () => {
            return reactQuillRef?.getEditor()?.history.redo()
          }
        }
      }
    }, formats: [
      'header',
      'bold', 'italic', 'underline', 'strike',
      'list', 'indent',
      'image'
    ]
  }), [])


  return (
    <div className="editor-wrapper">
      <div className="editorControls">
        <div className="saveControls">
          <button className={ `my-button saveButton ${ classForSaveState[saveState] }` } onClick={ handleSaveNote }><img
            src="/save.svg"
            alt="speichern"/>
            { saveState === SAVE_STATE.SAVING ? (<div className="spinner"></div>) : (
              <img src={ iconForSaveState[saveState] } alt="saveState"/>) }
          </button>
        </div>

        { publiclyVisible !== undefined && (
          <div className={ `visibilityToggle ${ permissions?.changeVisibility ? '' : 'disabled' }` }>
            <img src="/padlock-unlocked.svg" alt="publicly visible"/>
            <label className="switch">
              <input type="checkbox" checked={ !publiclyVisible } onChange={ handleVisibilityChanged }/>
              <span className="slider round"></span>
            </label>
            <img src="/padlock-locked.svg" alt="private note"/>
          </div>) }
        <button className="my-button deleteButton" onClick={ () => setModalVisible(true) }
                disabled={ !permissions?.delete }><img src="/paper-bin.svg"
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
                    onChange={ handleOnChange } ref={ (el) => {
          if (el) {
            reactQuillRef = el
          }
        } }/>
      </div>
    </div>
  )
}


