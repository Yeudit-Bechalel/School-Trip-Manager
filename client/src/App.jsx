import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import StudentList from './components/StudentList';
import TeacherDashboard from './components/TeacherDashboard'; 
import MapPage from './components/MapPage';                 

function App() {
  return (
    <BrowserRouter>
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', direction: 'rtl' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          {}
          <Route path="/dashboard" element={<TeacherDashboard />} /> 
          {}
          <Route path="/search" element={<StudentList />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;