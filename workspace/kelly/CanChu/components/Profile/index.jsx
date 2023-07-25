import React, { useRef, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import styles from './Profile.module.scss'
import { useRouter } from 'next/router'
import useAddFriend from '@/hook/useAddFriend'
import useDeleteAddFriend from '@/hook/useDeleteAddFriend'
const apiUrl = process.env.API_DOMAIN

export default function Profile() {
  const [editing, setEditing] = useState(false)
  const [userState, setUserState] = useState({}) // 初始為空陣列
  const [editedIntroduction, setEditedIntroduction] = useState('')
  const [editedTags, setEditedTags] = useState('')
  const tagRefs = useRef([])
  //獲得用戶資料
  const userId = Cookies.get('userId')
  const router = useRouter()
  const { id } = router.query
  // 獲取當前用戶是否為自己的個人頁面
  const isSelf = userId === id
  if (!isSelf) {
    Cookies.set('otherUserId', id)
  } else {
    Cookies.remove('otherUserId')
  }
  const { addFriend } = useAddFriend()
  const [setFriendRequestSent] = useState(false)
  const { deleteFriendRequest } = useDeleteAddFriend()
  const [setFriendRequestDeleted] = useState(false)

  const [isFriendSent, setIsFriendSent] = useState(false)
  useEffect(() => {
    // Read friend request status from localStorage (if available)
    const storedFriendRequestStatus = window.localStorage.getItem(
      'friendRequestStatus'
    )
    if (storedFriendRequestStatus !== null) {
      setFriendRequestSent(storedFriendRequestStatus === 'true')
      setFriendRequestDeleted(storedFriendRequestStatus === 'false')
    }
  }, [])
  const otherUserId = Cookies.get('otherUserId')
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accessToken = Cookies.get('accessToken')

        if (!accessToken) {
          console.error('未找到accessToken')
          return
        }

        const response = await fetch(`${apiUrl}/users/${id}/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          const userProfile = data?.data?.user || {}
          setUserState(userProfile) // 設置用戶資料到 userState 中

          // 確保 tags 被正確設置後再進行 split
          if (userProfile.tags) {
            const tagList = userProfile.tags.split(',')
            setEditedTags(tagList.join(','))
            // 在獲取用戶資料後再設置 editedIntroduction 和 editedTags
            setEditedIntroduction(userProfile.introduction || '')
            setEditedTags(userProfile.tags || '')
          }
        } else {
          console.error('獲取用戶信息時出錯')
        }
      } catch (error) {
        console.error('網絡請求錯誤', error)
      }
    }

    fetchUserProfile()
  }, [userState.id, id]) // 當 user.id 發生變化時，重新獲取用戶資料

  useEffect(() => {
    // 確保 editedTags 有值後再進行 split
    if (editedTags) {
      const tagList = editedTags.split(',')
      // 使用 setEditedTags 更新 state 中的 tagList
      setEditedTags(tagList.join(','))
    }
  }, [editedTags])

  //編輯個人資料
  const handleEditProfile = () => {
    setEditing(true)
  }
  //取消編輯
  const handleCancelEdit = () => {
    setEditing(false)
  }

  const updateUser = (updatedUser) => {
    const updatedUserData = [updatedUser]
    setUserState(updatedUserData)
  }
  //確認編輯完成
  const handleConfirmEdit = async () => {
    try {
      const accessToken = Cookies.get('accessToken')
      if (!accessToken) {
        console.error('未找到accessToken')
        return
      }

      // 發送 PUT 請求來更改用戶信息
      const response = await fetch(`${apiUrl}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          name: userState.name, // 這裡的 userState.name 是用戶名稱，也可以修改成從表單獲取的新值
          introduction: editedIntroduction,
          tags: editedTags
        })
      })

      if (response.ok) {
        // 更新用戶的自我介紹和興趣
        const updatedUser = {
          ...userState,
          introduction: editedIntroduction,
          tags: editedTags.split(',')
        }
        updateUser(updatedUser)
        setEditing(false) // 退出編輯模式
        alert('個人檔案更新完成')
      } else {
        alert('更新個人檔案失敗')
      }
      setEditing(false) // 確認後退出編輯模式
    } catch (error) {
      console.error('網絡請求錯誤', error)
    }
  }

  const tagList = userState.tags ? userState.tags.split(',') : []

  useEffect(() => {
    // 檢查目前顯示用戶是否已發送好友邀請
    const checkFriendStatus = () => {
      if (userState.friendship?.status === 'requested') {
        setIsFriendSent(true)
      } else {
        setIsFriendSent(false)
      }
    }

    checkFriendStatus()
  }, [userState.friendship])

  //按鈕功能切換
  const handleButtonClick = async () => {
    try {
      if (!isFriendSent) {
        // 目前還沒有發送好友邀請，按鈕文字是「邀請成為好友」，功能變成「邀請成為好友」
        await addFriend(otherUserId)
        setIsFriendSent(true)
      } else {
        // 已經發送好友邀請，則按鈕文字變成「刪除好友邀請」，功能變成「刪除好友邀請」
        await deleteFriendRequest(userState.friendship?.id)
        setIsFriendSent(false)
      }
    } catch (error) {
      console.error('發生錯誤', error)
    }
  }
  //按鈕的文字切換
  const getButtonLabel = () => {
    if (isSelf) {
      return '編輯個人檔案'
    } else if (isFriendSent) {
      return '刪除好友邀請'
    } else {
      return '邀請成為好友'
    }
  }
  return (
    <div className={styles.profileSquare}>
      {editing ? (
        // 如果在編輯模式下
        <>
          <button
            className={styles.profileButton}
            style={{ background: '#D3D3D3' }}
          >
            編輯個人檔案
          </button>

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
              onClick={handleConfirmEdit}
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
          <button
            className={styles.profileButton}
            onClick={
              isSelf ? handleEditProfile : handleButtonClick // 如果是自己，則執行 handleEditProfile 函數；否則執行 handleButtonClick 函數
            }
          >
            {getButtonLabel()}
          </button>

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
