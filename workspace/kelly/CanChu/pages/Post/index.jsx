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
  // 目前postData有很多資料，我要取得個別post的id，並且當我點擊該post時，會前往該post id所在的頁面
  // 例如
  // {
  //   "data": {
  //     "posts": [
  //       {
  //         "user_id": 151,
  //         "name": "黃采婕",
  //         "picture": "https://kelly-canchu-api.octave.vip/assets/151/95905dca.jpeg",
  //         "id": 137,
  //         "context": "20230717 22:30",
  //         "created_at": "2023-07-17 22:31:01",
  //         "like_count": 0,
  //         "comment_count": 0,
  //         "is_like": 0
  //       },
  //       {
  //         "user_id": 151,
  //         "name": "黃采婕",
  //         "picture": "https://kelly-canchu-api.octave.vip/assets/151/95905dca.jpeg",
  //         "id": 135,
  //         "context": "20230716 22:39",
  //         "created_at": "2023-07-16 22:39:24",
  //         "like_count": 0,
  //         "comment_count": 0,
  //         "is_like": 0
  //       }
  //     ]
  //   }
  // }
  const handlePostClick = () => {
    Cookies.set('postId', data.id) // 將使用者 ID 儲存在 Cookie 中
    // 導航至該 post 頁面，使用 `Link` 元件
    window.location.href = `/posts/${data.id}`
  }
  const user = userData()[0]

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

                <div className={styles.textTwo} onClick={handlePostClick}>
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
            />
          </div>
          <div className={`${styles.fourRow} ${styles.row}`}>
            <div onClick={handlePostClick}>
              {formattedLikeCount}人喜歡這則貼文
            </div>

            <div onClick={handlePostClick}>{formattedCommentCount}則留言</div>
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
          >
            <img className={styles.person} src={picture} alt='photo' />
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
