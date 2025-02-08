import { forwardRef, Ref, useImperativeHandle, useState } from 'react'

export type ChoiceModalHandler = {
  showModal: () => void
  hideModal: () => void
}

const ChoiceModal = forwardRef(({ message, onConfirm, onCancel }: {
  message: React.JSX.Element,
  onConfirm: () => void,
  onCancel?: () => void
}, ref: Ref<ChoiceModalHandler>) => {

  const [modalVisible, setModalVisible] = useState<boolean>(false)

  useImperativeHandle(ref, () => ({
    showModal() {
      setModalVisible(true);
    },
    hideModal() {
      setModalVisible(false);
    }
  }));

  const handleCancel = () => {
    onCancel && onCancel()
    setModalVisible(false)
  }

  const handleConfirm = () => {
    onConfirm()
    setModalVisible(false)
  }

  return <div id="modal-overlay" className={ `modal-overlay ${ modalVisible ? 'visible' : '' }` }
              onClick={ (e) => {
                if ((e.target as any).id === 'modal-overlay') {
                  handleCancel()
                }
              } }>
    <div className="choiceModal">
      { message }
      <div className="choiceModalButtons">
        <button className="my-button" onClick={ handleConfirm }>Ja</button>
        <button className="my-button" onClick={ handleCancel }>Nein
        </button>
      </div>
    </div>
  </div>

})

export default ChoiceModal