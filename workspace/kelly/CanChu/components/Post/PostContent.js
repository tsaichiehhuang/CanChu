import React, { useState } from 'react'
import styles from './Post.module.scss'
import parse from 'html-react-parser'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
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
  const parsedContent = parse(data.context)
  let contentToShow = parsedContent
  let shouldShowReadMoreButton = false
  const flattenContent = (content) => {
    if (typeof content === 'string') {
      return content
    } else if (React.isValidElement(content)) {
      if (Array.isArray(content.props.children)) {
        return content.props.children
          .map((child) => flattenContent(child))
          .join('')
      } else if (content.props.children) {
        return flattenContent(content.props.children)
      }
    }
    return ''
  }

  if (!showFullContent && !showMore && !showFullArticle) {
    const textContent = flattenContent(parsedContent)
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
  const modules = {
    toolbar: [
      [{ header: '1' }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ image: true }],
      ['clean']
    ],
    clipboard: {
      matchVisual: false
    }
  }
  return (
    <React.Fragment>
      {editing ? (
        <div className={styles.editContainer}>
          <ReactQuill
            theme='snow'
            className={styles.editTextarea}
            value={editedContent}
            onChange={setEditedContent}
            modules={modules}
          />
          <div className={styles.editButtonGroup}>
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
