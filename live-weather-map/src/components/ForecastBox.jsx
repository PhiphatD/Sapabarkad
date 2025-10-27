import './ForecastBox.css'

function normalizeForecast(forecast) {
  if (!forecast) return null
  // One Call shape
  if (forecast.current && forecast.daily) {
    return {
      label:
        (forecast.timezone && forecast.timezone.split('/')[1]) || 'Your Location',
      current: {
        temp: forecast.current.temp,
        feels_like: forecast.current.feels_like,
        weather: forecast.current.weather,
      },
      daily: forecast.daily,
    }
  }
  // Fallback shape: { current, forecast5d }
  if (forecast.current && forecast.forecast5d) {
    const label = forecast.current.name || 'Your Location'
    const curWeather = forecast.current.weather || []
    const current = {
      temp: forecast.current.main?.temp,
      feels_like: forecast.current.main?.feels_like,
      weather: curWeather,
    }
    // Group 3-hourly items into daily summary
    const list = forecast.forecast5d.list || []
    const byDay = {}
    list.forEach((entry) => {
      const d = new Date(entry.dt * 1000)
      const key = d.toISOString().slice(0, 10)
      const tmax = entry.main?.temp_max ?? entry.main?.temp
      const tmin = entry.main?.temp_min ?? entry.main?.temp
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

function ForecastBox({ forecast, isLoading }) {
  if (isLoading) {
    return <div className="forecast-box">Loading...</div>
  }

  const f = normalizeForecast(forecast)
  if (!f) {
    return <div className="forecast-box">No forecast data available.</div>
  }

  const iconCurrent = f.current.weather?.[0]?.icon
  const descCurrent = f.current.weather?.[0]?.description || ''
  const mainCurrent = f.current.weather?.[0]?.main || ''

  return (
    <div className="forecast-box">
      <h3>{f.label}</h3>
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