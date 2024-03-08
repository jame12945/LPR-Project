import React, { createContext, useContext, useState, ReactNode } from 'react'
import { ReceiveData } from '../components/Websocket'

interface ContextProps {
  lastRecord: ReceiveData | null
  setLastRecord: React.Dispatch<React.SetStateAction<ReceiveData | null>>
}

export const MasterContext = createContext<ContextProps | null>(null)

export const MasterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [lastRecord, setLastRecord] = useState<ReceiveData | null>(null)

  return (
    <MasterContext.Provider value={{ lastRecord, setLastRecord }}>
      {children}
    </MasterContext.Provider>
  )
}

export const useMasterContext = (): ContextProps => {
  const context = useContext(MasterContext)

  if (!context) {
    throw new Error('useMasterContext must be used within a MasterProvider')
  }

  return context
}
