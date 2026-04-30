import { useNavigate } from 'react-router-dom';

function TeacherDashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>לוח בקרה - צוות מלווה 👩‍🏫</h2>
      <p>ברוכה הבאה! אנא בחרי את הפעולה הרצויה:</p>

      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
        {/* כפתור 1: מעבר לדף רשימת הנרשמות */}
        <button 
          onClick={() => navigate('/search')} 
          style={{ padding: '20px', fontSize: '1.2rem', cursor: 'pointer', borderRadius: '8px', border: '1px solid #007bff', backgroundColor: '#e9ecef' }}
        >
          📋 ניהול וחיפוש נרשמות
        </button>

        {/* כפתור 2: מעבר לדף המפה החדש */}
        <button 
          onClick={() => navigate('/map')} 
          style={{ padding: '20px', fontSize: '1.2rem', cursor: 'pointer', borderRadius: '8px', border: '1px solid #28a745', backgroundColor: '#e9ecef' }}
        >
          🗺️ מפת איכון תלמידות
        </button>
      </div>

      <br />
      <button onClick={() => navigate('/')} style={{ marginTop: '40px', padding: '10px' }}>
        🔙 התנתקות וחזרה לדף הבית
      </button>
    </div>
  );
}

export default TeacherDashboard;