import { useEffect, useState } from 'react'
import { configForCategory } from '../types/types.ts'
import { createStaple, deleteStaple, getStaples } from '../api/shopping.ts'
import { SELECTED_CATEGORY } from '../constants/query-params.ts'
import useQueryParamState from '../hooks/use-query-param-state.ts'
import type { ListItemFrontend, ShopCategory } from '../../../shared/types/shopping.ts'
import { useOnlineStatus } from '../providers/online-status-provider.tsx'


const EditStaples = () => {
  const [ staples, setStaples ] = useState<ListItemFrontend[]>([])
  const [ newStapleName, setNewStapleName ] = useState<string>('')
  const [ selectedCategory, setSelectedCategory ] = useQueryParamState<ShopCategory>(SELECTED_CATEGORY, 'GROCERY')
  const isOnline = useOnlineStatus()


  useEffect(() => {
    (async () => {
      try {
        if (selectedCategory) {
          await refreshStaples(selectedCategory)
          setSelectedCategory(selectedCategory)
        }
      } catch (error) {
        console.error('Error fetching staples', error)
      }
    })()
  }, [ selectedCategory ])

  const refreshStaples = async (selectedCategory: ShopCategory) => {
    const staples = await getStaples(selectedCategory)
    setStaples(staples)
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    if (!newStapleName || !selectedCategory) {
      return
    }
    try {
      await createStaple(newStapleName, selectedCategory)
      await refreshStaples(selectedCategory)
      setNewStapleName('')
      event.target.reset()
    } catch (error) {
      console.error('There was a problem adding a new staple', error)
    }
  }

  const removeStaple = async (stapleId: number) => {
    if (!selectedCategory) {
      return
    }
    try {
      await deleteStaple(stapleId)
      await refreshStaples(selectedCategory)
    } catch (error) {
      console.error('There was a problem removing the staple', error)
    }
  }

  return (
    <div>
      <h1>Staples bearbeiten</h1>
      <div className="shopCategoryContainer">
        <div className={ `shopCategoryIcon` }><img
          alt={ selectedCategory }
          src={ selectedCategory ? configForCategory[selectedCategory].iconPath : '' }/></div>
      </div>
      <div className="listAndInput">
        <div className="listContainer">
          { staples.length === 0 ? (<div className="noElementsMessage">Noch keine Staples angelegt...</div>) :
            staples.map((item, index) => (
              <div key={ index } className="listElementContainer">
                <div className="shoppingListElement">
                  <div className="label ">{ item.name }</div>
                  <div className={ `deleteButton ${ !isOnline ? 'disabled' : '' }` }><img src="/paper-bin.svg"
                                                                                          onClick={ () => isOnline && removeStaple(item.id) }
                                                                                          alt="delete item"/>
                  </div>
                </div>

              </div>
            )) }
        </div>
        <form className="addItemForm" onSubmit={ handleSubmit }>
          <div className="inputAndButton">
            <input type="text" onChange={ e => setNewStapleName(e.target.value) }/>
            <button className="my-button addButton small" type="submit" disabled={ !isOnline }>Hinzufügen</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditStaples