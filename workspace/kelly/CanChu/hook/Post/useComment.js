import { useState, useCallback } from 'react'
import Cookies from 'js-cookie'

const apiUrl = process.env.API_DOMAIN

export default function useComment(postId) {
  const [leaveComment, setLeaveComment] = useState('')

  // 發表comment
  const handleLeaveComment = useCallback(async () => {
    if (!leaveComment) {
      alert('請輸入內容')
      return
    }
    // 構造請求體
    const requestBody = {
      content: leaveComment
    }

    const accessToken = Cookies.get('accessToken')
    const response = await fetch(`${apiUrl}/posts/${postId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(requestBody)
    })

    if (response.ok) {
      window.location.reload() // 自動重新整理頁面
    } else {
      throw new Error('留言失敗')
    }
  }, [leaveComment, postId])

  return {
    leaveComment,
    setLeaveComment,
    handleLeaveComment
  }
}
