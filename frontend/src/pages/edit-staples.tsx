import { createStaple, deleteStaple, getStaples } from '../api/api.ts'
import EditableList from '../elements/editable-list.tsx'


const EditStaples = () => {
  return (
    <EditableList title="Staples" getItemsApiCall={ getStaples } addItemApiCall={ createStaple }
                  removeItemApiCall={ deleteStaple } />
  )
}

export default EditStaples