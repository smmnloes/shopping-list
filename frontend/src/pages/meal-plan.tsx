import { addDays, addWeeks, endOfWeek, format, getWeek, getYear, startOfWeek } from 'date-fns'
import { useState } from 'react'
import { de } from 'date-fns/locale'

const MealPlan = () => {
  const [ meals, setMeals ] = useState<(string | null)[]>([ 'Fleischpflanzl', 'Sauerbraten', 'Badabing', 'Badabung', 'Freitagfisch', 'Samstagessen', 'Ohlala' ])
  const [ selectedWeek, setSelectedWeek ] = useState<number>(getWeek(new Date(), {weekStartsOn: 1}))

  const getDateRangeForWeek = (week: number): [ Date, Date ] => {
    const firstDayOfYear = new Date(getYear(new Date(), {}), 0, 1)
    const firstMonday = startOfWeek(firstDayOfYear, {weekStartsOn: 1})
    const mondayOfGivenWeek = addWeeks(firstMonday, week - 1)
    const sundayOfGivenWeek = endOfWeek(mondayOfGivenWeek, {weekStartsOn: 1})
    return [ mondayOfGivenWeek, sundayOfGivenWeek ]
  }

  const getDateRangeForWeekFormatted = (week: number): string => {
    const [ start, end ] = getDateRangeForWeek(week)
    return `${ start.toLocaleDateString() } - ${ end.toLocaleDateString() }`
  }


  return (<div>
      <h1>Meal Plan</h1>
      <div>
        <div className="kwSelect">
          <div className="weekButtons">
            <button onClick={ () => setSelectedWeek(selectedWeek - 1) }>prev</button>
            <p>KW { selectedWeek.toString().padStart(2, '0') }</p>
            <button onClick={ () => setSelectedWeek(selectedWeek + 1) }>next</button>
          </div>
          { getDateRangeForWeekFormatted(selectedWeek) }
        </div>
        <table className="mealTable">
          <tbody>
          { meals.map((meal, index) => (
            <tr
              key={ index }>
              <td>{ format(addDays(getDateRangeForWeek(selectedWeek)[0], index), 'EEEE', {locale: de}) }</td>
              <td>{ meal }</td>
            </tr>
          )) }
          </tbody>
        </table>

      </div>
    </div>
  )
}

export default MealPlan