import { useState, useEffect } from 'react'
import './ForecastBox.css'

function normalizeForecast(forecast) {
  if (!forecast) return null
  // One Call shape
  if (forecast.current && forecast.daily) {
    return {
      label:
        (forecast.timezone && forecast.timezone.split('/')[1]) || 'Your Location',
      current: {
        temp: forecast.current.temp ?? 0,
        feels_like: forecast.current.feels_like ?? 0,
        weather: forecast.current.weather,
        sunrise: forecast.current.sunrise,
        sunset: forecast.current.sunset,
      },
      daily: forecast.daily,
    }
  }
  // Fallback shape: { current, forecast5d }
  if (forecast.current && forecast.forecast5d) {
    const label = forecast.current.name || 'Your Location'
    const curWeather = forecast.current.weather || []
    const current = {
      temp: forecast.current.main?.temp ?? 0,
      feels_like: forecast.current.main?.feels_like ?? 0,
      weather: curWeather,
      sunrise: forecast.current.sys?.sunrise,
      sunset: forecast.current.sys?.sunset,
    }
    // Group 3-hourly items into daily summary
    const list = forecast.forecast5d.list || []
    const byDay = {}
    list.forEach((entry) => {
      const d = new Date(entry.dt * 1000)
      const key = d.toISOString().slice(0, 10)
      const tmax = entry.main?.temp_max ?? entry.main?.temp ?? 0
      const tmin = entry.main?.temp_min ?? entry.main?.temp ?? 0
      if (!byDay[key]) {
        byDay[key] = {
          dt: entry.dt,
          temp: { max: tmax, min: tmin },
          weather: entry.weather,
        }
      } else {
        byDay[key].temp.max = Math.max(byDay[key].temp.max, tmax)
        byDay[key].temp.min = Math.min(byDay[key].temp.min, tmin)
        // prefer midday icon if around 12:00, else keep first
        const hour = d.getHours()
        if (hour === 12) byDay[key].weather = entry.weather
      }
    })
    const daily = Object.values(byDay)
      .sort((a, b) => a.dt - b.dt)
      .map((d) => ({
        dt: d.dt,
        temp: d.temp,
        weather: d.weather,
      }))
    return { label, current, daily }
  }
  return null
}

function ForecastBox({ forecast, isLoading, apiKey }) {
  // Live Clock state
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timerId)
  }, [])

  if (isLoading) {
    return <div className="forecast-box">Loading...</div>
  }

  const f = normalizeForecast(forecast)
  if (!f) {
    if (!apiKey) {
      return <div className="forecast-box">กรุณาใส่ API key เพื่อดึงข้อมูลพยากรณ์</div>
    }
    return <div className="forecast-box">No forecast data available.</div>
  }

  // Timezone string from API 3.0 (if available)
  const timezone = forecast?.timezone
  const liveTime = currentTime.toLocaleTimeString('en-US', {
    timeZone: timezone || undefined,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  const iconCurrent = f.current.weather?.[0]?.icon
  const descCurrent = f.current.weather?.[0]?.description || ''
  const mainCurrent = f.current.weather?.[0]?.main || ''
  const sunriseTime = f.current.sunrise
    ? new Date(f.current.sunrise * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A'
  const sunsetTime = f.current.sunset
    ? new Date(f.current.sunset * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A'

  return (
    <div className="forecast-box">
      <h3>{f.label}</h3>
      <div className="live-clock">{liveTime}</div>
      <div className="current-weather">
        {iconCurrent && (
          <img
            src={`https://openweathermap.org/img/wn/${iconCurrent}@2x.png`}
            alt={descCurrent}
          />
        )}
        <div className="current-temp">
          <span>{Math.round(f.current.temp)}°C</span>
          <p>Feels like {Math.round(f.current.feels_like)}°C</p>
        </div>
      </div>
      <p>{mainCurrent}</p>

      <div className="sun-times">
        <div>
          <span>☀️ Sunrise</span>
          <strong>{sunriseTime}</strong>
        </div>
        <div>
          <span>🌅 Sunset</span>
          <strong>{sunsetTime}</strong>
        </div>
      </div>

      <hr />

      <ul className="daily-list">
        {Array.isArray(f.daily) && f.daily.slice(1, 6).map((day, idx) => {
          const dayIcon = day.weather?.[0]?.icon
          const dayDesc = day.weather?.[0]?.description || ''
          const wday = new Date(day.dt * 1000).toLocaleDateString('en-US', {
            weekday: 'short',
          })
          return (
            <li key={idx}>
              <span>{wday}</span>
              {dayIcon && (
                <img
                  src={`https://openweathermap.org/img/wn/${dayIcon}.png`}
                  alt={dayDesc}
                />
              )}
              <span>{Math.round(day.temp.max)}°</span>
              <span className="temp-min">{Math.round(day.temp.min)}°</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ForecastBox