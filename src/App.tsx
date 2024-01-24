import React from 'react'
import { DatePicker } from 'antd'
import { Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/Nav'
import ListviewPage from './pages/ListviewPage'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/listview" element={<ListviewPage />} />
      </Routes>
    </>
  )
}

export default App
