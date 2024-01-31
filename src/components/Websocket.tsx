import { useContext, useEffect } from 'react'
import { WebSocketContext } from '../contexts/WebsocketContext'

export const WebSocket = () => {
  const socket = useContext(WebSocketContext)
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected!')
    })
    socket.on('onRecieveLpr', (data) => {
      console.log('onRecieveLpr event recieved')
      console.log(data)
    })

    return () => {
      console.log('Unregistered Events...')
      socket.off('connected')
      socket.off('onRecieveLpr')
    }
  }, [])
  return (
    <div>
      <div>
        <h1>web socket component</h1>
      </div>
    </div>
  )
}
