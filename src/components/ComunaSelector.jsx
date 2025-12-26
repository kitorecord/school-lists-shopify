import { useState, useEffect } from 'react'

export default function ComunaSelector({ regionId, onComunaSelect, selectedComuna }) {
  const [comunas, setComunas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (regionId) {
      fetchComunas()
    }
  }, [regionId])

  const fetchComunas = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/regions/${regionId}/comunas`)
      if (!response.ok) throw new Error('Error fetching comunas')
      const data = await response.json()
      setComunas(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="selector">Cargando comunas...</div>
  if (error) return <div className="selector error">Error: {error}</div>

  return (
    <div className="selector">
      <label htmlFor="comuna-select">Selecciona tu Comuna:</label>
      <select 
        id="comuna-select"
        value={selectedComuna || ''}
        onChange={(e) => onComunaSelect(e.target.value ? parseInt(e.target.value) : null)}
      >
        <option value="">-- Selecciona una comuna --</option>
        {comunas.map(comuna => (
          <option key={comuna.id} value={comuna.id}>
            {comuna.name}
          </option>
        ))}
      </select>
    </div>
  )
}
