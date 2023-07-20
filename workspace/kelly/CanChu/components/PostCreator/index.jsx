import React, { useState, useEffect } from 'react'
import styles from './PostCreator.module.scss'
import userData from '../../data/userData'
import Cookies from 'js-cookie'

const apiUrl = process.env.API_DOMAIN

export default function PostCreator({ onPostSubmit }) {
  const user = userData()[0]
  const [postContent, setPostContent] = useState('')
  const [postData, setPostData] = useState([]) // 改為空數組作為初始值
  const [userState, setUserState] = useState({}) // 初始為空陣列

  //獲得用戶資料
  const userId = Cookies.get('userId')

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accessToken = Cookies.get('accessToken') // 獲取存儲在 cookies 的token

        if (!accessToken) {
          console.error('未找到accessToken')
          return
        }

        const response = await fetch(`${apiUrl}/users/${userId}/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          const userProfile = data?.data?.user || {}
          setUserState(userProfile) // 設置用戶資料到 userState 中
        } else {
          console.error('獲取用戶信息時出錯')
        }
      } catch (error) {
        console.error('網絡請求錯誤', error)
      }
    }

    fetchUserProfile()
  }, [userState.id]) // 當 user.id 發生變化時，重新獲取用戶資料

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

    // 獲取存儲在本地的token
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
        const responseData = await response.json()

        // 請求成功，將返回的貼文數據添加到頁面中顯示
        const newPost = {
          id: responseData.data.post.id,
          created_at: new Date().toISOString(), // 使用當下的時間
          context: postContent,
          is_like: false,
          like_count: 0,
          comment_count: 0,
          picture: user.picture,
          name: user.name
        }
        setPostData((prevData) => [newPost, ...prevData])

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
  const [userPicture, setUserPicture] = useState('')
  // //判斷圖片有沒有上傳過(網址是否正確)
  // useEffect(() => {
  //   const isUserPictureUpload = async () => {
  //     try {
  //       const accessToken = Cookies.get('accessToken') // 獲取存儲在 cookies 的訪問令牌

  //       const response = await fetch(`${userState.picture}`, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${accessToken}`
  //         }
  //       })

  //       if (response.ok) {
  //         setUserPicture(userState.picture)
  //       } else {
  //         setUserPicture('/個人照片.png')
  //         console.error('獲取用戶信息時出錯')
  //       }
  //     } catch (error) {
  //       setUserPicture('/個人照片.png')
  //       console.error('網絡請求錯誤', error)
  //     }
  //   }
  //   isUserPictureUpload()
  // }, [userState.picture])

  useEffect(() => {
    const img = new Image()
    img.onload = function imgOnLoad() {
      // 當圖片載入成功時，將其設置為使用者的頭像
      setUserPicture(userState.picture)
    }
    img.onerror = function imgOnError() {
      // 當圖片載入失敗時，將使用者頭像設置為默認的 '/個人照片.png'
      setUserPicture('/個人照片.png')
    }

    // 設置圖片 URL 並開始載入
    img.src = userState.picture
  }, [userState.picture])

  return (
    <div className={styles.posting}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <img className={styles.postingPhoto} src={userPicture} />
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
