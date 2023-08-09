import React, { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Login from '@/components/Login'
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'
import styles from '@/components/login.module.scss'
const apiUrl = process.env.API_DOMAIN

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const email = emailRef.current?.value
    const password = passwordRef.current?.value

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
      setIsLoading(true)
      const response = await fetch(`${apiUrl}/users/signin`, {
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
          title: '成功登入',
          showConfirmButton: false,
          timer: 1000
        })
        Cookies.set('accessToken', responseData.data.access_token)
        Cookies.set('userId', responseData.data.user.id)

        setTimeout(() => {
          router.push('/')
          window.location.reload()
        }, 1000)
      } else {
        Swal.fire('電子郵件或是密碼錯誤', '', 'warning')
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
          isLoading={isLoading}
          statusLogin={true}
          emailRef={emailRef}
          passwordRef={passwordRef}
        />
      </form>
    </div>
  )
}

export default LoginPage

export async function getServerSideProps(context) {
  const { req, res } = context
  const accessToken = req.cookies.accessToken

  if (accessToken) {
    res.writeHead(302, { Location: '/' })
    res.end()
    return { props: {} }
  }

  return { props: {} }
}
