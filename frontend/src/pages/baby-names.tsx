import { useEffect, useState } from 'react'
import { BabyNameFrontendView, Gender, VoteVerdict } from '../../../shared/types/babynames'
import '../styles/baby-names.scss'
import { getRandomName, postVote } from '../api/baby-names.ts'
import { isAxiosError } from 'axios'

const BabyNames = () => {

  const [ currentName, setCurrentName ] = useState<BabyNameFrontendView | null>(null)
  const [ gender, setGender ] = useState<Gender>('GIRL')

  useEffect(() => {
    (async () => {
      await getNewName()
    })()
  }, [gender])

  const getNewName = async () => {
    getRandomName(gender).then(name => setCurrentName(name)).catch( e => {
      if (isAxiosError(e) && e.status === 404) {
        setCurrentName(null)
      }
    })
  }

  const handleVote = async (voteVerdict: VoteVerdict): Promise<void> => {
    if (!currentName) {
      return
    }
    await postVote(currentName.id, voteVerdict)
    await getNewName()
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
          { currentName?.name ?? 'Kein Name verfügbar' }
        </div>
        <div className="voting-buttons">
          <div><img onClick={ () => handleVote('YES') } src="/thumbs-up.svg" alt="vote_yes"/></div>
          <div><img onClick={ () => handleVote('MAYBE') } src="/shrugging.svg" alt="vote_maybe"/></div>
          <div><img onClick={ () => handleVote('NO') } src="/thumbs-down.svg" alt="vote_no"/></div>
        </div>
      </div>
    </>
  )

}

export default BabyNames