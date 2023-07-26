import { useState } from 'react'
import Cookies from 'js-cookie'

const apiUrl = process.env.API_DOMAIN

export default function useEditPost(data) {
  const initialContent = data.context

  const [content, setContent] = useState(initialContent)
  const [editing, setEditing] = useState(false)

  // 編輯模式下的事件處理函式
  const handleEditClick = () => {
    setContent(initialContent) // 將原始貼文內容設置到編輯框
    setEditing(true)
  }

  const handleCancelEdit = () => {
    setEditing(false)
  }

  const handleConfirmEdit = async () => {
    try {
      const accessToken = Cookies.get('accessToken')
      // 發送 PUT 請求來修改貼文內容
      const response = await fetch(`${apiUrl}/posts/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ context: content })
      })

      if (response.ok) {
        setEditing(false) // 退出編輯模式
        alert('貼文更新完成')
        window.location.reload()
      } else {
        alert('更新貼文內容失敗')
      }
      setEditing(false) // 退出編輯模式
    } catch (error) {
      console.error('網絡請求錯誤', error)
    }
  }

  return {
    content,
    setContent,
    editing,
    handleEditClick,
    handleCancelEdit,
    handleConfirmEdit
  }
}
