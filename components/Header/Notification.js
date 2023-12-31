import React, { useState, useEffect } from 'react'
import styles from './Header.module.scss'
import useNotify from '@/hook/Header/useNotify'
import useRead from '@/hook/Header/useRead'
import getTimeDiff from '../getTimeDiff'

export default function Notification({ isMobileView }) {
  const { notifyData, setNotifyData } = useNotify()
  const [showAllNotifications, setShowAllNotifications] = useState(false)
  const [showNotifyOptions, setShowNotifyOptions] = useState(false)
  const [displayedNotifications, setDisplayedNotifications] = useState([])
  const { markAsRead } = useRead()

  const handleMobileNotifyShow = () => {
    setShowNotifyOptions(!showNotifyOptions)
  }

  const handleNotifyMouseEnter = () => {
    setShowNotifyOptions(true)
  }

  const handleNotifyMouseLeave = (event) => {
    if (
      event.relatedTarget &&
      !event.currentTarget.contains(event.relatedTarget)
    ) {
      setTimeout(() => {
        setShowNotifyOptions(false)
        setShowAllNotifications(false)
      }, 2000)
    }
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
  const newNotificationCount = notifyData.reduce(
    (count, notification) => (notification.is_read === 0 ? count + 1 : count),
    0
  )
  return (
    <div
      className={styles.notification}
      {...(!isMobileView && {
        onMouseEnter: handleNotifyMouseEnter,
        onMouseLeave: handleNotifyMouseLeave
      })}
    >
      <img
        width='20'
        height='20'
        src='/通知.png'
        className={styles.img}
        onClick={handleMobileNotifyShow}
      />

      {newNotificationCount > 0 && (
        <div className={styles.notificationCount}>{newNotificationCount}</div>
      )}
      <div
        className={`${isMobileView && showNotifyOptions ? styles.overlay : ''}`}
      >
        {showNotifyOptions && (
          <div
            className={`${
              isMobileView ? styles.notifyOptionsPopUp : styles.notifyOptions
            }`}
          >
            {isMobileView && (
              <button
                className={styles.cancelButton}
                onClick={handleMobileNotifyShow}
              >
                X
              </button>
            )}

            <div className={styles.notifyFirst}>
              <img src='/通知反白.png' />
              我的通知
            </div>
            <div
              className={`${
                showAllNotifications ? styles.notifyContainer : ''
              }`}
            >
              {Array.isArray(displayedNotifications) &&
              displayedNotifications.length > 0 ? (
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
                              notification.is_read === 1
                                ? 'lightgray'
                                : 'inherit'
                          }}
                        >
                          {notification.summary}
                        </div>
                        <div
                          className={styles.notifyTime}
                          style={{
                            color:
                              notification.is_read === 1
                                ? 'lightgray'
                                : '#5458f7'
                          }}
                        >
                          {getTimeDiff(new Date(notification.created_at))}
                        </div>
                      </div>
                      {notification.is_read === 0 && (
                        <img
                          src='/checkCircle.png'
                          style={{ width: '16px', height: '16px' }}
                          onClick={() =>
                            handleNotificationClick(notification.id)
                          }
                        />
                      )}
                    </div>
                  </>
                ))
              ) : (
                <div className={styles.noNotifications}>
                  目前沒有通知...你的世界很安靜
                </div>
              )}
            </div>
            {displayedNotifications.length > 0 ? (
              <>
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
              </>
            ) : (
              ''
            )}
          </div>
        )}
      </div>
    </div>
  )
}
