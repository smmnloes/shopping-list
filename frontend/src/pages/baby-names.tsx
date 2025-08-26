import { useEffect, useState } from 'react'
import { BabyNameFrontendView, Gender, VoteVerdict } from '../../../shared/types/babynames'
import '../styles/baby-names.scss'
import { getRandomName, postVote } from '../api/baby-names.ts'
import { isAxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'


export const voteToImageUrl = {
  'YES': '/thumbs-up.svg',
  'NO': '/thumbs-down.svg',
  'MAYBE': '/shrugging.svg'
}

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

    const matchResult = await postVote(currentName.id, voteVerdict)

    const animationDetails = matchResult.match ?
      {
        duration: 1200,
        className: 'animate-match'
      } :
      {
        duration: 600,
        className: 'animate-no-match'
      }


    const img = e.target as HTMLImageElement
    img.classList.add(animationDetails.className)
    setTimeout(() => {
      img.classList.remove(animationDetails.className)
      getNewName()
    }, animationDetails.duration)
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
        { currentName !== null ? (<>
          <div className="name-display">
            { currentName?.name ?? '' }
            <div className="next-name" onClick={ () => getNewName() }><img src="/refresh.svg" alt="refresh name"/></div>
          </div>
          <div className="voting-buttons">
            <div><img onClick={ (e) => handleVote('YES', e) } src={ voteToImageUrl['YES'] } alt="vote_yes"/></div>
            <div><img onClick={ (e) => handleVote('MAYBE', e) } src={ voteToImageUrl['MAYBE'] } alt="vote_maybe"/></div>
            <div><img onClick={ (e) => handleVote('NO', e) } src={ voteToImageUrl['NO'] } alt="vote_no"/></div>
          </div>
        </>) : 'Keine Namen mehr übrig :)' }
        <button className="my-button matches-button" onClick={ () => navigate('/baby-names/matches') }>Resultate
        </button>
      </div>
    </>
  )

}

export default BabyNames