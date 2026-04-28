import './App.css';
import RegisterForm from './components/RegisterForm'; // 1. אנחנו מייבאים את הטופס

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>טיול שנתי - בנות משה </h1>
      
      {/* 2. אנחנו מציגים את הטופס על המסך! */}
      <RegisterForm /> 
      
    </div>
  );
}

export default App;