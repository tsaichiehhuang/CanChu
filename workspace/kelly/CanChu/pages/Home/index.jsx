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
import useDeleteAddFriend from '@/hook/useDeleteAddFriend'
import useAgreeFriend from '@/hook/useAgreeFriend'
import Cookies from 'js-cookie'
import IsPictureUrlOk from '@/components/IsPictureUrlOk'

export default function Home() {
  const { deleteFriendRequest } = useDeleteAddFriend()
  const { agreeFriendRequest } = useAgreeFriend()
  const postData = useFetchPostsData()
  const handlePostClick = (postId) => {
    window.location.href = `/posts/${postId}`
  }
  const handleUserClick = (user_id) => {
    window.location.href = `/users/${user_id}`
  }
  const userId = Cookies.get('userId')
  const userState = useFetchUserProfile(userId)
  const friendsPending = useFriendsPending()
  const friends = useFriends()

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
        <div className={styles.friendRequestText}>{friend.name}</div>
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
          onClick={() => agreeFriendRequest(friend.friendship.id)}
        >
          確定
        </button>
        <button
          className={styles.friendRequestButton}
          style={{ background: '#BFBFBF' }}
          onClick={() => deleteFriendRequest(friend.friendship.id)}
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
    const renderIconSection = (icon, text) => (
      <div className={styles.friendListSection}>
        {icon ? (
          <img style={{ marginLeft: '1%', width: '10%' }} src={icon} />
        ) : (
          <div className={styles.friendListIcon}></div>
        )}
        <div style={{ color: '#767676' }} className={styles.friendRequestText}>
          {text}
        </div>
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
        {renderIconSection('/friends.png', '我的好友')}
        <div className={styles.friendListMyFriend}>
          {friendsPending.map((friend) => renderFriendRequest(friend))}
          {friends.map((friend, index) => (
            <div className={styles.friendListSection} key={index}>
              <IsPictureUrlOk
                className={styles.friendRequestImg}
                userState={friend}
              />
              <div className={styles.friendRequestText}>{friend.name}</div>
            </div>
          ))}
        </div>
        {renderIconSection('/options.png', '查看全部')}
      </div>
    )
  }
  const userPicutre = userState.userState.picture || '/個人照片.png'
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
