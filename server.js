import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Pool de conexiones MySQL
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
});

// ==================== RUTAS DE GEOGRAFÍA ====================

// Obtener todas las regiones
app.get('/api/regions', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM regions ORDER BY name');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching regions:', error);
    res.status(500).json({ error: 'Error fetching regions' });
  }
});

// Obtener comunas por región
app.get('/api/regions/:regionId/comunas', async (req, res) => {
  try {
    const { regionId } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM comunas WHERE regionId = ? ORDER BY name',
      [regionId]
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching comunas:', error);
    res.status(500).json({ error: 'Error fetching comunas' });
  }
});

// ==================== RUTAS DE LISTAS ESCOLARES ====================

// Obtener listas por comuna
app.get('/api/comunas/:comunaId/lists', async (req, res) => {
  try {
    const { comunaId } = req.params;
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      `SELECT sl.* FROM schoolLists sl
       INNER JOIN listAssignments la ON sl.id = la.listId
       WHERE la.comunaId = ? ORDER BY sl.name`,
      [comunaId]
    );
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching lists:', error);
    res.status(500).json({ error: 'Error fetching lists' });
  }
});

// Obtener detalles de una lista con productos
app.get('/api/lists/:listId', async (req, res) => {
  try {
    const { listId } = req.params;
    const connection = await pool.getConnection();
    
    // Obtener lista
    const [listRows] = await connection.query(
      'SELECT * FROM schoolLists WHERE id = ?',
      [listId]
    );
    
    if (listRows.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'List not found' });
    }
    
    // Obtener productos de la lista
    const [products] = await connection.query(
      `SELECT sp.*, lp.quantity FROM shopifyProducts sp
       INNER JOIN listProducts lp ON sp.id = lp.productId
       WHERE lp.listId = ?`,
      [listId]
    );
    
    connection.release();
    
    res.json({
      ...listRows[0],
      products: products
    });
  } catch (error) {
    console.error('Error fetching list details:', error);
    res.status(500).json({ error: 'Error fetching list details' });
  }
});

// ==================== RUTAS DE ADMINISTRACIÓN ====================

// Crear lista escolar
app.post('/api/admin/lists', async (req, res) => {
  try {
    const { name, description, createdBy } = req.body;
    const connection = await pool.getConnection();
    
    const [result] = await connection.query(
      'INSERT INTO schoolLists (name, description, createdBy, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())',
      [name, description, createdBy]
    );
    
    connection.release();
    res.json({ id: result.insertId, name, description });
  } catch (error) {
    console.error('Error creating list:', error);
    res.status(500).json({ error: 'Error creating list' });
  }
});

// Asignar lista a comuna
app.post('/api/admin/lists/:listId/assign-comuna', async (req, res) => {
  try {
    const { listId } = req.params;
    const { comunaId } = req.body;
    const connection = await pool.getConnection();
    
    await connection.query(
      'INSERT INTO listAssignments (listId, comunaId) VALUES (?, ?)',
      [listId, comunaId]
    );
    
    connection.release();
    res.json({ success: true });
  } catch (error) {
    console.error('Error assigning list:', error);
    res.status(500).json({ error: 'Error assigning list' });
  }
});

// Agregar producto a lista
app.post('/api/admin/lists/:listId/products', async (req, res) => {
  try {
    const { listId } = req.params;
    const { shopifyProductId, quantity } = req.body;
    const connection = await pool.getConnection();
    
    // Primero verificar si el producto existe en shopifyProducts
    const [existingProduct] = await connection.query(
      'SELECT id FROM shopifyProducts WHERE shopifyId = ?',
      [shopifyProductId]
    );
    
    let productId;
    if (existingProduct.length === 0) {
      // Crear nuevo producto
      const [result] = await connection.query(
        'INSERT INTO shopifyProducts (shopifyId, name, price, stock) VALUES (?, ?, ?, ?)',
        [shopifyProductId, 'Product', 0, 0]
      );
      productId = result.insertId;
    } else {
      productId = existingProduct[0].id;
    }
    
    // Agregar producto a la lista
    await connection.query(
      'INSERT INTO listProducts (listId, productId, quantity) VALUES (?, ?, ?)',
      [listId, productId, quantity]
    );
    
    connection.release();
    res.json({ success: true, productId });
  } catch (error) {
    console.error('Error adding product to list:', error);
    res.status(500).json({ error: 'Error adding product to list' });
  }
});

// ==================== RUTAS DE SHOPIFY ====================

// Sincronizar productos de Shopify
app.post('/api/shopify/sync-products', async (req, res) => {
  try {
    const { products } = req.body;
    const connection = await pool.getConnection();
    
    for (const product of products) {
      await connection.query(
        `INSERT INTO shopifyProducts (shopifyId, name, price, stock) 
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = ?, price = ?, stock = ?`,
        [product.id, product.title, product.price, product.stock, product.title, product.price, product.stock]
      );
    }
    
    connection.release();
    res.json({ success: true, count: products.length });
  } catch (error) {
    console.error('Error syncing products:', error);
    res.status(500).json({ error: 'Error syncing products' });
  }
});

// Generar URL de carrito para Shopify
app.post('/api/shopify/cart-url', async (req, res) => {
  try {
    const { items } = req.body; // items: [{ shopifyId, quantity }, ...]
    
    const storeUrl = process.env.SHOPIFY_STORE_URL;
    let cartUrl = `https://${storeUrl}/cart/`;
    
    // Construir URL con items
    const cartItems = items.map(item => `${item.shopifyId}:${item.quantity}`).join(',');
    cartUrl += cartItems;
    
    res.json({ cartUrl });
  } catch (error) {
    console.error('Error generating cart URL:', error);
    res.status(500).json({ error: 'Error generating cart URL' });
  }
});

// ==================== RUTAS DE SALUD ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Servir archivos estáticos del frontend
app.use(express.static('dist'));

// Ruta catch-all para SPA
app.get('*', (req, res) => {
  res.sendFile(`${__dirname}/dist/index.html`);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
