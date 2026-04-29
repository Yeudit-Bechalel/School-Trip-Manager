import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [searchClass, setSearchClass] = useState('');
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      let url = 'http://127.0.0.1:5000/users';
      if (searchClass) {
        url += `?className=${searchClass}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('שגיאה בשליפת נתונים:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', maxWidth: '600px', margin: '0 auto' }}>
      
      {/* כפתור חזרה לדף הבית למעלה */}
      <button onClick={() => navigate('/')} style={{ marginBottom: '20px', padding: '5px 10px', cursor: 'pointer' }}>
        🔙 חזרה לדף הבית
      </button>

      <h3>ניהול נרשמות - גישת מורה 🔓</h3>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="חפשי לפי כיתה (למשל: יא2)" 
          value={searchClass}
          onChange={(e) => setSearchClass(e.target.value)}
          style={{ padding: '8px', flex: 1 }}
        />
        <button onClick={fetchStudents} style={{ padding: '8px 15px', cursor: 'pointer' }}>חפשי</button>
      </div>

      {students.length === 0 ? (
        <p>לא נמצאו נרשמות מתאימות.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {students.map((student, index) => (
            <li key={index} style={{ background: '#f9f9f9', margin: '10px 0', padding: '15px', borderRadius: '8px', borderRight: '5px solid #28a745' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{student.className} - {student.fullName}</div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>
                תפקיד: {student.role === 'teacher' ? 'מורה/מלווה' : 'תלמידה'} | ת.ז: {student.idNumber}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StudentList;