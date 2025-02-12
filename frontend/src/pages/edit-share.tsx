import { ChangeEvent, useEffect, useState } from 'react'
import { deleteFile, getShareInfo, updateShareInfo, uploadFile } from '../api/file.ts'
import { ShareInfo } from '../../../shared/types/files'
import { useParams } from 'react-router-dom'
import '../styles/files.scss'

const EditShare = () => {
  const [ uploadProgress, setUploadProgress ] = useState<number | undefined>(undefined)
  const [ currentUploadAbortController, setCurrentUploadAbortController ] = useState<AbortController | undefined>()
  const [ shareInfo, setShareInfo ] = useState<ShareInfo>()
  const [ description, setDescription ] = useState('')

  const shareId = useParams<{ shareId: string }>().shareId
  if (!shareId) {
    throw new Error('ShareId is required')
  }


  useEffect(() => {
    refreshShareInfo()
  }, [])

  const refreshShareInfo = async () => {
    const newShareInfo = await getShareInfo(shareId)
    setShareInfo(newShareInfo)
    setDescription(newShareInfo.description)
  }

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (files) {
      for (const file of files) {
        const abortController = new AbortController()
        setCurrentUploadAbortController(abortController)
        await uploadFile(shareId, file, (progress) => setUploadProgress(progress.progress), abortController)
        setCurrentUploadAbortController(undefined)
      }
    }
    // @ts-ignore
    e.target.value = null
    refreshShareInfo()
  }

  const updateDescription = async (e: React.FocusEvent<HTMLInputElement>) => updateShareInfo(shareId, { description: e.target.value })
  const handleFileDelete = async (filename: string) => {
    await deleteFile(shareId, filename)
    await refreshShareInfo()
  }

  return (<>
      <div className="filesContainer">
        <label htmlFor="descriptionInput">Beschreibung:
          <input id="descriptionInput" type="text" value={ description }
                 onChange={ (e) => setDescription(e.target.value) } onBlur={ updateDescription }/></label>

        <p><b>Link:</b> { shareInfo?.shareLink }</p><a href="">Teilen</a>

        <input type="file" multiple onChange={ handleChange }/>
        <p>{ uploadProgress ? Math.floor(uploadProgress * 100) + ' %' : '' }</p>
        { currentUploadAbortController && <button onClick={ () => {
          currentUploadAbortController?.abort()
          setUploadProgress(undefined)
        } }>Cancel
        </button> }

        <h3>Files:</h3>
        { shareInfo?.files.length ?? 0 > 0 ?
          <ul>
            { shareInfo?.files.map((file, index) => (
              <li key={ index }>{ file.name }<span onClick={ () => handleFileDelete(file.name) }> X </span></li>)) }
          </ul> : <p>Noch keine Dateien hochgeladen</p>
        }
      </div>
    </>

  )

}

export default EditShare