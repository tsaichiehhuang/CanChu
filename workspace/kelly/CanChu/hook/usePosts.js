import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

const usePosts = (userId) => {
  const router = useRouter()
  const { id } = router.query
  console.log(id)
  const [postData, setPostData] = useState([])
  const [nextCursor, setNextCursor] = useState(null)
  const [isFetching, setIsFetching] = useState(false)

  const fetchPosts = async (cursor = null) => {
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

      let url = `${process.env.API_DOMAIN}/posts/search`
      if (cursor && !id) {
        url += `?cursor=${encodeURIComponent(cursor)}`
      }
      if (cursor && id) {
        url += `?user_id=${encodeURIComponent(id)}&cursor=${encodeURIComponent(
          cursor
        )}`
      }
      if (id && !cursor) {
        url += `?user_id=${encodeURIComponent(id)}`
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (response.ok) {
        console.log(url)
        const data = await response.json()
        if (!data?.data?.next_cursor) {
          setNextCursor(null)
        } else {
          setNextCursor(data?.data?.next_cursor)
        }

        if (cursor) {
          setPostData((prevData) => [...prevData, ...(data?.data?.posts || [])])
        } else {
          setPostData(data?.data?.posts || [])
        }

        console.log('Next Cursor:', data?.data?.next_cursor)
      } else {
        console.error('獲取貼文數據時出錯')
      }
    } catch (error) {
      console.error('網絡請求錯誤', error)
    } finally {
      setIsFetching(false)
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

  return { postData, fetchNextPosts, nextCursor }
}

export default usePosts