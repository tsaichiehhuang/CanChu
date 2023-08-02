import React, { useRef, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import styles from './Profile.module.scss'
import { useRouter } from 'next/router'
import useAddFriend from '@/hook/Friends/useAddFriend'
import useDeleteAddFriend from '@/hook/Friends/useDeleteAddFriend'
import useEditProfile from '@/hook/Profile/useEditProfile'
import ProfileButton from './ProfileButton'

export default function Profile({ userState, isSelf, updateUserState }) {
  const tagRefs = useRef([])

  const router = useRouter()
  const { id } = router.query

  if (!isSelf) {
    Cookies.set('otherUserId', id)
  } else {
    Cookies.remove('otherUserId')
  }

  const { addFriend } = useAddFriend()
  const { deleteFriendRequest } = useDeleteAddFriend()
  const {
    editing,
    editedIntroduction,
    editedTags,
    handleEditProfile,
    handleCancelEdit,
    handleUpdateProfile,
    setEditedIntroduction,
    setEditedTags
  } = useEditProfile(userState, updateUserState)
  const tagList =
    userState.tags && typeof userState.tags === 'string'
      ? userState.tags.split(',')
      : []

  return (
    <div className={styles.profileSquare}>
      <ProfileButton
        userState={userState}
        isSelf={isSelf}
        editing={editing}
        handleEditProfile={handleEditProfile}
        handleConfirmEdit={handleUpdateProfile}
        handleCancelEdit={handleCancelEdit}
        addFriend={addFriend}
        deleteFriendRequest={deleteFriendRequest}
      />
      {editing ? (
        // 如果在編輯模式下
        <>
          <div className={styles.profileContent}>
            <div className={styles.profileContentTitle}>自我介紹</div>
            <textarea
              className={styles.profileContentText}
              value={editedIntroduction}
              onChange={(e) => setEditedIntroduction(e.target.value)}
              style={{ resize: 'none' }}
            />
          </div>
          <div className={styles.profileContent}>
            <div className={styles.profileContentTitle}>興趣</div>
            <textarea
              className={styles.profileContentTag}
              value={editedTags}
              onChange={(e) => setEditedTags(e.target.value)}
              style={{ resize: 'none' }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '70%',
              gap: '8%',
              marginTop: '8%'
            }}
          >
            <button
              className={styles.profileButton}
              onClick={handleUpdateProfile}
            >
              確認
            </button>
            <button
              className={styles.profileButton}
              style={{ background: '#D3D3D3' }}
              onClick={handleCancelEdit}
            >
              取消
            </button>
          </div>
        </>
      ) : (
        // 如果不在編輯模式下，顯示用戶的自我介紹和興趣
        <>
          <div className={styles.profileContent}>
            <div className={styles.profileContentTitle}>自我介紹</div>
            <div className={styles.profileContentText}>
              {userState.introduction}
            </div>
          </div>
          <div className={styles.profileContent}>
            <div className={styles.profileContentTitle}>興趣</div>
            <div className={styles.profileContentTag}>
              {tagList.map((tag, index) => (
                <div
                  key={index}
                  className={styles.tag}
                  ref={(el) => {
                    tagRefs.current[index] = el
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
