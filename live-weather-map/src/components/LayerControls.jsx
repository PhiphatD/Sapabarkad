import './LayerControls.css'

function LayerControls({ activeLayers, onToggleClouds, onTogglePrecipitation, disabled }) {
  const isCloudsActive = !!activeLayers?.clouds
  const isPrecipActive = !!activeLayers?.precipitation

  return (
    <div className="layer-controls">
      <button className={`layer-btn ${isCloudsActive ? 'active' : ''}`} onClick={onToggleClouds} disabled={disabled}>
        ☁️ Clouds
      </button>
      <button className={`layer-btn ${isPrecipActive ? 'active' : ''}`} onClick={onTogglePrecipitation} disabled={disabled}>
        🌧️ Precipitation
      </button>
      {disabled && (
        <div className="layer-note">กรุณาใส่ API key เพื่อเปิดเลเยอร์</div>
      )}
    </div>
  )
}

export default LayerControls