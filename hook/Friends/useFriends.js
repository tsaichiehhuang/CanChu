import Cookies from 'js-cookie'
import { useState, useEffect } from 'react'

const apiUrl = process.env.API_DOMAIN
const useFriends = () => {
  const [friends, setFriends] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const Friend = async () => {
      try {
        setIsLoading(true)
        const accessToken = Cookies.get('accessToken')

        if (!accessToken) {
          console.error('未找到accessToken')
          return
        }

        const response = await fetch(`${apiUrl}/friends`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setFriends(data?.data?.users || [])
        } else {
          console.error('獲取用戶信息時出錯')
        }
      } catch (error) {
        console.error('網絡請求錯誤', error)
      } finally {
        setIsLoading(false)
      }
    }

    Friend()
  }, [])

  return {
    friends: Array.isArray(friends) ? friends : [],
    isLoading
  }
}

export default useFriends
