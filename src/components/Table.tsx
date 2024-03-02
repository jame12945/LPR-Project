import React, { useEffect, useState } from 'react'
import { Table, Menu, Dropdown, Button } from 'antd'
import { GiTruck } from 'react-icons/gi'
import axios from 'axios'
import dayjs from 'dayjs'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { IoChevronDownOutline } from 'react-icons/io5'
import { Modal, Input, Space } from 'antd'
import type { SearchProps } from 'antd/es/input/Search'
import Timer from './Timer'

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
  id: Number
}

export interface MenuClickParams {
  bookingId: String
  id: Number
  licensePlate: String
}
function TableDynamic() {
  const [dataSource, setDataSource] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<ReceiveData | null>(
    null
  )
  const [responseData, setResponseData] = useState(null)
  const { Search } = Input

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          'http://10.84.235.10:3000/bookings/filter',
          {}
        )
        console.log(response)
        const data = response.data.data.filterDateBooking || []
        setResponseData(data)
        if (data.length > 0) {
          setDataSource(data)
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
      render: (text) => (
        <div className="flex">
          <GiTruck className=" text-4xl mr-4" />
          <div className="mt-2">{text}</div>
        </div>
      ),
    },
    {
      title: 'Appointment Date',
      dataIndex: 'bookingDate',
      render: (text, record) => {
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
      title: 'BookingId',
      dataIndex: 'bookingId',
      render: (text, record) => (
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
    // {
    //   title: 'Manage',
    //   dataIndex: 'manage',
    //   render: (_, record) => (
    //     <Dropdown
    //       overlay={
    //         <Menu onClick={(e) => handleMenuClick(e, record)}>
    //           <Menu.Item key="CheckIn">CheckIn</Menu.Item>
    //           {/* <Menu.Item key="OpenGate">OpenGate</Menu.Item> */}
    //           <Menu.Item key="Reject">Reject</Menu.Item>
    //         </Menu>
    //       }
    //     >
    //       <Button className="bg-sky flex">
    //         <span>Action</span>
    //         <div className="flex items-center justify-center ml-2 mt-1.5 ">
    //           <IoChevronDownOutline />
    //         </div>
    //       </Button>
    //     </Dropdown>
    //   ),
    // },
  ]

  const handleMenuClick = async (e: any, record: MenuClickParams) => {
    if (e.key === 'CheckIn') {
      const { e, bookingId, licensePlate, id } = record
      setSelectedId(bookingId)

      try {
        const response = await axios.post(
          'http://10.84.235.10:3000/bookings/check-in',
          {
            bookingId: bookingId,
            licensePlate: licensePlate,
            id: id,
          }
        )

        console.log(`Checking in successfully for booking of ${bookingId}`)
        console.log('Response:', response.data)
        console.log('Data From Backend:', response.data.data.stampStatusData)

        toast.success('ระบบทำการ CheckIn เรียบร้อยแล้ว')
      } catch (error) {
        console.error('CheckIn Error: ', error)
        toast.error('Check-in failed!')
      }
    } else if (e.key === 'Reject') {
      console.log('Reject')
      const { e, bookingId, licensePlate, id } = record
      try {
        const response = await axios.post(
          'http://10.84.235.10:3000/bookings/reject',
          {
            bookingId: bookingId,
            licensePlate: licensePlate,
            id: id,
          }
        )
        console.log('Reject Succcess')
        console.log('Response:', response.data)
        toast.success('ระบบทำการ Reject เรียบร้อย ')
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

  const handleBooking = (record) => {
    setSelectedBooking(record)
    setModalVisible(true)
  }
  const handleModalCancel = () => {
    setModalVisible(false)
  }
  const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
    console.log(info?.source, value)
    const filterData = responseData.filter((item) =>
      item?.licensePlate?.includes(value)
    )
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
        <Table columns={cols} dataSource={dataSource} />
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

export default TableDynamic
