import React, { useState, useEffect } from 'react'
import styles from './Header.module.scss'
import Link from 'next/link'
import SearchUser from './SearchUser'
import Menu from './Menu'
import Notification from './Notification'

export default function Header() {
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

      <Link href='/' prefetch>
        <div className={styles.logo}>CanChu</div>
      </Link>
      <SearchUser isMobileView={isMobileView} />
      {!isMobileView && (
        <>
          <Notification isMobileView={isMobileView} />
          <Menu />
        </>
      )}
    </div>
  )
}
