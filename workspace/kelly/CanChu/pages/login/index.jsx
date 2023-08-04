import React, { useRef } from 'react'
import { useRouter } from 'next/router'
import Login from '@/components/Login'
import Cookies from 'js-cookie'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'

const apiUrl = process.env.API_DOMAIN

const LoginPage = () => {
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
    password: Yup.string()
      // .matches(
      //   /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/,
      //   '密碼必須包含大小寫字母和數字，且長度必須超過8個字符'
      // )
      .required('密碼為必填字段')
  })

  const handleSubmit = async (values) => {
    const { email, password } = values
    const requestBody = {
      provider: 'native',
      email: email.trim(),
      password: password.trim()
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
        Cookies.set('accessToken', responseData.data.access_token)
        Cookies.set('userId', responseData.data.user.id)
        router.push('/')
        window.location.reload()
      }
    } catch {
      Swal.fire({
        icon: 'error',
        title: '網路請求錯誤',
        text: '請稍後再試或通知我們的工程團隊。'
      })
    }
  }

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <Login
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
