import React, { useState } from 'react'
import styles from './PostCreator.module.scss'
import Cookies from 'js-cookie'
import useFetchUserProfile from '@/hook/useFetchUserProfile'
import IsPictureUrlOk from '../IsPictureUrlOk'
import Swal from 'sweetalert2'
const apiUrl = process.env.API_DOMAIN

export default function PostCreator() {
  const [postContent, setPostContent] = useState('')
  const userId = Cookies.get('userId')
  const userState = useFetchUserProfile(userId)

  const handlePostSubmit = async () => {
    if (!postContent) {
      Swal.fire('請輸入內容', '', 'warning')
      return
    }
    const requestBody = {
      context: postContent
    }

    const accessToken = Cookies.get('accessToken')

    if (!accessToken) {
      console.error('未找到accessToken')
      return
    }

    try {
      const response = await fetch(`${apiUrl}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(requestBody)
      })

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '貼文發布成功',
          showConfirmButton: false,
          timer: 1500
        })
        setTimeout(() => {
          window.location.reload()
        }, 1000)
        setPostContent('')
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
