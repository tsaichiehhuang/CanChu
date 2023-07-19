import styles from './Post.module.scss'
import React, { useState, useEffect } from 'react'
import getTimeDiff from '../../components/getTimeDiff'
import userData from '../../data/userData'
import Link from 'next/link'
import Cookies from 'js-cookie'
import fetchPostsData from '../../api/fetchPostsData'

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
const id = Cookies.get('userId')

export default function Post({
  data,
  showComments = true,
  showImage = true,
  showEditIcon = true
}) {
  const [postData, setPostData] = useState([]) // 改為空數組作為初始值
  //取得文章的id
  //找尋貼文
  useEffect(() => {
    fetchPostsData(setPostData)
  }, [])

  const handlePostClick = () => {
    Cookies.set('postId', data.id) // 將使用者 ID 儲存在 Cookie 中
    // 導航至該 post 頁面，使用 `Link` 元件
    window.location.href = `/posts/${data.id}`
  }
  const heartIcon = data.is_like ? '/heart.png' : '/notHeart.png'
  const postClassName = showComments ? styles.singlePost : styles.post
  const {
    picture,
    name,
    created_at,
    context,
    like_count,
    comment_count,
    comments
  } = data
  const formattedPicture = picture !== '' ? picture : '/個人照片.png'
  const formattedLikeCount = like_count !== undefined ? like_count : 0
  const formattedCommentCount = comment_count !== undefined ? comment_count : 0
  const [userPicture, setUserPicture] = useState('')
  //判斷圖片有沒有上傳過(網址是否正確)

  useEffect(() => {
    const isUserPictureUpload = async () => {
      try {
        const accessToken = Cookies.get('accessToken') // 獲取存儲在 cookies 的訪問令牌

        const response = await fetch(`${picture}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        })

        if (response.ok) {
          setUserPicture(picture)
        } else {
          setUserPicture('/個人照片.png')
          console.error('獲取用戶信息時出錯')
        }
      } catch (error) {
        console.error('網絡請求錯誤', error)
      }
    }
    isUserPictureUpload()
  }, [picture])
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
          {showEditIcon && <img className={styles.editIcon} src='/edit.png' />}

          <div className={`${styles.firstRow} ${styles.row}`}>
            <div className={styles.firstRowLeft}>
              <img className={styles.circle} src={formattedPicture} />
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
          <article
            className={`${styles.secondRow} ${styles['multiline-text']}`}
          >
            {context}
          </article>
          <div className={`${styles.thirdRow} ${styles.row}`}>
            <img className={styles.heartIcon} src={heartIcon} />

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

          <div
            className={`${styles.fiveRow} ${styles.row}`}
            onClick={handlePostClick}
            style={{ cursor: 'pointer' }}
          >
            <img className={styles.person} src={formattedPicture} alt='photo' />
            <div className={styles.selfComment}>
              <div>留個言吧</div>
              {showImage && <img src='/postButton.png' />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
