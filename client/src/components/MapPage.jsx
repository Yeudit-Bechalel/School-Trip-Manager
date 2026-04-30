import { useNavigate } from 'react-router-dom';
import MapDisplay from './MapDisplay';

function MapPage() {
  const navigate = useNavigate();

  return (
    <div style={{ marginTop: '30px', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', padding: '5px 10px', cursor: 'pointer' }}>
        🔙 חזרה ללוח הבקרה
      </button>
      
      <h3>מפת איכון תלמידות 📍</h3>
      <p>כאן יוצגו מיקומי התלמידות בזמן אמת.</p>
      
      {/* פה אנחנו קוראות לרכיב המפה שיצרנו קודם! */}
      <MapDisplay /> 
    </div>
  );
}

export default MapPage;