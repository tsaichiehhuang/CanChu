import React, { useRef, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import styles from './user.module.scss'
import Header from '../../components/Header'
import Post from '../Post'
import Copyright from '../../components/Copyright'
import PostCreator from '../../components/PostCreator'
import Profile from '../../components/Profile'
import fetchUserProfile from '../../api/fetchUserProfile'

const apiUrl = process.env.API_DOMAIN

export default function User() {
  const router = useRouter()
  const { user_id } = router.query

  const [selectedPicture, setSelectedPicture] = useState(null)
  const [isLoading, setIsLoading] = useState(true) // 新增 isLoading 狀態
  const [userState, setUserState] = useState({}) // 初始為空陣列

  const [postData, setPostData] = useState([]) // 改為空數組作為初始值

  //獲得用戶資料
  const userId = Cookies.get('userId')

  useEffect(() => {
    fetchUserProfile(userId, setUserState, setIsLoading)
  }, [userState.id])

  //顯示user貼文
  const url = new URL(`${apiUrl}/posts/search`)
  url.searchParams.append('user_id', userId)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = Cookies.get('accessToken')

        if (!accessToken) {
          console.error('未找到accessToken')
          return
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setPostData(data?.data?.posts || [])
        } else {
          console.error('獲取貼文數據時出錯')
        }
      } catch (error) {
        console.error('網絡請求錯誤', error)
      }
    }

    fetchData()
  }, [])

  //上傳圖片
  const updateUser = (updatedUser) => {
    const updatedUserData = [updatedUser]
    setUserState(updatedUserData)
  }

  const uploadPicture = async (file) => {
    try {
      const accessToken = Cookies.get('accessToken')

      if (!accessToken) {
        console.error('未找到accessToken')
        return
      }

      const formData = new FormData()
      formData.append('picture', file)

      const response = await fetch(`${apiUrl}/users/picture`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        const pictureUrl = data?.data?.picture
        // 更新用戶的圖片
        const updatedUser = { ...userState, picture: pictureUrl }
        // 更新用戶數據
        updateUser(updatedUser)

        // 將新上傳的頭像 URL 存儲在 cookies
        Cookies.set('uploadedPicture', pictureUrl)
        window.location.reload() // 自動重新整理頁面
      } else {
        console.error('上傳圖片失敗')
      }
    } catch (error) {
      console.error('網絡請求錯誤', error)
    }
  }
  useEffect(() => {
    // 檢查 cookies 是否有保存的頭像 URL
    const uploadedPictureUrl = Cookies.get('uploadedPicture')
    if (uploadedPictureUrl) {
      // 更新頭像的 src 屬性為上傳的頭像 URL
      const headshotImage = document.querySelector(`.${styles.userHeadshot}`)
      if (headshotImage) {
        headshotImage.src = uploadedPictureUrl
      }
    }
  }, [])

  const handlePictureUpload = (event) => {
    const file = event.target.files[0]
    setSelectedPicture(file)
    // 調用上傳圖片的 API 函式，並將 `file` 作為參數傳遞
    uploadPicture(file)
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
      <div className={styles.allContainer}>
        <div className={styles.cover}>
          <div className={styles.coverTop}>
            <div className={styles.userHeadshotWrapper}>
              <img className={styles.userHeadshot} src={userState.picture} />
              <div className={styles.userHeadshotText}>
                編輯大頭貼
                <input
                  style={{ cursor: 'pointer', fontSize: '0' }}
                  type='file'
                  accept='image/*'
                  className={styles.userHeadshotInput}
                  onChange={handlePictureUpload}
                />
              </div>
            </div>
            <div className={styles.coverTopRight}>
              <div className={styles.userName}>{userState.name}</div>
              <div className={styles.userFriendCount}>
                {userState.friend_count}位朋友
              </div>
            </div>
          </div>
          <div
            style={{ width: '80%', height: '1px', background: '#C8C8C8' }}
          ></div>
          <div className={styles.coverFunction}>
            <div className={styles.coverFunctionText}>貼文</div>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.containerLeft}>
            <Profile />
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
                showEditIcon={true}
                key={data.id}
                data={data}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
