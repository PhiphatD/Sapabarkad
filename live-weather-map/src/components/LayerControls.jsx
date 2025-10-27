import './LayerControls.css'

function LayerControls({ activeLayers, onToggleClouds, onTogglePrecipitation }) {
  const isCloudsActive = !!activeLayers?.clouds
  const isPrecipActive = !!activeLayers?.precipitation

  return (
    <div className="layer-controls">
      <button className={`layer-btn ${isCloudsActive ? 'active' : ''}`} onClick={onToggleClouds}>
        ☁️ Clouds
      </button>
      <button className={`layer-btn ${isPrecipActive ? 'active' : ''}`} onClick={onTogglePrecipitation}>
        🌧️ Precipitation
      </button>
    </div>
  )
}

export default LayerControls