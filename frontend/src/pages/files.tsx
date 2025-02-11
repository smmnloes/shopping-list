import { ChangeEvent } from 'react'
import { uploadFiles } from '../api/file.ts'


const Files = () => {

  const handleChange =async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      for (const file of files) {
        await uploadFiles(file)
      }
    }
  }

  return (<>
      <div className="filesContainer">
      <input type="file" multiple onChange={handleChange}/>
      </div>
    </>
  )

}

export default Files