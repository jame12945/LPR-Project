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
  Select,
  Popover,
  Radio,
} from 'antd'
import dayjs from 'dayjs'
import { IoChevronDownOutline } from 'react-icons/io5'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import type { NotificationArgsProps } from 'antd'
import Timer from './Timer'
import { FaCar } from 'react-icons/fa6'
type NotificationType = 'success' | 'info' | 'warning' | 'error'
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
}

type BOOKING_LIST_TYPE = {
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
  const [isError, setIsError] = useState<boolean>(false)
  const [checkResultMeassage, setCheckResultMeassage] = useState<boolean>()
  const [bookingData, setBookingData] = useState<BOOKING_LIST_TYPE[]>([])
  const [selectBookingIds, setSelectedBookingIds] = useState<string[]>([])
  const [api, contextHolder] = notification.useNotification()
  const [selectedBookings, setSelectedBookings] = useState<string[]>([])
  const [visible, setVisible] = useState(false)
  const [isOpenGateError, setIsOpenGateError] = useState<boolean>()

  const [inputdata, setInputData] = useState({
    license_plate_number: '',
    lane: '',
  })
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
            setIsOpenGateError(item.isOpenGateError)
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

        if (data.length > 1) setIsError(true)

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

  const handleMenuClick = async (e: any) => {
    const laneNumber = parseInt(lane)
    console.log('laneNumber......')
    console.log(laneNumber)
    console.log('BookingData.....')
    console.log(bookingData)
    try {
      let response
      if (e.key === 'CheckIn') {
        for (const bookingId of selectBookingIds) {
          const selectedBooking = bookingData.find(
            (el) => el.bookingId === bookingId
          )
          console.log('selectedBooking.....')
          console.log(selectedBooking)
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
      } else if (e.key === 'Reject') {
        for (const bookingId of selectBookingIds) {
          const selectedBooking = bookingData.find(
            (el) => el.bookingId === bookingId
          )
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
      toast.success(`Action ${e.key} successful`)
    } catch (error) {
      console.error(`Error on ${e.key}:`, error)
      toast.error(`Action ${e.key} failed`)
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
        <div className="grid grid-cols-9 mb-0 p-2 gap-1  ">
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
            {data?.full_image ? (
              checkResultMeassage ? (
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
              )
            ) : (
              <div className="flex flex-col gap-2 px-2">
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
                  disabled
                />
                <div className="w-full">
                  <Button className="w-full" onClick={handleRecieve} disabled>
                    Confirm
                  </Button>
                </div>
              </div>
            )}
          </div>

          {bookingData.length > 0 ? (
            <div className="bg-white rounded-md  flex items-center justify-center ">
              <div className="bg-white rounded-md  flex items-center justify-center">
                {bookingData.length === 1 ? (
                  <Popover
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
                              {dayjs(bookingData[0]?.bookingDate).format(
                                'YYYY-MM-DD'
                              )}
                            </div>
                            <div>{bookingData[0].bookingStart}</div>
                            <div>{bookingData[0]?.bookingEnd}</div>
                            <div>{bookingData[0]?.licensePlate}</div>
                            <div>{bookingData[0]?.warehouseCode}</div>
                            <div>{bookingData[0]?.truckType}</div>
                            <div>{bookingData[0]?.companyCode}</div>
                            <div>{bookingData[0]?.supCode}</div>
                            <div>{bookingData[0]?.supName}</div>
                            <div>{bookingData[0]?.operationType}</div>
                            <div>{bookingData[0]?.driverName}</div>
                            <div>{bookingData[0]?.telNo}</div>
                          </div>
                        </div>
                      </div>
                    }
                  >
                    <span>{bookingData[0].bookingId}</span>
                  </Popover>
                ) : (
                  <>
                    {bookingData.map((el, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          if (!selectedBookings.includes(el.bookingId)) {
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
            {data?.status == 'success' ? (
              <div className=" text-green">สำเร็จ</div>
            ) : data?.status == 'early' ? (
              <div className="text-orange">มาก่อนเวลาจอง</div>
            ) : data?.status == 'late' ? (
              <div className="text-orange">มาหลังเวลาจอง</div>
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
                <Menu onClick={(e) => handleMenuClick(e)}>
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
                  <Menu.Item
                    key="OpenGate"
                    disabled={
                      isOpenGateError === true || data?.resultMessage === true
                    }
                  >
                    OpenGate
                  </Menu.Item>
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
  const [allLane, setAllLane] = useState<LANE_LIST_TYPE[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [modalBookingVisible, setModalBookingVisible] = useState(false)
  const [modalBookingId, setModalBookingId] = useState(false)
  // const [api, contextHolder] = notification.useNotification()
  const [inputdata, setInputData] = useState({
    license_plate_number: '',
    lane: '',
  })
  const [selectedBookingId, setSelectedBookingId] =
    useState('Choose Booking Id')

  // const socket = useContext(WebSocketContext)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_GATEWAY_URL}door-setting`
        )
        const data = response.data.data
        const updatedAllLane = data.map((item: LANE_LIST_TYPE) => ({
          lane: item.lane.toString(),
          //add laneName
          LaneName: item.laneName,
        }))
        setAllLane(updatedAllLane)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])
  // useEffect(() => {
  //   let isDataReceived = false
  //   const fetchData = async () => {
  //     try {
  //       socket.on('connect', () => {
  //         console.log('Connected')
  //       })

  //       socket.on('onRecieveLpr', (data) => {
  //         if (!isHandleRecieveLprCalled) {
  //           handleRecieveLpr(data)
  //           setIsHandleRecieveLprCalled(true)
  //           isDataReceived = true
  //         }
  //       })
  //     } catch (error) {
  //       console.log('error fetching data')
  //     }
  //   }

  //   const clearMatchItem = () => {
  //     setMatchItems([])
  //     setIsHandleRecieveLprCalled(false)
  //   }
  //   fetchData()
  //   const cleanup = () => {
  //     if (!isDataReceived) {
  //       clearMatchItem()
  //     }
  //   }

  //   const interval = setInterval(cleanup, 30000)
  //   return () => {
  //     console.log('Unregistered Event!!')
  //     socket.off('connect')
  //     socket.off('onRecieveLpr')
  //     clearInterval(interval)
  //     setAllLane([])
  //   }
  // }, [])

  // useEffect(() => {
  //   console.log('allLane.....')
  //   console.log(allLane)
  //   const updatedReceive = Object.keys(allLane).map((key) => {
  //     const lanes = allLane[key]
  //     console.log('lanes--->', lanes)
  //     console.log('matchItems--->', matchItems)
  //     const matchingDatas: ReceiveData =
  //       matchItems.find((item) => item.lane === lanes.lane) || {}
  //     console.log('matchingDatas--->', matchingDatas)
  //     return {
  //       id: matchingDatas ? matchingDatas.id : '',
  //       lane: lanes,
  //       full_image: matchingDatas ? matchingDatas.full_image : '',
  //       plate_image: matchingDatas ? matchingDatas.plate_image : '',
  //       licensePlate: matchingDatas ? matchingDatas.licensePlate : '',
  //       bookingId: matchingDatas ? matchingDatas.bookingId : '',
  //       status: matchingDatas ? matchingDatas.status : '',
  //       bookingDate: matchingDatas ? matchingDatas.bookingDate : '',
  //       bookingStart: matchingDatas ? matchingDatas.bookingStart : '',
  //       bookingEnd: matchingDatas ? matchingDatas.bookingEnd : '',
  //       warehouseCode: matchingDatas ? matchingDatas.warehouseCode : '',
  //       companyCode: matchingDatas ? matchingDatas.companyCode : '',
  //       supCode: matchingDatas ? matchingDatas.supCode : '',
  //       supName: matchingDatas ? matchingDatas.supName : '',
  //       operationType: matchingDatas ? matchingDatas.operationType : '',
  //       driverName: matchingDatas ? matchingDatas.driverName : '',
  //       telNo: matchingDatas ? matchingDatas.telNo : '',
  //       truckType: matchingDatas ? matchingDatas.truckType : '',
  //       node_name: matchingDatas ? matchingDatas.node_name : '',
  //       resultMessage: matchingDatas ? matchingDatas.resultMessage : '',
  //       count: matchingDatas ? matchingDatas.count : '',
  //     }
  //   })
  //   setReceive(updatedReceive)
  // }, [matchItems, allLane])

  // const handleRecieveLpr = (data: BookingSocketData[]) => {
  //   console.log('Receive data')
  //   console.log(data)

  //   let hasBookingData = false
  //   if (data.length == 1) {
  //     data.forEach((item) => {
  //       if (item.bookingId && item.license_plate_number?.length == 7) {
  //         console.log('data coming')
  //         console.log(data)
  //         console.log(
  //           'Length of license_plate_number:',
  //           item.license_plate_number?.length
  //         )
  //         setMatchItems(data)
  //         setIsBooking(true)

  //         hasBookingData = false
  //       } else if (
  //         item.license_plate_number?.length != 7 &&
  //         item.license_plate_number?.length != 4
  //       ) {
  //         console.log(
  //           'Hello Length of license_plate_number:',
  //           item.license_plate_number?.length
  //         )
  //         setModalVisible(true)
  //         const saveLane = data[0].lane
  //         const saveFullImage = data[0].full_image
  //         const savePlateImage = data[0].plate_image
  //         setEachLane(saveLane)
  //         setPlateImage(savePlateImage)
  //         setFullImage(saveFullImage)
  //         setMatchItems(data)
  //         openNotification('top')
  //       } else if (item?.resultMessage) {
  //         //do heres
  //         console.log('no booking data')
  //         setMatchItems(data)

  //         hasBookingData = true
  //       } else if (
  //         item?.licensePlate &&
  //         item?.node_name &&
  //         item?.lane &&
  //         item?.plate_image &&
  //         item?.full_image
  //       ) {
  //         console.log('Hello Unregistered Car')
  //         const saveLane = data[0].lane
  //         const saveFullImage = data[0].full_image
  //         const savePlateImage = data[0].plate_image
  //         setEachLane(saveLane)
  //         setPlateImage(savePlateImage)
  //         setFullImage(saveFullImage)
  //         setMatchItems(data)
  //         openNotification('top')
  //       }
  //     })
  //     if (hasBookingData === true) {
  //       toast.success('ตรวจพบเป็น   รถภายในองค์กร ระบบกำลังเปิดไม้กั้น')

  //       //add open gate
  //       return
  //     }
  //   } else {
  //     //fix here
  //     console.log('More than one data coming!!!!')
  //     setMatchItems(data)
  //     setModalBookingId(true)
  //   }
  // }

  // const testColumns: ColumnsType<BookingType> = [
  //   {
  //     title: 'Lane',
  //     dataIndex: 'lane',
  //     key: 'lane',
  //     render: (_, record, index) => {
  //       const laneName =
  //         allLane.find((laneItem) => laneItem.lane == record.lane.lane)
  //           ?.LaneName || ''

  //       console.log('record.lane:', record.lane.lane)
  //       console.log('allLane:', allLane)
  //       console.log('laneName:', laneName)

  //       return laneName
  //     },
  //   },

  //   {
  //     title: 'MonitorRead',
  //     dataIndex: 'full_image',
  //     key: 'full_image',
  //     render: (text, record) => (
  //       <>
  //         {text && (
  //           <Image
  //             src={record.full_image}
  //             alt="Monitor Read fullImage"
  //             width={90}
  //             height={80}
  //           />
  //         )}
  //       </>
  //     ),
  //   },
  //   {
  //     title: 'License Plate',
  //     dataIndex: 'plate_image',
  //     key: 'plate_image',
  //     render: (text, record) => (
  //       <>
  //         {text && (
  //           <Image
  //             src={record.plate_image}
  //             alt="Monitor Read plateImage"
  //             width={80}
  //             height={60}
  //           />
  //         )}
  //       </>
  //     ),
  //   },
  //   {
  //     title: 'Car Registration',
  //     dataIndex: 'licensePlate',
  //     key: 'licensePlate',
  //   },
  //   {
  //     title: 'BookingId',
  //     dataIndex: 'bookingId',
  //     key: 'bookingId',
  //     render: (text, record) => (
  //       <>
  //         {record.bookingId && (
  //           <div
  //             className=" bg-sky rounded-md px-2 pt-1 h-8 flex justify-center cursor-pointer  hover:bg-rain hover:text-white"
  //             onClick={() => handleBooking(record)}
  //           >
  //             {text}
  //           </div>
  //         )}
  //       </>
  //     ),
  //   },
  //   {
  //     title: 'Status',
  //     dataIndex: 'status',
  //     key: 'status',
  //     render: (text, record) => (
  //       <>
  //         {text === 'success' && (
  //           <div className="bg-green rounded-md h-8 w-24">
  //             <div className="pt-1 text-center text-white font-medium">
  //               {text}
  //             </div>
  //           </div>
  //         )}
  //         {text === 'late' && (
  //           <div className=" bg-amber rounded-md  h-8 w-24">
  //             <div className=" pt-1 text-center text-white font-medium">
  //               {text}
  //             </div>
  //           </div>
  //         )}
  //         {text === 'early' && (
  //           <div className=" bg-amber rounded-md  h-8 w-24">
  //             <div className=" pt-1 text-center text-white font-medium">
  //               {text}
  //             </div>
  //           </div>
  //         )}
  //         {text != 'early' &&
  //           text != 'late' &&
  //           text != 'success' &&
  //           text == null &&
  //           record.count == null && (
  //             <div className=" bg-rain rounded-md  h-8 pt-1 w-24">
  //               <div className="flex justify-center">
  //                 <div className="  text-center text-white font-medium">
  //                   กำลังรอ
  //                 </div>
  //                 <Spin className="pt-1 pl-2 " />
  //               </div>
  //             </div>
  //           )}
  //         {text != 'early' &&
  //           text != 'late' &&
  //           text != 'success' &&
  //           record.count > 1 && (
  //             <div className=" bg-red rounded-md  h-8 pt-1 w-24">
  //               <div className="flex justify-center">
  //                 <div className="  text-center text-white font-medium">
  //                   MoreId
  //                 </div>
  //               </div>
  //             </div>
  //           )}
  //       </>
  //     ),
  //   },
  //   {
  //     title: 'BookingDate',
  //     dataIndex: 'bookingDate',
  //     key: 'bookingDate',
  //     render: (text, record) => (
  //       <>
  //         {text && (
  //           <div>
  //             <div className="ml-2">{dayjs(text).format('YYYY-MM-DD')}</div>
  //             <div className="text-green">
  //               ( {record.bookingStart.substring(0, 5)} -{' '}
  //               {record.bookingEnd.substring(0, 5)})
  //             </div>
  //           </div>
  //         )}
  //       </>
  //     ),
  //   },
  //   {
  //     title: 'Manage',
  //     dataIndex: 'manage',
  //     key: 'manage',
  //     render: (_, record) => (
  //       <>
  //         {isBooking &&
  //           record.bookingId &&
  //           record.bookingStart &&
  //           !record.resultMessage &&
  //           record.count == 1 &&
  //           record.status != 'success' && (
  //             <Dropdown
  //               overlay={
  //                 <Menu onClick={(e) => handleMenuClick(e, record)}>
  //                   <Menu.Item key="CheckIn">CheckIn And OpenGate</Menu.Item>
  //                   <Menu.Item key="OpenGate">OpenGate</Menu.Item>
  //                   <Menu.Item key="Reject">Reject</Menu.Item>
  //                 </Menu>
  //               }
  //             >
  //               <Button className="bg-sky flex">
  //                 <span>Action</span>
  //                 <div className="flex items-center justify-center ml-2 mt-1.5 ">
  //                   <IoChevronDownOutline />
  //                 </div>
  //               </Button>
  //             </Dropdown>
  //           )}
  //         {!record.bookingId &&
  //           record.lane &&
  //           record.full_image &&
  //           !record.resultMessage && (
  //             <Dropdown
  //               overlay={
  //                 <Menu onClick={(e) => handleMenuClick(e, record)}>
  //                   <Menu.Item key="OpenGate">OpenGate</Menu.Item>
  //                   <Menu.Item key="FillData">FillData</Menu.Item>
  //                   <Menu.Item key="Reject">Reject</Menu.Item>
  //                 </Menu>
  //               }
  //             >
  //               <Button className="bg-sky flex">
  //                 <span>Action</span>
  //                 <div className="flex items-center justify-center ml-2 mt-1.5">
  //                   <IoChevronDownOutline />
  //                 </div>
  //               </Button>
  //             </Dropdown>
  //           )}

  //         {record.bookingId && record.count > 1 && (
  //           <Dropdown
  //             overlay={
  //               <Menu onClick={(e) => handleMenuClick(e, record)}>
  //                 <Menu.Item key="CheckIn">CheckIn And OpenGate</Menu.Item>
  //                 <Menu.Item key="OpenGate">OpenGate</Menu.Item>
  //                 <Menu.Item key="Reject">Reject</Menu.Item>
  //               </Menu>
  //             }
  //           >
  //             <Button className="bg-sky flex">
  //               <span>Action</span>
  //               <div className="flex items-center justify-center ml-2 mt-1.5 ">
  //                 <IoChevronDownOutline />
  //               </div>
  //             </Button>
  //           </Dropdown>
  //         )}
  //       </>
  //     ),
  //   },
  // ]

  const handleModalCancel = () => {
    setModalVisible(false)
  }
  const handleModalBookingCancel = () => {
    setModalBookingVisible(false)
    setModalBookingId(false)
  }
  const handleModalBookingCancle = () => {
    setModalBookingVisible(false)
  }
  const handleModalBookingOk = async () => {
    console.log('Selected BookingId:', selectedBookingId)
    console.log('Lane:', eachLane)
    console.log('Plate Image:', plateImage)
    console.log('Full Image:', fullImage)

    try {
      const selectedData = matchItems.find(
        (item) => item.bookingId === selectedBookingId
      )

      if (selectedData) {
        console.log('Selected Data:', selectedData)
        setMatchItems([selectedData])
      } else {
        console.log('BookingId not found in matchItems')
      }
    } catch (error) {
      console.log('Error:', error.message)
    }

    setModalBookingVisible(false)
    setModalBookingId(false)
  }

  const handleModalOk = async () => {
    console.log('License Plate Number', inputdata.license_plate_number)
    console.log('Lane', eachLane)
    console.log('plateImage', plateImage)
    console.log('fullImage', fullImage)
    console.log('nodename', null)
    const laneNumber = parseInt(eachLane)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_GATEWAY_URL}recieve`,
        {
          license_plate_number: inputdata.license_plate_number,
          lane: laneNumber,
          plate_image: plateImage,
          full_image: fullImage,
          node_name: 'nodename', //Fix later
        }
      )
      console.log(`Checking in successfully for booking of ${bookingId}`)
      console.log('Response:', response)
    } catch (error) {
      console.log('Input Not Correct')
    }
    setModalVisible(false)
  }

  return (
    <div className="px-4">
      <div>
        <Timer />
        <ToastContainer />
        <div className=" grid grid-cols-9 mb-0 p-2 gap-">
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
        {/* test */}
        <Modal
          title="Select BookingId"
          open={modalBookingId}
          onCancel={handleModalBookingCancel}
          onOk={handleModalBookingOk}
        >
          <Select
            defaultValue="Select BookingId"
            value={selectedBookingId}
            onChange={(value) => setSelectedBookingId(value)}
            placeholder="Select BookingId"
          >
            {matchItems.map((item) => (
              <Select.Option key={item.bookingId} value={item.bookingId}>
                {item.bookingId}
              </Select.Option>
            ))}
          </Select>
        </Modal>

        <Modal
          title={`Booking Details : ${selectedBooking?.bookingId}`}
          open={modalBookingVisible}
          onCancel={handleModalBookingCancle}
          footer={null}
        >
          {' '}
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
                {dayjs(selectedBooking?.bookingDate).format('YYYY-MM-DD')}
              </div>
              <div>{selectedBooking?.bookingStart}</div>
              <div>{selectedBooking?.bookingEnd}</div>
              <div>{selectedBooking?.licensePlate}</div>
              <div>{selectedBooking?.warehouseCode}</div>
              <div>{selectedBooking?.truckType}</div>
              <div>{selectedBooking?.companyCode}</div>
              <div>{selectedBooking?.supCode}</div>
              <div>{selectedBooking?.supName}</div>
              <div>{selectedBooking?.operationType}</div>
              <div>{selectedBooking?.driverName}</div>
              <div>{selectedBooking?.telNo}</div>
            </div>
          </div>
        </Modal>
        {/* {contextHolder} */}
      </div>
    </div>
  )
}
