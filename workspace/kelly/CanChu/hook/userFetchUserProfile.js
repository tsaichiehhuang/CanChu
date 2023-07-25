import Cookies from 'js-cookie'
import { useState, useEffect } from 'react'

const apiUrl = process.env.API_DOMAIN
const useFetchUserProfile = (userId) => {
  const [userState, setUserState] = useState([])
  const [editedTags, setEditedTags] = useState('')

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accessToken = Cookies.get('accessToken')

        if (!accessToken) {
          console.error('未找到accessToken')
          return
        }

        const response = await fetch(`${apiUrl}/users/${userId}/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          const userProfile = data?.data?.user || {}
          setUserState(userProfile)

          // 確保 tags 被正確設置後再進行 split
          if (userProfile.tags) {
            const tagList = userProfile.tags.split(',')
            setEditedTags(tagList.join(','))
          }
        } else {
          console.error('獲取用戶信息時出錯')
        }
      } catch (error) {
        console.error('網絡請求錯誤', error)
      }
    }

    fetchUserProfile()
  }, [userId])
  const updateUserState = (updatedUser) => {
    setUserState(updatedUser)
  }

  return { userState, editedTags, updateUserState }
}

export default useFetchUserProfile
