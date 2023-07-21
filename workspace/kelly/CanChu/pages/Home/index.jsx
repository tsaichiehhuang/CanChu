import React, { useState, useEffect } from 'react'
import styles from './Home.module.scss'
import Header from '../../components/Header'
import PostCreator from '../../components/PostCreator'
import Post from '../../components/Post'
import Copyright from '../../components/Copyright'
import useFetchPostsData from '../../api/useFetchPostsData'

export default function Home() {
  // const [postData, setPostData] = useState([])
  const postData = useFetchPostsData()
  const handlePostClick = (postId) => {
    // 將點擊的 post id 儲存到狀態，然後導航至對應頁面
    window.location.href = `/posts/${postId}`
  }

  // //找尋貼文
  // useEffect(() => {
  //   fetchPostsData(setPostData)
  // }, [])

  const friendList = () => {
    const friends = Array(6).fill('好朋友')

    const renderFriendSection = (icon, text) => (
      <div className={styles.friendListSection}>
        {icon ? (
          <div style={{ marginLeft: '1%' }}>{icon}</div>
        ) : (
          <div className={styles.friendListIcon}></div>
        )}
        <div>{text}</div>
      </div>
    )

    return (
      <div className={styles.friendList}>
        {renderFriendSection('', '你的名字')}
        {renderFriendSection('', '好友邀請')}
        <div
          style={{ width: '90%', background: '#D9D9D9', height: '1px' }}
        ></div>
        {renderFriendSection(<img src='/friends.png' />, '我的好友')}
        <div className={styles.friendListMyFriend}>
          {friends.map((friend, index) => (
            <div className={styles.friendListSection} key={index}>
              <div className={styles.friendListIcon}></div>
              <div>{friend}</div>
            </div>
          ))}
        </div>
        {renderFriendSection(<img src='/options.png' />, '查看全部')}
      </div>
    )
  }

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
          {friendList()}
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
              onClick={() => handlePostClick(data.id)} // 傳遞點擊事件處理函式
            />
          ))}
        </div>
      </div>
    </div>
  )
}
export async function getServerSideProps(context) {
  const { req, res } = context
  const accessToken = req.cookies.accessToken

  // 如果未登入，重定向到登入頁面
  if (!accessToken) {
    res.writeHead(302, { Location: '/login' })
    res.end()
    return { props: {} }
  }

  return { props: {} }
}
