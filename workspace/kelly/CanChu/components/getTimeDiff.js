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
    if (diffInDays > 6) {
      // 超過六天，返回完整的原本時間
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hours}:${minutes}`
    } else {
      return `${diffInDays}天前`
    }
  }
}
