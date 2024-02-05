import { useContext, useEffect, useState } from 'react'
import { WebSocketContext } from '../contexts/WebsocketContext'
import { Table, Menu, Dropdown, Button, Input, Modal } from 'antd'
import dayjs from 'dayjs'
import { IoChevronDownOutline } from 'react-icons/io5'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import { BookingSocketData } from '../type/booking'
import { ColumnsType } from 'antd/es/table'

export interface BookingType {
  lane: string
  full_image: string
  plate_image: string
  licensePLate: string
  bookingId: string
  status: string
  bookingDate: string
  bookingStart: string
  bookingEnd: string
}
export interface ReceiveData {
  full_image: string
  plate_image: string
  licensePlate: string
  booking: string
  bookingId: string
  status: string
  bookingDate: string
  bookingStart: string
  bookingEnd: string
}

export interface MenuClickParams {
  bookingId: string
  licensePlate: string
  lane: string
  plateImage: string
  fullImage: string
}
export const WebSocket = () => {
  const [dataSource, setDataSource] = useState([])
  const [dataSourceNewTable, setDataSourceNewTable] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [licensePlate, setlicensePlate] = useState('')
  const [lane, setLane] = useState(['1', '2', '3'])
  const [plateImage, setPlateImage] = useState('')
  const [fullImage, setFullImage] = useState('')
  const [receive, setReceive] = useState([])
  const [isOfficer, setIsOfficer] = useState([])
  const [matchItems, setMatchItems] = useState([])
  const [isHandleRecieveLprCalled, setIsHandleRecieveLprCalled] =
    useState(false)
  const [allLane, setAllLane] = useState({
    lane1: '1',
    lane2: '2',
    lane3: '3',
    lane4: '4',
    lane5: '5',
  })
  const [modalVisible, setModalVisible] = useState(false)
  const [inputdata, setInputData] = useState({
    license_plate_number: '',
    lane: '',
  })
  const socket = useContext(WebSocketContext)

  useEffect(() => {
    const fetchData = async () => {
      try {
        socket.on('connect', () => {
          console.log('Connected!')
        })

        socket.on('onRecieveLpr', (data) => {
          if (!isHandleRecieveLprCalled) {
            handleRecieveLpr(data)
            setIsHandleRecieveLprCalled(true)
          }
        })
      } catch (err) {
        console.log('error fetching Data')
      }
    }

    const clearMatchItems = () => {
      setMatchItems([])
      setIsHandleRecieveLprCalled(false)
    }

    fetchData()
    const interval = setInterval(clearMatchItems, 30000)

    return () => {
      console.log('Unregistering Events...')
      socket.off('connect')
      socket.off('onRecieveLpr')
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const updatedReceive = Object.keys(allLane).map((key) => {
      const lanes = allLane[key]
      const matchingDatas: ReceiveData =
        matchItems.find((item) => item.lane === lanes) || {}

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
    let hasBookingData = false
    if (data.length > 0) {
      data.forEach((item) => {
        if (item.bookingId) {
          console.log('data coming')
          setDataSource(data)
          hasBookingData = true
        } else if (item?.resultMessage) {
          console.log('no booking data')
          setIsOfficer(data)
        }
      })
      if (hasBookingData === false) {
        toast.success('ตรวจพบเป็นรถภายในองค์กร ระบบกำลังเปิดไม้กั้น')
        return
      }
    } else {
      console.log('no response data coming!!!!')
      setModalVisible(true)
    }
  }
  const testColumns: ColumnsType<BookingType> = [
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
          {text === 'late' && (
            <div className=" bg-amber rounded-md  h-8">
              <div className=" pt-1 text-center text-white font-medium">
                {text}
              </div>
            </div>
          )}
          {text === 'early' && (
            <div className=" bg-amber rounded-md  h-8">
              <div className=" pt-1 text-center text-white font-medium">
                {text}
              </div>
            </div>
          )}
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
        <>
          {text && (
            <div>
              <div className="ml-2">{dayjs(text).format('YYYY-MM-DD')}</div>
              <div className="text-green">
                ({dayjs(record.bookingStart, 'HH:mm:ss').format('HH:mm')} -{' '}
                {dayjs(record.bookingEnd, 'HH:mm:ss').format('HH:mm')})
              </div>
            </div>
          )}
        </>
      ),
    },
    {
      title: 'Manage',
      dataIndex: 'manage',
      key: 'manage',
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu onClick={(e) => handleMenuClick(e, record)}>
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

  const handleMenuClick = async (e: any, record: MenuClickParams) => {
    if (e.key === 'CheckIn') {
      const { e, bookingId, licensePlate, lane, plateImage, fullImage } = record
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
      const { bookingId } = record
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

  // const handleOfficer = () => {
  //   console.log('IsOfficer...')
  //   console.log(isOfficer)
  //   toast.success('ระบบกำลังเปิดไม้กั้น')
  // }
  const handleModalCancel = () => {
    setModalVisible(false)
  }
  const handleModalOk = async () => {
    console.log('License Plate Number', inputdata.license_plate_number)
    console.log('Lane', inputdata.lane)
    try {
      const response = await axios.post('http://localhost:3000/recieve', {
        license_plate_number: inputdata.license_plate_number,
        lane: inputdata.lane,
      })
      console.log(`Checking in successfully for booking of ${bookingId}`)
      console.log('Response:', response)
    } catch (error) {
      // toast.error('Fetch Data Error !!!')
      //อาจจะให้กรอกข้อมูลใหม่
      console.log('Input Not Correct')
    }
    setModalVisible(false)
  }
  return (
    <div>
      <div>
        <ToastContainer />
        <Table columns={testColumns} dataSource={receive} />
        <Modal
          title="Input LicensePlate and Lane"
          open={modalVisible}
          onCancel={handleModalCancel}
          onOk={handleModalOk}
        >
          <Input
            placeholder="Enter LicensePlate"
            value={inputdata.license_plate_number}
            onChange={(e) =>
              setInputData({
                ...inputdata,
                license_plate_number: e.target.value,
              })
            }
          />
          <Input
            className="mt-2"
            placeholder="Enter Lane"
            value={inputdata.lane}
            onChange={(e) =>
              setInputData({
                ...inputdata,
                lane: e.target.value,
              })
            }
          />
        </Modal>
      </div>
    </div>
  )
}
