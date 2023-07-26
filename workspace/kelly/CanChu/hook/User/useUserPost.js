import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

const apiUrl = process.env.API_DOMAIN

const useUserPost = (userId) => {
  const [postData, setPostData] = useState([])

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const accessToken = Cookies.get('accessToken')

        if (!accessToken) {
          console.error('未找到accessToken')
          return
        }

        const url = new URL(`${apiUrl}/posts/search`)
        url.searchParams.append('user_id', userId)

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setPostData(data?.data?.posts || [])
        } else {
          console.error('獲取用戶貼文時出錯')
        }
      } catch (error) {
        console.error('網絡請求錯誤', error)
      }
    }

    fetchUserPosts()
  }, [userId])

  return postData
}

export default useUserPost
