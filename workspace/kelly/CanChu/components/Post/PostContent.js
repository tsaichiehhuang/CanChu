import React, { useState } from 'react'
import styles from './Post.module.scss'
import ReactHtmlParser from 'react-html-parser'

export default function PostContent({
  data,
  editing,
  editedContent,
  setEditedContent,
  handleConfirmEdit,
  handleCancelEdit,
  showFullArticle
}) {
  const maxCharsToShow = 200
  const maxLinesToShow = 3
  const [showMore, setShowMore] = useState(false)
  const [showFullContent, setShowFullContent] = useState(false)
  const parsedContent = ReactHtmlParser(data.context)
  let contentToShow = parsedContent
  let shouldShowReadMoreButton = false

  if (!showFullContent && !showMore && !showFullArticle) {
    const textContent = parsedContent
      .map((item) => (typeof item === 'string' ? item : item.props.children))
      .join('') // 將處理後的元素陣列轉為字串

    const lines = textContent.split('\n')

    if (lines.length > maxLinesToShow) {
      contentToShow = lines.slice(0, maxLinesToShow).join('\n')
      shouldShowReadMoreButton = true
    } else if (textContent.length > maxCharsToShow) {
      contentToShow = textContent.slice(0, maxCharsToShow)
      shouldShowReadMoreButton = true
    }
  }

  const handleReadMoreClick = () => {
    setShowMore(!showMore)
    setShowFullContent(!showMore)
  }
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
          {contentToShow}
          {shouldShowReadMoreButton && (
            <span
              className={styles.readMoreButton}
              onClick={handleReadMoreClick}
            >
              ......閱讀更多
            </span>
          )}
        </article>
      )}
    </React.Fragment>
  )
}
