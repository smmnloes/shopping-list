import React, { useEffect, useState } from 'react'
import { deleteNote, getNote, saveNote, setNoteVisibility } from '../api/notes.ts'
import { useNavigate, useParams } from 'react-router-dom'
import type { NoteDetails } from '../../../shared/types/notes.ts'
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { LexicalErrorBoundaryProps } from '@lexical/react/LexicalErrorBoundary'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import PlaygroundEditorTheme from '../styles/PlaygroundEditorTheme.ts'

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

  useEffect(() => {
    (async () => {
      const { content, publiclyVisible, permissions } = await getNote(noteId)
      setNoteContent(content)
      setPubliclyVisible(publiclyVisible)
      setPermissions(permissions)
    })()
  }, [ noteId ])


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


// Editor configuration
  const initialConfig: InitialConfigType = {
    namespace: 'MyEditor',
    theme: PlaygroundEditorTheme,
    onError: (error) => console.error(error),
  }

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
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input"/>}
            placeholder={<div className="editor-placeholder">Enter some text...</div>}
            ErrorBoundary={{} as React.FC<LexicalErrorBoundaryProps>}
        />
        <ToolbarPlugin/>
        <HistoryPlugin/>
        <OnChangePlugin
            onChange={editorState => {
              // Access the editor state here
              console.log(editorState)
            }}/>
      </LexicalComposer>
    </div>
  )
}


