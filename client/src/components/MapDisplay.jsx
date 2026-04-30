import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const createCustomPin = (text, type) => {
  let bgColor = '#ffffff';
  let borderColor = '#000000';
  let textColor = '#000000';

  if (type === 'current-teacher') {
    bgColor = '#fff3e0'; borderColor = '#e65100'; textColor = '#e65100'; 
  } else if (type === 'teacher') {
    bgColor = '#e8f5e9'; borderColor = '#2e7d32'; textColor = '#2e7d32'; 
  } else if (type === 'far-student') {
    bgColor = '#ffebee'; borderColor = '#c62828'; textColor = '#c62828';
  } else if (type === 'close-student') {
    bgColor = '#e3f2fd'; borderColor = '#1565c0'; textColor = '#1565c0';
  }

  return new L.divIcon({
    className: 'custom-html-icon',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; width: 100%;">
        <div style="
          background-color: ${bgColor};
          border: 2px solid ${borderColor};
          color: ${textColor};
          padding: 4px 8px;
          border-radius: 6px;
          font-weight: bold;
          text-align: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          font-size: 13px;
          line-height: 1.4;
          position: relative;
          white-space: nowrap;
        ">
          ${text}
          <div style="position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid ${borderColor};"></div>
          <div style="position: absolute; bottom: -5px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid ${bgColor};"></div>
        </div>
        <div style="height: 8px;"></div>
      </div>
    `,
    iconSize: [120, 60],
    iconAnchor: [60, 60],
  });
};

function MapDisplay({ students, teachers, convertDMSToDecimal }) {
  const mapCenter = (teachers && teachers.length > 0) 
    ? [teachers[0].latitude, teachers[0].longitude] 
    : [31.7767, 35.2345];

  return (
    <div style={{ height: '550px', width: '100%', marginTop: '30px', border: '2px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer center={mapCenter} zoom={11} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {teachers && teachers.map((teacher, index) => (
          <Marker 
            key={`teacher-${index}`}
            position={[teacher.latitude, teacher.longitude]} 
            icon={createCustomPin(teacher.isMe ? "אני" : teacher.name, teacher.isMe ? 'current-teacher' : 'teacher')} 
          />
        ))}

        {students && students.map((student) => {
          const lat = convertDMSToDecimal(student.Coordinates.Latitude);
          const lng = convertDMSToDecimal(student.Coordinates.Longitude);
          const type = student.isFar ? 'far-student' : 'close-student';
          const displayText = student.isFar ? `${student.Name}<br/>${student.ID}` : student.ID;

          return (
            <Marker 
              key={student.ID} 
              position={[lat, lng]} 
              icon={createCustomPin(displayText, type)} 
            />
          );
        })}

      </MapContainer>
    </div>
  );
}

export default MapDisplay;