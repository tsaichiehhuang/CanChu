import React, { useState, useEffect, useRef } from 'react'
import styles from './PostCreator.module.scss'
import Cookies from 'js-cookie'
import useFetchUserProfile from '@/hook/useFetchUserProfile'
import IsPictureUrlOk from '../IsPictureUrlOk'
import Swal from 'sweetalert2'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
const apiUrl = process.env.API_DOMAIN

export default function PostCreator() {
  const [postContent, setPostContent] = useState('')
  const [isQuillEditing, setIsQuillEditing] = useState(false)
  const [isTextareaEditing, setIsTextareaEditing] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const userId = Cookies.get('userId')
  const userState = useFetchUserProfile(userId)
  const quillRef = useRef(null)
  const textareaRef = useRef(null)
  const [thumbnailUrls, setThumbnailUrls] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([])

  const handlePostSubmit = async () => {
    if (!postContent) {
      Swal.fire('請輸入內容', '', 'warning')
      return
    }
    const requestBody = {
      context: postContent
    }

    const accessToken = Cookies.get('accessToken')

    if (!accessToken) {
      console.error('未找到accessToken')
      return
    }

    try {
      if (selectedFiles.length > 0) {
        const formData = new FormData()
        selectedFiles.forEach((file, index) => {
          formData.append(`image_${index}`, file)
        })

        const response = await fetch('https://api.imgur.com/3/upload', {
          method: 'POST',
          headers: {
            Authorization: 'Client-ID 8e8be06910748ff'
          },
          body: formData
        })

        if (response.ok) {
          const data = await response.json()
          const imageUrl = data.data.link
          requestBody.context += `<img src="${imageUrl}" alt="Uploaded Image" />`
        } else {
          Swal.fire('圖片上傳失敗', '', 'error')
          return
        }
      }
      const response = await fetch(`${apiUrl}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(requestBody)
      })

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '貼文發布成功',
          showConfirmButton: false,
          timer: 1500
        })
        setTimeout(() => {
          window.location.reload()
        }, 1000)
        setPostContent('')
      } else {
        Swal.fire('更新貼文內容失敗', '', 'error')
      }
    } catch (error) {
      console.error('網絡請求錯誤', error)
    }
    setPostContent('')
    setIsQuillEditing(false)
    setIsTextareaEditing(false)
  }

  useEffect(() => {
    const isContentEmpty =
      postContent.trim() === '' || postContent.trim() === '<p><br></p>'
    const isImageSelected = selectedFiles.length > 0
    setIsButtonDisabled(isContentEmpty && !isImageSelected)
  }, [postContent, selectedFiles])

  const handleClickOutside = (event) => {
    const quillEditor = document.querySelector('.ql-editor')
    const quillWrapper = document.querySelector(`.${styles.quillWrapper}`)

    if (
      isQuillEditing &&
      quillWrapper &&
      !quillWrapper.contains(event.target) &&
      quillEditor &&
      !quillEditor.contains(event.target)
    ) {
      setIsQuillEditing(false)
    }
  }

  const handleTextareaClick = (event) => {
    event.stopPropagation()
    setIsQuillEditing(true)
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isQuillEditing])

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

  return (
    <div className={styles.posting}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}
      >
        <IsPictureUrlOk
          className={styles.postingPhoto}
          userState={userState.userState}
        />

        {isQuillEditing && (
          <div className={styles.overlay} ref={quillRef}>
            <div className={styles.quillWrapper}>
              <ReactQuill
                theme='snow'
                ref={quillRef}
                modules={modules}
                placeholder='說點什麼嗎？'
                className={styles.postingEditText}
                value={postContent}
                onChange={setPostContent}
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

              <button
                className={styles.cancelButton}
                onClick={() => setIsQuillEditing(false)}
              >
                X
              </button>
              <button
                className={styles.postingButton}
                onClick={handlePostSubmit}
                disabled={isButtonDisabled}
              >
                發布貼文
              </button>
            </div>
          </div>
        )}
        {!isQuillEditing && (
          <textarea
            ref={textareaRef}
            className={styles.postingText}
            placeholder='說點什麼嗎？'
            style={{ resize: 'none' }}
            onClick={(event) => handleTextareaClick(event)}
          />
        )}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'flex-end'
        }}
      ></div>
    </div>
  )
}
