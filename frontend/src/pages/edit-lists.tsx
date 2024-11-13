import { ChangeEvent, useEffect, useState } from 'react'
import { configForCategory, ListItem, ShopCategory } from '../types/types.ts'
import {
  addStaplesToCategoryList,
  createNewItemForCategory,
  getItemsForCategory,
  getStaples,
  removeItemFromCategory
} from '../api/api.ts'
import { CheckedItem, getCheckedItemIdsFromLocal, setCheckedItemsToLocal } from '../api/local-storage.ts'
import useOnlineStatus from '../hooks/useOnlineStatus.ts'


const EditLists = () => {
  const [ selectedCategory, setSelectedCategory ] = useState<ShopCategory>(ShopCategory.GROCERY)

  const [ listItems, setListItems ] = useState<ListItem[]>([])
  const [ addedStaples, setAddedStaples ] = useState<ListItem[]>([])
  const [ checkedItems, setCheckedItems ] = useState<CheckedItem[]>([])

  const [ newItemName, setNewItemName ] = useState<string>('')

  const [ modalVisible, setModalVisible ] = useState<boolean>(false)

  const [ availableStaples, setAvailableStaples ] = useState<ListItem[]>([])
  const [ selectedStaples, setSelectedStaples ] = useState<ListItem[]>([])

  const isOnline = useOnlineStatus()

  useEffect(() => {
    (async () => {
      try {
        setCheckedItems(getCheckedItemIdsFromLocal())
        const {items} = await getItemsForCategory(selectedCategory)
        setAddedStaples(items.filter(item => item.isStaple))
        setListItems(items.filter(item => !item.isStaple))
      } catch (error) {
        console.error('Error fetching list items', error)
      }
    })()
  }, [ selectedCategory ])

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    if (!newItemName) {
      return
    }
    try {
      const newItem: ListItem = await createNewItemForCategory(newItemName, selectedCategory)
      setListItems([ ...listItems, newItem ])
      setNewItemName('')
      event.target.reset()
    } catch (error) {
      console.error('There was a problem adding a new item', error)
    }
  }

  const updateCheckedItems = (checkedItems: CheckedItem[]) => {
    setCheckedItems(checkedItems)
    setCheckedItemsToLocal(checkedItems)
  }

  const removeItems = async (toRemoveIds: number[]) => {
    try {
      await Promise.allSettled(toRemoveIds.map(id => removeItemFromCategory(id, selectedCategory)))
      setListItems(listItems.filter(item => !toRemoveIds.includes(item.id)))
      setAddedStaples(addedStaples.filter(staple => !toRemoveIds.includes(staple.id)))
      updateCheckedItems(checkedItems.filter(item => !toRemoveIds.includes(item.id)))
      console.log('Item removed')
    } catch (error) {
      console.error('There was a problem removing the item', error)
    }
  }

  const handleOpenModal = async () => {
    const staples = await getStaples(selectedCategory)
    setAvailableStaples(staples)
    setModalVisible(true)
  }

  const handleModalClose = () => {
    setModalVisible(false)
    setSelectedStaples([])
  }

  const handleStapleSelected = (item: ListItem) => {
    setSelectedStaples(selectedStaples.includes(item) ? selectedStaples.filter(staple => staple !== item) : ([ ...selectedStaples, item ]))
  }

  const handleModalAddButton = async () => {
    const staplesToAdd = selectedStaples.filter(staple => !addedStaples.some(addedStaple => addedStaple.id === staple.id))
    await addStaplesToCategoryList(staplesToAdd.map(staple => staple.id), selectedCategory)
    setAddedStaples([ ...addedStaples, ...staplesToAdd ])
    setSelectedStaples([])
    setModalVisible(false)
  }

  const handleCheckedItemsOnChange = (event: ChangeEvent<HTMLInputElement>, itemId: number) => {
    let newCheckedItems = [ ...checkedItems ]
    const checked = event.target.checked
    if (checked) {
      newCheckedItems.push({id: itemId, category: selectedCategory})
    } else {
      newCheckedItems = newCheckedItems.filter(item => item.id !== itemId)
    }
    updateCheckedItems(newCheckedItems)
  }

  const handleClearCheckedItems = async () => {
    await removeItems(checkedItems.filter(item => item.category === selectedCategory).map(item => item.id))
  }

  const EditableCheckableListItem = ({index, item}: { index: number, item: ListItem }) => {
    const isItemChecked = (itemId: number) => !!checkedItems.find(item => item.id === itemId)

    return <div key={ index } className="listElementContainer">
      <div className="listElement">
        <div className="listItemCheckBox"><input type="checkbox"
                                                 checked={ isItemChecked(item.id) }
                                                 onChange={ (event) => handleCheckedItemsOnChange(event, item.id) }/>
        </div>
        <div className={ 'label ' + (isItemChecked(item.id) ? 'strike-through' : '') }>{ item.name }</div>
        <div className={ `deleteButton ${ !isOnline ? 'disabled' : '' }` }><img src="/paper-bin.svg"
                                                                                onClick={ () => isOnline && removeItems([ item.id ]) }
                                                                                alt="delete item"/>
        </div>
      </div>
    </div>
  }

  return (
    <div>
      <h1>Liste Bearbeiten</h1>
      <div className="shopCategoryContainer">
        { Object.entries(configForCategory).map(([ category, config ], index) =>
          (<div className={ `shopCategoryIcon ${ selectedCategory === category ? 'selected' : '' }` } key={ index }><img
            alt={ category } onClick={ () => setSelectedCategory(category as ShopCategory) }
            src={ config.iconPath }/></div>)
        ) }
      </div>
      <div className="listAndInput">
        <div className="listTopControlsContainer">
          <button className="openModalBtn" onClick={ handleOpenModal } disabled={ !isOnline }><img src="/stapler.svg"
                                                                                                   alt="modal-open"/><span
            className="stapleAddSign"> + </span>
          </button>
          <button className="clearCheckedItems" onClick={ handleClearCheckedItems } disabled={ !isOnline }><img
            src="/clear-all.svg"
            alt="clear-checked-items"/>
          </button>
        </div>
        <div id="modal-overlay" className={ `modal-overlay ${ modalVisible ? 'visible' : '' }` } onClick={ (e) => {
          if ((e.target as any).id === 'modal-overlay') setModalVisible(false)
        } }>
          <div className="modal">
            <span className="close-btn" onClick={ handleModalClose }>&times;</span>
            <h2>Staples auswählen</h2>
            <div className="modalSelectBtnContainer">
              <button onClick={ () => setSelectedStaples(availableStaples) }>Alle</button>
              <button onClick={ () => setSelectedStaples([]) }>Keiner</button>
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
        <div className="listContainer">
          { addedStaples.length === 0 ? ('Noch keine Staples hinzugefügt.') :
            addedStaples.map((item, index) =>
              (<EditableCheckableListItem key={ index } index={ index } item={ item }/>)
            ) }
        </div>
        { listItems.length > 0 &&
          (<div className="listContainer">
            { listItems.map((item, index) =>
              (<EditableCheckableListItem key={ index } index={ index } item={ item }/>)
            ) }
          </div>)
        }
        <form className="addItemForm" onSubmit={ handleSubmit }>
          <input type="text" onChange={ e => setNewItemName(e.target.value) }/>
          <button className="addButton small" type="submit" disabled={ !isOnline }>Hinzufügen</button>
        </form>
      </div>
    </div>
  )
}

export default EditLists