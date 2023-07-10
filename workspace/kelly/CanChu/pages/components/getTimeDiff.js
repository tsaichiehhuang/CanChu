export default function getTimeDiff(date) {
  const now = new Date();
  const diffInMilliseconds = now - date;
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 5) {
    return date.toLocaleString();
  } else if (diffInDays > 0) {
    return `${diffInDays}天前`;
  } else {
    return `${diffInHours}小時前`;
  }
}
