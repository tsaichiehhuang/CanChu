/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import styles from './Header.module.scss'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useFetchUserProfile from '../../hook/userFetchUserProfile'
import IsPictureUrlOk from '../IsPictureUrlOk'

const apiUrl = process.env.API_DOMAIN

export default function Header() {
  const router = useRouter()
  // header的個人選單
  const [isNameHovered, setIsNameHovered] = useState(false)
  const [showProfileOptions, setShowProfileOptions] = useState(false)
  //獲得用戶資料
  const userId = Cookies.get('userId')
  const userState = useFetchUserProfile(userId)

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

  // 用於呼叫搜尋 API 並處理回傳的結果
  const fetchUserSearchResultsAPI = async (keywords) => {
    try {
      const accessToken = Cookies.get('accessToken')
      const res = await fetch(`${apiUrl}/users/search?keyword=${keywords}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const data = await res.json()
      return data.data.users
    } catch (error) {
      console.error('Error fetching search results:', error)
      return []
    }
  }
  const [searchResults, setSearchResults] = useState([]) //保存搜尋結果
  const [keywords, setKeywords] = useState([])
  const handleSearchInputChange = async (event) => {
    const keyword = event.target.value
    setKeywords(keyword)

    if (keyword.trim() !== '') {
      const results = await fetchUserSearchResultsAPI(keyword)
      setSearchResults(results)
    } else {
      // 如果關鍵字為空，清空搜尋結果

      setSearchResults([])
    }
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
            className={styles.inputSearch}
            placeholder='搜尋'
            value={keywords}
            onChange={handleSearchInputChange}
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
