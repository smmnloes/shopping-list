import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ListItem } from '../types/types.ts'
import { addItemToList, getListItems, removeItemFromList } from '../api/api.ts'


const EditList = () => {
  const {listId} = useParams<{ listId: string }>()
  if (!listId) {
    throw new Error('listId must be present')
  }
  const [ listItems, setListItems ] = useState<ListItem[]>([])
  const [ newItemName, setNewItemName ] = useState<string>('')

  useEffect(() => {
    (async () => {
      try {
        const items = await getListItems(listId)
        setListItems(items)
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
      setListItems([ ...listItems, newItem ])
      setNewItemName('')
      event.target.reset()
    } catch (error) {
      console.error('There was a problem adding a new item', error)
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      await removeItemFromList(itemId, listId)
      setListItems(listItems.filter(item => item.id !== itemId))
      console.log('Item removed')
    } catch (error) {
      console.error('There was a problem removing the item', error)
    }
  }

  return (
    <div>
      <h1>Liste Bearbeiten</h1>
      <div className="listAndInput">
        <div className="listContainer">
          { listItems.map((item, index) => (
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