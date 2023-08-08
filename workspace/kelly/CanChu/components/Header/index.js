import React from 'react'
import styles from './Header.module.scss'
import Link from 'next/link'
import SearchUser from './SearchUser'
import Menu from './Menu'
import Notification from './Notification'

export default function Header() {
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
      <SearchUser />
      <Notification />
      <Menu />
    </div>
  )
}
