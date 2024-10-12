import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createNewList, deleteList, getAllShoppingLists } from '../api/api.ts'
import { configForCategory, ShopCategory } from '../types/types.ts'

// TODO: share?
interface ShoppingList {
  id: number
  createdBy: string
  createdAt: string
}

const ShoppingLists = () => {
  const [ shoppingLists, setShoppingLists ] = useState<ShoppingList[]>([])
  const navigate = useNavigate()
  const [ selectedCategory, setSelectedCategory ] = useState<ShopCategory>(ShopCategory.GROCERY)

  useEffect(() => {
    (async () => {
      try {
        const lists = await getAllShoppingLists(selectedCategory)
        setShoppingLists(lists)
      } catch (error) {
        console.error('Error fetching shopping lists:', error)
      }
    })()
  }, [selectedCategory])

  const createList = async (category: ShopCategory) => {
    try {
      const newList: ShoppingList = await createNewList(category)
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

  const formatDate = (createdAt: string) => {
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
      <div className="shopCategoryContainer">
        { Object.entries(configForCategory).map(([ category, config ], index) =>
          (<div className={ `shopCategoryIcon ${ selectedCategory === category ? 'selected' : '' }` } key={ index }><img
            alt={ category } onClick={ () => setSelectedCategory(category as ShopCategory) }
            src={ config.iconPath }/></div>)
        ) }
      </div>
      <div className="listContainer">
        { shoppingLists.length > 0 ? shoppingLists.map(list => (
          <div className="listElementContainer">
            <div className="listElement" key={ list.id } role="link"
                 onClick={ () => handleEdit(list.id) }>
              <div
                className="listElementInfo">von { list.createdBy },<br/>{ formatDate(list.createdAt) }
              </div>
            </div>
            <button className="deleteButton" onClick={ () => handleDelete(list.id) }><img src="/paper-bin.svg"/>
            </button>
          </div>
        )) : (<p>Noch keine Liste erstellt.</p>) }
      </div>
      <button className="addButton" onClick={ () => createList(selectedCategory) }>Neue Liste</button>
    </div>
  )
}

export default ShoppingLists