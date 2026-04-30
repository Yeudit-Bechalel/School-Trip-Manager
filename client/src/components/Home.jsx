import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from './RegisterForm';

function Home() {
  const [idInput, setIdInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      setLoginError('');
      const response = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idNumber: idInput })
      });

      if (response.ok) {
        localStorage.setItem('idNumber', idInput);
        navigate('/dashboard');
      } else if (response.status === 404) {
        
        setLoginError('תעודת הזהות לא מוכרת, נדרשת הרשמה.');
      } else if (response.status === 403) {
        
        setLoginError('הכניסה היא רק למורות ולצוות.');
      }
    } catch (error) {
      setLoginError('שגיאת תקשורת עם השרת');
    }
  };

  return (
    <div style={{ display: 'flex', gap: '50px', justifyContent: 'center', marginTop: '30px', flexWrap: 'wrap' }}>
      
      {}
      <div>
        <RegisterForm />
      </div>

      {}
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', maxWidth: '300px', height: 'fit-content', background: '#f9f9f9' }}>
        <h3> כניסת צוות רשום</h3>
        <p>מורה שכבר נרשמה, היכנסי כאן:</p>
        <input 
          type="text" 
          placeholder="תעודת זהות (9 ספרות)" 
          value={idInput}
          onChange={(e) => setIdInput(e.target.value)}
          style={{ padding: '8px', width: '90%', marginBottom: '15px' }}
        />
        <br />
        <button onClick={handleLogin} style={{ padding: '10px 20px', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', width: '100%', fontWeight: 'bold' }}>
          כניסה למערכת החיפוש
        </button>
        {loginError && <p style={{ color: '#d9534f', marginTop: '15px', fontWeight: 'bold' }}>{loginError}</p>}
      </div>

    </div>
  );
}

export default Home;