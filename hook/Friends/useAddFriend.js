import Cookies from 'js-cookie'
import Swal from 'sweetalert2'
const apiUrl = process.env.API_DOMAIN

function useAddFriend() {
  const addFriend = async (otherUserId) => {
    try {
      const accessToken = Cookies.get('accessToken')

      if (!accessToken) {
        console.error('未找到accessToken')
        return
      }

      const response = await fetch(`${apiUrl}/friends/${otherUserId}/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        Swal.fire({
          icon: 'success',
          title: '已送出好友邀請',
          showConfirmButton: false,
          timer: 1500
        })
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        console.error('重複寄出邀請')
      }
    } catch (error) {
      console.error('網絡請求錯誤', error)
    }
  }

  return { addFriend }
}

export default useAddFriend
