import { useState } from 'react'
import './ApiKeyBanner.css'
import { getOWMApiKey, setOWMApiKey } from '../utils/owmKey'

function ApiKeyBanner({ apiKey, onSetApiKey }) {
  const [input, setInput] = useState(getOWMApiKey())
  const [saved, setSaved] = useState(false)

  if (apiKey) return null

  const saveKey = () => {
    const k = input.trim()
    if (!k) return
    setOWMApiKey(k)
    onSetApiKey(k)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="api-key-banner">
      <span>กรุณาใส่ OpenWeatherMap API key เพื่อดึงข้อมูล</span>
      <input
        type="text"
        placeholder="พิมพ์คีย์ของคุณที่นี่"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={saveKey}>บันทึกคีย์</button>
      {saved && <span className="saved-note">บันทึกแล้ว</span>}
    </div>
  )
}

export default ApiKeyBanner