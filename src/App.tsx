import React from 'react'
import { DatePicker } from 'antd'
import { Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/Nav'
import ListviewPage from './pages/ListviewPage'
import LprPage from './pages/LprPage'
import ConfigLanePage from './pages/ConfigLanePage'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LprPage />} />
        <Route path="/listview" element={<ListviewPage />} />
        <Route path="/lpr" element={<LprPage />} />
        <Route path="/setting" element={<ConfigLanePage />} />
        <Route path="/close" />
      </Routes>
    </>
  )
}

export default App
