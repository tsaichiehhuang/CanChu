import React, { useState } from 'react'
import styles from './Post.module.scss'
import parse from 'html-react-parser'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
import Swal from 'sweetalert2'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
export default function PostContent({
  data,
  editing,
  editedContent,
  setEditedContent,
  handleConfirmEdit,
  handleCancelEdit,
  showFullArticle,
  selectedFiles,
  setSelectedFiles
}) {
  const maxCharsToShow = 200
  const maxLinesToShow = 3
  const [showMore, setShowMore] = useState(false)
  const [showFullContent, setShowFullContent] = useState(false)
  const [thumbnailUrls, setThumbnailUrls] = useState([])

  const processContext = (context) => {
    const images = context.match(/<img[^>]*>/g)
    if (images) {
      const processedImages = images.map((image) =>
        image.replace('<img', `<img className=${styles.imageWrapper}`)
      )
      return processedImages.reduce(
        (acc, image, index) => acc.replace(images[index], image),
        context
      )
    }
    return context
  }

  const parsedContent = parse(processContext(data.context))
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
  const handleImageUpload = (e) => {
    const files = e.target.files

    if (!files || files.length === 0) {
      return
    }

    const newSelectedFiles = Array.from(files).filter(
      (file) => file.size <= 1024 * 1024
    )

    if (newSelectedFiles.length === 0) {
      Swal.fire('所有圖片大小超過1MB', '', 'warning')
      return
    }

    setSelectedFiles((prevSelectedFiles) => [
      ...prevSelectedFiles,
      ...newSelectedFiles
    ])

    const newThumbnailUrls = newSelectedFiles.map((file) =>
      URL.createObjectURL(file)
    )

    setThumbnailUrls((prevThumbnailUrls) => [
      ...prevThumbnailUrls,
      ...newThumbnailUrls
    ])
  }

  const handleRemoveImage = (indexToRemove) => {
    const newSelectedFiles = selectedFiles.filter(
      (file, index) => index !== indexToRemove
    )
    setSelectedFiles(newSelectedFiles)

    const newThumbnailUrls = thumbnailUrls.filter(
      (url, index) => index !== indexToRemove
    )
    setThumbnailUrls(newThumbnailUrls)
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
          />{' '}
          {thumbnailUrls && thumbnailUrls.length > 0 && (
            <div className={styles.thumbnailContainer}>
              {thumbnailUrls.map((url, index) => (
                <div key={index} className={styles.thumbnailImageWrapper}>
                  <img
                    src={url}
                    alt={`Thumbnail ${index}`}
                    className={styles.thumbnailImage}
                  />
                  <button
                    className={styles.deleteButton}
                    onClick={(event) => {
                      event.stopPropagation()
                      handleRemoveImage(index)
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
          <label className={styles.uploadImageButton}>
            <input
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              multiple
            />
            <img
              src='/上傳圖片.png'
              alt='Upload Image'
              style={{ cursor: 'pointer' }}
            />
            <div>新增圖片至貼文</div>
          </label>
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
          {showMore || showFullContent || !shouldShowReadMoreButton
            ? parsedContent
            : contentToShow}
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
