import { addWeeks, endOfWeek, getWeek, getYear, startOfWeek, WeekOptions } from 'date-fns'
import { memo, useEffect, useState } from 'react'
import { getMealsForWeek, saveMealsForWeek } from '../api/api.ts'
import objectHash from 'object-hash'
import useOnlineStatus from '../hooks/use-online-status.ts'

const COMMON_WEEK_OPTIONS: WeekOptions = {weekStartsOn: 1}

const getDateRangeForWeek = (week: number): [ Date, Date ] => {
  const firstDayOfYear = new Date(getYear(new Date(), {}), 0, 1)
  const firstMonday = startOfWeek(firstDayOfYear, COMMON_WEEK_OPTIONS)
  const mondayOfGivenWeek = addWeeks(firstMonday, week - 1)
  const sundayOfGivenWeek = endOfWeek(mondayOfGivenWeek, COMMON_WEEK_OPTIONS)
  return [ mondayOfGivenWeek, sundayOfGivenWeek ]
}

const getCurrentWeek = () => getWeek(new Date(), COMMON_WEEK_OPTIONS)
const getCurrentWeekMonday = () => getDateRangeForWeek(getCurrentWeek())[0]

const MealPlan = memo(() => {
  const [ selectedMonday, setSelectedMonday ] = useState<Date>(getCurrentWeekMonday())

  const mealsForWeekDefault = Array(7).fill('')
  const [ mealsForWeek, setMealsForWeek ] = useState<(string)[]>(mealsForWeekDefault)

  const mealDoneChecksDefault = Array(7).fill(false)
  const [ mealDoneChecks, setMealDoneChecks ] = useState<boolean[]>(mealDoneChecksDefault)

  const [ remoteDataFetched, setRemoteDataFetched ] = useState<boolean>(false)
  const [ lastSavedState, setLastSavedState ] = useState<string>()

  const isOnline = useOnlineStatus()

  const generateSavedState = () => objectHash({mealsForWeek, mealDoneChecks})

  useEffect(() => {
    (async () => {
      try {
        const {meals, checks} = await getMealsForWeek(getWeek(selectedMonday), getYear(selectedMonday))
        setMealsForWeek(meals)
        setMealDoneChecks(checks)

        setRemoteDataFetched(true)
        setLastSavedState(generateSavedState())
        console.log('Meal plan fetched')
      } catch (error) {
        console.log('Could not fetch meal plan')
        setMealsForWeek(mealsForWeekDefault)
        setMealDoneChecks(mealDoneChecksDefault)
      }
    })()
  }, [ selectedMonday ])

  useEffect(() => {
    (async () => {
      await handleSave()
    })()
  }, [ mealDoneChecks ])


  const getDateRangeForWeekFormatted = (week: number): string => {
    const [ weekStart, weekEnd ] = getDateRangeForWeek(week)
    return `${ weekStart.toLocaleDateString(undefined, {
      day: '2-digit',
      month: '2-digit'
    }) } - ${ weekEnd.toLocaleDateString(undefined, {day: '2-digit', month: '2-digit'}) }`
  }

  const handleSave = async () => {
    if (!remoteDataFetched) {
      console.log('Not saving because remote data was not fetched yet!')
      return
    }
    const currentState = generateSavedState()
    if (currentState === lastSavedState) {
      console.log('Not saving because state has not changed since last save')
      return
    }
    console.log('Saving')
    await saveMealsForWeek(getWeek(selectedMonday), getYear(selectedMonday), mealsForWeek, mealDoneChecks)
    setLastSavedState(currentState)
    console.log('Meals saved')
  }

  return (<div>
      <h2>Meal Plan</h2>
      <div className="kwSelect">
        <div className="weekButtons">
          <img src="/arrow-circle-left.svg" alt="previous week"
               onClick={ () => setSelectedMonday(addWeeks(selectedMonday, -1)) }/>

          <div className="kwDate">
            <span>KW { getWeek(selectedMonday).toString().padStart(2, '0') }</span>
            <span className="dateDisplay"> { getDateRangeForWeekFormatted(getWeek(selectedMonday)) }<br/>
              { getYear(selectedMonday) }
              </span>
          </div>
          <img className="rotated" src="/arrow-circle-left.svg" alt="next week"
               onClick={ () => setSelectedMonday(addWeeks(selectedMonday, 1)) }/>
        </div>

      </div>
      <table className="mealTable">
        <tbody>
        { Array(7).fill(0).map((_, index) => (
          <tr
            key={ index }>
            <td>{ weekDay[index] }</td>
            <td className="mealDoneCheck"><input type="checkbox" checked={ mealDoneChecks[index] || false }
                                                 onChange={ (event) => {
                                                   const newMealDoneChecks = [ ...mealDoneChecks ]
                                                   newMealDoneChecks[index] = event.target.checked
                                                   setMealDoneChecks(newMealDoneChecks)
                                                 } } disabled={ !mealsForWeek[index] || !isOnline }/></td>
            <td><textarea value={ mealsForWeek[index] ?? '' }
                          disabled={ mealDoneChecks[index] || !isOnline }
                          className={ mealDoneChecks[index] ? 'strike-through' : '' }
                          onChange={ (event) => {
                            const newMealsForWeek = [ ...mealsForWeek ]
                            newMealsForWeek[index] = event.target.value
                            setMealsForWeek(newMealsForWeek)
                          } }
                          onBlur={ () => handleSave() }/></td>
          </tr>
        )) }
        </tbody>
      </table>
    </div>
  )
})

const weekDay = [ 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So' ]

export default MealPlan