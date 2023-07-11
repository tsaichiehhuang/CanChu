import React, { useState } from 'react'
import styles from '../../Post.module.scss'
import mockData from '../MockData'
import getTimeDiff from '../../components/getTimeDiff'
import Image from 'next/image'

function Comment({ comment }) {
  const createdAt = new Date(comment.created_at)
  return (
    <div className={styles.commentContainer}>
      <Image
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

export default function Comments() {
  const comments = mockData().comments
  return (
    <div className={styles.comments}>
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  )
}
