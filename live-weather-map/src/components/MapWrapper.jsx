import { MapContainer, TileLayer, useMap, CircleMarker, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// สร้าง "ขอบเขต" ของโลก (ไม่ให้เลื่อนหลุด)
const worldBounds = L.latLngBounds(
  L.latLng(-90, -180), // มุมล่าง-ซ้าย
  L.latLng(90, 180)    // มุมบน-ขวา
);

// แผนที่ฐาน (Dark Mode) จาก CARTO
const darkMapUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const darkMapAttribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

// สร้าง URL ของเลเยอร์เมฆและฝนจาก OpenWeatherMap Weather Maps 1.0 ตามคีย์ที่รับมา
function buildCloudUrl(apiKey) {
  return `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`
}
function buildPrecipUrl(apiKey) {
  return `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`
}

function buildTempUrl(apiKey) {
  // ใช้ชื่อเลเยอร์ที่ถูกต้องจาก OWM: temp_new
  return `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`
}

function ChangeMapView({ center }) {
  const map = useMap();
  map.flyTo(center, map.getZoom());
  return null;
}

function RadarPulse({ position }) {
  const pulseIcon = L.divIcon({
    className: 'radar-pulse',
    html: '<span class="ring ring1"></span><span class="ring ring2"></span><span class="ring ring3"></span>',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
  return <Marker position={position} icon={pulseIcon} interactive={false} />;
}

function ClickManager({ setPosition }) {
  useMapEvents({
    click(e) {
      // แปลงพิกัดให้อยู่ในช่วงที่ถูกต้อง (-180..180)
      const wrappedLatLng = e.latlng.wrap();
      console.log('Map clicked at:', e.latlng, 'Wrapped to:', wrappedLatLng);
      // อัปเดตตำแหน่งหลักใน App.jsx ด้วยพิกัดที่แปลงแล้ว
      setPosition([wrappedLatLng.lat, wrappedLatLng.lng]);
    },
  });
  return null;
}

function MapWrapper({ center, activeLayers, apiKey, setPosition }) {
  return (
    <MapContainer
      center={center}
      zoom={10}
      zoomControl={false}
      attributionControl={false}
      style={{ width: '100vw', height: '100vh' }}
      minZoom={3}
      maxBounds={worldBounds}
      maxBoundsViscosity={1.0}
      worldCopyJump={true}
    >
      {/* 1. แผนที่ฐาน Dark Mode (อยู่ตลอด) */}
      <TileLayer url={darkMapUrl} attribution={darkMapAttribution} />

      {/* เลเยอร์อุณหภูมิ: อยู่ล่างสุดเหนือ Base map */}
      {activeLayers?.temperature && apiKey && (
        <TileLayer
          url={buildTempUrl(apiKey)}
          attribution="&copy; OpenWeatherMap"
          opacity={0.5}
          zIndex={1}
        />
      )}

      {/* 2. เลเยอร์เมฆ: แสดงเมื่อ activeLayers.clouds เป็น true */}
      {activeLayers?.clouds && apiKey && (
        <TileLayer
          url={buildCloudUrl(apiKey)}
          attribution="&copy; OpenWeatherMap"
          opacity={0.6}
          zIndex={2}
        />
      )}

      {/* 3. เลเยอร์ฝน: แสดงเมื่อ activeLayers.precipitation เป็น true */}
      {activeLayers?.precipitation && apiKey && (
        <TileLayer
          url={buildPrecipUrl(apiKey)}
          attribution="&copy; OpenWeatherMap"
          opacity={0.8}
          zIndex={3}
        />
      )}

      {/* จุดตำแหน่งและเอฟเฟกต์ RadarPulse */}
      <CircleMarker
        center={center}
        radius={8}
        pathOptions={{ color: '#2f7bf6', fillColor: '#2f7bf6', fillOpacity: 1 }}
      />
      <RadarPulse position={center} />

      {/* ซ่อน ScaleControl และ Attribution control ตามคำขอ */}

      {/* บินไปยังตำแหน่งใหม่เมื่อ center เปลี่ยน */}
      <ChangeMapView center={center} />

      {/* ดักจับการคลิกบนแผนที่แล้วส่งตำแหน่งกลับขึ้นไป */}
      {typeof setPosition === 'function' && <ClickManager setPosition={setPosition} />}
    </MapContainer>
  );
}

export default MapWrapper;