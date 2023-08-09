import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import styles from './Header.module.scss'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useFetchUserProfile from '@/hook/useFetchUserProfile'
import IsPictureUrlOk from '../IsPictureUrlOk'

export default function Menu({ isMobileView }) {
  const router = useRouter()
  const userId = Cookies.get('userId')
  const userState = useFetchUserProfile(userId)
  const [isNameHovered, setIsNameHovered] = useState(false)
  const [showProfileOptions, setShowProfileOptions] = useState(false)
  const id = userState.userState.id
  const handleMobileProfileShow = () => {
    setShowProfileOptions(!showProfileOptions)
  }

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
    router.replace('/login')
  }

  return (
    <div
      className={styles.profile}
      onMouseEnter={handleProfileMouseEnter}
      onMouseLeave={handleProfileMouseLeave}
      onClick={handleMobileProfileShow}
    >
      <IsPictureUrlOk
        className={styles.person}
        userState={userState.userState}
      />
      <div
        className={`${
          showProfileOptions && isMobileView ? styles.overlay : ''
        }`}
      >
        {showProfileOptions && (
          <div
            className={`${
              isMobileView ? styles.profileOptionsPopUp : styles.profileOptions
            }`}
          >
            {isMobileView && (
              <button
                className={styles.cancelButton}
                onClick={handleMobileProfileShow}
              >
                X
              </button>
            )}
            <Link
              href='/users/[id]'
              as={`/users/${id}`}
              prefetch
              style={{ textDecorationLine: 'none', color: '#000' }}
            >
              <div
                className={`${styles.profileOption} ${styles.profileFirst}`}
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
              className={`${styles.profileOption} ${styles.profileLast}`}
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
