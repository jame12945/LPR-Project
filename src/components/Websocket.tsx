import { useContext, useEffect, useState } from 'react'
import { WebSocketContext } from '../contexts/WebsocketContext'
import {
  Table,
  Menu,
  Dropdown,
  Button,
  Input,
  Modal,
  Spin,
  Image,
  Divider,
  notification,
  Space,
} from 'antd'
import dayjs from 'dayjs'
import { IoChevronDownOutline } from 'react-icons/io5'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import { BookingSocketData } from '../type/booking'
import { ColumnsType } from 'antd/es/table'
import type { NotificationArgsProps } from 'antd'

type NotificationPlacement = NotificationArgsProps['placement']

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
  node_name: string
  resultMessage: string
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
  warehouseCode: string
  truckType: string
  companyCode: string
  supCode: string
  supName: string
  operationType: string
  driverName: string
  lane: string
  telNo: string
  node_name: string
  resultMessage: string
}

export interface MenuClickParams {
  bookingId: string
  licensePlate: string
  lane: string
  plateImage: string
  fullImage: string
}
export const WebSocket = () => {
  const [selectedId, setSelectedId] = useState('')
  const [licensePlate, setlicensePlate] = useState('')
  const [lane, setLane] = useState([])
  const [eachLane, setEachLane] = useState('')
  const [plateImage, setPlateImage] = useState('')
  const [fullImage, setFullImage] = useState('')
  const [receive, setReceive] = useState([])
  const [isOfficer, setIsOfficer] = useState([])
  const [matchItems, setMatchItems] = useState([])
  const [isBooking, setIsBooking] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<ReceiveData | null>(
    null
  )
  const [isHandleRecieveLprCalled, setIsHandleRecieveLprCalled] =
    useState(false)
  const [allLane, setAllLane] = useState({
    lane1: '1',
    lane2: '2',
    lane3: '3',
    lane4: '4',
    lane5: '5',
    lane6: '6',
  })
  const [modalVisible, setModalVisible] = useState(false)
  const [modalBookingVisible, setModalBookingVisible] = useState(false)
  const [api, contextHolder] = notification.useNotification()
  const [inputdata, setInputData] = useState({
    license_plate_number: '',
    lane: '',
  })

  const socket = useContext(WebSocketContext)

  useEffect(() => {
    let isDataReceived = false
    const fetchData = async () => {
      try {
        socket.on('connect', () => {
          console.log('Connected')
        })

        socket.on('onRecieveLpr', (data) => {
          if (!isHandleRecieveLprCalled) {
            handleRecieveLpr(data)
            setIsHandleRecieveLprCalled(true)
            isDataReceived = true
          }
        })
      } catch (error) {
        console.log('error fetching data')
      }
    }

    const clearMatchItem = () => {
      setMatchItems([])
      setIsHandleRecieveLprCalled(false)
    }
    fetchData()
    const cleanup = () => {
      if (!isDataReceived) {
        clearMatchItem()
      }
    }

    const interval = setInterval(cleanup, 30000)
    return () => {
      console.log('Unregistered Event!!')
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
        warehouseCode: matchingDatas ? matchingDatas.warehouseCode : '',
        companyCode: matchingDatas ? matchingDatas.companyCode : '',
        supCode: matchingDatas ? matchingDatas.supCode : '',
        supName: matchingDatas ? matchingDatas.supName : '',
        operationType: matchingDatas ? matchingDatas.operationType : '',
        driverName: matchingDatas ? matchingDatas.driverName : '',
        telNo: matchingDatas ? matchingDatas.telNo : '',
        truckType: matchingDatas ? matchingDatas.truckType : '',
        node_name: matchingDatas ? matchingDatas.node_name : '',
        resultMessage: matchingDatas ? matchingDatas.resultMessage : '',
      }
    })
    setReceive(updatedReceive)
  }, [matchItems, allLane])

  const handleRecieveLpr = (data: BookingSocketData[]) => {
    console.log('Receive data')
    console.log(data)

    let hasBookingData = false
    if (data.length > 0) {
      data.forEach((item) => {
        if (item.bookingId) {
          console.log('data coming')
          setMatchItems(data)
          setIsBooking(true)

          hasBookingData = false
        } else if (item?.resultMessage) {
          //do heres
          console.log('no booking data')
          setMatchItems(data)

          hasBookingData = true
        } else if (
          item?.licensePlate &&
          item?.node_name &&
          item?.lane &&
          item?.plate_image &&
          item?.full_image
        ) {
          console.log('Hello Unregistered Car')
          const saveLane = data[0].lane
          const saveFullImage = data[0].full_image
          const savePlateImage = data[0].plate_image
          setEachLane(saveLane)
          setPlateImage(savePlateImage)
          setFullImage(saveFullImage)
          setMatchItems(data)
          openNotification('top')
        }
      })
      if (hasBookingData === true) {
        toast.success('ตรวจพบเป็นรถภายในองค์กร ระบบกำลังเปิดไม้กั้น')
        return
      }
    } else {
      //fix here
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
            <Image
              src={record.full_image}
              alt="Monitor Read fullImage"
              width={90}
              height={80}
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
            <Image
              src={record.plate_image}
              alt="Monitor Read plateImage"
              width={80}
              height={60}
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
      render: (text, record) => (
        <>
          {record.bookingId && (
            <div
              className=" bg-sky rounded-md px-2 pt-1 h-8 flex justify-center cursor-pointer  hover:bg-rain hover:text-white"
              onClick={() => handleBooking(record)}
            >
              {text}
            </div>
          )}
        </>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <>
          {text === 'success' && (
            <div className="bg-green rounded-md h-8 w-24">
              <div className="pt-1 text-center text-white font-medium">
                {text}
              </div>
            </div>
          )}
          {text === 'late' && (
            <div className=" bg-amber rounded-md  h-8 w-24">
              <div className=" pt-1 text-center text-white font-medium">
                {text}
              </div>
            </div>
          )}
          {text === 'early' && (
            <div className=" bg-amber rounded-md  h-8 w-24">
              <div className=" pt-1 text-center text-white font-medium">
                {text}
              </div>
            </div>
          )}
          {text != 'early' && text != 'late' && text != 'success' && (
            <div className=" bg-rain rounded-md  h-8 pt-1 w-24">
              <div className="flex justify-center">
                <div className="  text-center text-white font-medium">
                  waiting
                </div>
                <Spin className="pt-1 pl-2 " />
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
        <>
          {isBooking &&
            record.bookingId &&
            record.bookingStart &&
            !record.resultMessage &&
            record.status != 'success' && (
              <Dropdown
                overlay={
                  <Menu onClick={(e) => handleMenuClick(e, record)}>
                    <Menu.Item key="CheckIn">CheckIn</Menu.Item>
                    <Menu.Item key="OpenGate">OpenGate</Menu.Item>
                    <Menu.Item key="Reject">Reject</Menu.Item>
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
            )}
          {!record.bookingId &&
            record.lane &&
            record.full_image &&
            !record.resultMessage && (
              <Dropdown
                overlay={
                  <Menu onClick={(e) => handleMenuClick(e, record)}>
                    <Menu.Item key="OpenGate">OpenGate</Menu.Item>
                    <Menu.Item key="FillData">FillData</Menu.Item>
                    <Menu.Item key="Reject">Reject</Menu.Item>
                  </Menu>
                }
              >
                <Button className="bg-sky flex">
                  <span>Action</span>
                  <div className="flex items-center justify-center ml-2 mt-1.5">
                    <IoChevronDownOutline />
                  </div>
                </Button>
              </Dropdown>
            )}
        </>
      ),
    },
  ]
  const openNotification = (placement: NotificationPlacement) => {
    api.info({
      message: 'Booking Not Found',
      description: (
        <div>
          กรุณาให้ รปภ.เป็นผู้ทำการอนุญาติ <br /> เพื่อให้รถผ่านเข้าไปข้างใน
        </div>
      ),
      placement,
    })
  }

  const handleMenuClick = async (e: any, record: MenuClickParams) => {
    if (e.key === 'CheckIn') {
      const { e, bookingId, licensePlate, lane, plateImage, fullImage } = record

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
    } else if (e.key === 'FillData') {
      setModalVisible(true)
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

  const handleModalCancel = () => {
    setModalVisible(false)
  }
  const handleModalBookingCancle = () => {
    setModalBookingVisible(false)
  }
  const handleModalOk = async () => {
    console.log('License Plate Number', inputdata.license_plate_number)
    console.log('Lane', eachLane)
    try {
      const response = await axios.post('http://localhost:3000/recieve', {
        license_plate_number: inputdata.license_plate_number,
        lane: eachLane,
        plate_image: plateImage,
        full_image: fullImage,
      })
      console.log(`Checking in successfully for booking of ${bookingId}`)
      console.log('Response:', response)
    } catch (error) {
      console.log('Input Not Correct')
    }
    setModalVisible(false)
  }

  const handleBooking = (record: ReceiveData) => {
    setSelectedBooking(record)
    setModalBookingVisible(true)
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
        </Modal>
        <Modal
          title={`Booking Details : ${selectedBooking?.bookingId}`}
          open={modalBookingVisible}
          onCancel={handleModalBookingCancle}
          footer={null}
        >
          <div className=" grid grid-flow-col justify-stretch">
            <div>
              <p>Booking Id: {selectedBooking?.bookingId}</p>
              <p>
                Booking Date:{' '}
                {dayjs(selectedBooking?.bookingDate).format('YYYY-MM-DD')}
              </p>
              <p>Booking Start:{selectedBooking?.bookingStart}</p>
              <p>Booking End: {selectedBooking?.bookingEnd}</p>
              <p>TruckLicensePlate: {selectedBooking?.licensePlate}</p>
              <p>Warehouse Code: {selectedBooking?.warehouseCode}</p>
              <p>Truck Type: {selectedBooking?.truckType}</p>
            </div>
            <div>
              <p> Company Code: {selectedBooking?.companyCode}</p>
              <p> Sup Code: {selectedBooking?.supCode}</p>
              <p> Sup Name: {selectedBooking?.supName}</p>
              <p> operationType: {selectedBooking?.operationType}</p>
              <p> Driver Name: {selectedBooking?.driverName}</p>
              <p>Lane: {selectedBooking?.lane}</p>
              <p> Tel: {selectedBooking?.telNo}</p>
            </div>
          </div>
        </Modal>
        {contextHolder}
      </div>
    </div>
  )
}
