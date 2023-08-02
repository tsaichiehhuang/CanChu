import { useState, useCallback } from 'react'
import Cookies from 'js-cookie'

const apiUrl = process.env.API_DOMAIN

export default function useComment(postId) {
  const [leaveComment, setLeaveComment] = useState('')
  const handleLeaveComment = useCallback(async () => {
    if (!leaveComment) {
      alert('請輸入內容')
      return
    }
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
      window.location.reload()
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
