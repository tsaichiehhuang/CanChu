import React, { useState } from 'react'
import styles from '../Post/Post.module.scss'
import userData from '../user/components/userData'
export default function Header() {
  const user = userData()[0]
  //header的個人選單
  const [isNameHovered, setIsNameHovered] = useState(false)
  const [showProfileOptions, setShowProfileOptions] = useState(false)
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
  return (
    <div className={styles.header}>
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
        <img className={styles.person} src={user.picture} alt='photo' />
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
                src={user.picture}
                // src={isNameHovered ? '/hover個人照片.png' : '/個人照片.png'}
              />
              {user.name}
            </div>
            <div
              style={{
                width: '90%',
                height: '1px',
                background: '#D1CACE',
                margin: '0px 10px'
              }}
            ></div>
            <div className={styles.profileOption}>查看個人檔案</div>
            <div
              style={{
                width: '90%',
                height: '1px',
                background: '#D1CACE',
                margin: '0px 10px'
              }}
            ></div>
            <div className={`${styles.profileOption} ${styles.profileLogOut}`}>
              登出
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
