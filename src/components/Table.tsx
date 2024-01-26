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

//ทำตารางย่อยเมื่อกด BookingId  okในเบื้องต้น
//ทำส่วนนี้ใช้ text ธรรมดา กับ dayjs  รถมาถึงภายในช่วงเวลาที่นัดหมาย    Date:27-12-2023   Time:11:30
//search
//เปลี่ยนสี table ให้เป็น sky

function TableDynamic() {
  const [columns, setColumn] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [responseData, setResponseData] = useState(null)
  const { Search } = Input

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          'http://localhost:3000/booking-fe/filter',
          {}
        )
        const data = response.data.data.filterDateBooking || []
        setResponseData(data)
        if (data.length > 0) {
          const cols = [
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
              render: (text, record) => (
                <div>
                  <div className="ml-2">{dayjs(text).format('YYYY-MM-DD')}</div>
                  <div className=" text-green">
                    ( {dayjs(record.bookingStart, 'HH:mm:ss').format('HH:mm')} -{' '}
                    {dayjs(record.bookingStop, 'HH:mm:ss').format('HH:mm')} )
                  </div>
                </div>
              ),
            },
            {
              title: 'Car Registration',
              dataIndex: 'truckLicensePlate',
            },
            {
              title: 'Driver',
              dataIndex: 'driverName',
            },
            {
              title: 'BookingId',
              dataIndex: 'id',
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
            {
              title: 'Manage',
              dataIndex: 'manage',
              render: (_, record) => (
                <Dropdown
                  overlay={
                    <Menu onClick={(e) => handleMenuClick(e, record.id)}>
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

          setColumn(cols)
          setDataSource(data)
        }
      } catch (error) {
        console.error('fetchingData Error ', error)
      }
    }

    fetchData()
  }, [])

  const handleMenuClick = async (e, bookingId) => {
    if (e.key === 'CheckIn') {
      setSelectedId(bookingId)

      try {
        const response = await axios.post(
          'http://localhost:3000/booking-fe/check-in',
          { idSelected: bookingId }
        )

        console.log(`Checking in successfully for booking of ${bookingId}`)
        console.log('Response:', response.data)
        console.log('Data From Backend:', response.data.data.stampStatusData)

        toast.success('ระบบทำการ CheckIn เรียบร้อยแล้ว')
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
      item.truckLicensePlate.includes(value)
    )
    console.log(
      'filterData................................................................'
    )
    console.log(filterData)
    setDataSource(filterData)
  }

  return (
    <>
      <div className="flex justify-between pb-4 text-white pl-8 pt-2 placeholder text-xl ">
        <div className="flex">
          <p className=" text-xl">จำนวนการจองทั้งหมดภายในวันนี้</p>
          <div className="pl-14"> Date:{dayjs().format('YYYY-MM-DD')}</div>
          <div className="pl-4">
            {' '}
            Time:{dayjs().add(0, 'minute').format('HH:mm')}
          </div>
        </div>

        <Search
          placeholder="Input Car Registration"
          enterButton
          onSearch={onSearch}
          className="w-80 flex items-end"
        ></Search>
      </div>
      <Table columns={columns} dataSource={dataSource} />
      <ToastContainer />
      <Modal
        title={`Booking Details : ${selectedBooking?.id}`}
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <div className="grid grid-flow-col justify-stretch">
          <div>
            <p>Booking Id: {selectedBooking?.id}</p>
            <p>
              Booking Date:{' '}
              {dayjs(selectedBooking?.bookingDate).format('YYYY-MM-DD')}
            </p>
            <p>Booking Start: {selectedBooking?.bookingStart}</p>{' '}
            <p>Booking Stop: {selectedBooking?.bookingStop}</p>
            <p>TruckLicensePlate: {selectedBooking?.truckLicensePlate}</p>
            <p>Warehouse Code: {selectedBooking?.warehouseCode}</p>
            <p>Truck Type: {selectedBooking?.truckType}</p>
          </div>

          <div>
            <p> Company Code: {selectedBooking?.companyCode}</p>
            <p> Sup Code: {selectedBooking?.supCode}</p>
            <p> Sup Name: {selectedBooking?.supName}</p>
            <p> operationType: {selectedBooking?.operationType}</p>
            <p> Driver Name: {selectedBooking?.driverName}</p>
            <p>Lane: {selectedBooking?.len}</p>
            <p> Tel: {selectedBooking?.telNo}</p>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default TableDynamic
