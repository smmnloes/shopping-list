import { useState } from 'react'
import ReactQuill from 'react-quill-new'
import '../styles/quill/quill.snow.scss'

const Notes = () => {
  const [ value, setValue ] = useState('asdölfkjasödlkfasöldfjk')


  const modules = {
      toolbar: [
        [ {'header': [ 1, 2, false ]} ],
        [ 'bold', 'italic', 'underline', 'strike', 'blockquote' ],
        [ {'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'} ],
        [ 'link', 'image' ],
        [ 'clean' ]
      ],
    },

    formats = [
      'header',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'image'
    ]

  return (
    <div id="quill">
      <ReactQuill theme="snow" value={ value } modules={ modules } formats={ formats } onChange={ setValue }/>
    </div>
  )
}

export default Notes