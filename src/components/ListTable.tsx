import {
  Table,
  Input,
  Modal,
  Button,
  notification,
  NotificationArgsProps,
} from 'antd'
import axios from 'axios'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { GiTruck } from 'react-icons/gi'
import Timer from './Timer'
import { ColumnsType } from 'antd/es/table'
import { ListData } from '../type/booking'

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
}

type RECEIVE_DATA = {
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
  id: number
}

type NotificationPlacement = NotificationArgsProps['placement']

const url = `${import.meta.env.VITE_API_GATEWAY_URL}`

function ListComponent() {
  const [list, setList] = useState<BOOKING_LIST_TYPE[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [api, contextHolder] = notification.useNotification()
  const [selectedBooking, setSelectedBooking] = useState<RECEIVE_DATA | null>(
    null
  )

  useEffect(() => {
    const getList = async () => {
      try {
        const response = await axios.get(
          `${url}bookings/list-view/${searchValue}`
        )
        console.log(response.data.data.filterDateBooking)
        const listData = response.data.data.filterDateBooking
        setList(listData)
      } catch (error) {
        console.log(error)
        return error
      }
    }
    getList()
  }, [searchValue])

  const handleBooking = (e) => {
    setSelectedBooking(e)
    setModalVisible(true)
  }

  const handleModalCancel = () => {
    setModalVisible(false)
  }

  const alertNotification = (
    placement: NotificationPlacement,
    statusMessage: string
  ) => {
    const notificationConfig: any = {
      message: '',
      description: statusMessage,
      placement,
    }
    if (statusMessage === 'เช็คอินสำเร็จ') {
      notificationConfig.message = 'Check In Successfully'
    } else {
      notificationConfig.message = 'Check In Error'
    }

    api.info(notificationConfig)
  }

  const handleCheckIn = async (bookingId: string, licensePLate: string) => {
    console.log('check in')

    try {
      const response = await axios.post(`${url}bookings/check-in`, {
        bookingId: bookingId,
        licensePLate: licensePLate,
      })
      console.log(`Checking in successfully for booking of ${bookingId}`)
      console.log('Response:', response.data.statusMessage)
      const succesStatus = response.data.statusMessage.toString()
      alertNotification('top', succesStatus)
    } catch (error) {
      console.log(error.response.data.statusMessage.toString())
      const errorStatus = error.response.data.statusMessage.toString()
      alertNotification('top', errorStatus)
    }
  }

  const listCol: ColumnsType<ListData> = [
    {
      title: 'No.',
      dataIndex: 'no',
      render: (text: any, event: any, index: number) => `${index + 1}`,
    },
    {
      title: 'Type',
      dataIndex: 'truckType',
      render: (truckType: string) => (
        <div className="flex">
          <GiTruck className="text-4xl mr-4" />
          <div className="mt-2">{truckType}</div>
        </div>
      ),
    },
    {
      title: 'Appointment Date',
      dataIndex: 'bookingDate',
      render: (bookingDate: string, event: any) => {
        const bookingStart = event.bookingStart
          ? event.bookingStart.substring(0, 5)
          : ''
        const bookingEnd = event.bookingEnd
          ? event.bookingEnd.substring(0, 5)
          : ''
        return (
          <div>
            <div className="ml-2">
              {dayjs(bookingDate).format('YYYY-MM-DD')}
            </div>
            <div className="text-green">
              ({bookingStart} - {bookingEnd})
            </div>
          </div>
        )
      },
    },
    {
      title: 'Car Registration',
      dataIndex: 'licensePlate',
    },
    {
      title: 'Driver',
      dataIndex: 'driverName',
    },
    {
      title: 'Booking Id',
      dataIndex: 'bookingId',
      render: (bookingId: string, event: any) => (
        <>
          <div
            className="bg-sky rounded-md px-2 py-1.5 text-center hover:bg-rain hover:text-white cursor-pointer"
            onClick={() => handleBooking(event)}
          >
            {bookingId}
          </div>
        </>
      ),
    },
    {
      title: 'Manage',
      dataIndex: 'manage',
      render: (_, event: any) => (
        <Button
          onClick={() => handleCheckIn(event.bookingId, event.licensePLate)}
        >
          Check In
        </Button>
      ),
    },
  ]
  return (
    <>
      {contextHolder}
      <div className="px-4">
        <div className="flex justify-between pb-4 text-white pt-2 text-xl ">
          <div className="items-start">
            <Timer />
          </div>
          <Input.Search
            placeholder="Input Car Registration"
            enterButton
            onSearch={(value) => setSearchValue(value)}
            className="w-80 flex items-end mb-2.5"
          ></Input.Search>
        </div>
        <Table columns={listCol} dataSource={list} />
        <Modal
          title={`Booking Details : ${selectedBooking?.bookingId}`}
          open={modalVisible}
          onCancel={handleModalCancel}
          footer={null}
        >
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
      </div>
    </>
  )
}

export default ListComponent
