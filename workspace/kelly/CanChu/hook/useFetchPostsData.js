import Cookies from 'js-cookie'
import { useState, useEffect } from 'react'

const apiUrl = process.env.API_DOMAIN

function useFetchPostsData() {
  const [postData, setPostData] = useState([])

  useEffect(() => {
    const fetchPostsData = async () => {
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
          // console.error('獲取貼文數據時出錯');
        }
      } catch (error) {
        // console.error('網絡請求錯誤', error);
      }
    }

    fetchPostsData()
  }, [])

  return postData
}

export default useFetchPostsData

// const fetchPostsData = async (setPostData) => {
//   try {
//     const accessToken = Cookies.get('accessToken')

//     if (!accessToken) {
//       console.error('未找到accessToken')
//       return
//     }

//     const response = await fetch(`${apiUrl}/posts/search`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${accessToken}`
//       }
//     })

//     if (response.ok) {
//       const data = await response.json()
//       setPostData(data?.data?.posts || [])
//     } else {
//       // console.error('獲取貼文數據時出錯')
//     }
//   } catch (error) {
//     // console.error('網絡請求錯誤', error)
//   }
// }

// export default fetchPostsData
