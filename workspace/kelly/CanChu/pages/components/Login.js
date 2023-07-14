import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import styles from './login.module.scss'
import Link from 'next/link'

const Login = ({
  statusLogin = true,
  nameRef,
  emailRef,
  passwordRef,
  confirmPasswordRef
}) => {
  const router = useRouter()

  const handleLogin = () => {
    router.push('/login')
  }

  const handleSignup = () => {
    router.push('/signup')
  }

  const inputInfo = (title, placeholder, name, ref) => (
    <div className={styles.inputGroup}>
      <div className={styles.inputTitle}>{title}</div>
      <input
        className={styles.inputText}
        type={name === 'password' ? 'password' : 'text'}
        placeholder={placeholder}
        name={name}
        ref={ref}
      />
    </div>
  )

  useEffect(() => {
    // 在此處進行其他操作
  }, [])

  return (
    <div className={styles.body}>
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
              {inputInfo(
                '電子郵件',
                '例: shirney@appworks.tw',
                'email',
                emailRef
              )}
              {inputInfo('密碼', '', 'password', passwordRef)}
            </div>
          ) : (
            <div className={styles.inputSquare}>
              {inputInfo('使用者名稱', '例: Chou Chou Hu', 'name', nameRef)}
              {inputInfo(
                '電子郵件',
                '例: shirney@appworks.tw',
                'email',
                emailRef
              )}
              {inputInfo('密碼', '', 'password', passwordRef)}
              {inputInfo('再次輸入密碼', '', 'password', confirmPasswordRef)}
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
        <div className={styles.copyrigh}>
          關於我們 · 隱私權條款 · Cookie 條款 · © 2023 CanChu, Inc.
        </div>
      </div>
    </div>
  )
}

export default Login
