import { useEffect, useState } from 'react'
import { BabyNameMatch } from '../../../shared/types/babynames'
import '../styles/baby-names.scss'
import { getMatches } from '../api/baby-names.ts'

const voteToFriendly = {
  'YES': 'Ja',
  'NO': 'Nein',
  'MAYBE': 'Vielleicht'
}

const BabyNamesMatches = () => {

  const [ matches, setMatches ] = useState<BabyNameMatch[]>()


  useEffect(() => {
    (async () => {
      await getMatchesFromApi()
    })()
  }, [])

  const getMatchesFromApi = async () => {
    console.log('getting matches')
    getMatches().then(matches => setMatches(matches.matches))
  }

  return (
    <>
      { matches?.length === 0 ? (<div>Noch keine matches :/</div>) :
        (<div className="matches-container">
          { matches?.map(match => (<div className="match-element">
            <div className="match-name">{ match.name }</div>
            <div className="match-verdicts">{ match.votes.map(vote => (
              <div>{ `${ vote.userName }: ${ voteToFriendly[vote.vote] }` }</div>)) }</div>
          </div>)) }
        </div>) }
    </>
  )

}

export default BabyNamesMatches