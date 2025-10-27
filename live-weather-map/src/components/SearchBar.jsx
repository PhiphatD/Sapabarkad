import { useState } from 'react'
import './SearchBar.css'

function SearchBar({ onSelectPosition, apiKey }) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const performSearch = async () => {
    const q = query.trim()
    if (!q) return
    if (!apiKey) {
      setError('กรุณาใส่ API key ก่อนค้นหา')
      return
    }
    setLoading(true)
    setError('')
    try {
      const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=1&appid=${apiKey}`
      const res = await fetch(url)
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        const { lat, lon } = data[0]
        onSelectPosition([lat, lon])
      } else {
        setError('ไม่พบเมืองที่ค้นหา')
      }
    } catch (e) {
      setError('เกิดข้อผิดพลาดในการค้นหา')
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      performSearch()
    }
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="พิมพ์ชื่อเมือง เช่น London, Tokyo"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={loading}
      />
      <button className="search-btn" onClick={performSearch} disabled={loading || !query.trim()}>
        {loading ? 'กำลังค้นหา…' : 'ค้นหา'}
      </button>
      {error && <div className="search-error">{error}</div>}
    </div>
  )
}

export default SearchBar