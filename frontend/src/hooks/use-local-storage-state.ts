import { useEffect, useState } from 'react'
import { getStoredValueForKey, storeValueForKey } from '../utils/local-storage.ts'

const useLocalStorageState = <T, >(localStorageKey: string, initialValue: T): [ T, (x: T) => void ] => {
  const [ value, setValueInternal ] = useState<T>(initialValue)

  useEffect(() => {
    const storedValue = getStoredValueForKey<T>(localStorageKey)
    setValueInternal(storedValue ?? initialValue)
  }, [])


  /**
   * Set the parameter to a new value. Sets both the query param and the internal state
   * @param newValue
   */
  const setValue = (newValue: T) => {
    storeValueForKey(localStorageKey, newValue)
    setValueInternal(newValue)
  }


  return [ value, setValue ]
}

export default useLocalStorageState