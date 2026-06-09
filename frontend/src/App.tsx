import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { NavermapsProvider } from 'react-naver-maps'
import ChatPage from './pages/ChatPage'
import CalendarPage from './pages/CalendarPage'
import MapPage from './pages/MapPage'
import MealPlanPage from './pages/MealPlanPage'
import NoticePage from './pages/NoticePage'
import CareerPage from './pages/CareerPage'
import './App.css'

function App() {
  const ncpClientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;

  return (
    <NavermapsProvider ncpKeyId={ncpClientId} submodules={['geocoder']}>
      <Router>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/mealPlan" element={<MealPlanPage />} />
          <Route path="/notices" element={<NoticePage />} />
          <Route path="/careers" element={<CareerPage />} />
          {/* Fallback to home */}
          <Route path="*" element={<ChatPage />} />
        </Routes>
      </Router>
    </NavermapsProvider>
  )
}

export default App
