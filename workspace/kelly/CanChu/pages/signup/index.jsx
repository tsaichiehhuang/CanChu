import React, { useRef, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Login from '@/components/Login'
import Cookies from 'js-cookie'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const SignupPage = () => {
  const router = useRouter()
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const confirmPasswordRef = useRef(null)

  const initialValues = {
    name: '',
    email: '',
    password: ''
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('使用者名稱為必填字段'),
    email: Yup.string()
      .email('請輸入有效的電子郵件地址')
      .required('電子郵件為必填字段'),
    password: Yup.string()
      .matches(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/,
        '密碼必須包含大小寫字母和數字，且長度必須超過8個字符'
      )
      .required('密碼為必填字段')
  })
  useEffect(() => {
    const accessToken = Cookies.get('accessToken')
    if (accessToken) {
      router.replace('/')
    }
  }, [])
  const apiUrl = process.env.API_DOMAIN

  const handleSubmit = async (values) => {
    const { name, email, password } = values

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
        alert(responseData.error)
      } else {
        alert(responseData.error)
      }
    } catch {
      alert('網路請求錯誤')
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
            statusLogin={false}
            nameRef={nameRef}
            emailRef={emailRef}
            passwordRef={passwordRef}
          />
        </Form>
      </Formik>
    </div>
  )
}

export default SignupPage

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
