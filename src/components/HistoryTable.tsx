import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
import { GiTruck } from 'react-icons/gi'
import axios from 'axios'
import dayjs from 'dayjs'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { Modal, Input } from 'antd'
import type { SearchProps } from 'antd/es/input/Search'
import Timer from './Timer'

type RECEIVE_DATA = {
  arrivalTime: string
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

function HistoryComponent() {
  const [dataSource, setDataSource] = useState<RECEIVE_DATA[]>([])
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [selectedBooking, setSelectedBooking] = useState<RECEIVE_DATA | null>(
    null
  )
  const [responseData, setResponseData] = useState<RECEIVE_DATA[] | null>(null)

  const { Search } = Input

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_GATEWAY_URL}bookings/filter`,
          {}
        )
        console.log(response)
        const data = response.data.data.filterDateBooking || []

        setResponseData(data)
        if (data.length > 0) {
          // setDataSource(data)
          setDataSource(
            data
              .map((item: RECEIVE_DATA) => ({
                ...item,

                arrivalTime: dayjs(item.arrivalTime).format('DD/MM/YY HH:mm'),
              }))
              .sort(
                (a: RECEIVE_DATA, b: RECEIVE_DATA) =>
                  dayjs(b.arrivalTime).unix() - dayjs(a.arrivalTime).unix()
              )
          )
        }
      } catch (error) {
        console.error('fetchingData Error ', error)
      }
    }

    fetchData()
    const interval = setInterval(() => {
      fetchData()
    }, 30000)
    return () => clearInterval(interval)
  }, [])
  const cols = [
    {
      title: 'Id',
      dataIndex: 'id',
    },
    {
      title: 'Type',
      dataIndex: 'truckType',
      render: (text: string) => (
        <div className="flex">
          <GiTruck className=" text-4xl mr-4" />
          <div className="mt-2">{text}</div>
        </div>
      ),
    },
    {
      title: 'Arrival Date/Time',
      dataIndex: 'arrivalTime',
    },
    {
      title: 'Appointment Date',
      dataIndex: 'bookingDate',
      render: (text: string, record: RECEIVE_DATA) => {
        const start = record.bookingStart
          ? record.bookingStart.substring(0, 5)
          : ''
        const end = record.bookingEnd ? record.bookingEnd.substring(0, 5) : ''
        return (
          <div>
            <div className="ml-2">{dayjs(text).format('YYYY-MM-DD')}</div>
            <div className="text-green">
              ({start} - {end})
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
      render: (text: string, record: RECEIVE_DATA) => (
        <>
          <div
            className="bg-sky rounded-md px-2 py-1.5 text-center hover:bg-rain hover:text-white"
            onClick={() => handleBooking(record)}
            style={{ cursor: 'pointer' }}
          >
            {text}
          </div>
        </>
      ),
    },
  ]

  const handleBooking = (record: RECEIVE_DATA) => {
    setSelectedBooking(record)
    setModalVisible(true)
  }
  const handleModalCancel = () => {
    setModalVisible(false)
  }
  const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
    console.log(info?.source, value)
    const filterData =
      responseData?.filter((item: RECEIVE_DATA) =>
        item?.licensePlate?.includes(value)
      ) || []

    console.log(
      'filterData................................................................'
    )
    console.log(filterData)
    setDataSource(filterData)
  }

  return (
    <>
      <div className="px-4">
        <div className="flex justify-between pb-4 text-white  pt-2 placeholder text-xl ">
          <div className=" items-start">
            <Timer />
          </div>

          <Search
            placeholder="Input Car Registration"
            enterButton
            onSearch={onSearch}
            className="w-80 flex items-end mb-2.5"
          ></Search>
        </div>
        <Table columns={cols} dataSource={dataSource} pagination={false} />
        <ToastContainer />
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

export default HistoryComponent
