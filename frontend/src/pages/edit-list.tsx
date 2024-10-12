import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { configForCategory, ListItem, ListWithItems } from '../types/types.ts'
import { addItemToList, getListWithItems, removeItemFromList } from '../api/api.ts'


const EditList = () => {
  const {listId} = useParams<{ listId: string }>()
  if (!listId) {
    throw new Error('listId must be present')
  }
  const [ listWithItems, setListWithItems ] = useState<ListWithItems | undefined>(undefined)
  const [ newItemName, setNewItemName ] = useState<string>('')

  useEffect(() => {
    (async () => {
      try {
        const items = await getListWithItems(listId)
        setListWithItems(items)
      } catch (error) {
        console.error('Error fetching list items', error)
      }
    })()
  }, [ listId ])

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    if (!newItemName) {
      return
    }
    try {
      const newItem: ListItem = await addItemToList(newItemName, listId)
      listWithItems?.items.push(newItem)
      setListWithItems(listWithItems)
      setNewItemName('')
      event.target.reset()
    } catch (error) {
      console.error('There was a problem adding a new item', error)
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      await removeItemFromList(itemId, listId)
      listWithItems!.items = listWithItems!.items.filter(item => item.id !== itemId)
      setListWithItems(listWithItems)
      console.log('Item removed')
    } catch (error) {
      console.error('There was a problem removing the item', error)
    }
  }
  const config = listWithItems ? configForCategory[listWithItems?.category] : undefined
  return (
    <div>
      <h1>Liste Bearbeiten</h1>
      <div className="shopCategoryContainer">

        <div className="shopCategoryIcon">
          <img alt={ listWithItems?.category || '?' } src={ config?.iconPath }/>
        </div>

      </div>
      <div className="listAndInput">
        <div className="listContainer">
          { listWithItems?.items.map((item, index) => (
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
        <form className="addItemForm" onSubmit={ handleSubmit }>
          <input type="text" onChange={ e => setNewItemName(e.target.value) }/>
          <button className="addButton small" type="submit">Hinzufügen</button>
        </form>
      </div>
    </div>
  )
}

export default EditList