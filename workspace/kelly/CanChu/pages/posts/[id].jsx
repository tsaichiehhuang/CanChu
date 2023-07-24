import React, { useEffect, useState } from 'react'
import Post from '../Post'
import Header from '../../components/Header'
import Cookies from 'js-cookie'

const apiUrl = process.env.API_DOMAIN

export async function getServerSideProps(context) {
  const { req, res, params } = context
  const accessToken = req.cookies.accessToken

  // 如果未登入，重定向到登入頁面
  if (!accessToken) {
    res.writeHead(302, { Location: '/login' })
    res.end()
    return { props: {} }
  }

  return {
    props: {}
  }
}

export default function Demo() {
  const postId = Cookies.get('postId')
  const accessToken = Cookies.get('accessToken')
  // eslint-disable-next-line consistent-return
  const [postData, setPostData] = useState([]) // 改為空數組作為初始值

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await fetch(`${apiUrl}/posts/${postId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setPostData(data?.data?.post || [])
        } else {
          console.error('獲取貼文數據時出錯')
        }
      } catch (error) {
        console.error('網絡請求錯誤', error)
      }
    }
    fetchPostData()
  }, [])
  return (
    <div>
      <Header />
      <Post
        data={postData}
        showComments={true}
        showImage={true}
        showEditIcon={false}
      />
    </div>
  )
}
