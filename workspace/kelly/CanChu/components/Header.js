import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import styles from './Header.module.scss'
import { useRouter } from 'next/router'
import Link from 'next/link'
import fetchUserProfile from '../api/fetchUserProfile'

const apiUrl = process.env.API_DOMAIN

export default function Header() {
  const router = useRouter()
  // header的個人選單
  const [isNameHovered, setIsNameHovered] = useState(false)
  const [showProfileOptions, setShowProfileOptions] = useState(false)
  const [userState, setUserState] = useState([]) // 初始為空陣列

  //獲得用戶資料
  const userId = Cookies.get('userId')
  useEffect(() => {
    fetchUserProfile(userId, setUserState)
  }, [userId])

  const [userDataLoaded, setUserDataLoaded] = useState(false) //用於標記是否已獲取用戶資料
  const [userPicture, setUserPicture] = useState('')
  // 獲得資料之後再判斷圖片網址
  useEffect(() => {
    if (userState.picture) {
      const img = new Image()
      img.onload = function imgOnLoad() {
        // 當圖片載入成功時，將其設置為使用者的頭像
        console.log('網址有效')
        setUserPicture(userState.picture)
        setUserDataLoaded(true) // 標記已經獲取用戶資料
      }
      img.onerror = function imgOnError() {
        console.log('網址無效')
        // 當圖片載入失敗時，將使用者頭像設置為默認的 '/個人照片.png'
        setUserPicture('/個人照片.png')
        setUserDataLoaded(true) // 標記已經獲取用戶資料
      }

      // 設置圖片 URL 並開始載入
      img.src = userState.picture
    }
  }, [userState.picture])

  const id = userState.id

  const handleProfileMouseEnter = () => {
    setShowProfileOptions(true)
  }

  const handleProfileMouseLeave = () => {
    setShowProfileOptions(false)
  }
  const handlePhotoMouseEnter = () => {
    setIsNameHovered(true)
  }
  const handlePhotoMouseLeave = () => {
    setIsNameHovered(false)
  }
  const handleLogout = () => {
    // 登出，清除用户token
    Cookies.remove('accessToken')

    // 重新回去登入頁面
    router.push('/login')
  }

  // useEffect(() => {
  //   const isUserPictureUpload = async () => {
  //     try {
  //       const accessToken = Cookies.get('accessToken')

  //       const response = await fetch(`${userState.picture}`, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${accessToken}`
  //         }
  //       })

  //       if (response.ok) {
  //         setUserPicture(userState.picture)
  //       } else {
  //         setUserPicture('/個人照片.png')
  //         console.error('獲取用戶信息時出錯')
  //       }
  //     } catch (error) {
  //       console.error('網絡請求錯誤', error)
  //     }
  //   }
  //   isUserPictureUpload()
  // }, [userState.picture])
  return (
    <div className={styles.header}>
      <style global jsx>{`
        header {
          width: 100%;
          height: 100px;
          flex-shrink: 0;
          background: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: row;
        }
      `}</style>
      <Link
        href='/'
        prefetch
        style={{ textDecorationLine: 'none', color: '#000' }}
      >
        <div className={styles.logo}>CanChu</div>
      </Link>
      <div className={styles.search}>
        <img style={{ marginRight: '10px' }} src='/search.png' />
        搜尋
      </div>
      <div
        className={styles.profile}
        onMouseEnter={handleProfileMouseEnter}
        onMouseLeave={handleProfileMouseLeave}
      >
        <img className={styles.person} src={userPicture} alt='photo' />
        {showProfileOptions && (
          <div className={styles.profileOptions}>
            <Link
              href='/users/[id]'
              as={`/users/${id}`}
              prefetch
              style={{ textDecorationLine: 'none', color: '#000' }}
            >
              <div
                className={`${styles.profileOption} ${styles.profileName}`}
                onMouseEnter={handlePhotoMouseEnter}
                onMouseLeave={handlePhotoMouseLeave}
              >
                <img
                  className={styles.profileOptionPhoto}
                  style={{ borderRadius: '50%' }}
                  src={userPicture}
                />
                {userState.name}
              </div>
            </Link>
            <div
              style={{
                width: '90%',
                height: '1px',
                background: '#D1CACE',
                margin: '0px 10px'
              }}
            ></div>
            <Link
              href='/users/[id]'
              as={`/users/${id}`}
              prefetch
              style={{ textDecorationLine: 'none', color: '#000' }}
            >
              <div className={styles.profileOption}>查看個人檔案</div>
            </Link>

            <div
              style={{
                width: '90%',
                height: '1px',
                background: '#D1CACE',
                margin: '0px 10px'
              }}
            ></div>
            <div
              className={`${styles.profileOption} ${styles.profileLogOut}`}
              onClick={handleLogout}
            >
              登出
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
