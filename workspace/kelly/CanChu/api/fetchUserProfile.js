import Cookies from 'js-cookie'

const apiUrl = process.env.API_DOMAIN

const fetchUserProfile = async (
  userId,
  setUserState,
  setEditedTags,
  setIsLoading
) => {
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
      setUserState(userProfile) // 設置用戶資料到 userState 中
      setIsLoading(false)
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

export default fetchUserProfile