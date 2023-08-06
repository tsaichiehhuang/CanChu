import { useState } from 'react'
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'

const apiUrl = process.env.API_DOMAIN

export default function useEditPost(data) {
  const initialContent = data.context

  const [content, setContent] = useState(initialContent)
  const [editing, setEditing] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  // 編輯模式下的事件處理函式
  const handleEditClick = () => {
    setContent(initialContent) // 將原始貼文內容設置到編輯框
    setEditing(true)
  }

  const handleCancelEdit = () => {
    setEditing(false)
  }

  const handleConfirmEdit = async () => {
    const requestBody = {
      context: content
    }
    const accessToken = Cookies.get('accessToken')
    try {
      // eslint-disable-next-line consistent-return
      const uploadPromises = selectedFiles.map(async (file) => {
        const formData = new FormData()

        formData.append('image', file)

        const response = await fetch('https://api.imgur.com/3/upload', {
          method: 'POST',
          headers: {
            Authorization: 'Client-ID 8e8be06910748ff'
          },
          body: formData
        })

        if (response.ok) {
          const imageData = await response.json()
          return imageData.data.link
          // requestBody.context += `<img src="${imageUrl}" alt="Uploaded Image" />`
        } else {
          Swal.fire('圖片上傳失敗', '', 'error')
        }
      })
      const imageUrls = await Promise.all(uploadPromises)
      if (imageUrls.length > 0) {
        requestBody.context += '<br>'
        imageUrls.forEach((imageUrl) => {
          requestBody.context += `<img src="${imageUrl}" alt="Uploaded Image" /><br>`
        })
      }

      const response = await fetch(`${apiUrl}/posts/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(requestBody)
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
    handleConfirmEdit,
    selectedFiles,
    setSelectedFiles
  }
}
