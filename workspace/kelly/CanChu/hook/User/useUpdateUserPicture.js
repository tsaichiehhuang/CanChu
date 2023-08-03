import { useState } from 'react'
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'

const apiUrl = process.env.API_DOMAIN

const useUpdateUserPicture = () => {
  const [selectedPicture, setSelectedPicture] = useState(null)

  const uploadPicture = async (file) => {
    try {
      const accessToken = Cookies.get('accessToken')

      if (!accessToken) {
        console.error('未找到accessToken')
        return
      }

      const formData = new FormData()
      formData.append('picture', file)

      const response = await fetch(`${apiUrl}/users/picture`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        const pictureUrl = data?.data?.picture
        Cookies.set('uploadedPicture', pictureUrl)
        Swal.fire('圖片上傳成功', '', 'success')
        setTimeout(() => {
          window.location.reload()
        }, 1000)
        // eslint-disable-next-line consistent-return
        return pictureUrl
      } else {
        Swal.fire('上傳圖片失敗', '', 'error')
        // eslint-disable-next-line consistent-return
        return null
      }
    } catch (error) {
      console.error('網絡請求錯誤', error)
      // eslint-disable-next-line consistent-return
      return null
    }
  }

  return { selectedPicture, setSelectedPicture, uploadPicture }
}

export default useUpdateUserPicture
