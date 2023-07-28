import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

const apiUrl = process.env.API_DOMAIN

const useUserPost = (userId) => {
  const [postData, setPostData] = useState([])
  const [nextCursor, setNextCursor] = useState(null)
  const [isFetching, setIsFetching] = useState(false)

  const fetchUserPosts = async (cursor = null) => {
    if (isFetching) {
      return
    }
    try {
      setIsFetching(true)
      const accessToken = Cookies.get('accessToken')

      if (!accessToken) {
        console.error('未找到accessToken')
        return
      }

      const url = new URL(`${apiUrl}/posts/search`)
      url.searchParams.append('user_id', userId)
      if (cursor) {
        url.searchParams.append('cursor', cursor)
      }
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (!data?.data?.next_cursor) {
          setNextCursor(null)
        } else {
          setNextCursor(data?.data?.next_cursor)
        }
        setPostData((prevData) => [...prevData, ...(data?.data?.posts || [])])
      } else {
        console.error('獲取用戶貼文時出錯')
      }
    } catch (error) {
      console.error('網絡請求錯誤', error)
    } finally {
      setIsFetching(false) // API 呼叫結束，設置回 false
    }
  }
  useEffect(() => {
    fetchUserPosts()
  }, [userId])

  const fetchNextUserPosts = () => {
    if (nextCursor) {
      fetchUserPosts(nextCursor)
    }
  }

  return { postData, fetchNextUserPosts, nextCursor }
}

export default useUserPost
