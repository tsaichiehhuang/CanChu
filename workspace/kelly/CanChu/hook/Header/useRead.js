import Cookies from 'js-cookie'

const apiUrl = process.env.API_DOMAIN

function useRead() {
  const markAsRead = async (eventId) => {
    try {
      const accessToken = Cookies.get('accessToken')
      await fetch(`${apiUrl}/events/${eventId}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      })
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  return { markAsRead }
}

export default useRead
