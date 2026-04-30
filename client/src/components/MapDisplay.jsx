import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapDisplay() {
  const centerOfIsrael = [31.5, 34.8];

  return (
    <div style={{ height: '400px', width: '100%', marginTop: '30px', border: '2px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
      
      <MapContainer center={centerOfIsrael} zoom={7} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>

    </div>
  );
}

export default MapDisplay;