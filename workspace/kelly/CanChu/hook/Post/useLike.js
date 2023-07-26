import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
const apiUrl = process.env.API_DOMAIN
export default function useLike(data) {
  const [liked, setLiked] = useState(data?.is_liked || data?.is_like || false)
  const [likeCount, setLikeCount] = useState(data?.like_count || 0)
  const [clickTime, setClickTime] = useState(0)

  // 新增 useEffect 用於更新愛心相關狀態
  useEffect(() => {
    setLiked(data?.is_liked || data?.is_like || false)
    setLikeCount(data?.like_count || 0)
  }, [data])
  //當點愛心時，愛心會變色且讚的數量+1
  const handleHeartClick = async () => {
    //throttle
    const nowTime = new Date().getSeconds()
    if (nowTime - clickTime < 1) {
      return
    }
    setClickTime(nowTime)

    // 在點擊愛心後立即更新前端狀態，不需等待後端 API 回應
    setLiked((prevLiked) => !prevLiked)
    setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1))
    try {
      const accessToken = Cookies.get('accessToken')
      // 如果已經點讚，則發送 DELETE 請求，否則發送 POST 請求
      const method = liked ? 'DELETE' : 'POST'
      const response = await fetch(`${apiUrl}/posts/${data.id}/like`, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        // 如果 API 請求失敗，取消更新愛心狀態
        setLiked(liked)
        console.error('更新愛心狀態時出錯')
      }
    } catch (error) {
      console.error('網絡請求錯誤', error)
    }
  }
  return { liked, likeCount, handleHeartClick }
}
