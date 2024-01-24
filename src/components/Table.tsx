import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
import axios from 'axios'

function TableDynamic() {
  const [displayText, setDisplayText] = useState()
  const [columns, setColumn] = useState([
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      tilte: 'Quote',
      dataIndex: 'quote',
    },
    {
      title: 'Author',
      dataIndex: 'author',
    },
  ])
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/quotes')
        setDataSource(response.data.quotes)
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
