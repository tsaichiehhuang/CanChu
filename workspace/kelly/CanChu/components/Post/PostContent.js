import React from 'react'
import styles from './Post.module.scss'

export default function PostContent({
  data,
  editing,
  editedContent,
  setEditedContent,
  handleConfirmEdit,
  handleCancelEdit
}) {
  return (
    <React.Fragment>
      {editing ? (
        <div className={styles.editContainer}>
          <textarea
            className={styles.editTextarea}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <div className={styles.editButtonGroup} style={{}}>
            <button
              className={styles.editButton}
              onClick={handleConfirmEdit}
              style={{ background: '#5458F7' }}
            >
              確定
            </button>
            <button
              className={styles.editButton}
              onClick={handleCancelEdit}
              style={{ background: '#D3D3D3' }}
            >
              取消
            </button>
          </div>
        </div>
      ) : (
        <article className={`${styles.secondRow} ${styles['multiline-text']}`}>
          {data.context}
        </article>
      )}
    </React.Fragment>
  )
}
