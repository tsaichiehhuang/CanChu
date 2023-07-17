import React, { useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import Login from '../../components/Login'
import Cookies from 'js-cookie' // 導入 js-cookie

const SignupPage = () => {
  const router = useRouter()
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const confirmPasswordRef = useRef(null)
  useEffect(() => {
    const accessToken = Cookies.get('accessToken') // 從 cookies 中取得 accessToken
    if (accessToken) {
      router.replace('/') // 已登入，重定向到其他頁面
    }
  }, [])
  const apiUrl = process.env.API_DOMAIN
  const handleSubmit = async (event) => {
    event.preventDefault()

    const name = nameRef.current?.value
    const email = emailRef.current?.value
    const password = passwordRef.current?.value

    // 检查字段值是否存在且不为空
    if (!name || !email || !password) {
      console.error('姓名、電子郵件和密碼為必填字段')
      return
    }

    const requestBody = {
      name,
      email,
      password
    }

    try {
      const response = await fetch(`${apiUrl}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      const responseData = await response.json()

      if (response.ok) {
        router.push('/login')
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
          statusLogin={false}
          nameRef={nameRef}
          emailRef={emailRef}
          passwordRef={passwordRef}
          confirmPasswordRef={confirmPasswordRef}
        />
      </form>
    </div>
  )
}

export default SignupPage
