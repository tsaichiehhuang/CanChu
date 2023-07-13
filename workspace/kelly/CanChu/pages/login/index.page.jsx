import React, { useRef } from 'react'
import { useRouter } from 'next/router'
import Login from '../components/Login'

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
        // 登录成功，可以进行相关操作，如存储访问令牌等
        console.log(responseData)
        localStorage.setItem('accessToken', responseData.data.access_token)
        router.push('/Home/home') // 重定向到首页或其他页面
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
    <div>
      <form onSubmit={handleSubmit}>
        <Login
          statusLogin={true}
          emailRef={emailRef}
          passwordRef={passwordRef}
        />
      </form>
    </div>
  )
}

export default LoginPage
