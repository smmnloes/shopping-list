import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const useQueryParamState = <T, >(paramName: string, initialValue: T, deserializer?: (x: string) => T): [ T | undefined, (x: T) => void ] => {
  const [ param, setParamInternal ] = useState<T | undefined>(undefined)
  const navigate = useNavigate()

  const getAllQueryParams = () => new URLSearchParams(location.search)

  const getQueryParamValue = () => {
    const queryParams = getAllQueryParams()
    const param = queryParams.get(paramName)
    if (param) {
      return deserializer ? deserializer(param) : param as T
    }
  }

  /**
   * On first load, set the param  to the initial value if undefined.
   */
  useEffect(() => {
    const newQueryParam = getQueryParamValue()
    // Only set the initial value if the query string param is also unset
    if (!newQueryParam) {
      setParam(initialValue)
    }
  }, [])

  /**
   * Update the internal state on a change of the query params
   */
  useEffect(() => {
    const newQueryParam = getQueryParamValue()
    if (newQueryParam !== param) {
      setParamInternal(newQueryParam)
    }
  }, [ location.search ])


  /**
   * Set the parameter to a new value. Sets both the query param and the internal state
   * @param newValue
   */
  const setParam = (newValue: T) => {
    const queryParams = getAllQueryParams()
    queryParams.set(paramName, String(newValue))
    navigate(`${ location.pathname }?${ queryParams.toString() }`, {replace: true})
    setParamInternal(newValue)
  }


  return [ param, setParam ]
}

export default useQueryParamState