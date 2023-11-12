import React, { useEffect } from 'react'
import styles from './Post.module.scss'
import useComment from '@/hook/Post/useComment'
import Comment from './Comment'

export default function LeaveComment({
  handlePostClick,
  showComments,
  data,
  userState,
  enableClick,
  showImage
}) {
  const { leaveComment, setLeaveComment, handleLeaveComment } = useComment(
    data.id
  )
  useEffect(() => {
    const styleLink = document.createElement('link')
    styleLink.rel = 'stylesheet'
    styleLink.href = './Post.module.scss' // 請替換為實際的 CSS 路徑
    document.head.appendChild(styleLink)

    return () => {
      document.head.removeChild(styleLink)
    }
  }, [])
  return (
    <>
      {showComments && (
        <div className={styles.comments}>
          {data.comments &&
            Array.isArray(data.comments) &&
            data.comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
        </div>
      )}

      <div
        className={`${styles.fiveRow} ${styles.row}`}
        onClick={enableClick ? handlePostClick : undefined}
        style={enableClick ? { cursor: 'pointer' } : {}}
      >
        <img
          className={styles.person}
          src={
            userState.userState?.picture || userState.picture || '/個人照片.png'
          }
          alt='photo'
        />
        <div className={styles.selfComment}>
          {enableClick ? (
            <>
              <div>留個言吧</div>
              {showImage && <img src='/postButton.png' />}
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </>
  )
}
