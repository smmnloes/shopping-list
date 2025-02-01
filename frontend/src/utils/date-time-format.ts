export const formatDateAndTime = (date: Date): string => {
  return `${ formatDate(date) }, ${ formatTime(date) }`
}

export const formatDate =(date: Date) => date.toLocaleDateString('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit'
})
export const formatTime = (date: Date) => date.toLocaleTimeString('de-DE', {
  hour: '2-digit',
  minute: '2-digit'
})