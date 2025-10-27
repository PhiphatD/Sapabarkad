export function getOWMApiKey() {
  const fromEnv = import.meta.env.VITE_OWM_API_KEY
  const fromStorage = typeof localStorage !== 'undefined' ? localStorage.getItem('OWM_API_KEY') : null
  return fromEnv || fromStorage || ''
}

export function setOWMApiKey(key) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('OWM_API_KEY', key)
  }
}