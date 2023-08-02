import React, { useEffect, useState } from 'react'
import Post from '@/components/Post'
import Header from '@/components/Header'
import Cookies from 'js-cookie'
import useFetchUserProfile from '@/hook/useFetchUserProfile'

const apiUrl = process.env.API_DOMAIN

export async function getServerSideProps(context) {
  const { req, res } = context
  const accessToken = req.cookies.accessToken
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
  const userId = Cookies.get('userId')
  const userState = useFetchUserProfile(userId)
  const postId = Cookies.get('postId')
  const accessToken = Cookies.get('accessToken')
  const [postData, setPostData] = useState({
    data: {},
    liked: false,
    likeCount: 0
  })

  //fix:重新整理頁面時，即時顯示的愛心會消失
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
          const post = data?.data?.post || {}
          setPostData({
            data: post,
            liked: post.is_liked || post.is_like || false,
            likeCount: post.like_count || 0
          })
        } else {
          console.error('獲取貼文數據時出錯')
        }
      } catch (error) {
        console.error('網絡請求錯誤', error)
      }
    }
    fetchPostData()
  }, [postId])
  const { data, liked, likeCount } = postData
  const formattedLikeCount = likeCount === 0 ? 0 : likeCount
  return (
    <div>
      <Header />
      <Post
        showFullArticle={true}
        data={data}
        userState={userState}
        showComments={true}
        showImage={true}
        showEditIcon={true}
        enableClick={false}
        liked={liked}
        likeCount={likeCount}
        formattedLikeCount={formattedLikeCount}
      />
    </div>
  )
}
