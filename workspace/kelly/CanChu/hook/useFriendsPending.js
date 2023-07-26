import Cookies from 'js-cookie'
import { useState, useEffect } from 'react'

const apiUrl = process.env.API_DOMAIN

function useFriendsPending() {
  const [friendsPending, setFriendsPending] = useState([])

  const fetchFriendsPending = async () => {
    try {
      const accessToken = Cookies.get('accessToken')

      if (!accessToken) {
        console.error('未找到accessToken')
        return
      }

      const response = await fetch(`${apiUrl}/friends/pending`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        const pendingFriends = data?.data?.users || []
        setFriendsPending(pendingFriends)
      } else {
        console.error('獲取好友邀請失敗')
      }
    } catch (error) {
      console.error('網絡請求錯誤', error)
    }
  }

  useEffect(() => {
    fetchFriendsPending()
  }, []) // 只在組件加載時執行一次

  return friendsPending
}

export default useFriendsPending
