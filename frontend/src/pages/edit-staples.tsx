import { useEffect, useState } from 'react'
import { ListItem } from '../types/types.ts'
import { createStaple, deleteStaple, getStaples } from '../api/api.ts'


const EditStaples = () => {
  const [ staples, setStaples ] = useState<ListItem[]>([])
  const [ newStapleName, setNewStapleName ] = useState<string>('')

  useEffect(() => {
    (async () => {
      try {
        const items = await getStaples()
        setStaples(items)
      } catch (error) {
        console.error('Error fetching staples', error)
      }
    })()
  }, [])

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    if (!newStapleName) {
      return
    }
    try {
      const newItem: ListItem = await createStaple(newStapleName)
      setStaples([ ...staples, newItem ])
      setNewStapleName('')
      event.target.reset()
    } catch (error) {
      console.error('There was a problem adding a new staple', error)
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      await deleteStaple(itemId)
      setStaples(staples.filter(item => item.id !== itemId))
      console.log('Item removed')
    } catch (error) {
      console.error('There was a problem removing the staple', error)
    }
  }

  return (
    <div>
      <h1>Staples</h1>
      <div className="listAndInput">
        <div className="listContainer">
          { staples.map((item, index) => (
            <div key={index} className="listElementContainer">
              <div className="listElement">
                { item.name }
              </div>
              <button className="deleteButton" onClick={ () => removeItem(item.id) }><img src="/paper-bin.svg" alt="delete item"/>
              </button>
            </div>
          )) }
        </div>
        <form className="addItemForm" onSubmit={ handleSubmit }>
          <input type="text" onChange={ e => setNewStapleName(e.target.value) }/>
          <button className="addButton small" type="submit">Hinzufügen</button>
        </form>
      </div>
    </div>
  )
}

export default EditStaples