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

    // 在滾動停止後，重新設置 isFetchingRef 狀態
    const handleScrollStop = () => {
      let timeoutId
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
