import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const navigate = useNavigate();
  
  // === 1. הזיכרון של הטופס ===
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [className, setClassName] = useState("");
  const [role, setRole] = useState("student");
  const [passwordInput, setPasswordInput] = useState(""); 

  const SECRET_TEACHER_PASSWORD = "123";

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    
    if (selectedRole === 'teacher') {
      setClassName(""); 
    } else {
      setPasswordInput(""); 
    }
  };

  // === 2. מה קורה כשלוחצים על שליחה ===
  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalClassName = className;

    if (role === 'teacher') {
      if (passwordInput !== SECRET_TEACHER_PASSWORD) {
        alert("❌ סיסמה שגויה! אין אפשרות להירשם כצוות. נסי שוב או הירשמי כתלמידה.");
        return; 
      }
      finalClassName = "צוות";
    } else {
      const classRegex = /^[א-ת]{1,2}[0-9]{1,2}$/;
      if (!classRegex.test(className)) {
        alert("❌ שגיאה: תלמידה חייבת לכתוב את הכיתה והמספר ברצף ללא רווחים! (למשל: יא2, ט3)");
        return; 
      }
    }

    const newUser = {
      fullName: fullName,
      idNumber: idNumber,
      className: finalClassName,
      role: role
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        if (role === 'teacher') {
          alert('הרישום בוצע בהצלחה! מועברת למערכת הניהול... 🚀');
          navigate('/search'); 
        } else {
          alert('הרישום בוצע בהצלחה! 🎉');
          setFullName("");
          setIdNumber("");
          setClassName("");
          setRole("student");
          setPasswordInput("");
        }
      } else {
        // מקפיץ את השגיאה של השרת (למשל: ת.ז כבר רשומה)
        const errorMessage = await response.text(); 
        alert("שגיאה: " + errorMessage);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('שגיאת תקשורת. האם השרת פועל?');
    }
  };

  // === 3. התצוגה ===
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

      <div style={{ marginBottom: '15px' }}>
        <label>תפקיד בטיול: </label> <br />
        <select value={role} onChange={handleRoleChange} style={{ padding: '5px', width: '100%' }}>
          <option value="student">תלמידה</option>
          <option value="teacher">מורה / מלווה</option>
        </select>
      </div>

      {role === 'student' && (
        <div style={{ marginBottom: '10px' }}>
          <label>כיתה: </label> <br />
          <input
            type="text"
            placeholder="למשל: יא2 (ללא רווח)"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required={role === 'student'} 
          />
        </div>
      )}

      {role === 'teacher' && (
        <div style={{ marginBottom: '10px' }}>
          <label>סיסמת אישור צוות: </label> <br />
          <input
            type="password" 
            placeholder="הקלידי סיסמה"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            required={role === 'teacher'} 
          />
        </div>
      )}

      <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer', marginTop: '10px' }}>
        שלח הרשמה
      </button>
    </form>
  );
} // <--- הנה ה-`}` שהיה חסר לך!

export default RegisterForm;