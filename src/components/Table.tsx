import React, { useEffect, useState } from 'react'
import { Table, Menu, Dropdown, Button } from 'antd'
import { GiTruck } from 'react-icons/gi'
import axios from 'axios'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function TableDynamic() {
  const [columns, setColumn] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [selectedId, setSelectedId] = useState('')
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          'http://localhost:3000/booking-fe/filter',
          {}
        )
        const data = response.data.data.filterDateBooking || []

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
                  <Button>Action</Button>
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
  const handleMenuClick = (e, bookingId) => {
    if (e.key === 'CheckIn') {
      setSelectedId(bookingId)
    }
  }
  useEffect(() => {
    const checkIn = async () => {
      if (selectedId) {
        try {
          const response = await axios.post(
            'http://localhost:3000/booking-fe/check-in',
            { idSelected: selectedId }
          )

          console.log(`Checking in successfully for booking of ${selectedId}`)
          console.log('Response:', response.data)
          console.log('Data From Backend:', response.data.data.stampStatusData)

          toast.success('ระบบทำการ CheckIn เรียบร้อยแล้ว')
        } catch (error) {
          console.error('CheckIn Error: ', error)
          toast.error('Check-in failed!')
        }
      }
    }

    checkIn()
  }, [selectedId])
  return (
    <>
      <Table columns={columns} dataSource={dataSource} />
    </>
  )
}

export default TableDynamic
