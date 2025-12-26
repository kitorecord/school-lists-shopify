import { useState, useEffect } from 'react'
import ListDetail from './ListDetail'

export default function SchoolLists({ comunaId }) {
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedListId, setSelectedListId] = useState(null)

  useEffect(() => {
    if (comunaId) {
      fetchLists()
    }
  }, [comunaId])

  const fetchLists = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/comunas/${comunaId}/lists`)
      if (!response.ok) throw new Error('Error fetching lists')
      const data = await response.json()
      setLists(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Cargando listas...</div>
  if (error) return <div className="error">Error: {error}</div>
  if (lists.length === 0) return <div className="no-lists">No hay listas disponibles para esta comuna</div>

  if (selectedListId) {
    return (
      <div>
        <button onClick={() => setSelectedListId(null)} className="back-btn">
          ← Volver a listas
        </button>
        <ListDetail listId={selectedListId} />
      </div>
    )
  }

  return (
    <div className="lists-container">
      <h3>Listas disponibles:</h3>
      <div className="lists-grid">
        {lists.map(list => (
          <div key={list.id} className="list-card">
            <h4>{list.name}</h4>
            <p>{list.description}</p>
            <button 
              onClick={() => setSelectedListId(list.id)}
              className="view-btn"
            >
              Ver productos
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
