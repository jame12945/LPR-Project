import React, { useEffect, useState } from 'react'
import { Table, Menu, Dropdown, Button } from 'antd'
import { GiTruck } from 'react-icons/gi'
import axios from 'axios'
import dayjs from 'dayjs'

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
                  <GiTruck className=" text-2xl mr-4" /> {text}
                </div>
              ),
            },
            {
              title: 'Appointment Date',
              dataIndex: 'bookingDate',
              render: (text) => dayjs(text).format('YYYY-MM-DD'),
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
    // Set selectedId when CheckIn is clicked
    // data ไหลยาว
    //พนทำหน้า
    if (e.key === 'CheckIn') {
      setSelectedId(bookingId)
    }
  }
  useEffect(() => {
    const checkIn = async () => {
      if (selectedId) {
        try {
          await axios.post('http://localhost:3000/booking-fe/check-in', {
            idSelected: selectedId,
          })
          console.log(`Chechin Successfully for booking of ${selectedId}`)
        } catch (error) {
          console.error('CheckIn Error ', error)
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
