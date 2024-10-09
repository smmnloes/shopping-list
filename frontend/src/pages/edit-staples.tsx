import { useEffect, useState } from 'react'
import { createStaple, getStaples, deleteStaple as deleteStapleApi } from '../api/api.ts'


interface ListItem {
  id: string
  name: string
}


const EditStaples = () => {
  const [ staples, setStaples ] = useState<ListItem[]>([])
  const [ newStapleName, setNewStapleName ] = useState<string>('')


  useEffect(() => {
    (async () => {
      try {
        const staples = await getStaples().then(response => response.data)
        setStaples(staples)
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
      const newStaple: ListItem = await createStaple(newStapleName).then(response => response.data)
      setStaples([ ...staples, newStaple ])
      console.log('Item added')
      setNewStapleName('')
      event.target.reset()
    } catch (error) {
      console.error('There was a problem adding a new icon', error)
    }
  }

  const deleteStaple = async (stapleId: string) => {
    try {
      await deleteStapleApi(stapleId).then(response => response.data)
      setStaples(staples.filter(staple => staple.id !== stapleId))
      console.log('Staple deleted')
    } catch (error) {
      console.error('There was a problem deleting the staple', error)
    }
  }

  return (
    <div>
      <h1>Staples</h1>
      <div className="listContainer">
        { staples.map(staple => (
          <div className="listElementContainer">
            <div className="listElement">{ staple.name }</div>
            <button className="deleteButton" onClick={ () => deleteStaple(staple.id) }><img src="/paper-bin.svg"/>
            </button>
          </div>
        )) }
      </div>
      <form onSubmit={ handleSubmit }>
        <input type="text" onChange={ e => setNewStapleName(e.target.value) }/>
        <button  className="addButton small" type="submit">Hinzufügen</button>
      </form>
    </div>
  )
}

export default EditStaples