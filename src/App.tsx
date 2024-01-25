import React from 'react'
import { DatePicker } from 'antd'
import { Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/Nav'
import ListviewPage from './pages/ListviewPage'
import LprPage from './pages/LprPage'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/listview" element={<ListviewPage />} />
        <Route path="/lpr" element={<LprPage />} />
      </Routes>
    </>
  )
}

export default App
