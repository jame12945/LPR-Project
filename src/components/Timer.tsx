import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

function Timer() {
  const [currentTime, setCurrentTime] = useState(dayjs())
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs())
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])
  return (
    <div className="flex pl-8 pb-4 pt-2 text-xl text-white">
      <p>รายการจองรถขาเข้า</p>
      <div className="pl-14">Date: {currentTime.format('YYYY-MM-DD')}</div>
      <div className="pl-4">
        {' '}
        Time: {currentTime.add(0, 'minute').format('HH:mm')}
      </div>
    </div>
  )
}
export default Timer
