import { ChangeEvent, useEffect, useState } from 'react'
import { getUploadedFiles, uploadFiles } from '../api/file.ts'
import { SharedFileList } from '../../../shared/types/files'


const Files = () => {
  const [ uploadProgress, setUploadProgress ] = useState<number | undefined>(undefined)
  const [ currentUploadAbortController, setCurrentUploadAbortController ] = useState<AbortController | undefined>()
  const [ uploadedFiles, setUploadedFiles ] = useState<SharedFileList>([])


  useEffect(() => {
    refreshUploadedFiles()
  }, [])

  const refreshUploadedFiles = async () => setUploadedFiles(await getUploadedFiles())

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
    refreshUploadedFiles()
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

      <h3>uploaded:</h3>
      <ul>
        { uploadedFiles.map((file, index) => (<li key={ index }>{ file.name }</li>)) }
      </ul>
    </>
  )

}

export default Files