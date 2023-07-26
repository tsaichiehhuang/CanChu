import { useState } from 'react'
import Cookies from 'js-cookie'

const apiUrl = process.env.API_DOMAIN

function useEditProfile() {
  const [editedIntroduction, setEditedIntroduction] = useState('')
  const [editedTags, setEditedTags] = useState('')

  // 更新用戶的自我介紹和興趣標籤
  const updateUserProfile = async (introduction, tags) => {
    try {
      const accessToken = Cookies.get('accessToken')
      if (!accessToken) {
        console.error('未找到accessToken')
        return
      }

      // 發送 PUT 請求來更改用戶信息
      const response = await fetch(`${apiUrl}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          name: '', // 如果需要更改用戶名稱，可以在此處提供新的用戶名稱
          introduction,
          tags
        })
      })

      if (response.ok) {
        // 更新自我介紹和興趣標籤
        setEditedIntroduction(introduction)
        setEditedTags(tags)
        alert('個人檔案更新完成')
      } else {
        alert('更新個人檔案失敗')
      }
    } catch (error) {
      console.error('網絡請求錯誤', error)
    }
  }

  return { editedIntroduction, editedTags, updateUserProfile }
}

export default useEditProfile
