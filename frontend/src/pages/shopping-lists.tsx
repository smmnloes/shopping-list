import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createNewList, getAllShoppingLists, deleteList } from '../api/api.ts'

// TODO: share?
interface ShoppingList {
  id: number
  createdBy: string
  createdAt: string
}

const ShoppingLists = () => {
  const [ shoppingLists, setShoppingLists ] = useState<ShoppingList[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      try {
        const lists = await getAllShoppingLists().then(response => response.data)
        setShoppingLists(lists)
      } catch (error) {
        console.error('Error fetching shopping lists:', error)
      }
    })()
  }, [])

  const createList = async () => {
    try {
      const newList: ShoppingList = await createNewList().then(response => response.data)
      setShoppingLists([ ...shoppingLists, newList ])
      navigate(`/shopping-lists/${ newList.id }`)
      console.log('New shopping list created')
    } catch (error) {
      console.error('There was a problem creating the new list', error)
    }
  }

  const handleEdit = (id: number) => {
    navigate(`/shopping-lists/${ id }`)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteList(id)
      setShoppingLists(shoppingLists.filter(list => list.id !== id))
      console.log('List deleted')
    } catch (error) {
      console.error('Error deleting shopping list:', error)
    }
  }

  return (
    <div>
      <h1>Shopping Lists</h1>
      <ul>
        { shoppingLists.map(list => (
          <li key={ list.id }>
            von: { list.createdBy } erstellt: { new Date(list.createdAt).toLocaleString() }
            <button onClick={ () => handleEdit(list.id) }>Edit</button>
            <button onClick={ () => handleDelete(list.id) }>Delete</button>
          </li>
        )) }
      </ul>
      <button id="createList" onClick={ createList }>Create new list</button>
    </div>
  )
}

export default ShoppingLists