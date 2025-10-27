import { useState, useEffect } from 'react'
import MapWrapper from './components/MapWrapper'
import ForecastBox from './components/ForecastBox'
import LayerControls from './components/LayerControls'
import SearchBar from './components/SearchBar'

const API_KEY = import.meta.env.VITE_OWM_API_KEY

function App() {
  const [position, setPosition] = useState([13.7563, 100.5018])
  const [forecast, setForecast] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeLayers, setActiveLayers] = useState({ clouds: false, precipitation: false })

  const fetchForecast = async (lat, lon) => {
    setIsLoading(true)
    try {
      // Try One Call 3.0 (requires subscription). Fallback if 401.
      const url3 = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,alerts&appid=${API_KEY}`
      let res = await fetch(url3)
      let data = await res.json()

      if (res.status === 401 || (data && data.cod === 401)) {
        const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        const [currentRes, forecastRes] = await Promise.all([fetch(currentUrl), fetch(forecastUrl)])
        const current = await currentRes.json()
        const forecast5d = await forecastRes.json()
        data = { current, forecast5d }
      }

      setForecast(data)
      console.log('ได้ข้อมูลพยากรณ์แล้ว:', data)
    } catch (err) {
      console.warn('ดึง One Call 3.0 ไม่สำเร็จ กำลังใช้ fallback:', err)
      try {
        const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        const [currentRes, forecastRes] = await Promise.all([fetch(currentUrl), fetch(forecastUrl)])
        const current = await currentRes.json()
        const forecast5d = await forecastRes.json()
        setForecast({ current, forecast5d })
        console.log('ได้ข้อมูลพยากรณ์แบบ fallback:', { current, forecast5d })
      } catch (err2) {
        console.error(err2)
      } finally {
        setIsLoading(false)
      }
      return
    }
    setIsLoading(false)
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude])
      },
      (err) => {
        console.warn(err.message)
        // ใช้ค่า Default (กทม.) และดึงข้อมูลเอง
        fetchForecast(13.7563, 100.5018)
      }
    )
  }, [])

  useEffect(() => {
    if (position) {
      fetchForecast(position[0], position[1])
    }
  }, [position])

  const toggleClouds = () => {
    setActiveLayers((prev) => ({ clouds: !prev.clouds, precipitation: false }))
    console.log('Clouds toggled (exclusive)!')
  }

  const togglePrecipitation = () => {
    setActiveLayers((prev) => ({ clouds: false, precipitation: !prev.precipitation }))
    console.log('Precipitation toggled (exclusive)!')
  }

  return (
    <div className="App">
      <SearchBar onSelectPosition={setPosition} />
      <MapWrapper center={position} activeLayers={activeLayers} />
      <ForecastBox forecast={forecast} isLoading={isLoading} />
      <LayerControls
        activeLayers={activeLayers}
        onToggleClouds={toggleClouds}
        onTogglePrecipitation={togglePrecipitation}
      />
    </div>
  )
}

export default App
