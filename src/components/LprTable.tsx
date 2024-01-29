import React, { useEffect, useState } from 'react'
import { Table, Input, Modal } from 'antd'
import axios from 'axios'
import dayjs from 'dayjs'

function LprTable() {
  const [columns, setColumns] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [plateNo, setPlateNo] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:3000/recieve', {
          plateNo: plateNo,
        })
        const data =
          response.data.data.selectBooking.data.filterBookingsAfterFix || []
        setDataSource(data)
        generateColumns(data)
      } catch (error) {
        console.error('Fetching Data Error ', error)
      }
    }

    fetchData()

    const interval = setInterval(() => {
      setPlateNo('311111')
    }, 5000)

    return () => clearInterval(interval)
  }, [plateNo])

  const generateColumns = (data) => {
    if (data.length > 0) {
      const cols = Object.keys(data[0]).map((key) => ({
        title: key,
        dataIndex: key,
        render: (text, record) => {
          if (key === 'bookingDate') {
            return <div>{dayjs(text).format('YYYY-MM-DD')}</div>
          }
          return text
        },
      }))
      setColumns(cols)
    }
  }

  const handleBooking = (record) => {
    setSelectedBooking(record)
    setModalVisible(true)
  }

  const handleModalCancel = () => {
    setModalVisible(false)
  }

  return (
    <>
      <Input.Search
        placeholder="Input Car Registration"
        enterButton
        onSearch={(value) => console.log(value)} // เปลี่ยนเป็นการค้นหาใน DataSource ถ้าต้องการ
        style={{ width: 200, marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={(record) => record.id}
        onRow={(record) => ({
          onClick: () => handleBooking(record),
        })}
      />
      <Modal
        title={`Booking Details : ${selectedBooking?.id}`}
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        {selectedBooking && (
          <div>
            {Object.keys(selectedBooking).map((key) => (
              <p key={key}>
                {key}: {selectedBooking[key]}
              </p>
            ))}
          </div>
        )}
      </Modal>
    </>
  )
}

export default LprTable
