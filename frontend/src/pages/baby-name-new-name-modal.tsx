import { useRef, useState } from 'react'
import '../styles/modal.scss'
import { Gender } from '../../../shared/types/babynames'
import { addName } from '../api/baby-names.ts'

interface NewNameModalProps {
  selectedGender: Gender
  onModalClose?: Function
}

const BabyNameNewNameModal = ({ selectedGender }: NewNameModalProps) => {

  const [ newName, setNewName ] = useState<string>()
  const [ newNameModalVisible, setNewNameModalVisible ] = useState(false)

  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleOpenModal = async () => {
    setNewName('')
    setNewNameModalVisible(true)
  }

  const handleModalClose = () => {
    setNewNameModalVisible(false)
  }

  const handleAddName = async () => {
    if (newName && buttonRef.current) {
      await addName(newName, selectedGender)
      const buttonTextCurrent = buttonRef.current?.innerHTML
      buttonRef.current.innerHTML = 'Hinzugefügt!'
      setTimeout(() => {
        buttonRef.current!.innerHTML = buttonTextCurrent
        handleModalClose()
      }, 1000)
    }
  }

  return (
    <div>
      <button className="my-button" onClick={ handleOpenModal }>Neuer Name</button>
      <div id="modal-overlay" className={ `modal-overlay ${ newNameModalVisible ? 'visible' : '' }` }
           onClick={ (e) => {
             if ((e.target as any).id === 'modal-overlay') handleModalClose()
           } }>
        <div className="modal">
          <span className="close-btn" onClick={ handleModalClose }>&times;</span>
          <div className="new-baby-name-wrapper">
            <h2>Neuer Name</h2>
            <input type="text" onChange={ (e) => setNewName(e.target.value) } value={ newName }/>
            <button className="my-button" onClick={ handleAddName } ref={ buttonRef }>
              <div className="add-name-wrapper">Hinzufügen<img src="/thumbs-up.svg" alt=""/></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BabyNameNewNameModal