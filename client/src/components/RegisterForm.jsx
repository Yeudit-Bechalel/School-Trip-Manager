import { useState } from 'react';

function RegisterForm() {
  // === 1. הזיכרון של הטופס ===
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [className, setClassName] = useState("");
  const [role, setRole] = useState("student"); // שומר את התפקיד, מתחיל כ"תלמידה"

  // === 2. מה קורה כשלוחצים על שליחה ===
  const handleSubmit = async (e) => {
    e.preventDefault(); 

    // אורזים את כל הנתונים, כולל התפקיד שנבחר
    const newUser = {
      fullName: fullName,
      idNumber: idNumber,
      className: className,
      role: role 
    };

    try {
      // שליחה לשרת (תוודאי שהשרת בפורט 5000 דולק)
      const response = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser) 
      });

      if (response.ok) {
        alert('הרישום בוצע בהצלחה! 🎉');
        // איפוס הטופס לנרשמת הבאה
        setFullName("");
        setIdNumber("");
        setClassName("");
        setRole("student");
      } else {
        alert('שגיאה: ודאי שתעודת הזהות מכילה 9 ספרות ושכל השדות מלאים.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('שגיאת תקשורת. האם השרת פועל?');
    }
  };

  // === 3. התצוגה (מה שרואים על המסך) ===
  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', maxWidth: '400px' }}>
      <h2>רישום לטיול השנתי</h2>

      <div style={{ marginBottom: '10px' }}>
        <label>שם מלא: </label> <br />
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>תעודת זהות: </label> <br />
        <input
          type="text"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          required
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>כיתה: </label> <br />
        <input
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          required
        />
      </div>

      {/* תפריט בחירת התפקיד */}
      <div style={{ marginBottom: '15px' }}>
        <label>תפקיד בטיול: </label> <br />
        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: '5px', width: '100%' }}>
          <option value="student">תלמידה</option>
          <option value="teacher">מורה / מלווה</option>
        </select>
      </div>

      <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>
        שלח הרשמה
      </button>
    </form>
  );
}

export default RegisterForm;