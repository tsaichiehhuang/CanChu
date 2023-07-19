import Cookies from 'js-cookie'

const apiUrl = process.env.API_DOMAIN

const fetchPostsData = async (setPostData) => {
  try {
    const accessToken = Cookies.get('accessToken')

    if (!accessToken) {
      console.error('未找到accessToken')
      return
    }

    const response = await fetch(`${apiUrl}/posts/search`, {
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
      console.error('獲取貼文數據時出錯')
    }
  } catch (error) {
    console.error('網絡請求錯誤', error)
  }
}

export default fetchPostsData
