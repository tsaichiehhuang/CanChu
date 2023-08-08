import { useState } from 'react'
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'

const apiUrl = process.env.API_DOMAIN

const useEditProfile = (userState, updateUserState) => {
  const [editing, setEditing] = useState(false)
  const [editedIntroduction, setEditedIntroduction] = useState('')
  const [editedTags, setEditedTags] = useState('')

  const handleEditProfile = () => {
    setEditing(true)
    setEditedIntroduction(userState.introduction || '')
    setEditedTags(userState.tags || '')
  }

  const handleCancelEdit = () => {
    setEditing(false)
  }

  const handleUpdateProfile = async () => {
    try {
      const accessToken = Cookies.get('accessToken')
      if (!accessToken) {
        console.error('未找到accessToken')
        return
      }

      const response = await fetch(`${apiUrl}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          name: userState.name,
          introduction: editedIntroduction,
          tags: editedTags
        })
      })

      if (response.ok) {
        const updatedUser = {
          ...userState,
          introduction: editedIntroduction,
          tags: editedTags.split(',')
        }
        updateUserState(updatedUser)
        setEditing(false)
        Swal.fire('個人檔案更新完成', '', 'success')
        window.location.reload()
      } else {
        Swal.fire('更新個人檔案失敗', '', 'error')
      }
    } catch (error) {
      console.error('網絡請求錯誤', error)
    }
  }

  return {
    editing,
    editedIntroduction,
    editedTags,
    handleEditProfile,
    handleCancelEdit,
    handleUpdateProfile,
    setEditedIntroduction,
    setEditedTags
  }
}

export default useEditProfile
