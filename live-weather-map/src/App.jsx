import { useState, useEffect } from 'react'
import MapWrapper from './components/MapWrapper'
import ForecastBox from './components/ForecastBox'
import LayerControls from './components/LayerControls'
import SearchBar from './components/SearchBar'
import ApiKeyBanner from './components/ApiKeyBanner'
import { getOWMApiKey } from './utils/owmKey'

function App() {
  const [position, setPosition] = useState([13.7563, 100.5018])
  const [forecast, setForecast] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeLayers, setActiveLayers] = useState({ clouds: false, precipitation: false })
  const [apiKey, setApiKey] = useState(getOWMApiKey())

  const fetchForecast = async (lat, lon) => {
    setIsLoading(true)
    if (!apiKey) {
      console.warn('ยังไม่มี API key – รอให้ผู้ใช้กรอก')
      setForecast(null)
      setIsLoading(false)
      return
    }
    try {
      // Try One Call 3.0 (requires subscription). Fallback if 401.
      const url3 = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,alerts&appid=${apiKey}`
      let res = await fetch(url3)
      let data = await res.json()

      if (res.status === 401 || (data && data.cod === 401)) {
        const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
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
        const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
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

  useEffect(() => {
    // เมื่อคีย์เปลี่ยน ถ้ามีตำแหน่งอยู่แล้ว ให้ดึงข้อมูลใหม่
    if (apiKey && position) {
      fetchForecast(position[0], position[1])
    }
  }, [apiKey])

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
      <SearchBar onSelectPosition={setPosition} apiKey={apiKey} />
      <ApiKeyBanner apiKey={apiKey} onSetApiKey={setApiKey} />
      <MapWrapper center={position} activeLayers={activeLayers} apiKey={apiKey} />
      <ForecastBox forecast={forecast} isLoading={isLoading} apiKey={apiKey} />
      <LayerControls
        activeLayers={activeLayers}
        onToggleClouds={toggleClouds}
        onTogglePrecipitation={togglePrecipitation}
        disabled={!apiKey}
      />
    </div>
  )
}

export default App
