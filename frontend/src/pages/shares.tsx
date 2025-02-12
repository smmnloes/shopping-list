import { useEffect, useState } from 'react'
import { ShareOverview } from '../../../shared/types/files'
import { getShares, newShare } from '../api/file.ts'
import { useNavigate } from 'react-router-dom'


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
        <div className="newNoteElement" onClick={ newShareHandler }>Neue Freigabe</div>
        { shares.map((share, index) => (
          <div key={ index } className="listElementContainer">
            <div className="notesListElement" onClick={ () => navigate(`/files/${ share.id }`) }>
              <div className="noteContainer">
                <div className="noteTitle">{ share.description }</div>
                <div className="noteDetails">
                  <div><b>erstellt von:</b>{ share.createdBy }</div>
                  </div>
                </div>
              </div>
            </div>
        )) }
      </div>
  )

}

export default Shares