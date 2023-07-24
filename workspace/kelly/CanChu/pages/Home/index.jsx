import React, { useState, useEffect } from 'react'
import styles from './Home.module.scss'
import Header from '@/components/Header'
import PostCreator from '@/components/PostCreator'
import Post from '@/components/Post'
import Copyright from '@/components/Copyright'
import useFetchPostsData from '@/hook/useFetchPostsData'
import useFriends from '@/hook/useFriends'
import useFetchUserProfile from '@/hook/userFetchUserProfile'
import useFriendsPending from '@/hook/useFriendsPending'
import Cookies from 'js-cookie'
import IsPictureUrlOk from '@/components/IsPictureUrlOk'

export default function Home() {
  const postData = useFetchPostsData()
  const handlePostClick = (postId) => {
    // 將點擊的 post id 儲存到狀態，然後導航至對應頁面
    window.location.href = `/posts/${postId}`
  }
  const userId = Cookies.get('userId')
  const userState = useFetchUserProfile(userId)
  const friends = useFriends()
  const friendsPending = useFriendsPending()

  const renderFriendRequest = (friend) => (
    <div key={friend.id} className={styles.friendRequest}>
      <div
        style={{
          flexDirection: 'row',
          display: 'flex',
          width: '60%',
          gap: '6%'
        }}
      >
        <IsPictureUrlOk
          className={styles.friendRequestImg}
          userState={friend}
        />
        <div>{friend.name}</div>
      </div>
      <div
        style={{
          flexDirection: 'row',
          display: 'flex',

          gap: '5%'
        }}
      >
        <button
          className={styles.friendRequestButton}
          style={{ background: '#5458F7' }}
        >
          確定
        </button>
        <button
          className={styles.friendRequestButton}
          style={{ background: '#BFBFBF' }}
        >
          取消
        </button>
      </div>
    </div>
  )
  const friendList = () => {
    const renderFriendSection = (icon, text) => (
      <div className={styles.friendListSection}>
        {icon ? (
          <img
            style={{ marginLeft: '1%', width: '10%', borderRadius: '50%' }}
            src={icon}
          />
        ) : (
          <div className={styles.friendListIcon}></div>
        )}
        <div>{text}</div>
      </div>
    )
    const renderIconSection = (icon, text) => (
      <div className={styles.friendListSection}>
        {icon ? (
          <img style={{ marginLeft: '1%', width: '10%' }} src={icon} />
        ) : (
          <div className={styles.friendListIcon}></div>
        )}
        <div style={{ color: '#767676', fontWeight: '700' }}>{text}</div>
      </div>
    )
    return (
      <div className={styles.friendList}>
        {renderFriendSection(
          userState.userState.picture,
          userState.userState.name
        )}

        <div
          style={{
            width: '90%',
            background: '#D9D9D9',
            height: '1px',
            margin: '3% 0'
          }}
        ></div>
        {renderIconSection('/friends.png', '我的好友')}
        <div className={styles.friendListMyFriend}>
          {/* {friends.map((friend, index) => (
            <div className={styles.friendListSection} key={index}>
              <div className={styles.friendListIcon}></div>
              <div>{friend}</div>
            </div>
          ))} */}
          {friendsPending.map((friend) => renderFriendRequest(friend))}
        </div>
        {renderIconSection('/options.png', '查看全部')}
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
