import { useState, useEffect } from 'react'

export default function RegionSelector({ onRegionSelect, selectedRegion }) {
  const [regions, setRegions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchRegions()
  }, [])

  const fetchRegions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/regions')
      if (!response.ok) throw new Error('Error fetching regions')
      const data = await response.json()
      setRegions(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="selector">Cargando regiones...</div>
  if (error) return <div className="selector error">Error: {error}</div>

  return (
    <div className="selector">
      <label htmlFor="region-select">Selecciona tu Región:</label>
      <select 
        id="region-select"
        value={selectedRegion || ''}
        onChange={(e) => onRegionSelect(e.target.value ? parseInt(e.target.value) : null)}
      >
        <option value="">-- Selecciona una región --</option>
        {regions.map(region => (
          <option key={region.id} value={region.id}>
            {region.name}
          </option>
        ))}
      </select>
    </div>
  )
}
