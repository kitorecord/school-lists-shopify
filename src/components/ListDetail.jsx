import { useState, useEffect } from 'react'

export default function ListDetail({ listId }) {
  const [list, setList] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantities, setQuantities] = useState({})

  useEffect(() => {
    fetchListDetails()
  }, [listId])

  const fetchListDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/lists/${listId}`)
      if (!response.ok) throw new Error('Error fetching list details')
      const data = await response.json()
      setList(data)
      
      // Inicializar cantidades
      const initialQuantities = {}
      data.products.forEach(product => {
        initialQuantities[product.id] = product.quantity
      })
      setQuantities(initialQuantities)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = (productId, newQuantity) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, newQuantity)
    }))
  }

  const handleAddToCart = async () => {
    try {
      const items = list.products.map(product => ({
        shopifyId: product.shopifyId,
        quantity: quantities[product.id] || product.quantity
      }))

      const response = await fetch('/api/shopify/cart-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      })

      if (!response.ok) throw new Error('Error generating cart URL')
      const { cartUrl } = await response.json()
      
      // Redirigir a Shopify
      window.location.href = cartUrl
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  if (loading) return <div className="loading">Cargando detalles...</div>
  if (error) return <div className="error">Error: {error}</div>
  if (!list) return <div className="error">Lista no encontrada</div>

  const total = list.products.reduce((sum, product) => {
    const qty = quantities[product.id] || product.quantity
    return sum + (product.price * qty)
  }, 0)

  return (
    <div className="list-detail">
      <h2>{list.name}</h2>
      <p className="description">{list.description}</p>

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {list.products.map(product => {
              const qty = quantities[product.id] || product.quantity
              const subtotal = product.price * qty
              
              return (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                      {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                    </span>
                  </td>
                  <td>
                    <input 
                      type="number" 
                      min="1" 
                      value={qty}
                      onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                      className="quantity-input"
                    />
                  </td>
                  <td>${subtotal.toFixed(2)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="cart-summary">
        <h3>Total: ${total.toFixed(2)}</h3>
        <button 
          onClick={handleAddToCart}
          className="add-to-cart-btn"
        >
          🛒 Agregar todo al carrito de Shopify
        </button>
      </div>
    </div>
  )
}
