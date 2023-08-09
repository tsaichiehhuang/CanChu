import React from 'react'
import styles from './Home.module.scss'
import Header from '@/components/Header'
import PostCreator from '@/components/PostCreator'
import Post from '@/components/Post'
import Copyright from '@/components/Copyright'
import useFetchUserProfile from '@/hook/useFetchUserProfile'
import useInfiniteScroll from '@/hook/useInfiniteScroll'
import Cookies from 'js-cookie'
import FriendList from './FriendList'
import usePosts from '@/hook/usePosts'

export default function Home() {
  const { postData, fetchNextPosts, isLoading } = usePosts()
  const handlePostClick = (postId) => {
    window.location.href = `/posts/${postId}`
  }
  const handleUserClick = (user_id) => {
    window.location.href = `/users/${user_id}`
  }
  const userId = Cookies.get('userId')
  const userState = useFetchUserProfile(userId)
  useInfiniteScroll(fetchNextPosts, 100)

  return (
    <div className={styles.body}>
      <style global jsx>{`
        body {
          background: #f9f9f9;
          margin: 0;
        }
      `}</style>
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}
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
              showFullArticle={false}
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
