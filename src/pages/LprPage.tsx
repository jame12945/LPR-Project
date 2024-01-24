import React, { useState, useEffect } from 'react'
import axios from 'axios'
import TableDynamic from '../components/Table'
function LprPage() {
  const [data, setData] = useState([])

  useEffect(() => {
    axios
      .get('https://jsonplaceholder.typicode.com/users/1')
      .then((res) => setData(res.data))
  })

  //   console.log(data)
  return (
    <div className=" px-3 py-2  m-auto">
      {/* <h1>About</h1>
      <hr />
      <h3>My Name is {data.name}</h3>
      <ul>
        <li>email :{data.email}</li>
        <li>phone :{data.phone}</li>
        <li>website :{data.website}</li>
      </ul> */}
      <TableDynamic />
    </div>
  )
}

export default LprPage
