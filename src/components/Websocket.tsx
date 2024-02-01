import { useContext, useEffect, useState } from 'react'
import { WebSocketContext } from '../contexts/WebsocketContext'
import { Table, Menu, Dropdown, Button } from 'antd'
import dayjs from 'dayjs'
import { IoChevronDownOutline } from 'react-icons/io5'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'

export const WebSocket = () => {
  const [dataSource, setDataSource] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [licensePlate, setlicensePlate] = useState('')
  const [lane, setLane] = useState('')
  const [plateImage, setPlateImage] = useState('')
  const [fullImage, setFullImage] = useState('')
  const socket = useContext(WebSocketContext)
  useEffect(() => {
    const fetchData = async () => {
      socket.on('connect', () => {
        console.log('Connected!')
      })
      socket.on('onRecieveLpr', (data) => {
        console.log('onRecieveLpr event recieved')
        console.log(data)
        const response = data.data.selectBooking.data.filterBookingsAfterFix
        console.log('response....')
        console.log(response)
        setDataSource(response)
      })

      return () => {
        console.log('Unregistered Events...')
        socket.off('connected')
        socket.off('onRecieveLpr')
      }
    }
    fetchData()
  }, [])
  const cols = [
    {
      title: 'Lane',
      dataIndex: 'lane',
    },
    {
      title: 'MonitorRead',
      dataIndex: 'full_image',
      render: (text, record) => (
        <img src={record.full_image} alt="Monitor Read" className="w-20 h-18" />
      ),
    },
    {
      title: 'License Plate',
      dataIndex: 'plate_image',
      render: (text, record) => (
        <img
          src={record.plate_image}
          alt="Monitor Read LicensePlate"
          className="w-18 h-16"
        />
      ),
    },
    {
      title: 'Car Registration',
      dataIndex: 'licensePlate',
    },
    {
      title: 'BookingId',
      dataIndex: 'bookingId',
    },
    {
      title: 'status',
      dataIndex: 'status',
      render: (text) => (
        <>
          {text && (
            <div className=" bg-amber rounded-md  h-8">
              <div className=" pt-1 text-center text-white font-medium">
                {text}
              </div>
            </div>
          )}
        </>
      ),
    },
    {
      title: 'BookingId',
      dataIndex: 'bookingDate',
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
        const updatedDataSource = dataSource.map((item) => {
          if (item.bookingId === bookingId) {
            return {
              ...item,
              status:
                response.data.data.checkInManualWithId.data.stampStatusData
                  .status,
            }
          }
          return item
        })
        setDataSource(updatedDataSource)
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
        <Table columns={cols} dataSource={dataSource} />
        <ToastContainer />
      </div>
    </div>
  )
}
