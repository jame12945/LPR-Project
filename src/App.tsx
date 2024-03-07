import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Nav'
import HistoryPage from './pages/HistoryPage'
import LprPage from './pages/LprPage'
import ConfigLanePage from './pages/ConfigLanePage'
import ListviewPage from './pages/ListVIewPage'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LprPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/lpr" element={<LprPage />} />
        <Route path="/setting" element={<ConfigLanePage />} />
        <Route path="/list" element={<ListviewPage />} />
      </Routes>
    </>
  )
}

export default App
