export const formatDate = (date: Date): string => {
  const formattedDate = date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  })
  const formattedTime = date.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  })
  return `${ formattedDate } - ${ formattedTime }`
}