import React, { useState, useEffect } from 'react'
import styles from './MobileNavbar.module.scss'
import Menu from '@/components/Header/Menu'
import Notification from '@/components/Header/Notification'
import Link from 'next/link'

export default function MobileNavbar({
  isHome,
  setShowFriendList,
  showFriendList
}) {
  const [isMobileView, setIsMobileView] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 960)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  return (
    <>
      <div className={styles.mobileNavbar}>
        {isHome ? (
          <div
            onClick={() => setShowFriendList(!showFriendList)}
            className={styles.mobileFriendListButton}
          >
            <img src='/friendsPopUp.png' />
          </div>
        ) : (
          <Link href='/' style={{ color: '#5458F7', textDecoration: 'none' }}>
            <img src='/home.png' />
          </Link>
        )}

        <Notification isMobileView={isMobileView} />
        <Menu isMobileView={isMobileView} />
      </div>
    </>
  )
}
