import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createNewList, getAllShoppingLists } from '../api/api.ts'

// TODO: share?
interface ShoppingList {
  id: number
  createdBy: string
  createdAt: string
}

const ShoppingLists = () => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([])
  const navigate = useNavigate()

  const fetchShoppingLists = async () => {
    try {
      const lists = await getAllShoppingLists().then(response => response.data)
      setShoppingLists(lists)
    } catch (error) {
      console.error('Error fetching shopping lists:', error)
    }
  }

  useEffect(() => {
    fetchShoppingLists()
  }, [])

  const createList = async () => {
    try {
      const newList: ShoppingList= await createNewList().then(response => response.data)
      setShoppingLists([...shoppingLists, newList])
      console.log('New shopping list created')
    } catch (error) {
      console.error('There was a problem creating the new list', error)
    }
  }

  const editList = (id: number) => {
    navigate(`/shopping-lists/${id}`)
  }

  return (
    <div className="container">
      <h1>Shopping Lists</h1>
      <ul>
        {shoppingLists.map(list => (
          <li key={list.id}>
            von: {list.createdBy} erstellt: {new Date(list.createdAt).toLocaleString()}
            <button onClick={() => editList(list.id)}>Edit</button>
          </li>
        ))}
      </ul>
      <button id="createList" onClick={createList}>Create new list</button>
    </div>
  )
}

export default ShoppingLists