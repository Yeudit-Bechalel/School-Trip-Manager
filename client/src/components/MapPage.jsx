import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MapDisplay from './MapDisplay';

const convertDMSToDecimal = (dms) => {
  return parseFloat(dms.Degrees) + (parseFloat(dms.Minutes) / 60) + (parseFloat(dms.Seconds) / 3600);
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))); 
};

// סימולטור חכם ששומר על הבנות קרובות למורה (מקסימום 10 ק"מ)
const generateNearbyMockDMS = (baseLatDec, baseLngDec, isClose) => {
  // אם קרובה: מרחק של 0.00 עד 0.02 מעלות (כ-2 ק"מ)
  // אם רחוקה: מרחק של 0.03 עד 0.08 מעלות (כ-3 עד 9 ק"מ)
  const distanceOffset = isClose ? (Math.random() * 0.02) : (0.03 + (Math.random() * 0.05));
  const angle = Math.random() * Math.PI * 2; // כיוון אקראי ברדיוס

  const newLatDec = baseLatDec + (Math.cos(angle) * distanceOffset);
  const newLngDec = baseLngDec + (Math.sin(angle) * distanceOffset);

  const toDMS = (decimal) => {
    const absolute = Math.abs(decimal);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.floor((minutesNotTruncated - minutes) * 60);
    return { Degrees: degrees.toString(), Minutes: minutes.toString(), Seconds: seconds.toString() };
  };

  return { Latitude: toDMS(newLatDec), Longitude: toDMS(newLngDec) };
};

function MapPage() {
  const navigate = useNavigate();
  const [studentsData, setStudentsData] = useState([]);
  const [teachersData, setTeachersData] = useState([]); // עכשיו זה מערך ששומר הרבה מורות!

  useEffect(() => {
    // 🚨 כרגיל, להחליף פה לכתובת הנכונה שלך בשרת! 🚨
    fetch('http://127.0.0.1:5000/users') 
      .then(res => res.json())
      .then(users => {
        const dbTeachers = users.filter(u => u.role === 'teacher');
        const dbStudents = users.filter(u => u.role === 'student');

        // נשים את המורות באזור ירושלים, אבל נזיז כל אחת טיפ-טיפה כדי שלא ישבו אחת על השנייה
        const teachersWithLocations = dbTeachers.map((teacher, index) => {
          return {
            name: teacher.name || teacher.firstName || "מורה", 
            // מוסיף קצת זווית לכל מורה כדי שיפוזרו קצת בשטח
            latitude: 31.7767 + (index * 0.015), 
            longitude: 35.2345 + (index * 0.015)
          };
        });
        
        setTeachersData(teachersWithLocations);

        // עכשיו נסדר את התלמידות מסביב למורה הראשונה (רק בשביל הסימולטור)
        const studentsWithLocations = dbStudents.map((student, index) => {
          const isClose = index % 2 === 0; 
          return {
            ID: student.id || student.ID || student.idNumber || "ללא ת.ז",
            Name: student.name || student.firstName || "תלמידה",
            Coordinates: generateNearbyMockDMS(31.7767, 35.2345, isClose)
          };
        });

        setStudentsData(studentsWithLocations);
      })
      .catch(err => console.error("שגיאה במשיכת נתונים:", err));
  }, []);

  return (
    <div style={{ marginTop: '30px', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', padding: '5px 10px', cursor: 'pointer' }}>
        🔙 חזרה ללוח הבקרה
      </button>
      
      <h3>מפת איכון חמ"ל מורות 📍</h3>
      
      {teachersData.length > 0 ? (
         <MapDisplay 
           teachers={teachersData} // מעבירים את כל המורות
           students={studentsData.map(student => {
             const lat = convertDMSToDecimal(student.Coordinates.Latitude);
             const lng = convertDMSToDecimal(student.Coordinates.Longitude);
             
             // חישוב חכם: בודקים מה המרחק של התלמידה למורה *הכי קרובה* אליה
             let minDistance = Infinity;
             teachersData.forEach(teacher => {
               const distance = calculateDistance(teacher.latitude, teacher.longitude, lat, lng);
               if (distance < minDistance) {
                 minDistance = distance;
               }
             });
             
             // אם אפילו למורה הכי קרובה היא רחוקה מ-3 ק"מ, אז היא מוגדרת רחוקה
             return { ...student, isFar: minDistance > 3 };
           })} 
           convertDMSToDecimal={convertDMSToDecimal} 
         /> 
      ) : (
        <p>טוען נתונים מהשרת... ⏳</p>
      )}
    </div>
  );
}

export default MapPage;