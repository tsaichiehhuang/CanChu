import { useState } from 'react'
import Cookies from 'js-cookie'

const apiUrl = process.env.API_DOMAIN

const useAgreeFriend = () => {
  // eslint-disable-next-line consistent-return
  const agreeFriendRequest = async (friendshipId) => {
    try {
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

      if (response.ok) {
        window.location.reload()
      } else {
        console.error('確定好友邀請失敗')
      }
    } catch {
      console.error('網絡請求錯誤')
    }
  }

  return { agreeFriendRequest }
}

export default useAgreeFriend
