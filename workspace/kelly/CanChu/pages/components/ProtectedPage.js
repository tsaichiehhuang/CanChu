import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

const ProtectedPage = ({ children }) => {
  const router = useRouter()

  useEffect(() => {
    // 检查用户是否已登录
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      // 未登录，重定向到登录页
      router.push('/login')
    }
  }, [router])

  return <>{children}</>
}

export default ProtectedPage
