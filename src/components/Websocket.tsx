import { useContext, useEffect, useState } from 'react'
import { WebSocketContext } from '../contexts/WebsocketContext'
import {
  Menu,
  Dropdown,
  Button,
  Input,
  Modal,
  Image,
  notification,
  Popover,
  Radio,
} from 'antd'
import dayjs from 'dayjs'
import { IoChevronDownOutline } from 'react-icons/io5'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import Timer from './Timer'
import { FaCar } from 'react-icons/fa6'

type NotificationType = 'success' | 'info' | 'warning' | 'error'

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
  count: number
}
export interface ReceiveData {
  isOpenGateError: boolean
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
  resultMessage: boolean
  id: number
  count: number
  arrivalTime: string
  isCheckIn: boolean
  isReject: boolean
}

export interface MenuClickParams {
  bookingId: string
  licensePlate: string
  lane: string
  plateImage: string
  fullImage: string
  id: number
}

type LANE_COMPONENT_TYPE = {
  lane: string
  lane_name: string
}

type LANE_LIST_TYPE = {
  lane: string
  laneName: string
  LaneName: string
}

type BOOKING_LIST_TYPE = {
  id: number
  bookingId: string
  bookingDate: string
  bookingStart: string
  bookingEnd: string
  licensePlate: string
  warehouseCode: string
  truckType: string
  companyCode: string
  supCode: string
  supName: string
  operationType: string
  driverName: string
  telNo: string
  lane: string
}

