import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import CalendarPage from './pages/CalendarPage'
import MapPage from './pages/MapPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/map" element={<MapPage />} />
        {/* Fallback to home */}
        <Route path="*" element={<ChatPage />} />
      </Routes>
    </Router>
  )
}

export default App
