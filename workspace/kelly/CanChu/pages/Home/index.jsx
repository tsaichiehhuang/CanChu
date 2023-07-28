import React, { useState, useEffect } from 'react'
import styles from './Home.module.scss'
import Header from '@/components/Header'
import PostCreator from '@/components/PostCreator'
import Post from '@/components/Post'
import Copyright from '@/components/Copyright'
import useFetchPostsData from '@/hook/useFetchPostsData'
import useFetchUserProfile from '@/hook/useFetchUserProfile'
import Cookies from 'js-cookie'
import FriendList from './FriendList'

export default function Home() {
  const { postData, fetchNextPosts } = useFetchPostsData()
  const [reachedBottom, setReachedBottom] = useState(false)
  const handlePostClick = (postId) => {
    window.location.href = `/posts/${postId}`
  }
  const handleUserClick = (user_id) => {
    window.location.href = `/users/${user_id}`
  }
  const userId = Cookies.get('userId')
  const userState = useFetchUserProfile(userId)

  // 滾動事件處理函式
  const handleScroll = () => {
    const docHeight = document.documentElement.scrollHeight
    const windowHeight = window.innerHeight
    const scrollY = window.scrollY || document.body.scrollTop || 0
    if (docHeight - (windowHeight + scrollY) < 100) {
      setReachedBottom(true)
    } else {
      setReachedBottom(false)
    }
  }
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (reachedBottom) {
      console.log('get the posts!')
      fetchNextPosts()
    }
  }, [reachedBottom])
  return (
    <div className={styles.body}>
      <style global jsx>{`
        body {
          background: #f9f9f9;
          margin: 0;
        }
      `}</style>
      <Header />
      <div className={styles.container}>
        <div className={styles.containerLeft}>
          <FriendList userState={userState} />
          <div style={{ width: '274px', marginLeft: '10%' }}>
            <Copyright />
          </div>
        </div>
        <div className={styles.containerRight}>
          <PostCreator />
          {postData.map((data) => (
            <Post
              showComments={false}
              showImage={false}
              showEditIcon={false}
              key={data.id}
              data={data}
              userState={userState}
              onClick={() => {
                handlePostClick(data.id)
                handleUserClick(data.user_id)
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
