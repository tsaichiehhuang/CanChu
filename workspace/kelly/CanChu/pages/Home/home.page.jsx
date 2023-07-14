import React, { useState, useEffect } from 'react'
import styles from './Home.module.scss'
import userData from '../user/components/userData'
import Header from '../components/Header'
import Post from '../Post/post'
import homeData from './components/HomeData'
import Copyright from '../components/Copyright'

import ProtectedPage from '../components/ProtectedPage.js'
const apiUrl = process.env.API_DOMAIN
export default function Home() {
  const user = userData()[0]
  const [postData, setPostData] = useState([]) // 改為空數組作為初始值
  const [postContent, setPostContent] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken') // 獲取存儲在本地的訪問令牌

        if (!accessToken) {
          console.error('未找到accessToken')
          return
        }

        const response = await fetch(`${apiUrl}/posts/search`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          setPostData(data?.data?.posts || [])
        } else {
          console.error('獲取貼文數據時出錯')
        }
      } catch (error) {
        console.error('網絡請求錯誤', error)
      }
    }

    fetchData()
  }, [])

  const handlePostSubmit = () => {
    // 檢查字段值是否存在且不為空
    if (!postContent) {
      console.error('請輸入內容')
      return
    }

    // 構造請求體
    const requestBody = {
      context: postContent
    }

    // 獲取存儲在本地的訪問令牌
    const accessToken = localStorage.getItem('accessToken')

    if (!accessToken) {
      console.error('未找到accessToken')
      return
    }

    // 發送 POST 請求到 API
    fetch(`${apiUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(requestBody)
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error('發布貼文失敗')
        }
      })
      .then((responseData) => {
        // 請求成功，將返回的帖子數據添加到頁面中顯示
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
        setPostContent('') // 發布後清空輸入框內容

        window.location.reload() // 自動重新整理頁面
      })
      .catch((error) => {
        console.error('網絡請求錯誤', error)
      })
  }

  const friendList = () => {
    const friends = Array(6).fill('好朋友')

    const renderFriendSection = (icon, text) => (
      <div className={styles.friendListSection}>
        {icon ? (
          <div style={{ marginLeft: '1%' }}>{icon}</div>
        ) : (
          <div className={styles.friendListIcon}></div>
        )}
        <div>{text}</div>
      </div>
    )

    return (
      <div className={styles.friendList}>
        {renderFriendSection('', '你的名字')}
        {renderFriendSection('', '好友邀請')}
        <div
          style={{ width: '90%', background: '#D9D9D9', height: '1px' }}
        ></div>
        {renderFriendSection(<img src='/friends.png' />, '我的好友')}
        <div className={styles.friendListMyFriend}>
          {friends.map((friend, index) => (
            <div className={styles.friendListSection} key={index}>
              <div className={styles.friendListIcon}></div>
              <div>{friend}</div>
            </div>
          ))}
        </div>
        {renderFriendSection(<img src='/options.png' />, '查看全部')}
      </div>
    )
  }

  return (
    <ProtectedPage>
      <div className={styles.body}>
        <style global jsx>{`
          body {
            background: #f9f9f9;
            margin: 0;
          }
        `}</style>
        <Header />
        <div className={styles.container}>
          <div className={styles.containerLeft}>
            {friendList()}
            <div style={{ width: '274px', marginLeft: '10%' }}>
              <Copyright />
            </div>
          </div>
          <div className={styles.containerRight}>
            <div className={styles.posting}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <img className={styles.postingPhoto} src={user.picture} />
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
                <button
                  className={styles.postingButton}
                  onClick={handlePostSubmit}
                >
                  發布貼文
                </button>
              </div>
            </div>
            {postData.map((data) => (
              <Post
                showComments={false}
                showImage={false}
                showEditIcon={false}
                key={data.id}
                data={data}
              />
            ))}
          </div>
        </div>
      </div>
    </ProtectedPage>
  )
}
