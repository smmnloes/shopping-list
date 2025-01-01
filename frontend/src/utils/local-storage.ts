

export const getStoredValueForKey = <T> (key: string): T | null => {
  const values = localStorage.getItem(key)
  if (values === null) {
    console.log('No values found, returning null')
    return null
  }
  return JSON.parse(values) as T
}


export const storeValueForKey =
  <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value))
  }