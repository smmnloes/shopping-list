import { useEffect, useState } from 'react'
import { configForCategory, ListItem, ShopCategory } from '../types/types.ts'
import { createStaple, deleteStaple, getStaples } from '../api/api.ts'


const EditStaples = () => {
  const [ staples, setStaples ] = useState<ListItem[]>([])
  const [ newStapleName, setNewStapleName ] = useState<string>('')
  const [ selectedCategory, setSelectedCategory ] = useState<ShopCategory>(ShopCategory.GROCERY)

  useEffect(() => {
    (async () => {
      try {
        const items = await getStaples(selectedCategory)
        console.log('Staples fetched')
        setStaples(items)
      } catch (error) {
        console.error('Error fetching staples', error)
      }
    })()
  }, [selectedCategory])

  useEffect(() => {
    console.log('Selected category changed to:', selectedCategory)
  }, [ selectedCategory ])


  const handleSubmit = async (event: any) => {
    event.preventDefault()
    if (!newStapleName) {
      return
    }
    try {
      const newItem: ListItem = await createStaple(newStapleName, selectedCategory)
      setStaples([ ...staples, newItem ])
      setNewStapleName('')
      event.target.reset()
    } catch (error) {
      console.error('There was a problem adding a new staple', error)
    }
  }

  const removeStaple = async (stapleId: string) => {
    try {
      await deleteStaple(stapleId)
      setStaples(staples.filter(staple => staple.id !== stapleId))
      console.log('Item removed')
    } catch (error) {
      console.error('There was a problem removing the staple', error)
    }
  }

  return (
    <div>
      <h1>Staples</h1>
      <div className="shopCategoryContainer">
        { Object.entries(configForCategory).map(([ category, config ], index) =>
          (<div className={ `shopCategoryIcon ${ selectedCategory === category ? 'selected' : '' }`} key={index}><img
            alt={ category } onClick={ () => setSelectedCategory(category as ShopCategory) }
            src={ config.iconPath }/></div>)
        ) }
      </div>
      <div className="listAndInput">
        <div className="listContainer">
          { staples.map((item, index) => (
            <div key={ index } className="listElementContainer">
              <div className="listElement">
                { item.name }
              </div>
              <button className="deleteButton" onClick={ () => removeStaple(item.id) }><img src="/paper-bin.svg"
                                                                                          alt="delete item"/>
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