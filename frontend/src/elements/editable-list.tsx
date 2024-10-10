import { useEffect, useState } from 'react'

interface ListItem {
  id: string
  name: string
}

interface EditableListProps {
  title: string,
  listId?: string,
  getItemsApiCall: (...args: any) => Promise<ListItem[]>,
  addItemApiCall: (...args: any) => Promise<ListItem>,
  removeItemApiCall: (...args: any) => Promise<void>
}

const EditableList = (
  {
    title,
    listId,
    getItemsApiCall,
    addItemApiCall,
    removeItemApiCall,
  }: EditableListProps) => {
  const [ listItems, setListItems ] = useState<ListItem[]>([])
  const [ newItemName, setNewItemName ] = useState<string>('')

  useEffect(() => {
    (async () => {
      try {
        const items = await getItemsApiCall(listId)
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
      const newItem: ListItem = await addItemApiCall(newItemName, listId)
      setListItems([ ...listItems, newItem ])
      setNewItemName('')
      event.target.reset()
    } catch (error) {
      console.error('There was a problem adding a new icon', error)
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      await removeItemApiCall(itemId, listId)
      setListItems(listItems.filter(item => item.id !== itemId))
      console.log('Item removed')
    } catch (error) {
      console.error('There was a problem removing the item', error)
    }
  }

  return (
    <div>
      <h1>{ title }</h1>
      <div className="listAndInput">
        <div className="listContainer">
          { listItems.map((item, index) => (
            <div key={index} className="listElementContainer">
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

export default EditableList