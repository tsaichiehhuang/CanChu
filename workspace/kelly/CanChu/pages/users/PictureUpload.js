import React, { useState } from 'react'
import styles from './user.module.scss'
import useUpdateUserPicture from '@/hook/User/useUpdateUserPicture'
import IsPictureUrlOk from '@/components/IsPictureUrlOk'

const PictureUpload = ({ userState, updateUserState }) => {
  const { setSelectedPicture, uploadPicture } = useUpdateUserPicture()
  const [isDragging, setIsDragging] = useState(false)

  const handlePictureUpload = async (file) => {
    setSelectedPicture(file)
    const pictureUrl = await uploadPicture(file)
    if (pictureUrl) {
      const updatedUser = { ...userState, picture: pictureUrl }
      updateUserState(updatedUser)
      const headshotImage = document.querySelector(`.${styles.userHeadshot}`)
      if (headshotImage) {
        headshotImage.src = pictureUrl
      }
    }
  }
  const handleFileInputChange = (event) => {
    const file = event.target.files[0]
    handlePictureUpload(file)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setTimeout(() => {
      setIsDragging(false)
    }, 1000)

    const file = event.dataTransfer.files[0]
    handlePictureUpload(file)
  }
  const handleDragLeaveWrapper = (event) => {
    //是否目標元素是子元素
    const isChildElement = event.currentTarget.contains(event.relatedTarget)
    if (!isChildElement) {
      setIsDragging(false)
    }
  }
  return (
    <div
      className={`${styles.userHeadshotWrapper} ${
        isDragging ? styles.dragging : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeaveWrapper}
      onDrop={handleDrop}
    >
      <IsPictureUrlOk className={styles.userHeadshot} userState={userState} />

      <div className={styles.userHeadshotText}>
        {isDragging ? '上傳圖片' : '編輯大頭貼'}
        <input
          style={{ cursor: 'pointer', fontSize: '0' }}
          type='file'
          accept='.png, .jpg, .jpeg'
          className={styles.userHeadshotInput}
          onChange={handleFileInputChange}
        />
      </div>
    </div>
  )
}

export default PictureUpload
