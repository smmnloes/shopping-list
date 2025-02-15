import { useParams } from 'react-router-dom'
import '../styles/shares.scss'
import { useEffect, useState } from 'react'
import { getShareInfoPublic } from '../api/shares.ts'
import { ShareInfoPublic } from '../../../shared/types/files'
import { AxiosError } from 'axios'

const SharesPublic = () => {
  const [ feedbackMessages, setFeedbackMessages ] = useState<string[]>([])
  const [ shareInfoPublic, setShareInfoPublic ] = useState<ShareInfoPublic>()

  const shareCode = useParams<{ shareCode: string }>().shareCode

  useEffect(() => {
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
        console.log(info)
        setShareInfoPublic(info)
      }
    })()
  }, [])


  return (<>
      <div className="sharesPublicContainer">
        Share for code { shareCode }
        <div className="feedbackMessagesContainer">
          { feedbackMessages.map((message, index) => (<div key={ index }>{ message }</div>)) }
        </div>
        { shareInfoPublic && <div className="shareContentsPublic">Description: { shareInfoPublic.description } shared
          by { shareInfoPublic.sharedByUserName }
          <div>
            {shareInfoPublic.files.map((file, index) => <div key={index}>{file.name}</div>)}
          </div>
        </div> }
      </div>
    </>

  )

}

export default SharesPublic