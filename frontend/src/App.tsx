import { Routes, Route } from 'react-router-dom'
import CareerResults from './pages/CareerResults'
import CourseView from './pages/CourseView'

function App() {
  return (
    <Routes>
      <Route path="/carrera/:careerName" element={<CareerResults />} />
      <Route path="/curso/:courseId" element={<CourseView />} />
      <Route path="/" element={<div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Bienvenido a Brújula</h1>
      </div>} />
    </Routes>
  )
}

export default App
