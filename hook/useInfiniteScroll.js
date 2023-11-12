import { useEffect, useRef } from 'react'

function useInfiniteScroll(callback, distance) {
  const isFetchingRef = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight
      const windowHeight = window.innerHeight
      const scrollY = window.scrollY
      if (
        docHeight - (windowHeight + scrollY) < distance &&
        !isFetchingRef.current
      ) {
        isFetchingRef.current = true
        callback()
        console.log('get the posts!')
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [callback, distance])

  useEffect(() => {
    const resetIsFetching = () => {
      isFetchingRef.current = false
    }
    let timeoutId
    // 在滾動停止後，重新設置 isFetchingRef 狀態
    const handleScrollStop = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(resetIsFetching, 200) //延遲
    }

    window.addEventListener('scroll', handleScrollStop)
    return () => {
      window.removeEventListener('scroll', handleScrollStop)
    }
  }, [])
}

export default useInfiniteScroll
