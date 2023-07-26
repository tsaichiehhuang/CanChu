import React, { useState } from 'react'
import Cookies from 'js-cookie'
import styles from './Header.module.scss'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useFetchUserProfile from '@/hook/userFetchUserProfile'
import IsPictureUrlOk from '../IsPictureUrlOk'

export default function Menu() {
  const router = useRouter()
  const userId = Cookies.get('userId')
  const userState = useFetchUserProfile(userId)
  const [isNameHovered, setIsNameHovered] = useState(false)
  const [showProfileOptions, setShowProfileOptions] = useState(false)
  const id = userState.userState.id

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
    // 登出，清除token
    Cookies.remove('accessToken')
    // 重新回去登入頁面
    router.push('/login')
  }

  return (
    <div
      className={styles.profile}
      onMouseEnter={handleProfileMouseEnter}
      onMouseLeave={handleProfileMouseLeave}
    >
      <IsPictureUrlOk
        className={styles.person}
        userState={userState.userState}
      />

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
              <IsPictureUrlOk
                className={styles.profileOptionPhoto}
                userState={userState.userState}
              />
              {userState.userState.name}
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
  )
}
