import React, { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Login from '@/components/Login'
import Cookies from 'js-cookie'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import styles from '@/components/login.module.scss'
const apiUrl = process.env.API_DOMAIN

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const initialValues = {
    email: '',
    password: ''
  }
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('請輸入有效的電子郵件地址')
      .required('電子郵件為必填字段'),
    password: Yup.string().required('密碼為必填字段')
  })

  const handleSubmit = async (values) => {
    const { email, password } = values
    const requestBody = {
      provider: 'native',
      email: email.trim(),
      password: password.trim()
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
    } catch {
      Swal.fire({
        icon: 'error',
        title: '網路請求錯誤',
        text: '請稍後再試或通知我們的工程團隊。'
      })
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
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <Login
            isLoading={isLoading}
            statusLogin={true}
            emailRef={emailRef}
            passwordRef={passwordRef}
          />
        </Form>
      </Formik>
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
