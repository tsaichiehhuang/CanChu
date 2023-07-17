import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import styles from './Header.module.scss'
import userData from '../pages/user/userData'
import { useRouter } from 'next/router'
import Link from 'next/Link'

const apiUrl = process.env.API_DOMAIN

export default function Header() {
  const router = useRouter()
  const user = userData()[0]
  // header的個人選單
  const [isNameHovered, setIsNameHovered] = useState(false)
  const [showProfileOptions, setShowProfileOptions] = useState(false)
  const [userState, setUserState] = useState({}) // 初始為空陣列

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
        } else {
          console.error('獲取用戶信息時出錯')
        }
      } catch (error) {
        console.error('網絡請求錯誤', error)
      }
    }

    fetchUserProfile()
  }, [userState.id]) // 當 user.id 發生變化時，重新獲取用戶資料

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
      <div className={styles.logo}>CanChu</div>
      <div className={styles.search}>
        <img style={{ marginRight: '10px' }} src='/search.png' />
        搜尋
      </div>
      <div
        className={styles.profile}
        onMouseEnter={handleProfileMouseEnter}
        onMouseLeave={handleProfileMouseLeave}
      >
        <img className={styles.person} src={userState.picture} alt='photo' />
        {showProfileOptions && (
          <div className={styles.profileOptions}>
            <div
              className={`${styles.profileOption} ${styles.profileName}`}
              onMouseEnter={handlePhotoMouseEnter}
              onMouseLeave={handlePhotoMouseLeave}
            >
              <img
                className={styles.profileOptionPhoto}
                style={{ borderRadius: '50%' }}
                src={userState.picture}
              />
              {userState.name}
            </div>
            <div
              style={{
                width: '90%',
                height: '1px',
                background: '#D1CACE',
                margin: '0px 10px'
              }}
            ></div>
            <Link
              href='/user/demo'
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
