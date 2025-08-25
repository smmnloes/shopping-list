import { useEffect, useState } from 'react'
import { BabyNameResult, VoteVerdict } from '../../../shared/types/babynames'
import '../styles/baby-names.scss'
import { getResults } from '../api/baby-names.ts'

const voteToImageUrl = {
  'YES': '/thumbs-up.svg',
  'NO': '/thumbs-down.svg',
  'MAYBE': '/shrugging.svg'
}

const BabyNamesMatches = () => {

  const [ results, setResults ] = useState<BabyNameResult[]>()


  useEffect(() => {
    (async () => {
      await getResultsFromApi()
    })()
  }, [])

  const getResultsFromApi = async () => {
    console.log('getting matches')
    getResults().then(response => setResults(response.results))
  }

  const getMatches = (results?: BabyNameResult[]): BabyNameResult[] => {
    if (!results) {
      return []
    }
    return results.filter(result => result.votes.length > 1 && result.votes[0].userName !== result.votes[1].userName)
  }

  const getUsers = (results?: BabyNameResult[]): string[] => {
    if (!results) {
      return []
    }
    return Array.from(new Set(results.flatMap(result => result.votes.map(vote => vote.userName))))
  }

  const getUserPositiveVotes = (user: string, results?: BabyNameResult[]): { name: string, verdict: VoteVerdict }[] => {
    if (!results) {
      return []
    }
    return results.reduce((acc: { name: string, verdict: VoteVerdict }[], current) => {
      const voteFromUser = current.votes.find(v => v.userName === user)
      if (voteFromUser && [ 'YES', 'MAYBE' ].includes(voteFromUser.vote)) {
        acc.push({ name: current.name, verdict: voteFromUser.vote })
      }
      return acc
    }, [])
  }

  return (
    <>
      <h2>🎉 Matches 🎉</h2>
      { getMatches(results).length === 0 ? (<div>Noch keine matches :/</div>) :
        (<div className="matches-container">
          { getMatches(results).map(match => (<div className="match-element">
            <div className="match-name">{ match.name }</div>
          </div>)) }
        </div>) }
      <h2>Positive Votes</h2>
      <div className="positive-votes-container">
        { getUsers(results).map(user => (
          <div className="user-column">
            <h3>{ user }</h3>
            { getUserPositiveVotes(user, results).map(voteFromUser => (
              <>
                <div>{ voteFromUser.name }</div>
                <div><img src={ voteToImageUrl[voteFromUser.verdict] } alt=""/>{ }</div>
              </>)) }
          </div>
        )) }
      </div>
    </>
  )

}

export default BabyNamesMatches