import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { deleteFile, deleteShare, getShareInfo, updateShareInfo, uploadFiles } from '../api/shares.ts'
import { ShareInfo } from '../../../shared/types/files'
import { useNavigate, useParams } from 'react-router-dom'
import '../styles/shares.scss'
import ChoiceModal, { ChoiceModalHandler } from '../elements/choice-modal.tsx'

const EditShare = () => {
  const [ uploadInProgress, setUploadInProgress ] = useState<boolean>(false)
  const [ currentUploadAbortController, setCurrentUploadAbortController ] = useState<AbortController | undefined>()
  const [ shareInfo, setShareInfo ] = useState<ShareInfo>()
  const [ description, setDescription ] = useState('')
  const [ linkCopyButtonText, setLinkCopyButtonText ] = useState('Kopieren')
  const navigate = useNavigate()

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
    if (!files) {
      return
    }
    setUploadInProgress(true)
    const abortController = new AbortController()
    setCurrentUploadAbortController(abortController)
    await uploadFiles(shareId, files, abortController)
    setCurrentUploadAbortController(undefined)
    setUploadInProgress(false)
    // @ts-ignore
    e.target.value = null
    refreshShareInfo()
  }

  const updateDescription = async (e: React.FocusEvent<HTMLInputElement>) => updateShareInfo(shareId, { description: e.target.value })
  const handleFileDelete = async (filename: string) => {
    await deleteFile(shareId, filename)
    await refreshShareInfo()
  }

  const handleDeleteShare = async () => {
    await deleteShare(shareId)
    navigate('/shares')
  }

  const deleteModalRef = useRef<ChoiceModalHandler | null>(null)

  return (<>
      <div className="editShareContainer">
        <div className="descriptionInputAndLabel">
          <div className="descriptionLabel">Beschreibung:</div>
          <input type="text" value={ description }
                 onChange={ (e) => setDescription(e.target.value) } onBlur={ updateDescription }/></div>

        <div className="linkwrapper">
          <div>
            <b>Link:</b><br/>{ shareInfo?.shareLink }
          </div>
          <button className="my-button clipboard-copy-button"
                  onClick={ () => navigator.clipboard.writeText(shareInfo?.shareLink ?? '').then(() => setLinkCopyButtonText('Kopiert!')) }>{ linkCopyButtonText }
          </button>
        </div>
        <div className="uploadFilesContainer">
          <div className="uploadButtonAndStatus">
            { !uploadInProgress &&
              <label className="custom-file-upload my-button">Dateien hochladen<input type="file" multiple
                                                                                      onChange={ handleChange }/></label> }
            <div className="uploadStatus">  { uploadInProgress && (<div className="spinner"></div>) }</div>
            { currentUploadAbortController && uploadInProgress &&
              <button className="my-button cancel-button" onClick={ () => {
                currentUploadAbortController?.abort()
                setUploadInProgress(false)
              } }>Cancel
              </button> }
          </div>

          <div className="uploadedFiles">
            { shareInfo?.files.length ?? 0 > 0 ? <h4>Hochgeladene Dateien:</h4> :
              <h4>Noch keine Dateien hochgeladen</h4> }
            { shareInfo?.files.map((file, index) => (
              <div key={ index } className="uploadedFileListElement">
                <div>{ file.name }</div>
                <div className="deleteButton"><img src="/paper-bin.svg"
                                                   onClick={ () => handleFileDelete(file.name) }
                                                   alt="delete item"/>
                </div>
              </div>)) }
          </div>
        </div>
        <button className="my-button delete-share" onClick={ () => deleteModalRef.current?.showModal() }>Freigabe
          löschen
        </button>

        <ChoiceModal ref={ deleteModalRef }
                     message={ <span>Freigabe und alle enthaltenen Dateien wirklich löschen?</span> }
                     onConfirm={ handleDeleteShare }/>
      </div>
    </>

  )

}

export default EditShare