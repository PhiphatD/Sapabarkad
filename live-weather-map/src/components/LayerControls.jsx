import './LayerControls.css'

function LayerControls({ activeLayers, onToggleClouds, onTogglePrecipitation, onToggleTemperature, disabled }) {
  const isCloudsActive = !!activeLayers?.clouds
  const isPrecipActive = !!activeLayers?.precipitation
  const isTempActive = !!activeLayers?.temperature

  return (
    <div className="layer-controls">
      <button className={`layer-btn ${isCloudsActive ? 'active' : ''}`} onClick={onToggleClouds} disabled={disabled}>
        ☁️ Clouds
      </button>
      <button className={`layer-btn ${isPrecipActive ? 'active' : ''}`} onClick={onTogglePrecipitation} disabled={disabled}>
        🌧️ Precipitation
      </button>
      <button className={`layer-btn ${isTempActive ? 'active' : ''}`} onClick={onToggleTemperature} disabled={disabled}>
        🌡️ Temperature
      </button>
      {disabled && (
        <div className="layer-note">กรุณาใส่ API key เพื่อเปิดเลเยอร์</div>
      )}
    </div>
  )
}

export default LayerControls