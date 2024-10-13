import { useEffect, useState } from 'react'
import { configForCategory, ListItem, ShopCategory } from '../types/types.ts'
import { addItemToCategory, getItemsForCategory, removeItemFromCategory, resetStaples } from '../api/api.ts'


const EditLists = () => {
  const [ selectedCategory, setSelectedCategory ] = useState<ShopCategory>(ShopCategory.GROCERY)
  // handle staples separately??
  const [ listItems, setListItems ] = useState<ListItem[]>([])
  const [ newItemName, setNewItemName ] = useState<string>('')

  useEffect(() => {
    (async () => {
      try {
        const {items} = await getItemsForCategory(selectedCategory)
        setListItems(items)
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
      console.log('Item removed')
    } catch (error) {
      console.error('There was a problem removing the item', error)
    }
  }

  const handleResetStaples = async () => {
    const staples = await resetStaples(selectedCategory)
    setListItems([ ...listItems.filter(item => !item.isStaple), ...staples ])
  }

  const isStaple = (item: ListItem) => item.isStaple

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
        <span>Staples:</span>
        <div className="listContainer">
          <div className="resetStaplesContainer">
            <button className="resetStaplesButton" onClick={ handleResetStaples }>Reset staples</button>
          </div>
          { listItems.map((item, index) => item.isStaple && (
            <div key={ index } className="listElementContainer">
              <div className="listElement">
                { item.name }
              </div>
              <button className="deleteButton" onClick={ () => removeItem(item.id) }><img src="/paper-bin.svg"
                                                                                          alt="delete item"/>
              </button>
            </div>
          )) }
        </div>
        { listItems.filter((item) => !isStaple(item)).length > 0 &&
          (<div className="listContainer">
            { listItems.map((item, index) => !item.isStaple && (
              <div key={ index } className="listElementContainer">
                <div className="listElement">
                  { item.name }
                </div>
                <button className="deleteButton" onClick={ () => removeItem(item.id) }><img src="/paper-bin.svg"
                                                                                            alt="delete item"/>
                </button>
              </div>
            )) }
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