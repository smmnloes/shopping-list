import { useEffect, useState } from 'react'
import ReactQuill, { DeltaStatic } from 'react-quill-new'
import '../styles/quill/quill.snow.scss'
import { getNote, saveNote } from '../api/api.ts'
import { useParams } from 'react-router-dom'

export const EditNote = () => {
  const [ noteContent, setNoteContent ] = useState<string>('')

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

  const handleOnChange = (value: string, delta: DeltaStatic) => {
    compressImage(value, delta)
    setNoteContent(value)
  }

  const compressImage = (value: string, delta: DeltaStatic) => {
    const imageInsertOp = delta.ops.find(element => typeof element.insert === 'object' && typeof element.insert.image === 'string')
    if (imageInsertOp){
      console.log('Image insert!')
      const imageBase64 = (imageInsertOp.insert as {image: string}).image
      // todo: compress!
    }

  }

  const handleSaveNote = async () => {
    await saveNote(noteId, noteContent)
  }

  const modules = {
      toolbar: {
        container: [
          [ {'header': [ 1, 2, false ]} ],
          [ 'bold', 'italic', 'underline', 'strike', 'blockquote' ],
          [ {'color': []}, {'background': []} ],
          [ {'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'} ],
          [ 'link', 'image' ],
          [ 'clean' ],
        ],
      }
    },

    formats = [
      'header',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'color', 'background',
      'list', 'indent',
      'link', 'image'
    ]

  return (
    <div className="editor-wrapper">
      <div id="quill">
        <ReactQuill theme="snow" value={ noteContent } modules={ modules } formats={ formats }
                    onChange={ handleOnChange }/>
      </div>
      <button className="my-button note-save-button" onClick={ handleSaveNote }>Speichern</button>
    </div>
  )
}


