import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { configForCategory } from '../types/types.ts'
import useQueryParamState from '../hooks/use-query-param-state.ts'
import { SELECTED_CATEGORY } from '../constants/query-params.ts'
import SelectStapleModal from './select-staple-modal.tsx'
import {
  addStaplesToCategoryList,
  createNewItemForCategory,
  deleteItemsFromCategoryBulk,
  getItemsForCategory,
  getSuggestions as getSuggestionsApi
} from '../api/shopping.ts'
import type { ListItemFrontend, ShopCategory } from '../../../shared/types/shopping.ts'
import useLocalStorageState from '../hooks/use-local-storage-state.ts'
import { useOnlineStatus } from '../providers/online-status-provider.tsx'

export type CheckedItem = { id: number, category: ShopCategory }
export const CHECKED_ITEMS_KEY = 'checkedItems'


const EditLists = () => {
  const [ selectedCategory, setSelectedCategory ] = useQueryParamState<ShopCategory>(SELECTED_CATEGORY, 'GROCERY')

  const [ listItems, setListItems ] = useState<ListItemFrontend[]>([])
  const [ addedStaples, setAddedStaples ] = useState<ListItemFrontend[]>([])
  const [ checkedItems, setCheckedItems ] = useLocalStorageState<CheckedItem[]>(CHECKED_ITEMS_KEY, [])

  const [ newItemName, setNewItemName ] = useState<string>('')

  const [ suggestions, setSuggestions ] = useState<ListItemFrontend[]>([])

  const isOnline = useOnlineStatus()

  const suggestionTimeoutId = useRef<number | null>(null)

  useEffect(() => {
    if (selectedCategory) {
      (async () => {
        try {
          await refreshItems(selectedCategory)
        } catch (error) {
          console.error('Error fetching list items', error)
        }
      })()
    }
  }, [ selectedCategory ])


  const refreshItems = async (selectedCategory: ShopCategory) => {
    const { items } = await getItemsForCategory(selectedCategory)
    setAddedStaples(items.filter(item => item.isStaple))
    setListItems(items.filter(item => !item.isStaple))
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    if (!newItemName || !selectedCategory) {
      return
    }
    try {
      await createNewItemForCategory(newItemName, selectedCategory)
      await refreshItems(selectedCategory)
      setNewItemName('')
      event.target.reset()
    } catch (error) {
      console.error('There was a problem adding a new item', error)
    }
  }

  const removeItems = async (toRemoveIds: number[]) => {
    if (!selectedCategory) {
      return
    }
    try {
      await deleteItemsFromCategoryBulk(toRemoveIds, selectedCategory)
      await refreshItems(selectedCategory)
      setCheckedItems(checkedItems.filter(item => !toRemoveIds.includes(item.id)))
    } catch (error) {
      console.error('There was a problem removing the item', error)
    }
  }

  const handleCheckedItemsOnChange = (event: ChangeEvent<HTMLInputElement>, itemId: number) => {
    if (!selectedCategory) {
      return
    }
    let newCheckedItems = [ ...checkedItems ]
    const checked = event.target.checked
    if (checked) {
      newCheckedItems.push({ id: itemId, category: selectedCategory })
    } else {
      newCheckedItems = newCheckedItems.filter(item => item.id !== itemId)
    }
    setCheckedItems(newCheckedItems)
  }

  const handleClearCheckedItems = async () => {
    await removeItems(checkedItems.filter(item => item.category === selectedCategory).map(item => item.id))
  }

  useEffect(() => {
      (async () => {
        if (!selectedCategory) {
          return
        }
        if (newItemName) {
          if (suggestionTimeoutId.current !== null) {
            clearTimeout(suggestionTimeoutId.current)
          }
          suggestionTimeoutId.current = setTimeout(async () => {
            const suggestions = await getSuggestionsApi(selectedCategory, newItemName)
            const filteredSuggestions = suggestions.filter(suggestion => {
              return !(suggestion.isStaple && addedStaples.find(staple => staple.id === suggestion.id))
            })
            setSuggestions(filteredSuggestions)
          }, 500)
        } else {
          clearTimeout(suggestionTimeoutId.current)
          setSuggestions([])
        }
      })()
    }
    , [ newItemName ])

  const EditableCheckableListItem = ({ index, item }: { index: number, item: ListItemFrontend }) => {
    const isItemChecked = (itemId: number) => !!checkedItems.find(item => item.id === itemId)

    return (
      <div key={ index } className="listElement">
        <div className="listItemCheckBox"><input type="checkbox"
                                                 checked={ isItemChecked(item.id) }
                                                 onChange={ (event) => handleCheckedItemsOnChange(event, item.id) }/>
        </div>
        <div className={ 'label ' + (isItemChecked(item.id) ? 'strike-through' : '') }>{ item.name }</div>
        <div className={ `deleteButton ${ !isOnline ? 'disabled' : '' }` }><img src="/paper-bin.svg"
                                                                                onClick={ () => isOnline && removeItems([ item.id ]) }
                                                                                alt="delete item"/>
        </div>
      </div>
    )
  }

  async function addItemFromSuggestion(suggestion: ListItemFrontend) {
    if (!selectedCategory) {
      return
    }
    if (suggestion.isStaple) {
      await addStaplesToCategoryList([ suggestion.id ], selectedCategory)
    } else {
      await createNewItemForCategory(suggestion.name, selectedCategory)
    }
    setNewItemName('')
    await refreshItems(selectedCategory)
  }

  return (
    <div>
      <h1>Einkaufsliste</h1>
      <div className="shopCategoryContainer">
        { Object.entries(configForCategory).map(([ category, config ], index) =>
          (<div className={ `shopCategoryIcon ${ selectedCategory === category ? 'selected' : '' }` } key={ index }><img
            alt={ category } onClick={ () => {
            setSelectedCategory(category as ShopCategory)
            setNewItemName('')
          } }
            src={ config.iconPath }/></div>)
        ) }
      </div>
      <div className="listAndInput">
        <div className="listTopControlsContainer">
          <SelectStapleModal selectedCategory={ selectedCategory } addedStaples={ addedStaples }
                             onModalClose={ () => selectedCategory && refreshItems(selectedCategory) }/>
          <button className="clearCheckedItems my-button" onClick={ handleClearCheckedItems } disabled={ !isOnline }>
            <img
              src="/clear-all.svg"
              alt="clear-checked-items"/>
          </button>
        </div>
        <div className="listContainer">
          { addedStaples.length === 0 ? (<div className="noElementsMessage">Noch keine Staples hinzugefügt.</div>) :
            addedStaples.map((item, index) =>
              (<EditableCheckableListItem key={ index } index={ index } item={ item }/>)
            ) }
        </div>
        <hr/>
        { listItems.length > 0 &&
          (<div className="listContainer">
            { listItems.map((item, index) =>
              (<EditableCheckableListItem key={ index } index={ index } item={ item }/>)
            ) }
          </div>)
        }
        <form className="addItemForm lessMarginTop" onSubmit={ handleSubmit }>

          <div className="suggestionsContainer">
            { suggestions.map((suggestion, index) => (
              <div
                key={ index }
                className="suggestionElement"
                onClick={ () => {
                  addItemFromSuggestion(suggestion)
                } }
              >
                <span>{ suggestion.name }</span>
                { suggestion.isStaple && <img src="/stapler.svg" alt='staple'/> }
              </div>
            )) }
          </div>

          <div className="inputAndButton">
            <input type="text" onChange={ e => {
              setNewItemName(e.target.value)
            } } value={ newItemName }/>
            <button className="my-button addButton small" type="submit" disabled={ !isOnline }>Hinzufügen</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditLists