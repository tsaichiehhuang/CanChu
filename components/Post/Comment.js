import styles from './Post.module.scss'
import React from 'react'
import getTimeDiff from '../getTimeDiff'
import IsPictureUrlOk from '@/components/IsPictureUrlOk'

export default function Comment({ comment }) {
  const createdAt = new Date(comment.created_at)

  return (
    <div className={styles.commentContainer}>
      <IsPictureUrlOk
        className={styles.commentUserImage}
        userState={comment.user}
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
