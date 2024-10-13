import { useEffect, useState } from 'react'
import { configForCategory, ListItem, ShopCategory } from '../types/types.ts'
import {
  addItemToCategory,
  addStaplesToCategoryList,
  getItemsForCategory,
  getStaples,
  removeItemFromCategory
} from '../api/api.ts'


const EditLists = () => {
  const [ selectedCategory, setSelectedCategory ] = useState<ShopCategory>(ShopCategory.GROCERY)

  const [ listItems, setListItems ] = useState<ListItem[]>([])
  const [ addedStaples, setAddedStaples ] = useState<ListItem[]>([])

  const [ newItemName, setNewItemName ] = useState<string>('')

  const [ modalVisible, setModalVisible ] = useState<boolean>(false)

  const [ availableStaples, setAvailableStaples ] = useState<ListItem[]>([])
  const [ selectedStaples, setSelectedStaples ] = useState<ListItem[]>([])


  useEffect(() => {
    (async () => {
      try {
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
      const newItem: ListItem = await addItemToCategory(newItemName, selectedCategory)
      setListItems([ ...listItems, newItem ])
      setNewItemName('')
      event.target.reset()
    } catch (error) {
      console.error('There was a problem adding a new item', error)
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      await removeItemFromCategory(itemId, selectedCategory)
      setListItems(listItems.filter(item => item.id !== itemId))
      setAddedStaples(addedStaples.filter(staple => staple.id !== itemId))
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
        <div className="resetStaplesContainer">
          <button className="openModalBtn" onClick={ handleOpenModal }><img src="/stapler.svg"/><span
            className="stapleAddSign"> + </span></button>
        </div>
        <div id="modal-overlay" className={ `modal-overlay ${ modalVisible ? 'visible' : '' }` } onClick={ (e) => {
          if ((e.target as any).id === 'modal-overlay') setModalVisible(false)
        } }>
          <div className="modal">
            <span className="close-btn" onClick={ handleModalClose }>&times;</span>
            <h2>Staples auswählen</h2>
            <div className="modalList">
              { availableStaples.length === 0 ? ('Keine Staples angelegt :/') :
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
          { addedStaples.length === 0 ? ('Noch Keine Staples hinzugefügt...') :
            addedStaples.map((item, index) =>
              (<div key={ index } className="listElementContainer">
                  <div className="listElement">
                    { item.name }
                  </div>
                  <button className="deleteButton" onClick={ () => removeItem(item.id) }><img src="/paper-bin.svg"
                                                                                              alt="delete item"/>
                  </button>
                </div>
              )) }
        </div>
        { listItems.length > 0 &&
          (<div className="listContainer">
            { listItems.map((item, index) =>
              <div key={ index } className="listElementContainer">
                <div className="listElement">
                  { item.name }
                </div>
                <button className="deleteButton" onClick={ () => removeItem(item.id) }><img src="/paper-bin.svg"
                                                                                            alt="delete item"/>
                </button>
              </div>
            ) }
          </div>) }
        <form className="addItemForm" onSubmit={ handleSubmit }>
          <input type="text" onChange={ e => setNewItemName(e.target.value) }/>
          <button className="addButton small" type="submit">Hinzufügen</button>
        </form>
      </div>
    </div>
  )
}

export default EditLists