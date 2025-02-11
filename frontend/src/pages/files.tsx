import { ChangeEvent, useState } from 'react'
import { uploadFiles } from '../api/file.ts'


const Files = () => {
  const [ uploadProgress, setUploadProgress ] = useState<number | undefined>(undefined)
  const [ currentUploadAbortController, setCurrentUploadAbortController ] = useState<AbortController | undefined>()

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (files) {
      for (const file of files) {
        const abortController = new AbortController()
        setCurrentUploadAbortController(abortController)
        await uploadFiles(file, (progress) => setUploadProgress(progress.progress), abortController)
      }
    }
    // @ts-ignore
    e.target.value = null
  }


  return (<>
      <div className="filesContainer">
        <input type="file" multiple onChange={ handleChange }/>
      </div>
      <p>{ uploadProgress ? Math.floor(uploadProgress * 100) + ' %' : '' }</p>
      <button onClick={ () => {
        currentUploadAbortController?.abort()
        setUploadProgress(undefined)
      } }>Cancel
      </button>
    </>
  )

}

export default Files