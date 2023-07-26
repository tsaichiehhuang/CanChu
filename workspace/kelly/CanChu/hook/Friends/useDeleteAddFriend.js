import Cookies from 'js-cookie'
import { useState } from 'react'

const apiUrl = process.env.API_DOMAIN

function useDeleteAddFriend() {
  const deleteFriendRequest = async (friendshipId) => {
    try {
      const accessToken = Cookies.get('accessToken')

      if (!accessToken) {
        console.error('未找到accessToken')
        return
      }

      const response = await fetch(`${apiUrl}/friends/${friendshipId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (response.ok) {
        window.location.reload()
      } else {
        console.error('刪除好友邀請失敗')
      }
    } catch (error) {
      console.error('網絡請求錯誤', error)
    }
  }

  return { deleteFriendRequest }
}

export default useDeleteAddFriend
