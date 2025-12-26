import { useState, useEffect } from 'react'
import '../styles/AdminPanel.css'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('create-list')
  const [lists, setLists] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    createdBy: 'admin'
  })
  const [selectedList, setSelectedList] = useState(null)
  const [productForm, setProductForm] = useState({
    shopifyProductId: '',
    quantity: 1
  })

  const handleCreateList = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (!response.ok) throw new Error('Error creating list')
      
      alert('✅ Lista creada exitosamente')
      setFormData({ name: '', description: '', createdBy: 'admin' })
    } catch (err) {
      alert('❌ Error: ' + err.message)
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    if (!selectedList) {
      alert('Selecciona una lista primero')
      return
    }

    try {
      const response = await fetch(`/api/admin/lists/${selectedList}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm)
      })
      if (!response.ok) throw new Error('Error adding product')
      
      alert('✅ Producto agregado a la lista')
      setProductForm({ shopifyProductId: '', quantity: 1 })
    } catch (err) {
      alert('❌ Error: ' + err.message)
    }
  }

  return (
    <div className="admin-panel">
      <h2>🔧 Panel de Administración</h2>
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'create-list' ? 'active' : ''}
          onClick={() => setActiveTab('create-list')}
        >
          Crear Lista
        </button>
        <button 
          className={activeTab === 'manage-products' ? 'active' : ''}
          onClick={() => setActiveTab('manage-products')}
        >
          Gestionar Productos
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'create-list' && (
          <div className="admin-section">
            <h3>Crear Nueva Lista Escolar</h3>
            <form onSubmit={handleCreateList}>
              <div className="form-group">
                <label>Nombre de la lista:</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ej: Lista 1º Básico"
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción:</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descripción de la lista"
                  rows="4"
                />
              </div>

              <button type="submit" className="btn-primary">
                Crear Lista
              </button>
            </form>
          </div>
        )}

        {activeTab === 'manage-products' && (
          <div className="admin-section">
            <h3>Agregar Productos a Listas</h3>
            
            <div className="form-group">
              <label>Selecciona una lista:</label>
              <input 
                type="number"
                value={selectedList || ''}
                onChange={(e) => setSelectedList(e.target.value ? parseInt(e.target.value) : null)}
                placeholder="ID de la lista"
              />
            </div>

            {selectedList && (
              <form onSubmit={handleAddProduct}>
                <div className="form-group">
                  <label>ID del Producto Shopify:</label>
                  <input 
                    type="text"
                    value={productForm.shopifyProductId}
                    onChange={(e) => setProductForm({...productForm, shopifyProductId: e.target.value})}
                    placeholder="Ej: gid://shopify/Product/123456"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Cantidad:</label>
                  <input 
                    type="number"
                    min="1"
                    value={productForm.quantity}
                    onChange={(e) => setProductForm({...productForm, quantity: parseInt(e.target.value)})}
                  />
                </div>

                <button type="submit" className="btn-primary">
                  Agregar Producto
                </button>
              </form>
            )}

            <div className="info-box">
              <h4>💡 Cómo obtener el ID de Shopify:</h4>
              <ol>
                <li>Ve a tu tienda Shopify</li>
                <li>Abre un producto</li>
                <li>El ID está en la URL: /products/<strong>ID</strong></li>
                <li>O copia desde: gid://shopify/Product/<strong>ID</strong></li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
