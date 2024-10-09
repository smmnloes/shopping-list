import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createNewList, deleteList, getAllShoppingLists } from '../api/api.ts'

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

  const formatDate=(createdAt: string) => {
    const date = new Date(createdAt)
    return date.toLocaleDateString('de', {
      month: '2-digit',
      day: '2-digit',
    }) + ' um ' + date.toLocaleTimeString('de', {
      hour: '2-digit',
      minute: '2-digit'
    })


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
                className="listElementInfo">von { list.createdBy },<br/>{ formatDate(list.createdAt) }
              </div>
            </div>
            <button className="deleteButton" onClick={ () => handleDelete(list.id) }><img src="/paper-bin.svg"/></button>
          </div>
        )) }
      </div>
      <button className="addButton" onClick={ createList }>Neue Liste</button>
    </div>
  )
}

export default ShoppingLists