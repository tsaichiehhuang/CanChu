import Cookies from 'js-cookie'
import { useState, useEffect } from 'react'

const apiUrl = process.env.API_DOMAIN

function useFetchPostsData() {
  const [postData, setPostData] = useState([])
  const [nextCursor, setNextCursor] = useState(null)

  const fetchPostsData = async (cursor = null) => {
    try {
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
        setPostData((prevData) => [...prevData, ...(data?.data?.posts || [])])
        setNextCursor(data?.data?.next_cursor || null)
        console.log('Next Cursor:', data?.data?.next_cursor)
      } else {
        console.error('獲取貼文數據時出錯')
      }
    } catch (error) {
      console.error('網絡請求錯誤', error)
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
