import React from 'react'
import styles from './Header.module.scss'
import Link from 'next/link'
import SearchUser from './searchUser'
import Menu from './Menu'

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
      <Menu />
    </div>
  )
}
