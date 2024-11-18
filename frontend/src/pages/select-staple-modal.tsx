import { ListItem, ShopCategory } from '../types/types.ts'
import { addStaplesToCategoryList, getStaples } from '../api/api.ts'
import { useNavigate } from 'react-router-dom'
import useQueryParamState from '../hooks/use-query-param-state.tsx'
import { MODAL_VISIBLE } from '../constants/query-params.ts'
import { booleanFromString } from '../util/boolean.ts'
import { useEffect, useState } from 'react'
import useOnlineStatus from '../hooks/use-online-status.ts'

interface SelectStapleModalProps {
  selectedCategory?: ShopCategory
  addedStaples: ListItem[]
  setAddedStaples: React.Dispatch<React.SetStateAction<ListItem[]>>
}

const SelectStapleModal = ({selectedCategory, addedStaples, setAddedStaples}: SelectStapleModalProps) => {
  const navigate = useNavigate()

  const [ modalVisible, setModalVisible ] = useQueryParamState<boolean>(MODAL_VISIBLE, false, booleanFromString)

  const [ availableStaples, setAvailableStaples ] = useState<ListItem[]>([])
  const [ selectedStaples, setSelectedStaples ] = useState<ListItem[]>([])

  const isOnline = useOnlineStatus()

  useEffect(() => {
    selectedCategory &&
    (async () => {
      console.log(`Loading staples for ${ selectedCategory }`)
      const staples = await getStaples(selectedCategory)
      setAvailableStaples(staples)
    })()
  }, [ selectedCategory ])

  const handleEditStaples = () => {
    if (!selectedCategory) {
      return
    }
    const queryParams = new URLSearchParams({'selectedCategory': selectedCategory})
    navigate(`/staples?${ queryParams.toString() }`)
  }

  const handleModalClose = () => {
    setSelectedStaples([])
    setModalVisible(false)
  }

  const handleStapleSelected = (item: ListItem) => {
    setSelectedStaples(selectedStaples.includes(item) ? selectedStaples.filter(staple => staple !== item) : ([ ...selectedStaples, item ]))
  }

  const handleModalAddButton = async () => {
    if (!selectedCategory) {
      return
    }
    const staplesToAdd = selectedStaples.filter(staple => !addedStaples.some(addedStaple => addedStaple.id === staple.id))
    await addStaplesToCategoryList(staplesToAdd.map(staple => staple.id), selectedCategory)
    setAddedStaples([ ...addedStaples, ...staplesToAdd ])
    setSelectedStaples([])
    handleModalClose()
  }

  return (
    <div>
      <button className="openModalBtn" onClick={ () => setModalVisible(true) } disabled={ !isOnline }><img
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
            <button onClick={ () => setSelectedStaples(availableStaples) }>Alle</button>
            <button onClick={ () => setSelectedStaples([]) }>Keiner</button>
            <button onClick={ handleEditStaples }>Edit</button>
          </div>
          <div className="listContainer">
            { availableStaples.length === 0 ? ('Keine Staples angelegt.') :
              availableStaples.map((item, index) =>
                (<div key={ index } className="listElementContainer">
                    <div
                      onClick={ () => handleStapleSelected(item) }
                      className={ `listElement ${ selectedStaples.some(staple => staple.id === item.id) ? 'selectedStaple' : '' }` }>
                      { item.name }
                    </div>
                  </div>
                )) }
          </div>
          <button className="modalAddBtn" onClick={ handleModalAddButton }>Hinzufügen</button>
        </div>
      </div>
    </div>
  )
}

export default SelectStapleModal