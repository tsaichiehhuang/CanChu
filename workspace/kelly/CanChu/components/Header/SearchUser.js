import React, { useState, useEffect, useRef } from 'react'
import styles from './Header.module.scss'
import Link from 'next/link'
import useSearchUsers from '@/hook/Header/useSearchUsers'
import IsPictureUrlOk from '@/components/IsPictureUrlOk'

export default function SearchUser({ isMobileView }) {
  const { searchUsers } = useSearchUsers()
  const [searchResults, setSearchResults] = useState([])
  const [isFocus, setIsFocus] = useState(false)
  const [isSearchPopUp, setIsSearchPopUp] = useState(false)
  const inputRef = useRef(null)
  //如果滑鼠點了input框外，則搜尋取消

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      // 點擊的目標不在 input 元素範圍內，則關閉搜尋結果並清空 input 的值
      setIsFocus(false)
      setSearchResults([])
      setIsSearchPopUp(false)
      inputRef.current.value = ''
    }
  }
  const handleSearchPopUp = () => {
    if (isMobileView) {
      setIsSearchPopUp(true)
      document.removeEventListener('click', handleClickOutside)
    }
  }

  useEffect(() => {
    // window與document差異：前者是瀏覽器窗口的全局對象，後者代表載入網頁的文件，用於操作網頁內容的對象
    // 在組件首次渲染時，添加點擊事件監聽器

    if (!isSearchPopUp) {
      document.addEventListener('click', handleClickOutside)
    }
    setTimeout(() => {
      if (isSearchPopUp) {
        document.addEventListener('click', handleClickOutside)
      }
    }, 500)

    // 返回一個清理函數，在組件卸載時移除點擊事件監聽器，避免內存洩漏
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isSearchPopUp])

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
  console.log(isSearchPopUp)
  function debounce(keyword, delay) {
    let timer = null
    clearTimeout(timer)
    timer = setTimeout(() => handleSearchInputChange(keyword), delay)
  }
  return (
    <>
      {isMobileView && !isSearchPopUp && (
        <div>
          <img src='/SearchRwd.png' onClick={handleSearchPopUp} />
        </div>
      )}
      {(!isMobileView || isSearchPopUp) && (
        <>
          <div
            className={`${
              isSearchPopUp
                ? styles.searchContainerPopUp
                : styles.searchContainer
            }`}
          >
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
                    <Link
                      href='/users/[user.id]'
                      as={`/users/${user.id}`}
                      prefetch
                    >
                      <li
                        key={user.id}
                        className={
                          // eslint-disable-next-line no-nested-ternary
                          searchResults.length === 1 // 判斷是否只有一個搜尋結果
                            ? `${styles.searchResultsList} ${styles.singleResult}` // 只有一個結果時的 className
                            : // eslint-disable-next-line no-nested-ternary
                            index === 0
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
        </>
      )}
    </>
  )
}
