import { useEffect, useState } from 'react'

const ChoiceModal = ({ initialVisibility, message, onConfirm, onCancel }: {
  initialVisibility: boolean,
  message: React.JSX.Element,
  onConfirm: () => void,
  onCancel?: () => void
}) => {
  const [ modalVisible, setModalVisible ] = useState<boolean>(initialVisibility)

  useEffect(() => {
    setModalVisible(initialVisibility)
  }, [ initialVisibility ])

  return <div id="modal-overlay" className={ `modal-overlay ${ modalVisible ? 'visible' : '' }` }
              onClick={ (e) => {
                if ((e.target as any).id === 'modal-overlay') setModalVisible(false)
              } }>
    <div className="choiceModal">
      { message }
      <div className="choiceModalButtons">
        <button className="my-button" onClick={ onConfirm }>Ja</button>
        <button className="my-button" onClick={ () => {
          onCancel && onCancel()
          setModalVisible(false)
        } }>Nein
        </button>
      </div>
    </div>
  </div>

}

export default ChoiceModal