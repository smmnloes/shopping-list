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
              setFeedbackMessages([...feedbackMessages, 'Der angegebene Code ist nicht gültig. Bitte prüfe den Link.'])
            }
          }
        }
        setShareInfoPublic(info)
      }
    })()
  }, [])


  return (<>
      <div className="sharesPublicContainer">
        Share for code { shareCode }
        <div className="feedbackMessagesContainer">
          { feedbackMessages.map(message => (<div>{ message }</div>)) }
        </div>
        {shareInfoPublic && <div className="shareContentsPublic">Description: {shareInfoPublic.description} shared by {shareInfoPublic.sharedByUserName}</div>}
      </div>
    </>

  )

}

export default SharesPublic