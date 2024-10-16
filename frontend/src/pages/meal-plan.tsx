import { addWeeks, endOfWeek, getWeek, getYear, startOfWeek } from 'date-fns'
import { memo, useEffect, useState } from 'react'
import { getMealsForWeek, saveMealsForWeek } from '../api/api.ts'

const getDateRangeForWeek = (week: number): [ Date, Date ] => {
  const firstDayOfYear = new Date(getYear(new Date(), {}), 0, 1)
  const firstMonday = startOfWeek(firstDayOfYear, {weekStartsOn: 1})
  const mondayOfGivenWeek = addWeeks(firstMonday, week - 1)
  const sundayOfGivenWeek = endOfWeek(mondayOfGivenWeek, {weekStartsOn: 1})
  return [ mondayOfGivenWeek, sundayOfGivenWeek ]
}

const getCurrentWeek = () => getWeek(new Date())
const getCurrentWeekMonday = () => getDateRangeForWeek(getCurrentWeek())[0]

const MealPlan = memo(() => {
  const [ mealsForWeek, setMealsForWeek ] = useState<(string)[]>([])
  const [ selectedMonday, setSelectedMonday ] = useState<Date>(getCurrentWeekMonday())
  const [ lastSavedMeals, setLastSavedMeals] = useState<string[] | undefined>(undefined)

  useEffect(() => {
    (async () => {
      try {
        const {meals} = await getMealsForWeek(getWeek(selectedMonday), getYear(selectedMonday))
        setMealsForWeek(meals)
        setLastSavedMeals(meals)
        console.log('Meal plan fetched')
      } catch (error) {
        console.log('Could not fetch meal plan')
        setMealsForWeek(Array(7).fill(''))
      }
    })()
  }, [ selectedMonday ])


  const getDateRangeForWeekFormatted = (week: number): string => {
    const [ weekStart, weekEnd ] = getDateRangeForWeek(week)
    return `${ weekStart.toLocaleDateString(undefined, {
      day: '2-digit',
      month: '2-digit'
    }) } - ${ weekEnd.toLocaleDateString(undefined, {day: '2-digit', month: '2-digit'}) }`
  }

  const handleSave = async () => {
    if (!mealsForWeek.some(meal => meal)) {
      console.log('Nothing to save')
      return
    }

    if (JSON.stringify(lastSavedMeals) === JSON.stringify(mealsForWeek)) {
      console.log('Nothing changed since last save')
      return
    }

    await saveMealsForWeek(getWeek(selectedMonday), getYear(selectedMonday), mealsForWeek)
    setLastSavedMeals(mealsForWeek)
    console.log('Meals saved')
  }

  return (<div>
      <h1>Meal Plan</h1>
        <div className="kwSelect">
          <div className="weekButtons">
            <button onClick={ () => setSelectedMonday(addWeeks(selectedMonday, -1)) }>&#8678;</button>
            <div className="kwDate">
              <span>KW { getWeek(selectedMonday).toString().padStart(2, '0') }</span>
              <span className="dateDisplay"> { getDateRangeForWeekFormatted(getWeek(selectedMonday)) }<br/>
                { getYear(selectedMonday) }
              </span>
            </div>
            <button onClick={ () => setSelectedMonday(addWeeks(selectedMonday, 1)) }>&#8680;</button>
          </div>

        </div>
        <table className="mealTable">
          <tbody>
          { Array(7).fill(0).map((_,index)  => (
            <tr
              key={ index }>
              <td>{ weekDay[index] }</td>
              <td><textarea value={ mealsForWeek[index] ?? '' } onChange={ (event) => {
                mealsForWeek[index] = event.target.value
                setMealsForWeek([ ...mealsForWeek ])
              }} onBlur={() => handleSave()}/></td>
            </tr>
          )) }
          </tbody>
        </table>

      </div>
  )
})

const weekDay = [ 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So' ]

export default MealPlan