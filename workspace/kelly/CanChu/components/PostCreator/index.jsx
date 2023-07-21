import React, { useState, useEffect } from 'react'
import styles from './PostCreator.module.scss'
import Cookies from 'js-cookie'
import useFetchUserProfile from '@/hook/userFetchUserProfile'
import IsPictureUrlOk from '../IsPictureUrlOk'
const apiUrl = process.env.API_DOMAIN

export default function PostCreator() {
  const [postContent, setPostContent] = useState('')
  const [postData, setPostData] = useState([]) // 改為空數組作為初始值

  //獲得用戶資料
  const userId = Cookies.get('userId')
  const userState = useFetchUserProfile(userId)

  const handlePostSubmit = async () => {
    // 檢查字段值是否存在且不為空
    if (!postContent) {
      alert('請輸入內容')
      return
    }

    // 構造請求體
    const requestBody = {
      context: postContent
    }

    const accessToken = Cookies.get('accessToken')

    if (!accessToken) {
      console.error('未找到accessToken')
      return
    }

    try {
      // 發送 POST 請求到 API
      const response = await fetch(`${apiUrl}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(requestBody)
      })

      if (response.ok) {
        window.location.reload() // 自動重新整理頁面
        alert('貼文發布成功')

        setPostContent('') // 發布後清空輸入框內容
      } else {
        throw new Error('發布貼文失敗')
      }
    } catch (error) {
      console.error('網絡請求錯誤', error)
    }
  }

  return (
    <div className={styles.posting}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <IsPictureUrlOk
          className={styles.postingPhoto}
          userState={userState.userState}
        />
        <textarea
          className={styles.postingText}
          placeholder='說點什麼嗎？'
          style={{ resize: 'none' }}
          value={postContent}
          onChange={(event) => setPostContent(event.target.value)}
        ></textarea>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'flex-end'
        }}
      >
        <button className={styles.postingButton} onClick={handlePostSubmit}>
          發布貼文
        </button>
      </div>
    </div>
  )
}
