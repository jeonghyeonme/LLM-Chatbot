import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import CalendarPage from './pages/CalendarPage'
import MapPage from './pages/MapPage'
import MealPlanPage from './pages/MealPlanPage'
import NoticePage from './pages/NoticePage'
import NoticeDetailPage from './pages/NoticeDetailPage'
import CareerPage from './pages/CareerPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/mealPlan" element={<MealPlanPage />} />
        <Route path="/notices" element={<NoticePage />} />
        <Route path="/notices/:id" element={<NoticeDetailPage />} />
        <Route path="/careers" element={<CareerPage />} />
        {/* Fallback to home */}
        <Route path="*" element={<ChatPage />} />
      </Routes>
    </Router>
  )
}

export default App
