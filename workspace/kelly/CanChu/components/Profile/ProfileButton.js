import React, { useEffect, useState } from 'react'
import styles from './Profile.module.scss'
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'

export default function ProfileButton({
  userState,
  isSelf,
  editing,
  handleEditProfile,
  addFriend,
  deleteFriendRequest
}) {
  const [isFriend, setIsFriend] = useState(false)
  const [isFriendSent, setIsFriendSent] = useState(false)
  const otherUserId = Cookies.get('otherUserId')
  useEffect(() => {
    // 檢查目前顯示用戶是否是好友或已發送好友邀請
    const checkFriendStatus = () => {
      if (userState.friendship?.status === 'friend') {
        setIsFriend(true)
      } else {
        setIsFriend(false)
      }
      if (userState.friendship?.status === 'requested') {
        setIsFriendSent(true)
      } else {
        setIsFriendSent(false)
      }
    }

    checkFriendStatus()
  }, [userState.friendship])
  const handleButtonClick = async () => {
    try {
      if (isFriend) {
        // 如果是好友，則按鈕文字變成「刪除好友」，功能變成「刪除好友」
        const result = await Swal.fire({
          title: '確定要刪除好友嗎？',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: '確定',
          cancelButtonText: '取消'
        })
        if (result.isConfirmed) {
          await deleteFriendRequest(userState.friendship.id)
          setIsFriend(false)
        }
      } else if (!isFriendSent) {
        // 如果不是好友、還沒有發送好友邀請，則按鈕文字變成「邀請成為好友」，功能變成「邀請成為好友」
        await addFriend(otherUserId)
        setIsFriendSent(false)
        Swal.fire({
          icon: 'success',
          title: '已送出好友邀請',
          showConfirmButton: false,
          timer: 1500
        })
      } else {
        // 如果不是好友、已經發送好友邀請，則按鈕文字變成「刪除好友邀請」，功能變成「刪除好友邀請」
        await deleteFriendRequest(userState.friendship.id)
      }
    } catch (error) {
      console.error('發生錯誤', error)
    }
  }

  const getButtonLabel = () => {
    if (isSelf) {
      return '編輯個人檔案'
    } else if (isFriend) {
      return '刪除好友'
    } else if (isFriendSent) {
      return '刪除好友邀請'
    } else {
      return '邀請成為好友'
    }
  }
  return (
    <>
      {editing ? (
        <button
          className={styles.profileButton}
          style={{ background: '#D3D3D3' }}
          onClick={handleEditProfile}
        >
          編輯個人檔案
        </button>
      ) : (
        <button
          className={styles.profileButton}
          onClick={isSelf ? handleEditProfile : handleButtonClick}
        >
          {getButtonLabel()}
        </button>
      )}
      {editing && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '70%',
            gap: '8%',
            marginTop: '8%'
          }}
        ></div>
      )}
    </>
  )
}
