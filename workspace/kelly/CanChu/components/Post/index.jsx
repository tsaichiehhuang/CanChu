import styles from './Post.module.scss'
import React, { useState } from 'react'
import getTimeDiff from '../getTimeDiff'
import Cookies from 'js-cookie'
import useLike from '@/hook/Post/useLike'
import useEditPost from '@/hook/Post/useEditPost'
import PostContent from './PostContent'
import LeaveComment from './LeaveComment'

export default function Post({
  userState,
  data,
  showComments = true,
  showImage = true,
  showEditIcon = true,
  enableClick = true,
  showFullArticle = false
}) {
  const { liked, likeCount, handleHeartClick, heartAnimation } = useLike(data)

  const {
    content: editedContent,
    setContent: setEditedContent,
    editing,
    handleEditClick,
    handleCancelEdit,
    handleConfirmEdit
  } = useEditPost(data)

  const userId = Cookies.get('userId')
  const handlePostClick = () => {
    Cookies.set('postId', data.id)
    window.location.href = `/posts/${data.id}`
  }
  const handleUserClick = () => {
    window.location.href = `/users/${data.user_id}`
  }
  const isCurrentUserPostOwner = +userId === data.user_id

  const postClassName = showComments ? styles.singlePost : styles.post
  const editIconClassName = showComments
    ? styles.singleEditIcon
    : styles.editIcon

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
              className={editIconClassName}
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
            showFullArticle={showFullArticle}
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
              className={heartAnimation ? styles.likedHeart : ''}
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
          <LeaveComment
            showComments={showComments}
            data={data}
            userState={userState}
            enableClick={enableClick}
            showImage={showImage}
            handlePostClick={handlePostClick}
          />
        </div>
      </div>
    </div>
  )
}
