import { useState } from 'react'
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'

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
      const response = await fetch(`${apiUrl}/posts/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ context: content })
      })

      if (response.ok) {
        setEditing(false)
        Swal.fire('貼文更新完成', '', 'success')
        window.location.reload()
      } else {
        Swal.fire('更新貼文內容失敗', '', 'error')
      }
      setEditing(false)
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
