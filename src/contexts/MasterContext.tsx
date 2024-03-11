import React, { createContext, useContext, useState } from 'react'
import { ReceiveData } from '../components/Websocket'

interface LastReceivedDataContextType {
  lastReceivedData: ReceiveData[]
  updateLastReceivedData: (data: ReceiveData) => void
}

const LastReceivedDataContext = createContext<LastReceivedDataContextType>({
  lastReceivedData: [],
  updateLastReceivedData: () => {},
})

export const LastReceivedDataProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [lastReceivedData, setLastReceivedData] = useState<ReceiveData[]>([])

  const updateLastReceivedData = (data: ReceiveData) => {
    setLastReceivedData((prevData) => {
      const existingLaneIndex = prevData.findIndex(
        (item) => item.lane === data.lane
      )

      if (existingLaneIndex !== -1) {
        prevData[existingLaneIndex] = data
      } else {
        prevData.push(data)
      }
      const uniqueData = prevData.reduce(
        (acc: ReceiveData[], current: ReceiveData) => {
          const x = acc.find((item) => item.lane === current.lane)
          if (!x) {
            return acc.concat([current])
          } else {
            return acc
          }
        },
        []
      )

      return uniqueData
    })
  }

  console.log('lastReceivedData-->', lastReceivedData)

  return (
    <LastReceivedDataContext.Provider
      value={{ lastReceivedData, updateLastReceivedData }}
    >
      {children}
    </LastReceivedDataContext.Provider>
  )
}

export const useLastReceivedData = () => useContext(LastReceivedDataContext)
