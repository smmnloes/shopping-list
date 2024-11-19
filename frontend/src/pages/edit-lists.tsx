import { ChangeEvent, useEffect, useState } from 'react'
import { configForCategory, ListItem, ShopCategory } from '../types/types.ts'
import { createNewItemForCategory, deleteItemsFromCategoryBulk, getItemsForCategory } from '../api/api.ts'
import { CheckedItem, getCheckedItemIdsFromLocal, setCheckedItemsToLocal } from '../api/local-storage.ts'
import useOnlineStatus from '../hooks/use-online-status.ts'
import useQueryParamState from '../hooks/use-query-param-state.ts'
import { SELECTED_CATEGORY } from '../constants/query-params.ts'
import SelectStapleModal from './select-staple-modal.tsx'


const EditLists = () => {
  const [ selectedCategory, setSelectedCategory ] = useQueryParamState<ShopCategory>(SELECTED_CATEGORY, ShopCategory.GROCERY)

  const [ listItems, setListItems ] = useState<ListItem[]>([])
  const [ addedStaples, setAddedStaples ] = useState<ListItem[]>([])
  const [ checkedItems, setCheckedItems ] = useState<CheckedItem[]>([])

  const [ newItemName, setNewItemName ] = useState<string>('')


  const isOnline = useOnlineStatus()

  useEffect(() => {
    selectedCategory &&
    (async () => {
      try {
        setCheckedItems(getCheckedItemIdsFromLocal())
        const {items} = await getItemsForCategory(selectedCategory)
        setAddedStaples(items.filter(item => item.isStaple))
        setListItems(items.filter(item => !item.isStaple))
      } catch (error) {
        console.error('Error fetching list items', error)
      }
    })()
  }, [ selectedCategory ])


  const handleSubmit = async (event: any) => {
    event.preventDefault()
    if (!newItemName || !selectedCategory) {
      return
    }
    try {
      const newItem: ListItem = await createNewItemForCategory(newItemName, selectedCategory)
      setListItems([ ...listItems, newItem ])
      setNewItemName('')
      event.target.reset()
    } catch (error) {
      console.error('There was a problem adding a new item', error)
    }
  }

  const updateCheckedItems = (checkedItems: CheckedItem[]) => {
    setCheckedItems(checkedItems)
    setCheckedItemsToLocal(checkedItems)
  }

  const removeItems = async (toRemoveIds: number[]) => {
    if (!selectedCategory) {
      return
    }
    try {
      await deleteItemsFromCategoryBulk(toRemoveIds, selectedCategory)
      setListItems(listItems.filter(item => !toRemoveIds.includes(item.id)))
      setAddedStaples(addedStaples.filter(staple => !toRemoveIds.includes(staple.id)))
      updateCheckedItems(checkedItems.filter(item => !toRemoveIds.includes(item.id)))
      console.log('Items removed')
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
      newCheckedItems.push({id: itemId, category: selectedCategory})
    } else {
      newCheckedItems = newCheckedItems.filter(item => item.id !== itemId)
    }
    updateCheckedItems(newCheckedItems)
  }

  const handleClearCheckedItems = async () => {
    await removeItems(checkedItems.filter(item => item.category === selectedCategory).map(item => item.id))
  }


  const EditableCheckableListItem = ({index, item}: { index: number, item: ListItem }) => {
    const isItemChecked = (itemId: number) => !!checkedItems.find(item => item.id === itemId)

    return <div key={ index } className="listElementContainer">
      <div className="listElement">
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
    </div>
  }

  return (
    <div>
      <h1>Liste Bearbeiten</h1>
      <div className="shopCategoryContainer">
        { Object.entries(configForCategory).map(([ category, config ], index) =>
          (<div className={ `shopCategoryIcon ${ selectedCategory === category ? 'selected' : '' }` } key={ index }><img
            alt={ category } onClick={ () => setSelectedCategory(category as ShopCategory) }
            src={ config.iconPath }/></div>)
        ) }
      </div>
      <div className="listAndInput">
        <div className="listTopControlsContainer">
          <SelectStapleModal selectedCategory={ selectedCategory } addedStaples={ addedStaples }
                             setAddedStaples={ setAddedStaples }/>
          <button className="clearCheckedItems my-button" onClick={ handleClearCheckedItems } disabled={ !isOnline }><img
            src="/clear-all.svg"
            alt="clear-checked-items"/>
          </button>
        </div>
        <div className="listContainer">
          { addedStaples.length === 0 ? ('Noch keine Staples hinzugefügt.') :
            addedStaples.map((item, index) =>
              (<EditableCheckableListItem key={ index } index={ index } item={ item }/>)
            ) }
        </div>
        { listItems.length > 0 &&
          (<div className="listContainer">
            { listItems.map((item, index) =>
              (<EditableCheckableListItem key={ index } index={ index } item={ item }/>)
            ) }
          </div>)
        }
        <form className="addItemForm" onSubmit={ handleSubmit }>
          <input type="text" onChange={ e => setNewItemName(e.target.value) }/>
          <button className="my-button addButton small" type="submit" disabled={ !isOnline }>Hinzufügen</button>
        </form>
      </div>
    </div>
  )
}

export default EditLists