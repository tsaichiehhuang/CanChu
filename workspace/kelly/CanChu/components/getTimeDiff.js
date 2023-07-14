export default function getTimeDiff(date) {
  const now = new Date()
  const diffInMilliseconds = now - date
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000)

  if (diffInSeconds < 60) {
    return '剛剛'
  } else if (diffInSeconds < 3600) {
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    return `${diffInMinutes}分鐘前`
  } else if (diffInSeconds < 86400) {
    const diffInHours = Math.floor(diffInSeconds / 3600)
    return `${diffInHours}小時前`
  } else {
    const diffInDays = Math.floor(diffInSeconds / 86400)
    return `${diffInDays}天前`
  }
}
