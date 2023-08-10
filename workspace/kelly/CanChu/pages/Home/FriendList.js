import React, { useState } from 'react'
import styles from './Home.module.scss'
import useFriends from '@/hook/Friends/useFriends'
import useFriendsPending from '@/hook/Friends/useFriendsPending'
import useDeleteAddFriend from '@/hook/Friends/useDeleteAddFriend'
import useAgreeFriend from '@/hook/Friends/useAgreeFriend'
import IsPictureUrlOk from '@/components/IsPictureUrlOk'
import Link from 'next/link'

export default function FriendList({
  userState,
  showFriendList,
  setShowFriendList
}) {
  const { deleteFriendRequest } = useDeleteAddFriend()
  const { agreeFriendRequest } = useAgreeFriend()
  const friendsPending = useFriendsPending()
  const { friends, isLoading } = useFriends()
  const [showAllFriends, setShowAllFriends] = useState(false)

  const renderFriendRequest = (friend) => (
    <div key={friend.id} className={styles.friendRequest}>
      <div
        style={{
          flexDirection: 'row',
          display: 'flex',
          width: '60%',
          gap: '9%',
          alignItems: 'center'
        }}
      >
        <IsPictureUrlOk
          className={styles.friendRequestImg}
          userState={friend}
        />
        <div className={styles.friendRequestText}>{friend.name}</div>
      </div>
      <div
        style={{
          flexDirection: 'row',
          display: 'flex',
          gap: '5%'
        }}
      >
        <button
          className={styles.friendRequestButton}
          style={{ background: '#5458F7' }}
          onClick={() => agreeFriendRequest(friend.friendship.id)}
        >
          確定
        </button>
        <button
          className={styles.friendRequestButton}
          style={{ background: '#BFBFBF' }}
          onClick={() => deleteFriendRequest(friend.friendship.id)}
        >
          取消
        </button>
      </div>
    </div>
  )

  const renderFriendSection = (img, text) => (
    <div className={styles.friendListSection}>
      <img
        style={{
          marginLeft: '1%',
          width: '40px',
          height: '40px',
          objectFit: 'cover',
          borderRadius: '50%'
        }}
        src={img}
      />
      <div className={styles.friendRequestText}>{text}</div>
    </div>
  )
  const renderFriendList = (friend, index) => (
    <div key={index}>
      <Link
        href='/users/[user.id]'
        as={`/users/${friend.id}`}
        className={styles.friendListSection}
        prefetch
      >
        <IsPictureUrlOk
          className={styles.friendRequestImg}
          userState={friend}
        />
        <div className={styles.friendRequestText}>{friend.name}</div>
      </Link>
    </div>
  )
  const totalFriendsCount = friendsPending.length + friends.length
  const maxItemsToShow = 8
  const shouldShowViewAllButton = totalFriendsCount > 8
  const availableSlots = maxItemsToShow - friendsPending.length
  return (
    <div className={`${showFriendList ? styles.overlay : ''}`}>
      <div
        className={`${
          showFriendList ? styles.friendListPopUp : styles.friendList
        }`}
      >
        {showFriendList && (
          <button
            className={styles.cancelButton}
            onClick={() => setShowFriendList(false)}
          >
            X
          </button>
        )}
        {renderFriendSection(
          userState.userState.picture || '/個人照片.png',
          userState.userState.name
        )}

        <div
          style={{
            width: '90%',
            background: '#D9D9D9',
            height: '1px',
            margin: '3% 0'
          }}
        ></div>

        <div className={styles.friendListSection}>
          <div style={{ margin: '0% 3.5%', width: '40px' }}>
            <img className={styles.img} src='/friends.png' />
          </div>
          <div
            style={{ color: '#767676' }}
            className={styles.friendRequestText}
          >
            我的好友
          </div>
        </div>

        <div className={styles.friendListMyFriend}>
          {isLoading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%'
              }}
            >
              <div
                className={styles.loadingSpinner}
                style={{ borderTop: '4px solid #000' }}
              ></div>
            </div>
          ) : (
            <>
              {totalFriendsCount === 0 && (
                <div className={styles.noFriends}>你没有好友TT</div>
              )}
            </>
          )}

          {(!showAllFriends
            ? friendsPending.slice(
                0,
                Math.min(availableSlots, friendsPending.length)
              )
            : friendsPending
          ).map((friend) => renderFriendRequest(friend))}
          {(!showAllFriends
            ? friends.slice(0, Math.min(availableSlots, friends.length))
            : friends
          ).map((friend, index) => renderFriendList(friend, index))}
        </div>
        {shouldShowViewAllButton && (
          <div className={styles.friendListSection}>
            <img
              style={{ margin: '0% 1.5%', width: '40px', height: 'auto' }}
              src='/options.png'
            />
            <div
              style={{
                color: '#767676',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
              className={styles.friendRequestText}
              onClick={() => setShowAllFriends(!showAllFriends)}
            >
              {showAllFriends ? '收起' : '查看全部'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
