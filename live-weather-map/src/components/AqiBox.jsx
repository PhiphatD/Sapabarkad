import './AqiBox.css'

function aqiText(aqi) {
  switch (aqi) {
    case 1: return 'ดี (Good)'
    case 2: return 'พอใช้ (Fair)'
    case 3: return 'ปานกลาง (Moderate)'
    case 4: return 'แย่ (Poor)'
    case 5: return 'แย่มาก (Very Poor)'
    default: return 'ไม่ทราบ'
  }
}

export default function AqiBox({ aqiData, apiKey }) {
  if (!apiKey) {
    return (
      <div className="aqi-box">
        กรุณาใส่ API key เพื่อดูคุณภาพอากาศ
      </div>
    )
  }

  if (!aqiData) {
    return (
      <div className="aqi-box">No AQI data available.</div>
    )
  }

  const aqiIndex = Number(aqiData?.main?.aqi) || 0
  const pm25 = Number(aqiData?.components?.pm2_5) || 0
  const pm10 = Number(aqiData?.components?.pm10) || 0

  return (
    <div className="aqi-box">
      <h4>คุณภาพอากาศ (AQI)</h4>
      <div className={`aqi-chip aqi-${aqiIndex}`}>AQI {aqiIndex}: {aqiText(aqiIndex)}</div>
      <div className="aqi-details">
        <span>PM2.5: {Math.round(pm25)}</span>
        <span>PM10: {Math.round(pm10)}</span>
      </div>
    </div>
  )
}