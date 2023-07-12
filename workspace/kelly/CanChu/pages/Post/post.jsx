import styles from './Post.module.scss'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import getTimeDiff from '../components/getTimeDiff'

function Comment({ comment }) {
  const createdAt = new Date(comment.created_at)

  return (
    <div className={styles.commentContainer}>
      <img className={styles.commentUserImage} src={comment.user.picture} />
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

export default function Post({ data, showComments = true, showImage = true }) {
  const router = useRouter()
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

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <div className={postClassName}>
          <div className={`${styles.firstRow} ${styles.row}`}>
            <img className={styles.circle} src={picture} />
            <div className={styles.text}>
              <div className={styles.textOne}>{name}</div>
              <div
                className={styles.textTwo}
                onClick={() => router.push('/posts/demo')}
              >
                {getTimeDiff(new Date(created_at))}
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
              onClick={() => router.push('/posts/demo')}
            />
          </div>
          <div className={`${styles.fourRow} ${styles.row}`}>
            <div onClick={() => router.push('/posts/demo')}>
              {like_count}人喜歡這則貼文
            </div>
            <div onClick={() => router.push('/posts/demo')}>
              {comment_count}則留言
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
            onClick={() => router.push('/posts/demo')}
          >
            <img className={styles.person} src='/個人照片.png' alt='photo' />
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
