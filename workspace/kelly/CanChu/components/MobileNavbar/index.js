import React, { useState, useEffect } from 'react'
import styles from './MobileNavbar.module.scss'
import Menu from '@/components/Header/Menu'
import Notification from '@/components/Header/Notification'

export default function MobileNavbar({ setShowFriendList, showFriendList }) {
  const [isMobileView, setIsMobileView] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768)
    }

    handleResize() // 初始化
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  return (
    <>
      <div className={styles.mobileNavbar}>
        <div
          onClick={() => setShowFriendList(!showFriendList)}
          className={styles.mobileFriendListButton}
        >
          <img src='/friendsPopUp.png' />
        </div>
        <Notification isMobileView={isMobileView} />
        <Menu isMobileView={isMobileView} />
      </div>
    </>
  )
}
