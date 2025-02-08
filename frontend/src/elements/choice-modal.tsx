import { useEffect, useState } from 'react'

const ChoiceModal = ({ initialVisibility, message, onConfirm }: {
  initialVisibility: boolean,
  message: React.JSX.Element,
  onConfirm: () => void
}) => {
  const [ modalVisible, setModalVisible ] = useState<boolean>(initialVisibility)

  useEffect(() => {
    setModalVisible(initialVisibility)
  }, [ initialVisibility ])

  console.log(initialVisibility)
  console.log(modalVisible)
  return <div id="modal-overlay" className={ `modal-overlay ${ modalVisible ? 'visible' : '' }` }
              onClick={ (e) => {
                if ((e.target as any).id === 'modal-overlay') setModalVisible(false)
              } }>
    <div className="choiceModal">
      <span>{ message }</span>
      <div className="choiceModalButtons">
        <button className="my-button" onClick={ onConfirm }>Ja</button>
        <button className="my-button" onClick={ () => setModalVisible(false) }>Nein</button>
      </div>

    </div>
  </div>

}

export default ChoiceModal