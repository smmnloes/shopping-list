import { ChangeEvent, useEffect, useRef, useState } from 'react'
import {
  deleteFile,
  deleteShare,
  getShareInfo,
  setShareExpiration,
  updateShareInfo,
  uploadFiles
} from '../api/shares.ts'
import { ShareInfo } from '../../../shared/types/files'
import { useNavigate, useParams } from 'react-router-dom'
import '../styles/shares.scss'
import ChoiceModal, { ChoiceModalHandler } from '../elements/choice-modal.tsx'

const EditShare = () => {
  const [ uploadInProgress, setUploadInProgress ] = useState<boolean>(false)
  const [ uploadProgress, setUploadProgress ] = useState<number>(0)
  const [ currentUploadAbortController, setCurrentUploadAbortController ] = useState<AbortController | undefined>()
  const [ shareInfo, setShareInfo ] = useState<ShareInfo>()
  const [ description, setDescription ] = useState('')
  const [ buttonHighlighted, setButtonHighlighted ] = useState(false)
  const [ expirationDate, setExpirationDate ] = useState<string | null>()
  const navigate = useNavigate()

  const defaultExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

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
    setExpirationDate(newShareInfo.expiration)
  }

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) {
      return
    }
    setUploadInProgress(true)
    const abortController = new AbortController()
    setCurrentUploadAbortController(abortController)
    await uploadFiles(shareId, files, abortController, setUploadProgress)
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
    navigate(-1)
  }

  const deleteModalRef = useRef<ChoiceModalHandler | null>(null)

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(shareInfo?.shareLink ?? '')
    setButtonHighlighted(true)
    setTimeout(() => setButtonHighlighted(false), 500)
  }

  const handleShareShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Neue Dateifreigabe`,
          text: 'Es wurden Dateien für dich freigegeben.',
          url: shareInfo?.shareLink,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      console.warn('Web Share API is not supported in this browser.')
    }
  }

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await setShareExpiration(shareId, e.target.value)
    refreshShareInfo()
  }

  const handleExpirationActiveChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

    await setShareExpiration(shareId, e.target.checked ? defaultExpiration.toISOString() : null)
    refreshShareInfo()
  }

  return (<>
      <div className="editShareContainer">
        <div className="descriptionInputAndLabel">
          <div className="descriptionLabel">Beschreibung:</div>
          <input type="text" value={ description }
                 onChange={ (e) => setDescription(e.target.value) } onBlur={ updateDescription }/></div>
        <div className="shareExpirationControl">
          <div><b>Ablaufdatum</b></div>
          <label htmlFor="expirationactivate">Aktivieren <input id="expirationactivate" type="checkbox"
                                                                checked={ !!expirationDate }
                                                                onChange={ handleExpirationActiveChange }/></label>
          <input disabled={ expirationDate === null } aria-label="Date and time" type="datetime-local"
                 onChange={ handleDateChange }
                 value={ convertToDateTimeLocalString(shareInfo?.expiration ? new Date(shareInfo.expiration) : new Date(defaultExpiration)) }/>
        </div>
        <div className="linkwrapper">
          <div>
            <div><b>Link zum Abruf:</b></div>
            <div className="shareLink"><a href={ shareInfo?.shareLink }>{ shareInfo?.shareLink }</a></div>
          </div>
          <div className="link-buttons">
            <button className={ `my-button clipboard-copy-button ${ buttonHighlighted ? 'highlighted' : '' }` }
                    onClick={ handleCopyClipboard }><img src="/copy.svg"
                                                         alt="copy"/>
            </button>
            <button className="my-button share-button" onClick={ handleShareShare }><img src="/share.svg" alt="share"/>
            </button>
          </div>
        </div>


        <div className="uploadedFiles">
          <div><b>Hochgeladene Dateien:</b></div>
          <div className="uploadFilesContainer">
            <div className="uploadButtonAndStatus">
              { !uploadInProgress &&
                <label className="custom-file-upload my-button">Hochladen<input type="file" multiple
                                                                                onChange={ handleChange }/></label> }
              <div className="uploadStatus">
                { uploadInProgress && (<>
                  <div className="spinner"></div>
                  <div className="uploadProgressPercent">{ uploadProgress }%</div>
                </>) }

              </div>

              { currentUploadAbortController && uploadInProgress &&
                <button className="my-button cancel-button" onClick={ () => {
                  currentUploadAbortController?.abort()
                  setUploadInProgress(false)
                } }>Abbrechen
                </button> }
            </div>
            { (shareInfo?.files.length ?? 0) === 0 &&
              <div className="noFilesUploadedMessage">Noch keine Dateien hochgeladen.</div> }
            { shareInfo?.files.map((file, index) => (
              <div key={ index } className="uploadedFileListElement">
                <div className="label">{ file.name }</div>
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

const convertToDateTimeLocalString = (date: Date) => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  return `${ year }-${ month }-${ day }T${ hours }:${ minutes }`
}


export default EditShare