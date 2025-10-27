# Live Weather Map (React + Vite)

แอปแผนที่สภาพอากาศแบบเรียลไทม์ ใช้ React, Vite และ Leaflet พร้อมฟังก์ชันค้นหาเมือง, แสดงพยากรณ์, และสลับเลเยอร์เมฆ/ฝนจาก OpenWeatherMap

## ฟีเจอร์หลัก
- ค้นหาชื่อเมืองและบินไปยังพิกัด (`SearchBar`)
- แสดงพยากรณ์ปัจจุบันและ 5 วันข้างหน้า (`ForecastBox`)
- สลับเลเยอร์เมฆ/ฝน (ต้องมี API key) (`LayerControls` + `MapWrapper`)
- รองรับการใส่ API key ผ่าน UI ถ้าไม่มีไฟล์ env (`ApiKeyBanner`)

## การตั้งค่าและการรัน
1) ติดตั้งแพ็กเกจ

```bash
npm install
```

2) ตั้งค่า API key (เลือกวิธีใดวิธีหนึ่ง)
- วิธี A: สร้างไฟล์ `.env.local` ในโฟลเดอร์ `live-weather-map` แล้วใส่:

```
VITE_OWM_API_KEY=YOUR_OPENWEATHERMAP_KEY
```

- วิธี B: รันแอป แล้วกรอกคีย์ในแบนเนอร์ด้านบน (เก็บใน `localStorage`)

3) รัน dev server

```bash
npm run dev
```

เปิด `http://localhost:5173/`

## โครงสร้างที่เกี่ยวข้อง
- `src/App.jsx`: จัดการสถานะตำแหน่ง, พยากรณ์, คีย์ API, และประกอบ UI
- `src/components/MapWrapper.jsx`: แผนที่, จุดตำแหน่ง, และเลเยอร์เมฆ/ฝน (ใช้คีย์จากพร็อพ)
- `src/components/ForecastBox.jsx`: แสดงผลพยากรณ์ รองรับ One Call 3.0 และ fallback 2.5
- `src/components/SearchBar.jsx`: ค้นหาชื่อเมืองด้วย OWM Geocoding API
- `src/components/LayerControls.jsx`: ปุ่มสลับเลเยอร์ พร้อมสถานะ disabled เมื่อไม่มีคีย์
- `src/components/ApiKeyBanner.jsx`: กล่องกรอก/บันทึก API key
- `src/utils/owmKey.js`: ยูทิลอ่าน/เขียนคีย์จาก env หรือ localStorage

## การทดสอบการใช้งานจริง
- ค้นหาเมือง เช่น `Bangkok`, `Tokyo`, `London` → แผนที่บินไปยังตำแหน่งนั้น และโหลดพยากรณ์
- เปิดปุ่ม `Clouds` หรือ `Precipitation` เมื่อใส่คีย์แล้ว → เห็นเลเยอร์จาก OWM บนแผนที่
- ปิด/เปิดปุ่มสลับทีละอัน (ป้องกันเปิดพร้อมกัน)
- กรณีไม่มีคีย์ → ปุ่มเลเยอร์จะถูก disable และ ForecastBox จะแจ้งเตือนตามผลการเรียก API

## ข้อผิดพลาดที่คาดพบและแนวทางแก้
- `No forecast data available` → ตรวจว่าใส่คีย์ถูกต้อง/เครือข่ายไม่บล็อก OWM
- `401 Unauthorized` จาก One Call 3.0 → ระบบจะ fallback ไป API ฟรี (`/weather` + `/forecast`)
- Tile ของ OWM ไม่ขึ้น → ตรวจคีย์หรือ rate limit, ปรับลดการสลับเลเยอร์ถี่ ๆ

## การเข้ากันได้
- ทำงานบน Vite dev server (`Node >= 18` แนะนำ)
- ใช้ Leaflet 1.9.x และ React 19.x
- ต้องมีการเชื่อมต่อ `api.openweathermap.org` สำหรับข้อมูลพยากรณ์และ Geocoding

## License & Attribution
- Base map: CARTO + OpenStreetMap (ดูเครดิตในตัวแผนที่)
- Weather layers: OpenWeatherMap (ต้องมี API key)

## ประวัติการอัปเดต
- v0.1.0: เพิ่ม UI ใส่ API key, ปรับใช้คีย์แบบไดนามิก, เพิ่ม SearchBar, ปรับเลเยอร์ให้ใช้คีย์จากพร็อพ, ปุ่มเลเยอร์รองรับ disabled, ปรับเอกสาร