const LaneComponent = ({ lane, lane_name }: LANE_COMPONENT_TYPE) => {
  const socket = useContext(WebSocketContext)
  const [data, setData] = useState<ReceiveData>()
  const [checkResultMeassage, setCheckResultMeassage] = useState<boolean>()
  const [bookingData, setBookingData] = useState<BOOKING_LIST_TYPE[]>([])
  const [selectBookingIds, setSelectedBookingIds] = useState<string[]>([])
  const [api, contextHolder] = notification.useNotification()
  const [visible, setVisible] = useState(false)
  const [inputdata, setInputData] = useState({
    license_plate_number: '',
    lane: '',
  })
  const formattedArrivalTime = dayjs(data?.arrivalTime).format('DD/MM/YY HH:mm')
  const openNotificationWithIcon = (type: NotificationType) => {
    api[type]({
      message: 'Open Gate Error',
      description: 'ระบบเปิดไม้กั้นเกิดขัอผิดพลาด',
    })
  }

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected')
    })

    socket.on('onRecieveLpr', (data: ReceiveData[]) => {
      const isCorrectLane = data.find((el) => el.lane === lane)

      if (isCorrectLane) {
        console.log(data)
        console.log('checkResultMeassage')
        console.log(checkResultMeassage)

        data.forEach((item) => {
          console.log('data resultmessage', item.resultMessage)
          setCheckResultMeassage(item.resultMessage)
          if (item.isOpenGateError === true) {
            console.log('data isOpenGateError', item.isOpenGateError)
            openNotificationWithIcon('error')
          }
        })
        if (data.length === 1) {
          // const singleData = data.find((el) => el.lane === lane)
          data.forEach((item) => {
            console.log('hello!!!!!')
            console.log(item.bookingId)
            console.log(item.licensePlate)
            setSelectedBookingIds([...selectBookingIds, item.bookingId])
          })
        }

        const bookingData = data.map((el) => ({
          bookingId: el.bookingId,
          bookingDate: el.bookingDate,
          bookingStart: el.bookingStart,
          bookingEnd: el.bookingEnd,
          licensePlate: el.licensePlate,
          warehouseCode: el.warehouseCode,
          truckType: el.truckType,
          companyCode: el.companyCode,
          supCode: el.supCode,
          supName: el.supName,
          operationType: el.operationType,
          driverName: el.driverName,
          telNo: el.telNo,
          id: el.id,
          lane: el.lane,
        }))

        setBookingData(bookingData)
        setData(data[0])
        setInputData((prev) => ({
          ...prev,
          license_plate_number: data[0].licensePlate,
        }))
      }
    })
  }, [lane, socket])

  useEffect(() => {
    const updatedBookingData = bookingData.map((el) => ({
      ...el,
      selected: selectBookingIds.includes(el.bookingId),
    }))
    setBookingData(updatedBookingData)
  }, [selectBookingIds])

  const handleMenuClick = async ({ key }: { key: React.Key }) => {
    const action = key as string
    const laneNumber = parseInt(lane)

    try {
      let response

      if (action === 'CheckIn') {
        for (const bookingId of selectBookingIds) {
          const selectedBooking = bookingData.find(
            (el) => el.bookingId === bookingId
          )

          if (selectedBooking) {
            response = await axios.post(
              `${import.meta.env.VITE_API_GATEWAY_URL}bookings/check-in`,
              {
                licensePlate: selectedBooking.licensePlate,
                bookingId: selectedBooking.bookingId,
                lane: laneNumber || null,
                id: selectedBooking.id || null,
              }
            )

            console.log(
              `Check-in successful for booking ${selectedBooking.bookingId}`
            )
            console.log('Response:', response.data.data)
            setData({ ...data, ...response.data.data })
          }
        }
      } else if (action === 'Reject') {
        for (const bookingId of selectBookingIds) {
          const selectedBooking = bookingData.find(
            (el) => el.bookingId === bookingId
          )

          if (selectedBooking) {
            response = await axios.post(
              `${import.meta.env.VITE_API_GATEWAY_URL}bookings/reject`,
              {
                licensePlate: selectedBooking.licensePlate,
                bookingId: selectedBooking.bookingId || null,
                lane: laneNumber,
                id: selectedBooking.id || null,
              }
            )

            console.log(
              `Reject successful for booking ${selectedBooking.bookingId}`
            )

            console.log('Response:', response.data)
            setData({ ...data, ...response.data.data })
          }
        }
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_GATEWAY_URL}open-gate`,
          {
            lane: laneNumber,
          }
        )

        console.log('Open Gate successful')
        console.log('Response:', response.data)
      }

      toast.success(`Action ${action} successful`)
    } catch (error) {
      console.error(`Error on ${action}:`, error)
      toast.error(`Action ${action} failed`)
    }
  }

  const handleRecieve = async () => {
    console.log('License Plate Number', inputdata.license_plate_number)
    console.log('Lane', lane)
    console.log('plateImage', data?.plate_image)
    console.log('fullImage', data?.full_image)

    const laneNumber = parseInt(lane)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_GATEWAY_URL}recieve`,
        {
          license_plate_number: inputdata.license_plate_number,
          lane: laneNumber,
          plate_image: data?.plate_image,
          full_image: data?.full_image,
          node_name: 'nodename',
        }
      )

      console.log('Response:', response.data)
    } catch (error) {
      console.log('Input Not Correct')
    }
  }

  const handleBookingsButtonClick = () => {
    setVisible(true)
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const handleOk = () => {
    setVisible(false)
  }
  return (
    <>
      {contextHolder}

      <div className=" bg-grey rounded-md">
        <div className="grid grid-cols-10 mb-0 p-2 gap-1  ">
          <div className="bg-white rounded-md  flex items-center justify-center">
            {lane_name}
          </div>
          <div className="bg-white rounded-md flex items-center justify-center ">
            {data?.plate_image ? (
              <Image
                src={data.plate_image}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex w-full h-full px-2">
                <div className="flex w-full h-full items-center justify-center">
                  <p className="px-6 py-3 rounded-md text-ocenblue font-bold bg-white border-4 border-solid border-ocenblue">
                    MM-2024
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-md flex items-center justify-center overflow-hidden">
            {data?.full_image ? (
              <Image
                src={data.full_image}
                className="h-full w-full object-cover"
              />
            ) : (
              <FaCar className="text-9xl text-ocenblue" />
            )}
          </div>
          <div className="bg-white rounded-md flex items-center justify-center">
            {checkResultMeassage ? (
              <div className=" flex items-center justify-center  ">
                {data?.licensePlate}
              </div>
            ) : data?.arrivalTime ? (
              <div className=" flex items-center justify-center  ">
                {data?.licensePlate}
              </div>
            ) : (
              <div className="flex flex-col px-2 gap-2">
                <Input
                  className="w-full"
                  placeholder="Enter LicensePlate"
                  value={inputdata.license_plate_number}
                  onChange={(e) =>
                    setInputData({
                      ...inputdata,
                      license_plate_number: e.target.value,
                    })
                  }
                  allowClear
                />
                <div className="w-full">
                  <Button className="w-full" onClick={handleRecieve}>
                    Confirm
                  </Button>
                </div>
              </div>
            )}
          </div>

          {bookingData.length > 0 ? (
            <div className="bg-white rounded-md  flex items-center justify-center ">
              <div className="bg-white rounded-md  flex items-center justify-center">
                {selectBookingIds.length === 0 ? (
                  <>
                    {bookingData.map((el, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          if (!selectBookingIds.includes(el.bookingId)) {
                            setSelectedBookingIds([
                              ...selectBookingIds,
                              el.bookingId,
                            ])
                          } else {
                            setSelectedBookingIds(
                              selectBookingIds.filter(
                                (id) => id !== el.bookingId
                              )
                            )
                          }
                        }}
                      ></div>
                    ))}
                    <Button onClick={handleBookingsButtonClick}>
                      Bookings
                    </Button>
                  </>
                ) : (
                  <span>{selectBookingIds.join(', ')}</span>
                )}
              </div>
              <Modal
                title="Select Bookings"
                open={visible}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <Radio.Group value={selectBookingIds[0]}>
                  {bookingData.map((el, index) => (
                    <Radio
                      key={index}
                      onChange={(e) => {
                        if (e.target.value) {
                          setSelectedBookingIds([el.bookingId])
                        }
                      }}
                      value={el.bookingId}
                    >
                      <Popover
                        key={index}
                        content={
                          <div>
                            <div className="grid grid-flow-col justify-stretch">
                              <div>
                                <p>Booking Date:</p>
                                <p>Booking Start:</p>
                                <p>Booking End:</p>
                                <p>Plate Number:</p>
                                <p>Warehouse Code:</p>
                                <p>Truck Type:</p>
                                <p> Company Code:</p>
                                <p> Sup Code:</p>
                                <p> Sup Name:</p>
                                <p> Operation Type:</p>
                                <p> Driver Name:</p>
                                <p> Tel:</p>
                              </div>

                              <div className="pl-10">
                                <div>
                                  {dayjs(el?.bookingDate).format('YYYY-MM-DD')}
                                </div>
                                <div>{el?.bookingStart}</div>
                                <div>{el?.bookingEnd}</div>
                                <div>{el?.licensePlate}</div>
                                <div>{el?.warehouseCode}</div>
                                <div>{el?.truckType}</div>
                                <div>{el?.companyCode}</div>
                                <div>{el?.supCode}</div>
                                <div>{el?.supName}</div>
                                <div>{el?.operationType}</div>
                                <div>{el?.driverName}</div>
                                <div>{el?.telNo}</div>
                              </div>
                            </div>
                          </div>
                        }
                      >
                        {el.bookingId}
                      </Popover>
                    </Radio>
                  ))}
                </Radio.Group>
              </Modal>
            </div>
          ) : (
            <div className="bg-white flex items-center justify-center ">
              <div className=" rounded-md  h-8 pt-1 w-24">
                <div className="flex justify-center">
                  <span className="text-blue bg-white text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded border border-blue-400">
                    กำลังรอ
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-md  flex items-center justify-center">
            {data?.driverName ? (
              data?.driverName
            ) : (
              <div className="  rounded-md  h-8 pt-1 w-24">
                <div className="flex justify-center">
                  <span className="text-blue bg-white text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded border border-blue-400">
                    กำลังรอ
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="bg-white rounded-md  flex items-center justify-center">
            {data?.arrivalTime ? formattedArrivalTime : ''}
          </div>
          <div className="bg-white rounded-md  flex items-center justify-center">
            {data?.status == 'success' ? (
              <div className=" text-green">สำเร็จ</div>
            ) : data?.status == 'early' ? (
              <div className="text-orange">มาก่อนเวลาจอง</div>
            ) : data?.status == 'late' ? (
              <div className="text-orange">มาหลังเวลาจอง</div>
            ) : data?.status == 'bookingNotFound' ? (
              <div className="text-red">ไม่พบการจอง</div>
            ) : (
              <div className=" rounded-md  h-8 pt-1 w-24">
                <div className="flex justify-center">
                  <span className="text-blue bg-white text-xs font-medium me-2 px-2.5 py-0.5 rounded border border-blue-400">
                    กำลังรอ
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="bg-white rounded-md  flex items-center justify-center">
            {data?.isCheckIn ? (
              <div>CheckIn สำเร็จ</div>
            ) : data?.isReject ? (
              <div>ยกเลิกรายการ</div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="bg-white rounded-md  flex items-center justify-center">
            <Dropdown
              overlay={
                <Menu onClick={handleMenuClick}>
                  <Menu.Item
                    key="CheckIn"
                    disabled={
                      !selectBookingIds.length ||
                      !bookingData.some((el) => el.bookingId) ||
                      data?.isCheckIn
                    }
                  >
                    CheckIn And OpenGate
                  </Menu.Item>
                  <Menu.Item key="OpenGate">OpenGate</Menu.Item>
                  <Menu.Item
                    key="Reject"
                    disabled={
                      !selectBookingIds.length ||
                      !bookingData.some((el) => el.lane && el.licensePlate) ||
                      data?.isCheckIn
                    }
                  >
                    Reject
                  </Menu.Item>
                </Menu>
              }
            >
              <Button className="bg-sky flex rounded-md">
                <span>Action</span>
                <div className="flex items-center justify-center ml-2 mt-1.5 ">
                  <IoChevronDownOutline />
                </div>
              </Button>
            </Dropdown>
          </div>
        </div>
      </div>
    </>
  )
}

export const WebSocket = () => {
  const [allLane, setAllLane] = useState<LANE_LIST_TYPE[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_GATEWAY_URL}door-setting`
        )
        const data = response.data.data
        const updatedAllLane = data.map((item: LANE_LIST_TYPE) => ({
          lane: item.lane.toString(),
          LaneName: item.laneName,
        }))
        setAllLane(updatedAllLane)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="px-4">
      <div>
        <Timer />
        <ToastContainer />
        <div className=" grid grid-cols-10 mb-0 p-2 gap-">
          <div className="text-sky flex items-center justify-center font-semibold ">
            Lane Name
          </div>
          <div className="text-sky flex items-center justify-center font-semibold  ">
            License Plate Image
          </div>
          <div className="text-sky flex items-center justify-center font-semibold  ">
            Car Image
          </div>
          <div className="text-sky flex items-center justify-center font-semibold  ">
            License Plate
          </div>
          <div className="text-sky flex items-center justify-center font-semibold ">
            Booking Id
          </div>
          <div className="text-sky flex items-center justify-center font-semibold ">
            Driver
          </div>
          <div className="text-sky flex items-center justify-center font-semibold  ">
            Date/Time
          </div>
          <div className="text-sky flex items-center justify-center font-semibold  ">
            Status
          </div>
          <div className="text-sky flex items-center justify-center font-semibold  ">
            CheckIn / Reject
          </div>
          <div className="text-sky flex items-center justify-center font-semibold  ">
            Action
          </div>
        </div>
        {allLane.map((el) => (
          <LaneComponent lane={el.lane} lane_name={el.LaneName} />
        ))}
      </div>
    </div>
  )
}
