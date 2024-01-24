import React, { useState, useEffect } from 'react'
import axios from 'axios'
import TableDynamic from '../components/Table'
function LprPage() {
  const [data, setData] = useState([])

  return (
    <div className=" px-3 py-2  m-auto">
      <p>
        hello LPR ต้องเพื่มจากเดิมคือต้อง post ข้อมูลลงไปได้
        แยกอีกตารางจริงๆแล้ว
      </p>
    </div>
  )
}

export default LprPage
