import { ChangeEvent, useEffect, useState } from 'react'
import { getShareInfo, uploadFile } from '../api/file.ts'
import { ShareInfo } from '../../../shared/types/files'
import { useParams } from 'react-router-dom'


const EditShare = () => {
  const [ uploadProgress, setUploadProgress ] = useState<number | undefined>(undefined)
  const [ currentUploadAbortController, setCurrentUploadAbortController ] = useState<AbortController | undefined>()
  const [ shareInfo, setShareInfo ] = useState<ShareInfo>()

  const shareIdParam = useParams<{ shareId: string }>().shareId
  if (!shareIdParam) {
    throw new Error('ShareId is required')
  }


  useEffect(() => {
    refreshShareInfo()
  }, [])

  const refreshShareInfo = async () => setShareInfo(await getShareInfo(shareIdParam))

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (files) {
      for (const file of files) {
        const abortController = new AbortController()
        setCurrentUploadAbortController(abortController)
        await uploadFile(shareIdParam, file, (progress) => setUploadProgress(progress.progress), abortController)
      }
    }
    // @ts-ignore
    e.target.value = null
    refreshShareInfo()
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

      <h3>Files:</h3>
      <ul>
        { shareInfo?.files.map((file, index) => (<li key={ index }>{ file.name }</li>)) }
      </ul>
    </>
  )

}

export default EditShare