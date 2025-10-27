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
      <div className="aqi-header">
        <span className="aqi-title">คุณภาพอากาศ (AQI)</span>
      </div>
      <div className="aqi-top">
        <div className={`aqi-chip aqi-${aqiIndex}`}>AQI {aqiIndex}: {aqiText(aqiIndex)}</div>
      </div>
      <div className="aqi-details">
        <div className="metric">
          <span className="metric-label">PM2.5</span>
          <span className="metric-value">{Math.round(pm25)} µg/m³</span>
        </div>
        <div className="metric">
          <span className="metric-label">PM10</span>
          <span className="metric-value">{Math.round(pm10)} µg/m³</span>
        </div>
      </div>
    </div>
  )
}