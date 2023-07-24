import { useState } from 'react'
import Cookies from 'js-cookie'

const apiUrl = process.env.API_DOMAIN

const useAgreeFriend = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const agreeFriendRequest = async (friendshipId) => {
    try {
      setIsLoading(true)

      const accessToken = Cookies.get('accessToken')
      if (!accessToken) {
        throw new Error('未找到accessToken')
      }

      const response = await fetch(`${apiUrl}/friends/${friendshipId}/agree`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error('確認好友請求失敗')
      }

      setIsLoading(false)
      return true
    } catch {
      setIsLoading(false)
      setError(error)
      return false
    }
  }

  return { isLoading, error, agreeFriendRequest }
}

export default useAgreeFriend
