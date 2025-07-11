import { useState } from 'react'
import type { ShopCategory } from '../../../shared/types/shopping.ts'
import { useOnlineStatus } from '../providers/online-status-provider.tsx'
import '../styles/modal.scss'
import { deleteSavedItem, getAllSavedItems } from '../api/shopping.ts'
import { SavedListItem } from '../../../shared/types/shopping'

interface EditItemsModalProps {
  selectedCategory: ShopCategory,
  onModalClose?: Function
}

const CleanupItemsModal = ({ selectedCategory, onModalClose }: EditItemsModalProps) => {

  const [ savedItems, setSavedItems ] = useState<SavedListItem[]>([])
  const [ cleanupItemsModalVisible, setCleanupItemsModalVisible ] = useState(false)

  const isOnline = useOnlineStatus()

  const refresh = async () => {
    const savedItems = await getAllSavedItems(selectedCategory).then(result => result.items)
    setSavedItems(savedItems)
  }

  const removeItem = async (itemId: number): Promise<void> => {
    await deleteSavedItem(itemId)
    return refresh()
  }

  const handleOpenModal = async () => {
    setCleanupItemsModalVisible(true)
    return refresh()
  }

  const handleModalClose = () => {
    setCleanupItemsModalVisible(false)

    if (onModalClose) {
      onModalClose()
    }
  }

  return (
    <div>
      <button className="my-button openModalBtn" onClick={ () => handleOpenModal() }
              disabled={ !isOnline }><img
        src="/broom.svg"
        alt="modal-open"/>
      </button>
      <div id="modal-overlay" className={ `modal-overlay ${ cleanupItemsModalVisible ? 'visible' : '' }` }
           onClick={ (e) => {
             if ((e.target as any).id === 'modal-overlay') handleModalClose()
           } }>
        <div className="modal">
          <span className="close-btn" onClick={ handleModalClose }>&times;</span>
          <h2>Elemente Bearbeiten</h2>
          <div className="listContainer">
            { savedItems.length === 0 ? (<div className="noElementsMessage">Keine Elemente vorhanden</div>) :
              savedItems.map((item, index) =>
                (<div key={ index } className="shoppingListElement">
                  <div className={ 'label' }>{ item.name }</div>
                  <div className='added-counter'>{item.addedCounter}</div>
                  <div className={ `deleteButton ${ !isOnline ? 'disabled' : '' }` }><img src="/paper-bin.svg"
                                                                                          onClick={ () => isOnline && removeItem(item.id) }
                                                                                          alt="delete item"/>
                  </div>
                </div>)) }
          </div>
        </div>
      </div>
    </div>
  )
}

export default CleanupItemsModal