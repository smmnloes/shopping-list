import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { addItemToList, getListItems, removeItemFromList } from '../api/api.ts'


interface ListItem {
  id: string
  name: string
}


const EditList = () => {
  const [ listItems, setListItems ] = useState<ListItem[]>([])
  const [newItemName, setNewItemName] = useState<string>('')

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
  }, [listId])

  const addItem = async () => {
    try {
      const newItem: ListItem = await addItemToList(listId, newItemName).then(response => response.data)
      setListItems([ ...listItems, newItem ])
      console.log('Item added')
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
    <div className="container">
      <h1>Items</h1>
      <ul>
        { listItems.map(item => (
          <li key={ item.id }>
            { item.name }
            <button onClick={ () => removeItem(item.id) }> - </button>
          </li>
        )) }
      </ul>
      <input type="text" onChange={e => setNewItemName(e.target.value)}/>
      <button onClick={ addItem }>Add</button>
    </div>
  )
}

export default EditList