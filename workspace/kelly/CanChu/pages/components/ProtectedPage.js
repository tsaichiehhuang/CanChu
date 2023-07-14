import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

const ProtectedPage = ({ children }) => {
  const router = useRouter()

  useEffect(() => {
    // 檢查是否有登入
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      // 未登入，重新導向登入頁面
      router.push('/login')
    }
  }, [router])

  return <>{children}</>
}

export default ProtectedPage
