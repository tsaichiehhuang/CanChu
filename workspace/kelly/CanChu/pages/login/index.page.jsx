import React, { useRef } from 'react'
import { useRouter } from 'next/router'
import Login from '../components/Login'
import ProtectedPage from '../components/ProtectedPage.js'

const apiUrl = process.env.API_DOMAIN

const LoginPage = () => {
  const router = useRouter()
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const handleSubmit = async (event) => {
    event.preventDefault()

    const email = emailRef.current?.value
    const password = passwordRef.current?.value

    // 检查字段值是否存在且不为空
    if (!email || !password) {
      console.error('電子郵件和密碼為必填字段')
      return
    }

    const requestBody = {
      provider: 'native',
      email,
      password
    }

    try {
      const response = await fetch(`${apiUrl}/users/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      const responseData = await response.json()

      if (response.ok) {
        // 登入成功
        console.log(responseData)
        localStorage.setItem('accessToken', responseData.data.access_token)
        router.push('/Home/home') // 前往首頁
      } else if (response.status === 403) {
        console.error(responseData.error)
      } else {
        console.error(responseData.error)
      }
    } catch (error) {
      console.error('網路請求錯誤', error)
    }
  }

  return (
    <ProtectedPage>
      <form onSubmit={handleSubmit}>
        <Login
          statusLogin={true}
          emailRef={emailRef}
          passwordRef={passwordRef}
        />
      </form>
    </ProtectedPage>
  )
}

export default LoginPage
