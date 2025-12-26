import { useState, useEffect } from 'react'
import './App.css'
import RegionSelector from './components/RegionSelector'
import ComunaSelector from './components/ComunaSelector'
import SchoolLists from './components/SchoolLists'
import AdminPanel from './pages/AdminPanel'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [selectedComuna, setSelectedComuna] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>📚 Listas Escolares Bichoto</h1>
          <nav>
            <button 
              className={currentPage === 'home' ? 'active' : ''}
              onClick={() => setCurrentPage('home')}
            >
              Inicio
            </button>
            <button 
              className={currentPage === 'admin' ? 'active' : ''}
              onClick={() => setCurrentPage('admin')}
            >
              Administrador
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {currentPage === 'home' ? (
            <div className="home-page">
              <h2>Encuentra tu lista de útiles escolares</h2>
              
              <div className="selectors">
                <RegionSelector 
                  onRegionSelect={setSelectedRegion}
                  selectedRegion={selectedRegion}
                />
                
                {selectedRegion && (
                  <ComunaSelector 
                    regionId={selectedRegion}
                    onComunaSelect={setSelectedComuna}
                    selectedComuna={selectedComuna}
                  />
                )}
              </div>

              {selectedComuna && (
                <SchoolLists comunaId={selectedComuna} />
              )}
            </div>
          ) : (
            <AdminPanel />
          )}
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Listas Escolares Bichoto. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}

export default App
