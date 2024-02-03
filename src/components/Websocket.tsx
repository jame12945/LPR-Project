import { useContext, useEffect, useState } from 'react'
import { WebSocketContext } from '../contexts/WebsocketContext'
import { Table, Menu, Dropdown, Button, Input } from 'antd'
import dayjs from 'dayjs'
import { IoChevronDownOutline } from 'react-icons/io5'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import { BookingSocketData } from '../type/booking'

function WebSocket() {
  const [dataSource, setDataSource] = useState([])
  const [dataSourceNewTable, setDataSourceNewTable] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [licensePlate, setlicensePlate] = useState('')
  const [lane, setLane] = useState(['1', '2', '3'])
  const [plateImage, setPlateImage] = useState('')
  const [fullImage, setFullImage] = useState('')
  const [receive, setReceive] = useState([])
  const [matchItems, setMatchItems] = useState([])
  const [allLane, setAllLane] = useState({
    lane1: '1',
    lane2: '2',
    lane3: '3',
    lane4: '4',
    lane5: '5',
  })

  const socket = useContext(WebSocketContext)

  useEffect(() => {
    // Connect to socket
    socket.on('connect', () => {
      console.log('Connected!')
    })

    socket.on('onRecieveLpr', handleRecieveLpr)
    return () => {
      console.log('Unregistering Events...')
      socket.off('connect')
      socket.off('onRecieveLpr', handleRecieveLpr)
    }
  }, [])
  useEffect(() => {
    const updatedReceive = Object.keys(allLane).map((key) => {
      const lanes = allLane[key]
      console.log('Got lane')
      console.log(lanes)
      const matchingDatas = matchItems.find((item) => item.lane === lanes) || {}

      return {
        lane: lanes,
        full_image: matchingDatas ? matchingDatas.full_image : '',
        plate_image: matchingDatas ? matchingDatas.plate_image : '',
        licensePlate: matchingDatas ? matchingDatas.licensePlate : '',
        bookingId: matchingDatas ? matchingDatas.bookingId : '',
        status: matchingDatas ? matchingDatas.status : '',
        bookingDate: matchingDatas ? matchingDatas.bookingDate : '',
        bookingStart: matchingDatas ? matchingDatas.bookingStart : '',
        bookingEnd: matchingDatas ? matchingDatas.bookingEnd : '',
      }
    })
    setReceive(updatedReceive)
  }, [matchItems, allLane])

  const handleRecieveLpr = (data: BookingSocketData[]) => {
    console.log('Receive data')
    console.log(data)
    setMatchItems(data)
    const updatedData = data.map((item) => ({
      ...item,
      bookingStart: item.bookingStart || '',
      bookingEnd: item.bookingEnd || '',
    }))
    setDataSourceNewTable(updatedData)
    if (data.length > 0) {
      data.forEach((item) => {
        if (item.bookingId) {
          console.log('data coming')
          setDataSource(data)
        } else {
          console.log('no booking data')
        }
      })
      console.log('dataSourceNewTable is :')
      console.log(dataSourceNewTable)
    } else {
      console.log('no response data coming!!!!')
    }
  }
  const testColumns = [
    {
      title: 'Lane',
      dataIndex: 'lane',
      key: 'lane',
    },
    {
      title: 'MonitorRead',
      dataIndex: 'full_image',
      key: 'full_image',
      render: (text, record) => (
        <>
          {text && (
            <img
              src={record.full_image}
              alt="Monitor Read fullImage"
              className="w-20 h-18"
            />
          )}
        </>
      ),
    },
    {
      title: 'License Plate',
      dataIndex: 'plate_image',
      key: 'plate_image',
      render: (text, record) => (
        <>
          {text && (
            <img
              src={record.plate_image}
              alt="Monitor Read plateImage"
              className="w-20 h-18"
            />
          )}
        </>
      ),
    },
    {
      title: 'Car Registration',
      dataIndex: 'licensePlate',
      key: 'licensePlate',
    },
    {
      title: 'BookingId',
      dataIndex: 'bookingId',
      key: 'bookingId',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <>
          {text === 'success' && (
            <div className="bg-green rounded-md h-8">
              <div className="pt-1 text-center text-white font-medium">
                {text}
              </div>
            </div>
          )}
          {text === 'early' ||
            (text === 'late' && (
              <div className=" bg-amber rounded-md  h-8">
                <div className=" pt-1 text-center text-white font-medium">
                  {text}
                </div>
              </div>
            ))}
          {text != 'early' && text != 'late' && text != 'success' && (
            <div className=" bg-rain rounded-md  h-8">
              <div className=" pt-1 text-center text-white font-medium">
                waiting
              </div>
            </div>
          )}
        </>
      ),
    },
    {
      title: 'BookingDate',
      dataIndex: 'bookingDate',
      key: 'bookingDate',
      render: (text, record) => (
        <div>
          <div className="ml-2">{dayjs(text).format('YYYY-MM-DD')}</div>
          <div className="text-green">
            ({dayjs(record.bookingStart, 'HH:mm:ss').format('HH:mm')} -{' '}
            {dayjs(record.bookingEnd, 'HH:mm:ss').format('HH:mm')})
          </div>
        </div>
      ),
    },
    {
      title: 'Manage',
      dataIndex: 'manage',
      key: 'manage',
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu
              onClick={(e) =>
                handleMenuClick(
                  e,
                  record.bookingId,
                  record.licensePlate,
                  record.lane,
                  record.plate_image,
                  record.full_image
                )
              }
            >
              <Menu.Item key="CheckIn">CheckIn</Menu.Item>
              <Menu.Item key="OpenGate">OpenGate</Menu.Item>
            </Menu>
          }
        >
          <Button className="bg-sky flex">
            <span>Action</span>
            <div className="flex items-center justify-center ml-2 mt-1.5 ">
              <IoChevronDownOutline />
            </div>
          </Button>
        </Dropdown>
      ),
    },
  ]
  //do here

  const handleMenuClick = async (
    e,
    bookingId,
    licensePlate,
    lane,
    plateImage,
    fullImage
  ) => {
    if (e.key === 'CheckIn') {
      setSelectedId(bookingId)
      setlicensePlate(licensePlate)
      setLane(lane)
      setPlateImage(plateImage)
      setFullImage(fullImage)
      try {
        const response = await axios.post(
          'http://localhost:3000/recieve/manual-checkin',
          {
            license_plate_number: licensePlate,
            data: bookingId,
            lane: lane,
            plate_image: plateImage,
            full_image: fullImage,
          }
        )
        console.log(`Checking in successfully for booking of ${bookingId}`)
        console.log('Response:', response.data)
        console.log(
          'Data From Backend:',
          response.data.data.checkInManualWithId.data.stampStatusData.status
        )
        toast.success('ระบบทำการ CheckIn เรียบร้อยแล้ว')
        const updatedReceive = receive.map((item) => {
          if (item.bookingId === bookingId) {
            console.log('Checking in successfully for')
            return {
              ...item,
              status:
                response.data.data.checkInManualWithId.data.stampStatusData
                  .status,
            }
          }
          return item
        })
        setReceive(updatedReceive)
      } catch (error) {
        console.error('CheckIn Error: ', error)
        toast.error('Check-in failed!')
      }
    } else {
      setSelectedId(bookingId)
      try {
        const response = await axios.get('http://localhost:3000/opengate', {})
        console.log('Response:', response.data)
        toast.success('ระบบกำลังเปิดไม้กั้น')
      } catch (error) {
        toast.error('OpenGate Error')
      }
    }
  }

  return (
    <div>
      <div>
        <ToastContainer />
        <Table columns={testColumns} dataSource={receive} />
      </div>
    </div>
  )
}

export default WebSocket
