import { useState } from 'react'
import './LayerControls.css'

function LayerControls({ onToggleClouds, onTogglePrecipitation }) {
  const [isCloudsActive, setIsCloudsActive] = useState(false)
  const [isPrecipActive, setIsPrecipActive] = useState(false)

  const handleCloudsClick = () => {
    setIsCloudsActive((v) => !v)
    if (onToggleClouds) onToggleClouds()
  }

  const handlePrecipClick = () => {
    setIsPrecipActive((v) => !v)
    if (onTogglePrecipitation) onTogglePrecipitation()
  }

  return (
    <div className="layer-controls">
      <button className={`layer-btn ${isCloudsActive ? 'active' : ''}`} onClick={handleCloudsClick}>
        ☁️ Clouds
      </button>
      <button className={`layer-btn ${isPrecipActive ? 'active' : ''}`} onClick={handlePrecipClick}>
        🌧️ Precipitation
      </button>
    </div>
  )
}

export default LayerControls