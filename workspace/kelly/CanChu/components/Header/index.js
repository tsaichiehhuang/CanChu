/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useRef } from 'react'
import Cookies from 'js-cookie'
import styles from './Header.module.scss'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useFetchUserProfile from '@/hook/userFetchUserProfile'
import useSearchUsers from '@/hook/useSearchUsers'
import IsPictureUrlOk from '../IsPictureUrlOk'

export default function Header() {
  const router = useRouter()
  // header的個人選單
  const [isNameHovered, setIsNameHovered] = useState(false)
  const [showProfileOptions, setShowProfileOptions] = useState(false)
  //獲得用戶資料
  const userId = Cookies.get('userId')
  const userState = useFetchUserProfile(userId)
  const { searchUsers } = useSearchUsers()

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

  const [searchResults, setSearchResults] = useState([])
  const [isFocus, setIsFocus] = useState(false) //判斷是否點選input
  const inputRef = useRef(null)
  //如果滑鼠點了input框外，則搜尋取消
  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      // 點擊的目標不在 input 元素範圍內，則關閉搜尋結果並清空 input 的值
      setIsFocus(false)
      setSearchResults([])
      inputRef.current.value = ''
    }
  }
  useEffect(() => {
    // window與document差異：前者是瀏覽器窗口的全局對象，後者代表載入網頁的文件，用於操作網頁內容的對象
    // 在組件首次渲染時，添加點擊事件監聽器
    document.addEventListener('click', handleClickOutside)
    // 返回一個清理函數，在組件卸載時移除點擊事件監聽器，避免內存洩漏
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const handleSearchInputChange = async (keyword) => {
    if (isFocus) {
      if (keyword !== '') {
        const results = await searchUsers(keyword)
        setSearchResults(results)
      } else {
        setSearchResults([])
      }
    }
  }

  function debounce(keyword, delay) {
    let timer = null
    clearTimeout(timer)
    timer = setTimeout(() => handleSearchInputChange(keyword), delay)
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

      <Link
        href='/'
        prefetch
        style={{ textDecorationLine: 'none', color: '#000' }}
      >
        <div className={styles.logo}>CanChu</div>
      </Link>
      <div className={styles.searchContainer}>
        <div className={styles.search}>
          <img style={{ marginRight: '8px' }} src='/search.png' />
          <input
            ref={inputRef}
            className={styles.inputSearch}
            placeholder='搜尋'
            onChange={(e) => debounce(e.target.value, 500)}
            onFocus={() => setIsFocus(true)}
          />
        </div>

        {searchResults.length > 0 && (
          <div className={styles.searchResults}>
            <ul>
              {searchResults.map((user, index) => (
                // eslint-disable-next-line react/jsx-key
                <Link href='/users/[user.id]' as={`/users/${user.id}`} prefetch>
                  <li
                    key={user.id}
                    className={
                      searchResults.length === 1 // 判斷是否只有一個搜尋結果
                        ? `${styles.searchResultsList} ${styles.singleResult}` // 只有一個結果時的 className
                        : index === 0
                        ? `${styles.searchResultsList} ${styles.firstItem}`
                        : index === searchResults.length - 1
                        ? `${styles.searchResultsList} ${styles.lastItem}`
                        : styles.searchResultsList
                    }
                  >
                    <IsPictureUrlOk
                      className={styles.profileOptionPhoto}
                      userState={user}
                    />
                    {user.name}
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        )}
      </div>
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
    </div>
  )
}
