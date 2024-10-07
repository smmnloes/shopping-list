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
    console.log('triggered')
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
      <h1>Einkaufslisten</h1>
      <div className="listContainer">
        { shoppingLists.map(list => (
          <div className="listElementContainer">
            <div className="listElement" key={ list.id } role="link"
                 onClick={ () => handleEdit(list.id) }>
              <div
                className="listElementInfo">von <b>{ list.createdBy }, { new Date(list.createdAt).toLocaleString() }</b>
              </div>
            </div>
            <button className="deleteButton" onClick={ () => handleDelete(list.id) }>&#x2716;</button>
          </div>
        )) }
      </div>
      <button id="createList" onClick={ createList }>Neu</button>
    </div>
  )
}

export default ShoppingLists