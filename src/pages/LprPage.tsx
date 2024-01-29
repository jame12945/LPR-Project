import React, { useState, useEffect } from 'react'
import axios from 'axios'
import TableDynamic from '../components/Table'
import LprTable from '../components/LprTable'
function LprPage() {
  const [data, setData] = useState([])

  return (
    <div className=" min-h-screen bg-ocenblue">
      <LprTable />
    </div>
  )
}

export default LprPage
