/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react'
import styles from './Home.module.scss'
import Header from '@/components/Header'
import MobileNavbar from '@/components/MobileNavbar'
import PostCreator from '@/components/PostCreator'
import Post from '@/components/Post'
import Copyright from '@/components/Copyright'
import useFetchUserProfile from '@/hook/useFetchUserProfile'
import useInfiniteScroll from '@/hook/useInfiniteScroll'
import Cookies from 'js-cookie'
import FriendList from './FriendList'
import usePosts from '@/hook/usePosts'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Home() {
  const { postData, fetchNextPosts, isLoading } = usePosts()
  const [isMobileView, setIsMobileView] = useState(false)
  const [showFriendList, setShowFriendList] = useState(false)
  const handlePostClick = (postId) => {
    window.location.href = `/posts/${postId}`
  }
  const handleUserClick = (user_id) => {
    window.location.href = `/users/${user_id}`
  }
  const userId = Cookies.get('userId')
  const userState = useFetchUserProfile(userId)
  useInfiniteScroll(fetchNextPosts, 100)
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 960)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  return (
    <>
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
      {isMobileView && (
        <MobileNavbar
          isHome={true}
          setShowFriendList={setShowFriendList}
          showFriendList={showFriendList}
        />
      )}

      <div className={styles.container}>
        {isMobileView ? (
          showFriendList ? (
            <FriendList
              userState={userState}
              showFriendList={showFriendList}
              setShowFriendList={setShowFriendList}
            />
          ) : null
        ) : (
          <div className={styles.containerLeft}>
            <FriendList userState={userState} />
            <div style={{ width: '274px', marginLeft: '10%' }}>
              <Copyright />
            </div>
          </div>
        )}
        <div className={styles.containerRight}>
          <PostCreator />
          {isLoading && (
            <Skeleton
              count={1}
              height={400}
              width='85% '
              circle={false}
              style={{ borderRadius: '20px' }}
            />
          )}

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
    </>
  )
}
