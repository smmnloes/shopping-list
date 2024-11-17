import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const useQueryParamState = <T, >(paramName: string, initialValue: T, deserializer?: (x: string) => T): [ T, (x: T) => void ] => {
  const [ param, setParamInternal ] = useState<T>(initialValue)
  const navigate = useNavigate()

  const getQueryParamValue = (queryParams: URLSearchParams) => {

    const param = queryParams.get(paramName)
    if (param) {
      return deserializer ? deserializer(param) : param as T
    }
  }


  // update query params => state
  useEffect(() => {
    console.log('Triggered by location')
    const queryParams = new URLSearchParams(location.search)
    const newQueryParam = getQueryParamValue(queryParams)
    console.log(`New param value ${ newQueryParam }, current state: ${ param }`)
    if (newQueryParam !== param && newQueryParam) {
      console.log('Setting param')
      setParamInternal(newQueryParam)
    }
  }, [ location.search ])

  const setParam = (newValue: T) => {
    console.log('Triggered by param change')
    const queryParams = new URLSearchParams(location.search)
    console.log('Setting query param')
    queryParams.set(paramName, String(newValue))
    navigate(`${ location.pathname }?${ queryParams.toString() }`, {replace: true})
    setParamInternal(newValue)
  }


  return [ param, setParam ]
}

export default useQueryParamState