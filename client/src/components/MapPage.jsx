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

const generateNearbyMockDMS = (baseLatDec, baseLngDec, isClose) => {
  const distanceOffset = isClose ? (Math.random() * 0.02) : (0.03 + (Math.random() * 0.05));
  const angle = Math.random() * Math.PI * 2; 

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
  const [teachersData, setTeachersData] = useState([]);
  const loggedInUserId = localStorage.getItem('idNumber');

  useEffect(() => {
    fetch('http://127.0.0.1:5000/users') 
      .then(res => res.json())
      .then(users => {
        const dbTeachers = users.filter(u => u.role === 'teacher');
        const dbStudents = users.filter(u => u.role === 'student');
        const teachersWithLocations = dbTeachers.map((teacher, index) => {
          return {
            name: teacher.fullName || "מורה ללא שם", 
            latitude: 31.7767 + (index * 0.015), 
            longitude: 35.2345 + (index * 0.015),
            isMe: String(teacher.idNumber) === String(loggedInUserId) 
          };
        });
        
        setTeachersData(teachersWithLocations);

        const studentsWithLocations = dbStudents.map((student, index) => {
          const isClose = index % 2 === 0; 
          return {
            ID: student.idNumber || "ללא ת.ז",
            Name: student.fullName || "תלמידה ללא שם",
            Coordinates: generateNearbyMockDMS(31.7767, 35.2345, isClose)
          };
        });

        setStudentsData(studentsWithLocations);
      })
      .catch(err => console.error("שגיאה במשיכת נתונים:", err));
  }, [loggedInUserId]); 

  return (
    <div style={{ marginTop: '30px', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', padding: '5px 10px', cursor: 'pointer' }}>
       חזרה ללוח הבקרה
      </button>
      
      <h3>מפת איכון חמ"ל מורות </h3>
      
      {teachersData.length > 0 ? (
         <MapDisplay 
           teachers={teachersData}
           students={studentsData.map(student => {
             const lat = convertDMSToDecimal(student.Coordinates.Latitude);
             const lng = convertDMSToDecimal(student.Coordinates.Longitude);
             let minDistance = Infinity;
             teachersData.forEach(teacher => {
               const distance = calculateDistance(teacher.latitude, teacher.longitude, lat, lng);
               if (distance < minDistance) {
                 minDistance = distance;
               }
             });
             
             return { ...student, isFar: minDistance > 3 };
           })} 
           convertDMSToDecimal={convertDMSToDecimal} 
         /> 
      ) : (
        <p>טוען נתונים מהשרת... </p>
      )}
    </div>
  );
}

export default MapPage;