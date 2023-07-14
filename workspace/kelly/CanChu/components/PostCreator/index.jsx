import React, { useState } from 'react'
import styles from './PostCreator.module.scss'
import userData from '../../pages/user/userData'

export default function PostCreator({ onPostSubmit }) {
  const user = userData()[0]
  const [postContent, setPostContent] = useState('')

  const handlePostSubmit = () => {
    // 檢查字段值是否存在且不為空
    if (!postContent) {
      console.error('請輸入內容')
      return
    }

    onPostSubmit(postContent)
    setPostContent('') // 發布後清空輸入框內容
  }

  return (
    <div className={styles.posting}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <img className={styles.postingPhoto} src={user.picture} />
        <textarea
          className={styles.postingText}
          placeholder='說點什麼嗎？'
          style={{ resize: 'none' }}
          value={postContent}
          onChange={(event) => setPostContent(event.target.value)}
        ></textarea>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'flex-end'
        }}
      >
        <button className={styles.postingButton} onClick={handlePostSubmit}>
          發布貼文
        </button>
      </div>
    </div>
  )
}
