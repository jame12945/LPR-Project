import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
import axios from 'axios'

function TableDynamic() {
  const [columns, setColumn] = useState([])
  const [dataSource, setDataSource] = useState([])
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
            },
            {
              title: 'Appointment Date',
              dataIndex: 'bookingDate',
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

  return (
    <>
      <Table columns={columns} dataSource={dataSource} />
    </>
  )
}

export default TableDynamic
