import '../styles/insults.scss'

const nrOfAnimations = 3
const getRandomAnimation = () => Math.floor(Math.random() * nrOfAnimations + 1)


const InsultView = () => {

  const params = new URLSearchParams(location.search)

  return (<>
      <div className="insult-view-wrapper">
        <div className={`insult-view text-animation-${getRandomAnimation()}`}>{ params.get('insult') }</div>
      </div>
    </>
  )

}

export default InsultView