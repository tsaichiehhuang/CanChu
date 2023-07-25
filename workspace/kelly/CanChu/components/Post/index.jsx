import styles from './Post.module.scss'
import React, { useState, useEffect } from 'react'
import getTimeDiff from '../getTimeDiff'
import Cookies from 'js-cookie'
const apiUrl = process.env.API_DOMAIN

function Comment({ comment }) {
  const createdAt = new Date(comment.created_at)

  return (
    <div className={styles.commentContainer}>
      <img
        className={styles.commentUserImage}
        src={comment.user.picture}
        alt='User'
      />
      <div className={styles.commentContent}>
        <div className={styles.commentContentSquare}>
          <div className={styles.commentUserName}>{comment.user.name}</div>
          <div className={styles.commentText}>{comment.content}</div>
        </div>
        <div className={styles.commentTime}>{getTimeDiff(createdAt)}</div>
      </div>
    </div>
  )
}

export default function Post({
  userState,
  data,
  showComments = true,
  showImage = true,
  showEditIcon = true,
  enableClick = true
}) {
  const [leaveComment, setLeaveComment] = useState('')
  const [editedContent, setEditedContent] = useState(data.context || '')
  const [editing, setEditing] = useState(false) // 編輯模式的狀態

  const handlePostClick = () => {
    Cookies.set('postId', data.id) // 將使用者 ID 儲存在 Cookie 中
    // 導航至該 post 頁面，使用 `Link` 元件
    window.location.href = `/posts/${data.id}`
  }
  const handleUserClick = () => {
    window.location.href = `/users/${data.user_id}`
  }

  // 編輯模式下的事件處理函式
  const handleEditClick = () => {
    setEditedContent(data.context || '') // 將原始貼文內容設置到編輯框
    setEditing(true)
  }

  const handleCancelEdit = () => {
    setEditing(false)
  }
  //編輯並發API
  const handleConfirmEdit = async () => {
    try {
      const accessToken = Cookies.get('accessToken')
      // 發送 PUT 請求來修改貼文內容
      const response = await fetch(`${apiUrl}/posts/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ context: editedContent })
      })

      if (response.ok) {
        setEditing(false) // 退出編輯模式
        alert('貼文更新完成')
        window.location.reload()
      } else {
        alert('更新貼文內容失敗')
      }
      setEditing(false) // 退出編輯模式
    } catch (error) {
      console.error('網絡請求錯誤', error)
    }
  }
  //發表comment
  const handleLeaveComment = async () => {
    if (!leaveComment) {
      alert('請輸入內容')
      return
    }
    // 構造請求體
    const requestBody = {
      content: leaveComment
    }

    const accessToken = Cookies.get('accessToken')
    const response = await fetch(`${apiUrl}/posts/${data.id}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(requestBody)
    })

    if (response.ok) {
      window.location.reload() // 自動重新整理頁面
    } else {
      throw new Error('留言失敗')
    }
  }

  const postClassName = showComments ? styles.singlePost : styles.post

  const {
    picture,
    name,
    created_at,
    context,
    like_count,
    is_liked,
    is_like,
    comment_count,
    comments
  } = data
  const formattedPicture = picture !== '' ? picture : '/個人照片.png'
  const formattedCommentCount = comment_count || 0
  const [liked, setLiked] = useState(data.is_liked || data.is_like || false)
  const [likeCount, setLikeCount] = useState(data.like_count || 0)

  // 新增 useEffect 用於更新愛心相關狀態
  useEffect(() => {
    setLiked(data.is_liked || data.is_like || false)
    setLikeCount(data.like_count || 0)
  }, [data])
  //當點愛心時，愛心會變色且讚的數量+1
  const handleHeartClick = async () => {
    // 在點擊愛心後立即更新前端狀態，不需等待後端 API 回應
    setLiked((prevLiked) => !prevLiked)
    setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1))
    try {
      const accessToken = Cookies.get('accessToken')
      // 如果已經點讚，則發送 DELETE 請求，否則發送 POST 請求
      const method = liked ? 'DELETE' : 'POST'
      const response = await fetch(`${apiUrl}/posts/${data.id}/like`, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        // 如果 API 請求失敗，取消更新愛心狀態
        setLiked(liked)
        console.error('更新愛心狀態時出錯')
      }
    } catch (error) {
      console.error('網絡請求錯誤', error)
    }
  }

  const formattedLikeCount = likeCount === 0 ? 0 : likeCount
  return (
    <div className={styles.body}>
      <style global jsx>{`
        body {
          background: #f9f9f9;
          margin: 0;
        }
      `}</style>
      <div className={styles.container}>
        <div className={postClassName}>
          {showEditIcon && !editing && (
            <img
              className={styles.editIcon}
              src='/edit.png'
              onClick={handleEditClick}
            />
          )}

          <div className={`${styles.firstRow} ${styles.row}`}>
            <div className={styles.firstRowLeft}>
              <img
                className={styles.circle}
                src={formattedPicture}
                onClick={handleUserClick}
                style={{ cursor: 'pointer' }}
              />
              <div className={styles.text}>
                <div className={styles.textOne}>{name}</div>

                <div
                  className={styles.textTwo}
                  onClick={handlePostClick}
                  style={{ cursor: 'pointer' }}
                >
                  {getTimeDiff(new Date(created_at))}
                </div>
              </div>
            </div>
          </div>
          {/* 顯示貼文內容或可編輯 */}
          {editing ? (
            <div className={styles.editContainer}>
              <textarea
                className={styles.editTextarea}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <div className={styles.editButtonGroup} style={{}}>
                <button
                  className={styles.editButton}
                  onClick={handleConfirmEdit}
                  style={{ background: '#5458F7' }}
                >
                  確定
                </button>
                <button
                  className={styles.editButton}
                  onClick={handleCancelEdit}
                  style={{ background: '#D3D3D3' }}
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <article
              className={`${styles.secondRow} ${styles['multiline-text']}`}
            >
              {data.context}
            </article>
          )}
          <div className={`${styles.thirdRow} ${styles.row}`}>
            {/* 愛心按讚 */}
            <img
              className={styles.heartIcon}
              src={liked ? '/heart.png' : '/notHeart.png'}
              onClick={handleHeartClick}
              style={{ cursor: 'pointer' }}
            />

            <img
              className={styles.commentIcon}
              src='/comment.png'
              onClick={handlePostClick}
              style={{ cursor: 'pointer' }}
            />
          </div>
          <div className={`${styles.fourRow} ${styles.row}`}>
            <div onClick={handlePostClick} style={{ cursor: 'pointer' }}>
              {formattedLikeCount}人喜歡這則貼文
            </div>

            <div onClick={handlePostClick} style={{ cursor: 'pointer' }}>
              {formattedCommentCount}則留言
            </div>
          </div>
          <div style={{ borderTop: '1px solid #bfbfbf', width: '100%' }}></div>
          {/* 網友留言 */}
          {showComments && (
            <div className={styles.comments}>
              {comments &&
                Array.isArray(comments) &&
                comments.map((comment) => (
                  <Comment key={comment.id} comment={comment} />
                ))}
            </div>
          )}
          {enableClick ? (
            <div
              className={`${styles.fiveRow} ${styles.row}`}
              onClick={handlePostClick}
              style={{ cursor: 'pointer' }}
            >
              <img
                className={styles.person}
                src={
                  userState.userState?.picture ||
                  userState.picture ||
                  '/個人照片.png'
                }
                alt='photo'
              />
              <div className={styles.selfComment}>
                <div>留個言吧</div>
                {showImage && <img src='/postButton.png' />}
              </div>
            </div>
          ) : (
            <div className={`${styles.fiveRow} ${styles.row}`}>
              <img
                className={styles.person}
                src={
                  userState.userState?.picture ||
                  userState.picture ||
                  '/個人照片.png'
                }
                alt='photo'
              />
              <div className={styles.selfComment}>
                <input
                  className={styles.inputComment}
                  value={leaveComment}
                  placeholder='留個言吧'
                  onChange={(event) => setLeaveComment(event.target.value)}
                />
                {showImage && (
                  <img
                    src='/postButton.png'
                    onClick={handleLeaveComment}
                    style={{ cursor: 'pointer' }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
