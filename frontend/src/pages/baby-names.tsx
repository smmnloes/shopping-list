import { useEffect, useState } from 'react'
import { BabyNameFrontendView, Gender, VoteVerdict } from '../../../shared/types/babynames'
import '../styles/baby-names.scss'
import { getRandomName, postVote } from '../api/baby-names.ts'
import { isAxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'

const BabyNames = () => {

  const [ currentName, setCurrentName ] = useState<BabyNameFrontendView | null>()
  const [ gender, setGender ] = useState<Gender>('GIRL')

  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      await getNewName()
    })()
  }, [ gender ])

  const getNewName = async () => {
    getRandomName(gender).then(name => setCurrentName(name)).catch(e => {
      if (isAxiosError(e) && e.status === 404) {
        setCurrentName(null)
      }
    })
  }

  const handleVote = async (voteVerdict: VoteVerdict, e: React.MouseEvent<HTMLImageElement>): Promise<void> => {
    if (!currentName) {
      return
    }
    await postVote(currentName.id, voteVerdict)

    const img = e.target as HTMLImageElement
    img.classList.add('animate')
    setTimeout(() => {
      img.classList.remove('animate')
      getNewName()
    }, 600)
  }

  return (

    <>
      <div className="baby-names-content">
        <div className={ `genderToggle` }>
          <img src="/female.svg" alt="female"/>
          <label className="switch">
            <input type="checkbox" checked={ gender === 'BOY' }
                   onChange={ () => {
                     if (gender === 'BOY') {
                       setGender('GIRL')
                     } else {
                       setGender('BOY')
                     }
                   } }/>
            <span className="slider round"></span>
          </label>
          <img src="/male.svg" alt="male"/>
        </div>
        <div className="name-display">
          { currentName?.name === null ? 'Kein Name verfügbar' : (currentName?.name || '') }
          <div className="next-name" onClick={ () => getNewName() }><img src="/refresh.svg" alt="refresh name"/></div>
        </div>
        <div className="voting-buttons">
          <div><img onClick={ (e) => handleVote('YES', e) } src="/thumbs-up.svg" alt="vote_yes"/></div>
          <div><img onClick={ (e) => handleVote('MAYBE', e) } src="/shrugging.svg" alt="vote_maybe"/></div>
          <div><img onClick={ (e) => handleVote('NO', e) } src="/thumbs-down.svg" alt="vote_no"/></div>
        </div>
        <button className="my-button matches-button" onClick={ () => navigate('/baby-names/matches') }>Matches
          anzeigen
        </button>
      </div>
    </>
  )

}

export default BabyNames