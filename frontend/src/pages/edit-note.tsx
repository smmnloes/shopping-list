import { useEffect, useState } from 'react'
import ReactQuill, { DeltaStatic } from 'react-quill-new'
import '../styles/quill/quill.snow.scss'
import { getNote, saveNote } from '../api/api.ts'
import { useParams } from 'react-router-dom'
import { Image } from 'image-js'


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

  const handleOnChange = async (value: string, delta: DeltaStatic) => {
    const imageInsertOp = delta.ops.find(element => typeof element.insert === 'object' && typeof element.insert.image === 'string')
    if (imageInsertOp) {
      value =  await resizeImage(value, (imageInsertOp.insert as { image: string }).image)
    }
    setNoteContent(value)
  }

  const resizeImage = async (value: string, uncompressedImageBase64: string) => {
      console.log('Image insert!')
      const image = await Image.load(uncompressedImageBase64)

      const IMAGE_DIM_THRESH = 500
      const biggestSideOverThresh: 'width' | 'height' | null = Math.max(image.width, image.height) < IMAGE_DIM_THRESH ? null : (image.width > image.height ? 'width' : 'height')

      if (!biggestSideOverThresh) {
        console.log(`Image is not over threshold ${IMAGE_DIM_THRESH}px`)
        return value
      }

      let resized
      if (biggestSideOverThresh === 'width') {
        resized = image.resize({preserveAspectRatio: true, width: IMAGE_DIM_THRESH})
      } else if (biggestSideOverThresh === 'height') {
        resized = image.resize({preserveAspectRatio: true, height: IMAGE_DIM_THRESH})
      }
      const resizedBase64 = resized?.toDataURL()
      return resizedBase64 ? value.replace(uncompressedImageBase64, resizedBase64) : (() => {
        console.error('Error while resizing, using original size')
        return value
      })()
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


