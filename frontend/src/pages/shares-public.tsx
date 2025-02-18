import { useParams } from 'react-router-dom'
import '../styles/shares.scss'
import { useEffect, useState } from 'react'
import { downloadAllFiles, downloadFile, getShareInfoPublic } from '../api/shares.ts'
import { ShareInfoPublic } from '../../../shared/types/files'
import { AxiosError } from 'axios'

const SharesPublic = () => {
  const [ feedbackMessages, setFeedbackMessages ] = useState<string[]>([])
  const [ shareInfoPublic, setShareInfoPublic ] = useState<ShareInfoPublic>()
  const [ downloadAllInProgress, setDownloadAllInProgress ] = useState(false)

  const shareCode = useParams<{ shareCode: string }>().shareCode

  useEffect(() => {
    document.title = 'Dateifreigabe';
    (async () => {
      if (!shareCode) {
        setFeedbackMessages([ ...feedbackMessages, 'Kein Share Code angegeben. Bitte prüfe den Link.' ])
      } else {
        let info
        try {
          info = await getShareInfoPublic(shareCode)
        } catch (e) {
          if ((e as AxiosError).isAxiosError) {
            if ((e as AxiosError).status === 404) {
              setFeedbackMessages([ ...feedbackMessages, 'Der angegebene Code ist nicht gültig. Bitte prüfe den Link.' ])
            } else if ((e as AxiosError).status === 401) {
              setFeedbackMessages([ ...feedbackMessages, 'Kein Code im Link vorhanden. Bitte prüfe den Link.' ])
            }
          }
        }
        setShareInfoPublic(info)
      }
    })()
  }, [])


  const handleDownloadFile = async (filename: string) => {
    if (shareCode) {
      try {
        const response = await downloadFile(shareCode, filename)
        reactDownloadWorkaround(response, filename)
      } catch (error) {
        console.error('Error downloading the file', error)
      }

    }
  }

  const handleDownloadAllFiles = async () => {
    if (shareCode) {
      setDownloadAllInProgress(true)
      const response = await downloadAllFiles(shareCode)
      setDownloadAllInProgress(false)
      reactDownloadWorkaround(response, 'all.zip')
    }
  }

  const reactDownloadWorkaround = (data: any, downloadedFileName: string) => {
    const url = window.URL.createObjectURL(new Blob([ data ]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', downloadedFileName)
    document.body.appendChild(link)
    link.click()

    link.parentNode?.removeChild(link)
  }

  return (<>
      <div className="sharesPublicContainer">
        <div className="feedbackMessagesContainer">
          { feedbackMessages.map((message, index) => (<div key={ index }>{ message }</div>)) }
        </div>
        { shareInfoPublic &&
          <div className="shareContentsPublic">
            <div className="sharePublicDescription">
              <div className="publicContentDescriptionHeader">Freigabe von { shareInfoPublic.sharedByUserName }</div>
              Beschreibung: { shareInfoPublic.description }
            </div>
            <div className="download-all-container">
              { downloadAllInProgress ? (<div className="spinner"></div>) :
                <button className="my-button download-all-button" onClick={ handleDownloadAllFiles }>Alles downloaden
                </button> }

            </div>
            <div className="sharePublicFiles">
              { (shareInfoPublic?.files.length ?? 0) === 0 &&
                <div className="noFilesUploadedMessage">Noch keine Dateien hochgeladen.</div> }
              { shareInfoPublic.files.map((file, index) => <div key={ index } className="uploadedFileListElement">
                <div>{ file.name }</div>
                <div className="downloadbutton"><img src="/download.svg"
                                                     onClick={ () => handleDownloadFile(file.name) }
                                                     alt="download file"/>
                </div>
              </div>) }
            </div>
          </div>
        }
      </div>
    </>

  )

}

export default SharesPublic