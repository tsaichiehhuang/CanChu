import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

const usePosts = (userId) => {
  const [postData, setPostData] = useState([])
  const [nextCursor, setNextCursor] = useState(null)
  const [isFetching, setIsFetching] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchPosts = async (cursor = null) => {
    if (isFetching) {
      return
    }
    try {
      setIsFetching(true)
      setIsLoading(true)
      const accessToken = Cookies.get('accessToken')

      if (!accessToken) {
        console.error('未找到accessToken')
        return
      }

      let url = `${process.env.API_DOMAIN}/posts/search`
      if (cursor) {
        url += `?cursor=${encodeURIComponent(cursor)}`
      }
      if (userId && cursor) {
        url += `&user_id=${encodeURIComponent(userId)}`
      } else if (userId) {
        url += `?user_id=${encodeURIComponent(userId)}`
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
        setNextCursor(data?.data?.next_cursor || null)
        setPostData((prevData) =>
          cursor
            ? [...prevData, ...(data?.data?.posts || [])]
            : data?.data?.posts || []
        )

        console.log('Next Cursor:', data?.data?.next_cursor)
      } else {
        console.error('獲取貼文數據時出錯')
      }
    } catch (error) {
      console.error('網絡請求錯誤', error)
    } finally {
      setIsFetching(false)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [userId])

  const fetchNextPosts = () => {
    if (nextCursor) {
      fetchPosts(nextCursor)
    }
  }

  return { postData, fetchNextPosts, nextCursor, isLoading }
}

export default usePosts
