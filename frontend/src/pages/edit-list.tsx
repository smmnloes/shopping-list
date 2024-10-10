import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { addItemToList, getListItems, removeItemFromList } from '../api/api.ts'


interface ListItem {
  id: string
  name: string
}


const EditList = () => {
  const [ listItems, setListItems ] = useState<ListItem[]>([])
  const [ newItemName, setNewItemName ] = useState<string>('')

  const {listId} = useParams<{ listId: string }>()
  if (!listId) {
    throw new Error('listId must be present')
  }

  useEffect(() => {
    (async () => {
      try {
        const items = await getListItems(listId).then(response => response.data)
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
      const newItem: ListItem = await addItemToList(listId, newItemName).then(response => response.data)
      setListItems([ ...listItems, newItem ])
      console.log('Item added')
      setNewItemName('')
      event.target.reset()
    } catch (error) {
      console.error('There was a problem adding a new icon', error)
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      await removeItemFromList(listId, itemId).then(response => response.data)
      setListItems(listItems.filter(item => item.id !== itemId))
      console.log('Item removed')
    } catch (error) {
      console.error('There was a problem removing the item', error)
    }
  }

  return (
    <div>
      <h1>Liste bearbeiten</h1>
      <div className="listAndInput">
        <div className="listContainer">
          { listItems.map(item => (
            <div className="listElementContainer">
              <div className="listElement">
                { item.name }
              </div>
              <button className="deleteButton" onClick={ () => removeItem(item.id) }><img src="/paper-bin.svg"/>
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