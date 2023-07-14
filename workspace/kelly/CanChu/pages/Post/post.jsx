import styles from './Post.module.scss'
import React, { useState } from 'react'
import getTimeDiff from '../components/getTimeDiff'
import userData from '../user/components/userData'
import Link from 'next/link'

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
  data,
  showComments = true,
  showImage = true,
  showEditIcon = true
}) {
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
              <img className={styles.circle} src={picture} />
              <div className={styles.text}>
                <div className={styles.textOne}>{name}</div>
                <Link href='/posts/demo' style={{ textDecoration: 'none' }}>
                  <div className={styles.textTwo}>
                    {getTimeDiff(new Date(created_at))}
                  </div>
                </Link>
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
            <Link href='/posts/demo' style={{ textDecoration: 'none' }}>
              <img className={styles.commentIcon} src='/comment.png' />
            </Link>
          </div>
          <div className={`${styles.fourRow} ${styles.row}`}>
            <Link
              href='/posts/demo'
              style={{ textDecoration: 'none', color: '#5C5C5C' }}
            >
              <div>{formattedLikeCount}人喜歡這則貼文</div>
            </Link>
            <Link
              href='/posts/demo'
              style={{ textDecoration: 'none', color: '#5C5C5C' }}
            >
              <div>{formattedCommentCount}則留言</div>
            </Link>
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
          <Link href='/posts/demo' style={{ textDecoration: 'none' }}>
            <div className={`${styles.fiveRow} ${styles.row}`}>
              <img className={styles.person} src={user.picture} alt='photo' />
              <div className={styles.selfComment}>
                <div>留個言吧</div>
                {showImage && <img src='/postButton.png' />}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
