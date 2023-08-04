import React, { useRef, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from './login.module.scss'
import Link from 'next/link'
import Copyright from './Copyright'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
const Login = ({
  statusLogin = true,
  nameRef,
  emailRef,
  passwordRef,
  confirmPasswordRef
}) => {
  const router = useRouter()
  const [error, setError] = useState(null)
  const handleLogin = () => {
    router.push('/login')
  }
  const handleSignup = () => {
    router.push('/signup')
  }

  const InputField = ({ title, placeholder, name, type, innerRef }) => (
    <div className={styles.inputGroup}>
      <div className={styles.inputTitle}>{title}</div>
      <Field
        className={styles.inputText}
        type={type}
        name={name}
        placeholder={placeholder}
        innerRef={innerRef}
      />
      <ErrorMessage
        name={name}
        component='div'
        className={styles.errorMessage}
      />
    </div>
  )
  return (
    <div className={styles.body}>
      <style global jsx>{`
        body {
          background: #f9f9f9;
          margin: 0;
        }
      `}</style>
      <div className={statusLogin ? styles.loginSquare : styles.signupSquare}>
        <div
          className={
            statusLogin ? styles.loginSquareLeft : styles.signupSquareLeft
          }
        >
          <div className={styles.logo}>CanChu</div>
          <div className={styles.title}>
            {statusLogin ? '會員登入' : '會員註冊'}
          </div>

          {statusLogin ? (
            <div className={styles.inputSquare}>
              <InputField
                title='電子郵件'
                placeholder='例: shirney@appworks.tw'
                name='email'
                type='email'
                innerRef={emailRef}
              />
              <InputField
                title='密碼'
                placeholder=''
                name='password'
                type='password'
                innerRef={passwordRef}
              />
            </div>
          ) : (
            <div className={styles.inputSquare}>
              <InputField
                title='使用者名稱'
                placeholder='例: Chou Chou Hu'
                name='name'
                type='text'
                innerRef={nameRef}
              />
              <InputField
                title='電子郵件'
                placeholder='例: shirney@appworks.tw'
                name='email'
                type='email'
                innerRef={emailRef}
              />
              <InputField
                title='密碼'
                placeholder=''
                name='password'
                type='password'
                innerRef={passwordRef}
              />
              <InputField
                title='再次輸入密碼'
                placeholder=''
                name='confirmPassword'
                type='password'
                innerRef={confirmPasswordRef}
              />
            </div>
          )}
          <button
            className={styles.loginButton}
            onClick={statusLogin ? handleLogin : handleSignup}
          >
            {statusLogin ? '登入' : '註冊'}
          </button>
          {statusLogin ? (
            <div>
              尚未成為會員?{' '}
              <Link
                href='/signup'
                style={{ color: '#5458F7', textDecoration: 'none' }}
              >
                會員註冊
              </Link>
            </div>
          ) : (
            <div>
              已經是會員了?{' '}
              <Link
                href='/login'
                style={{ color: '#5458F7', textDecoration: 'none' }}
              >
                會員登入
              </Link>
            </div>
          )}
          {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
        <div
          className={
            statusLogin ? styles.loginSquareRight : styles.signupSquareRight
          }
        ></div>
      </div>
      <div
        style={{
          width: '80%',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end'
        }}
      >
        <div style={{ marginTop: '2%' }}>
          <Copyright />
        </div>
      </div>
    </div>
  )
}

export default Login
