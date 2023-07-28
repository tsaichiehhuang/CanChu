import Cookies from 'js-cookie'
import { useState, useEffect } from 'react'

const apiUrl = process.env.API_DOMAIN

function useFetchPostsData() {
  const [postData, setPostData] = useState([])
  const [nextCursor, setNextCursor] = useState(null)
  const [isFetching, setIsFetching] = useState(false)

  const fetchPostsData = async (cursor = null) => {
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
      let url = `${apiUrl}/posts/search`
      if (cursor) {
        url += `?cursor=${encodeURIComponent(cursor)}`
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

        console.log('Next Cursor:', data?.data?.next_cursor)
      } else {
        console.error('獲取貼文數據時出錯')
      }
    } catch (error) {
      console.error('網絡請求錯誤', error)
    } finally {
      setIsFetching(false) // API 呼叫結束，設置回 false
    }
  }

  useEffect(() => {
    fetchPostsData()
  }, [])

  const fetchNextPosts = () => {
    if (nextCursor) {
      fetchPostsData(nextCursor)
    }
  }
  return { postData, fetchNextPosts, nextCursor }
}

export default useFetchPostsData
