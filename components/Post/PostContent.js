import React, { useState, useEffect, useRef } from 'react'
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
  const [parsedContent, setParsedContent] = useState(null)
  const [showAllImages, setShowAllImages] = useState(false)
  useEffect(() => {
    if (data.context !== undefined) {
      const processContext = (context) => {
        if (context) {
          const images = context.match(/<img[^>]*>/g)
          if (images) {
            const totalImages =
              showAllImages || showFullArticle
                ? images.length
                : Math.min(images.length, 3)
            const processedImages = images.map((image, imageIndex) => {
              const imageClass =
                imageIndex === 2 && !showAllImages && !showFullArticle
                  ? `${styles.imageWrapper} ${styles.fadeBlack}`
                  : styles.imageWrapper
              return image.replace(
                '<img',
                `<img class="${imageClass}" data-index="${imageIndex}" `
              )
            })
            const buttonHtml =
              totalImages === 3 && !showAllImages && !showFullArticle
                ? `
                <button class="${styles.photoReadMoreButton}">+更多照片</button>
              `
                : ''
            const imageContainer = `
              <div class="${styles.imageWrapperHorizontal}">
                ${buttonHtml}
                ${processedImages.slice(0, totalImages).join('')}
              </div>`
            const cleanedContext = context
              .replace(/<p>\s*<\/p>/g, '')
              .replace(/<img[^>]*>|<br\s*\/?>/g, '')
            return cleanedContext + imageContainer
          }
          return context
        }
        return ''
      }

      // eslint-disable-next-line no-shadow
      const parsedContent = parse(processContext(data.context))
      setParsedContent(parsedContent)
    }
  }, [data.context, showAllImages])
  const handlePhotoReadMoreClick = (event) => {
    const thirdImage = event.target
      .closest('div')
      .querySelector('img[data-index="2"]')
    if (thirdImage) {
      setShowAllImages(!showAllImages)
      if (!showAllImages) {
        thirdImage.classList.add(styles.fadeBlack)
      } else {
        thirdImage.classList.remove(styles.fadeBlack)
      }
    }
  }
  const handleReadMoreClick = () => {
    setShowMore(!showMore)
    setShowFullContent(!showMore)
  }
  useEffect(() => {
    const button = document.querySelector(`.${styles.photoReadMoreButton}`)
    if (button) {
      button.addEventListener('click', handlePhotoReadMoreClick)
    }

    return () => {
      if (button) {
        button.removeEventListener('click', handlePhotoReadMoreClick)
      }
    }
  }, [parsedContent])

  // const flattenContent = (content) => {
  //   if (typeof content === 'string') {
  //     return content
  //   } else if (React.isValidElement(content)) {
  //     if (Array.isArray(content.props.children)) {
  //       return content.props.children
  //         .map((child) => flattenContent(child))
  //         .join('')
  //     } else if (content.props.children) {
  //       return flattenContent(content.props.children)
  //     }
  //   }
  //   return ''
  // }

  const modules = {
    toolbar: [
      [{ header: '1' }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
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
  // let totalTextLength = 0
  // const measureTextLength = (content) => {
  //   if (typeof content === 'string') {
  //     totalTextLength += content.length
  //   } else if (React.isValidElement(content)) {
  //     if (Array.isArray(content.props.children)) {
  //       content.props.children.forEach((child) => measureTextLength(child))
  //     } else if (content.props.children) {
  //       measureTextLength(content.props.children)
  //     }
  //   }
  // }

  // measureTextLength(parsedContent)

  const contentToShow = parsedContent
  const shouldShowReadMoreButton = false

  // useEffect(() => {
  //   let totalTextLength = 0
  //   let totalLines = 0
  //   if (contentToShow) {
  //     const contentWithStats = contentToShow.map((context, index) => {
  //       let textContent = ''
  //       let lines = 0

  //       if (React.isValidElement(context)) {
  //         textContent = context.props?.children
  //         if (typeof textContent === 'string') {
  //           lines = textContent.split('\n').length
  //         }
  //       } else if (typeof context === 'string') {
  //         textContent = context
  //         lines = textContent.split('\n').length
  //       }

  //       // eslint-disable-next-line no-unsafe-optional-chaining
  //       totalTextLength += textContent?.length
  //       totalLines += lines

  //       return {
  //         context,
  //         textContent,
  //         lines
  //       }
  //     })
  //     if (!showFullContent && !showMore && !showFullArticle) {
  //       if (totalLines > maxLinesToShow) {
  //         contentToShow = contentWithStats
  //           .slice(0, maxLinesToShow)
  //           .map((item) => item.context)
  //         shouldShowReadMoreButton = true
  //       } else if (totalTextLength > maxCharsToShow) {
  //         contentToShow = contentWithStats
  //           .map((item) => item.context)
  //           .join('')
  //           .slice(0, maxCharsToShow)
  //         shouldShowReadMoreButton = true
  //       }
  //     }
  //     console.log('Total Text Length:', totalTextLength)
  //     console.log('Total Lines:', totalLines)
  //     // contentWithStats.map((text) =>
  //     //   console.log('Content with Stats:', text.textContent)
  //     // )
  //   }
  // }, [parsedContent])

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
        <article className={styles.secondRow}>
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
