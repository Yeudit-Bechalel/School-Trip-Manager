import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home'; 
import StudentList from './components/StudentList';

function App() {
  return (
    <BrowserRouter>
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', direction: 'rtl' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<StudentList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;