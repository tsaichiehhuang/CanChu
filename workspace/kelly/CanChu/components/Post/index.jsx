import styles from './Post.module.scss'
import React, { useState } from 'react'
import getTimeDiff from '../getTimeDiff'
import Cookies from 'js-cookie'
import useLike from '@/hook/Post/useLike'
import Comment from './Comment'
import useEditPost from '@/hook/Post/useEditPost'
import useComment from '@/hook/Post/useComment'
import PostContent from './PostContent'

export default function Post({
  userState,
  data,
  showComments = true,
  showImage = true,
  showEditIcon = true,
  enableClick = true
}) {
  const { liked, likeCount, handleHeartClick } = useLike(data)
  const {
    content: editedContent,
    setContent: setEditedContent,
    editing,
    handleEditClick,
    handleCancelEdit,
    handleConfirmEdit
  } = useEditPost(data)
  const { leaveComment, setLeaveComment, handleLeaveComment } = useComment(
    data.id
  )

  const userId = Cookies.get('userId')
  const handlePostClick = () => {
    Cookies.set('postId', data.id) // 將使用者 ID 儲存在 Cookie 中
    // 導航至該 post 頁面，使用 `Link` 元件
    window.location.href = `/posts/${data.id}`
  }
  const handleUserClick = () => {
    window.location.href = `/users/${data.user_id}`
  }
  const isCurrentUserPostOwner = +userId === data.user_id

  const postClassName = showComments ? styles.singlePost : styles.post

  const { picture, name, created_at, comment_count, comments } = data
  const formattedPicture = picture !== '' ? picture : '/個人照片.png'
  const formattedCommentCount = comment_count || 0
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
          {showEditIcon && !editing && isCurrentUserPostOwner && (
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
          <PostContent
            data={data}
            editing={editing}
            editedContent={editedContent}
            setEditedContent={setEditedContent}
            handleConfirmEdit={handleConfirmEdit}
            handleCancelEdit={handleCancelEdit}
          />

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
