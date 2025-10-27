import { useState, useEffect } from 'react'
import MapWrapper from './components/MapWrapper'
import ForecastBox from './components/ForecastBox'
import LayerControls from './components/LayerControls'
import SearchBar from './components/SearchBar'
import ApiKeyBanner from './components/ApiKeyBanner'
import AqiBox from './components/AqiBox'
import { getOWMApiKey } from './utils/owmKey'

function App() {
  const [position, setPosition] = useState([13.7563, 100.5018])
  const [forecast, setForecast] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeLayers, setActiveLayers] = useState({ clouds: false, precipitation: false, temperature: false })
  const [apiKey, setApiKey] = useState(getOWMApiKey())
  const [aqiData, setAqiData] = useState(null)

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

  const fetchAqi = async (lat, lon) => {
    if (!apiKey) return
    try {
      const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
      const res = await fetch(url)
      const data = await res.json()
      if (Array.isArray(data?.list) && data.list.length > 0) {
        setAqiData(data.list[0])
      } else {
        setAqiData(null)
      }
    } catch (err) {
      console.error('AQI Fetch Error:', err)
      setAqiData(null)
    }
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
    if (!position) return
    const handler = setTimeout(() => {
      console.log('Debounce: OK! Fetching data now...')
      fetchForecast(position[0], position[1])
      fetchAqi(position[0], position[1])
    }, 1000)
    return () => {
      console.log('Debounce: Cancelling previous fetch...')
      clearTimeout(handler)
    }
  }, [position])

  useEffect(() => {
    // เมื่อคีย์เปลี่ยน ถ้ามีตำแหน่งอยู่แล้ว ให้ดึงข้อมูลใหม่
    if (apiKey && position) {
      fetchForecast(position[0], position[1])
      fetchAqi(position[0], position[1])
    }
  }, [apiKey])

  const toggleClouds = () => {
    setActiveLayers((prev) => ({ ...prev, clouds: !prev.clouds }))
    console.log('Clouds toggled')
  }

  const togglePrecipitation = () => {
    setActiveLayers((prev) => ({ ...prev, precipitation: !prev.precipitation }))
    console.log('Precipitation toggled')
  }

  const toggleTemperature = () => {
    setActiveLayers((prev) => ({ ...prev, temperature: !prev.temperature }))
    console.log('Temperature toggled')
  }

  return (
    <div className="App">
      <SearchBar onSelectPosition={setPosition} apiKey={apiKey} />
      <ApiKeyBanner apiKey={apiKey} onSetApiKey={setApiKey} />
      <MapWrapper center={position} activeLayers={activeLayers} apiKey={apiKey} setPosition={setPosition} />
      <ForecastBox forecast={forecast} isLoading={isLoading} apiKey={apiKey} />
      <AqiBox aqiData={aqiData} apiKey={apiKey} />
      <LayerControls
        activeLayers={activeLayers}
        onToggleClouds={toggleClouds}
        onTogglePrecipitation={togglePrecipitation}
        onToggleTemperature={toggleTemperature}
        disabled={!apiKey}
      />
    </div>
  )
}

export default App
