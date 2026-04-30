import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function StudentList() {
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/users');
      if (response.ok) {
        const data = await response.json();
        setAllUsers(data);
      }
    } catch (error) {
      console.error('שגיאה בשליפת נתונים:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = allUsers.filter(user => {
    if (!searchTerm) return true;
    const query = searchTerm.toLowerCase().trim();
    if (query === 'צוות' || query === 'מורה') {
      return user.role === 'teacher';
    }

    const className = user.className || '';
    
    return className.includes(query);
  });
return (
    <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', maxWidth: '600px', margin: '0 auto' }}>
      
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', padding: '5px 10px', cursor: 'pointer' }}>
         חזרה ללוח הבקרה
      </button>

      <h3>ניהול נרשמות - גישת מורה </h3>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="חפשי לפי כיתה או 'צוות'..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <p>לא נמצאו תוצאות לחיפוש שלך. </p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {filteredUsers.map((user, index) => (
            <li key={index} style={{ background: '#f9f9f9', margin: '10px 0', padding: '15px', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                {user.role === 'teacher' ? `צוות - ${user.fullName}` : `${user.className} - ${user.fullName}`}
              </div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>
                תפקיד: {user.role === 'teacher' ? 'מורה/מלווה' : 'תלמידה'} | ת.ז: {user.idNumber}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StudentList;