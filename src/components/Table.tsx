import React, { useEffect, useState } from 'react'
import { Table } from 'antd'
import axios from 'axios'

function TableDynamic() {
  const [displayText, setDisplayText] = useState()
  const [columns, setColumn] = useState([])
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/quotes')
        const list = response.data.quotes || []
        console.log('list:', list)
        const firstObject = list[0] || {}
        console.log('firstObject:', firstObject)
        const cols = []
        for (const key in firstObject) {
          const col = {
            title: key,
            dataIndex: key,
          }
          cols.push(col)
          console.log('cols:', cols)
        }
        setColumn(cols)
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
