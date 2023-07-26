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
import Link from 'next/link'

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
    const renderFriendSection = (img, text) => (
      <div className={styles.friendListSection}>
        <img
          style={{ marginLeft: '1%', width: '40px', borderRadius: '50%' }}
          src={img}
        />
        <div className={styles.friendRequestText}>{text}</div>
      </div>
    )
    return (
      <div className={styles.friendList}>
        {renderFriendSection(
          userState.userState.picture || '/個人照片.png',
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

        <div className={styles.friendListSection}>
          <div style={{ margin: '0% 3.5%', width: '10%' }}>
            <img style={{ width: '100%' }} src='/friends.png' />
          </div>
          <div
            style={{ color: '#767676' }}
            className={styles.friendRequestText}
          >
            我的好友
          </div>
        </div>
        <div className={styles.friendListMyFriend}>
          {friends.map((friend, index) => (
            <div key={index}>
              <Link
                href='/users/[user.id]'
                as={`/users/${friend.id}`}
                className={styles.friendListSection}
                prefetch
              >
                <IsPictureUrlOk
                  className={styles.friendRequestImg}
                  userState={friend}
                />
                <div className={styles.friendRequestText}>{friend.name}</div>
              </Link>
            </div>
          ))}
          {friendsPending.map((friend) => renderFriendRequest(friend))}
        </div>

        <div className={styles.friendListSection}>
          <img style={{ margin: '0% 1.5%', width: '15%' }} src='/options.png' />

          <div
            style={{ color: '#767676' }}
            className={styles.friendRequestText}
          >
            查看全部
          </div>
        </div>
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
