import { useEffect, useState } from 'react'
import { ShareOverview } from '../../../shared/types/files'
import { getShares, newShare } from '../api/shares.ts'
import { useNavigate } from 'react-router-dom'
import '../styles/shares.scss'

const Shares = () => {
  const [ shares, setShares ] = useState<ShareOverview[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      getShares()
        .then(response => setShares(response))
    })()
  }, [])

  const newShareHandler = async () => {
    const id = await newShare().then(response => response.id)
    navigate(`/files/${ id }`)
  }

  return (
    <div className="sharesContainer">
        <div className="newShareElement" onClick={ newShareHandler }>Neue Freigabe</div>
        { shares.map((share, index) => (
          <div key={ index }>
            <div className="sharesListElement" onClick={ () => navigate(`/shares/${ share.id }`) }>
              <div>
                <div className="shareTitle">{ share.description }</div>
                <div className="shareDetails">
                  <div><b>erstellt von: </b>{ share.createdBy }</div>
                  </div>
                </div>
              </div>
            </div>
        )) }
      </div>
  )

}

export default Shares