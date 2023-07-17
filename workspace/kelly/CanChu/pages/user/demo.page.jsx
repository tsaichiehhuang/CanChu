import React, { useRef, useEffect, useState } from 'react'
import Cookies from 'js-cookie' // 導入 js-cookie
import ProtectedPage from '../../components/ProtectedPage'
import styles from './user.module.scss'
import Header from '../../components/Header'
import Post from '../Post'
// import userData from './userData'
import Copyright from '../../components/Copyright'
import PostCreator from '../../components/PostCreator'

const apiUrl = process.env.API_DOMAIN

export default function User() {
  const [selectedPicture, setSelectedPicture] = useState(null)
  const [isLoading, setIsLoading] = useState(true) // 新增 isLoading 狀態
  const [userState, setUserState] = useState({}) // 初始為空陣列

  const tagRefs = useRef([])
  const [postData, setPostData] = useState([]) // 改為空數組作為初始值
  const [editing, setEditing] = useState(false)
  const [editedIntroduction, setEditedIntroduction] = useState(
    userState.introduction
  )
  const [editedTags, setEditedTags] = useState(userState.tag)

  //獲得用戶資料
  const userId = Cookies.get('userId')

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accessToken = Cookies.get('accessToken') // 獲取存儲在 cookies 的訪問令牌

        if (!accessToken) {
          console.error('未找到accessToken')
          return
        }

        const response = await fetch(`${apiUrl}/users/${userId}/profile`, {
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
          setIsLoading(false)
          // 確保 tags 被正確設置後再進行 split
          if (userProfile.tags) {
            const tagList = userProfile.tags.split(',')
            setEditedTags(tagList.join(','))
          }
        } else {
          console.error('獲取用戶信息時出錯')
        }
      } catch (error) {
        console.error('網絡請求錯誤', error)
      }
    }

    fetchUserProfile()
  }, [userState.id]) // 當 user.id 發生變化時，重新獲取用戶資料

  useEffect(() => {
    // 確保 editedTags 有值後再進行 split
    if (editedTags) {
      const tagList = editedTags.split(',')
      // 使用 setEditedTags 更新 state 中的 tagList
      setEditedTags(tagList.join(','))
    }
  }, [editedTags])

  //顯示貼文
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = Cookies.get('accessToken')

        if (!accessToken) {
          console.error('未找到accessToken')
          return
        }

        const response = await fetch(`${apiUrl}/posts/search`, {
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

  useEffect(() => {
    const setTagWidth = () => {
      tagRefs.current.forEach((tagRef) => {
        const { width } = window.getComputedStyle(tagRef)
        tagRef.style.width = width
      })
    }

    tagRefs.current.forEach((tagRef) => {
      const text = tagRef.textContent
      const fontSize = '16px'
      const fontFamily = 'Outfit'
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      context.font = `${fontSize} ${fontFamily}`
      const width = context.measureText(text).width + 4
      tagRef.style.width = `${width}px`
    })

    setTagWidth()
  }, [userState.tags])

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

  //編輯個人資料
  const handleEditProfile = () => {
    setEditing(true)
  }
  //取消編輯
  const handleCancelEdit = () => {
    setEditing(false)
  }
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
      } else {
        console.error('更新個人檔案失敗')
      }
      setEditing(false) // 確認後退出編輯模式
    } catch (error) {
      console.error('網絡請求錯誤', error)
    }
  }
  const tagList = userState.tags.split(',')
  const Profile = () => (
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
          <button className={styles.profileButton} onClick={handleEditProfile}>
            編輯個人檔案
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
