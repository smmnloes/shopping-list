import { addExistingItemsToList, getStaples } from '../api/shopping.ts'
import { useNavigate } from 'react-router-dom'
import useQueryParamState from '../hooks/use-query-param-state.ts'
import { MODAL_VISIBLE } from '../constants/query-params.ts'
import { booleanFromString } from '../utils/boolean.ts'
import { useEffect, useState } from 'react'
import type { ListItemFrontend, ShopCategory } from '../../../shared/types/shopping.ts'
import { useOnlineStatus } from '../providers/online-status-provider.tsx'

interface SelectStapleModalProps {
  selectedCategory?: ShopCategory,
  addedStaples: ListItemFrontend[],
  onModalClose?: Function
}

const SelectStapleModal = ({ selectedCategory, addedStaples, onModalClose }: SelectStapleModalProps) => {
  const navigate = useNavigate()

  const [ modalVisible, setModalVisible ] = useQueryParamState<boolean>(MODAL_VISIBLE, false, booleanFromString)

  const [ availableStaples, setAvailableStaples ] = useState<ListItemFrontend[]>([])
  const [ selectedStaples, setSelectedStaples ] = useState<ListItemFrontend[]>([])

  const isOnline = useOnlineStatus()

  useEffect(() => {
    if (selectedCategory) {
      (async () => {
        const staples = await getStaples(selectedCategory)
        setAvailableStaples(staples)
      })()
    }
  }, [ selectedCategory ])

  const handleEditStaples = () => {
    if (!selectedCategory) {
      return
    }
    const queryParams = new URLSearchParams({ 'selectedCategory': selectedCategory })
    navigate(`/staples?${ queryParams.toString() }`)
  }

  const handleModalClose = () => {
    setSelectedStaples([])
    setModalVisible(false)

    if (onModalClose) {
      onModalClose()
    }
  }

  const handleStapleSelected = (item: ListItemFrontend) => {
    setSelectedStaples(selectedStaples.includes(item) ? selectedStaples.filter(staple => staple !== item) : ([ ...selectedStaples, item ]))
  }

  const handleModalAddButton = async () => {
    if (!selectedCategory) {
      return
    }
    const staplesToAdd = selectedStaples.filter(staple => !addedStaples.some(addedStaple => addedStaple.id === staple.id))
    await addExistingItemsToList(staplesToAdd.map(staple => staple.id), selectedCategory)
    handleModalClose()
  }

  return (
    <div>
      <button className="my-button openModalBtn" onClick={ () => setModalVisible(true) } disabled={ !isOnline }><img
        src="/stapler.svg"
        alt="modal-open"/><span
        className="stapleAddSign"> + </span>
      </button>
      <div id="modal-overlay" className={ `modal-overlay ${ modalVisible ? 'visible' : '' }` } onClick={ (e) => {
        if ((e.target as any).id === 'modal-overlay') handleModalClose()
      } }>
        <div className="modal">
          <span className="close-btn" onClick={ handleModalClose }>&times;</span>
          <h2>Staples auswählen</h2>
          <div className="modalSelectBtnContainer">
            <button className="my-button" onClick={ () => {
              setSelectedStaples(selectedStaples.length > 0 ? [] : availableStaples)
            } }>Alle / Keine
            </button>
            <button className="my-button" onClick={ handleEditStaples }>Bearbeiten</button>
          </div>
          <div className="listContainer">
            { availableStaples.length === 0 ? (<div className="noElementsMessage">Keine Staples angelegt.</div>) :
              availableStaples.map((item, index) =>
                (<div key={ index } className="listElementContainer">
                    <div
                      onClick={ () => handleStapleSelected(item) }
                      className={ `shoppingListElement ${ selectedStaples.some(staple => staple.id === item.id) ? 'selectedStaple' : '' }` }>
                      { item.name }
                    </div>
                  </div>
                )) }
          </div>
          <button className="my-button modalAddBtn" onClick={ handleModalAddButton }>Hinzufügen</button>
        </div>
      </div>
    </div>
  )
}

export default SelectStapleModal