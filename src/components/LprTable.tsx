import { socket, WebSocketProvider } from '../contexts/WebsocketContext'
import { WebSocket } from './Websocket'

function LprTable() {
  return (
    <>
      <WebSocketProvider value={socket}>
        <WebSocket />
      </WebSocketProvider>
    </>
  )
}

export default LprTable
