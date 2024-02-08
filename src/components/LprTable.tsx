import React, { useEffect, useState } from 'react'
import { Table, Input, Modal } from 'antd'
import axios from 'axios'
import dayjs from 'dayjs'
import io from 'socket.io-client'
import { socket, WebSocketProvider } from '../contexts/WebsocketContext'
import { WebSocket } from './Websocket'
import Timer from './Timer'
function LprTable() {
  return (
    <>
      <WebSocketProvider value={socket}>
        <Timer />
        <WebSocket />
      </WebSocketProvider>
    </>
  )
}

export default LprTable
