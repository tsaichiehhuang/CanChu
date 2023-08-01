import React, { useState, useEffect } from 'react'
import styles from './Header.module.scss'
import useNotify from '@/hook/Header/useNotify'
import useRead from '@/hook/Header/useRead'
import getTimeDiff from '../getTimeDiff'

export default function Notification() {
  const { notifyData, setNotifyData } = useNotify()
  const [showAllNotifications, setShowAllNotifications] = useState(false)
  const [showProfileOptions, setShowProfileOptions] = useState(false)
  const [displayedNotifications, setDisplayedNotifications] = useState([])
  const { markAsRead } = useRead()
  const handleProfileMouseEnter = () => {
    setShowProfileOptions(true)
  }

  const handleProfileMouseLeave = () => {
    setShowProfileOptions(false)
  }
  const handleShowAllNotifications = () => {
    setShowAllNotifications(!showAllNotifications)
  }
  const handleNotificationClick = async (eventId) => {
    try {
      await markAsRead(eventId)
      setNotifyData((prevNotifyData) =>
        prevNotifyData.map((notification) =>
          notification.id === eventId
            ? { ...notification, is_read: 1 }
            : notification
        )
      )
    } catch (error) {
      console.error('標記通知為已讀時發生錯誤：', error)
    }
  }
  useEffect(() => {
    if (showAllNotifications) {
      setDisplayedNotifications(notifyData)
    } else {
      setDisplayedNotifications(notifyData.slice(0, 4))
    }
  }, [showAllNotifications, notifyData])
  return (
    <div
      className={styles.notification}
      onMouseEnter={handleProfileMouseEnter}
      onMouseLeave={handleProfileMouseLeave}
    >
      <img src='./通知.png' />
      {showProfileOptions && (
        <div className={styles.notifyOptions}>
          <div className={styles.notifyFirst}>
            <img src='./通知反白.png' />
            我的通知
          </div>
          <div
            className={`${showAllNotifications ? styles.notifyContainer : ''}`}
          >
            {Array.isArray(displayedNotifications) &&
              displayedNotifications.map((notification) => (
                <>
                  <div
                    style={{
                      width: '90%',
                      height: '1px',
                      background: '#D1CACE',
                      margin: '0px 10px'
                    }}
                  ></div>
                  <div key={notification.id} className={styles.notifyOption}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <div
                        style={{
                          color:
                            notification.is_read === 1 ? 'lightgray' : 'inherit'
                        }}
                      >
                        {notification.summary}
                      </div>
                      <div
                        style={{
                          color:
                            notification.is_read === 1 ? 'lightgray' : 'inherit'
                        }}
                      >
                        {getTimeDiff(new Date(notification.created_at))}
                      </div>
                    </div>
                    {notification.is_read === 0 && (
                      <img
                        src='./checkCircle.png'
                        style={{ width: '20px', height: '20px' }}
                        onClick={() => handleNotificationClick(notification.id)}
                      />
                    )}
                  </div>
                </>
              ))}
          </div>
          <div
            style={{
              width: '90%',
              height: '1px',
              background: '#D1CACE',
              margin: '0px 10px'
            }}
          ></div>
          <div
            className={styles.notifyLast}
            onClick={handleShowAllNotifications}
            style={{ textDecoration: 'underline' }}
          >
            {showAllNotifications ? '收起通知' : '查看全部通知'}
          </div>
        </div>
      )}
    </div>
  )
}
