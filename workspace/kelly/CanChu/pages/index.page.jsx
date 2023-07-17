import React, { useState, useEffect } from 'react'
import Home from './Home/home.page'
import LoginPage from './login/index.page'
import { useRouter } from 'next/router'

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // 檢查用戶是否已登錄
    const checkLoggedIn = () => {
      const accessToken = localStorage.getItem('accessToken')
      if (accessToken) {
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
    }

    checkLoggedIn()
  }, [])

  // useEffect(() => {
  //   if (!isLoggedIn && router.pathname !== '/login') {
  //     // 用戶未登錄且不在LoginPage頁面，重定向到LoginPage
  //     router.replace('/login')
  //   }
  // }, [isLoggedIn, router])

  if (isLoggedIn) {
    return <Home />
  } else {
    return <LoginPage />
  }
}
