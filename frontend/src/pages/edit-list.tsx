import { useParams } from 'react-router-dom'
import { addItemToList, getListItems, removeItemFromList } from '../api/api.ts'
import EditableList from '../elements/editable-list.tsx'


const EditList = () => {
  const {listId} = useParams<{ listId: string }>()
  if (!listId) {
    throw new Error('listId must be present')
  }


  return (
    <EditableList title="Liste Bearbeiten" getItemsApiCall={ getListItems } addItemApiCall={ addItemToList }
                  removeItemApiCall={ removeItemFromList } listId={listId}/>
  )
}

export default EditList