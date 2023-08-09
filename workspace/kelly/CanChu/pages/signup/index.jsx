import React, { useRef, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Login from '@/components/Login'
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'
import styles from '@/components/login.module.scss'
const SignupPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const confirmPasswordRef = useRef(null)
  useEffect(() => {
    const accessToken = Cookies.get('accessToken')
    if (accessToken) {
      router.replace('/')
    }
  }, [])
  const apiUrl = process.env.API_DOMAIN
  const handleSubmit = async (event) => {
    event.preventDefault()

    const name = nameRef.current?.value
    const email = emailRef.current?.value
    const password = passwordRef.current?.value

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
      setIsLoading(true)
      const response = await fetch(`${apiUrl}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      const responseData = await response.json()

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: '註冊成功',
          showConfirmButton: false,
          timer: 1500
        })

        router.push('/login')
      } else if (response.status === 403) {
        console.error(responseData.error)
      } else {
        console.error(responseData.error)
      }
    } catch (error) {
      console.error('網路請求錯誤', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}></div>
        </div>
      )}
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

export async function getServerSideProps(context) {
  const { req, res } = context
  const accessToken = req.cookies.accessToken

  // 如果已登入，重回首頁
  if (accessToken) {
    res.writeHead(302, { Location: '/' })
    res.end()
    return { props: {} }
  }

  // 如果未登入，允許訪問登入和註冊頁面
  return { props: {} }
}
