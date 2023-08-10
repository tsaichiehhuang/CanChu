import React from 'react'
import styles from './user.module.scss'
import useUpdateUserPicture from '@/hook/User/useUpdateUserPicture'
import IsPictureUrlOk from '@/components/IsPictureUrlOk'
import Swal from 'sweetalert2'

const PictureUpload = ({ userState, updateUserState }) => {
  const { setSelectedPicture, uploadPicture } = useUpdateUserPicture()

  const handlePictureUpload = async (event) => {
    const file = event.target.files[0]
    setSelectedPicture(file)
    const pictureUrl = await uploadPicture(file)
    if (pictureUrl) {
      const updatedUser = { ...userState, picture: pictureUrl }
      updateUserState(updatedUser)
      // 更新頭像的 src 屬性
      const headshotImage = document.querySelector(`.${styles.userHeadshot}`)
      if (headshotImage) {
        headshotImage.src = pictureUrl
      }
      Swal.fire('圖片上傳成功', '', 'success')
    }
  }

  return (
    <div className={styles.userHeadshotWrapper}>
      <IsPictureUrlOk className={styles.userHeadshot} userState={userState} />

      <div className={styles.userHeadshotText}>
        編輯大頭貼
        <input
          style={{ cursor: 'pointer', fontSize: '0' }}
          type='file'
          accept='.png, .jpg, .jpeg'
          className={styles.userHeadshotInput}
          onChange={handlePictureUpload}
        />
      </div>
    </div>
  )
}

export default PictureUpload
