# 📚 Sistema de Listas Escolares para Shopify

Un sistema completo para gestionar listas de útiles escolares filtradas por región y comuna de Chile, integrado con Shopify.

## 🎯 Características

- ✅ Selector cascada de región → comuna
- ✅ Listas de útiles escolares por comuna
- ✅ Visualización de productos con stock de Shopify
- ✅ Carrito integrado con Shopify
- ✅ Panel de administración para gestionar listas
- ✅ Agregar productos de Shopify a las listas
- ✅ Personalización de cantidades antes de comprar

## 🚀 Instalación Local

### Requisitos
- Node.js 18+
- npm o pnpm
- MySQL/MariaDB

### Pasos

1. **Clonar repositorio**
```bash
git clone <tu-repo>
cd school-lists-shopify
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar base de datos**
```bash
# Ejecutar el script SQL en tu servidor MySQL
mysql -h aventiasolutions.com -u user_school_lists -p school_lists < database.sql
```

4. **Crear archivo .env**
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

El servidor estará en `http://localhost:3000`

## 📦 Variables de Entorno

Crea un archivo `.env` con:

```
# Base de Datos
DATABASE_HOST=aventiasolutions.com
DATABASE_USER=user_school_lists
DATABASE_PASSWORD=tu_contraseña
DATABASE_NAME=school_lists
DATABASE_PORT=3306

# Shopify
SHOPIFY_STORE_URL=tu-tienda.myshopify.com
SHOPIFY_ACCESS_TOKEN=shpat_xxxxx

# Servidor
NODE_ENV=production
PORT=3000
```

## 🛠️ Estructura del Proyecto

```
.
├── server.js                 # Servidor Express
├── database.sql             # Schema SQL
├── vite.config.js           # Configuración Vite
├── vercel.json              # Configuración Vercel
├── src/
│   ├── main.jsx             # Punto de entrada React
│   ├── App.jsx              # Componente principal
│   ├── index.css            # Estilos globales
│   ├── components/
│   │   ├── RegionSelector.jsx
│   │   ├── ComunaSelector.jsx
│   │   ├── SchoolLists.jsx
│   │   └── ListDetail.jsx
│   ├── pages/
│   │   └── AdminPanel.jsx
│   └── styles/
│       └── AdminPanel.css
└── package.json
```

## 🔌 API Endpoints

### Públicos
- `GET /api/regions` - Obtener todas las regiones
- `GET /api/regions/:regionId/comunas` - Obtener comunas por región
- `GET /api/comunas/:comunaId/lists` - Obtener listas por comuna
- `GET /api/lists/:listId` - Obtener detalles de una lista

### Administración
- `POST /api/admin/lists` - Crear lista escolar
- `POST /api/admin/lists/:listId/assign-comuna` - Asignar lista a comuna
- `POST /api/admin/lists/:listId/products` - Agregar producto a lista

### Shopify
- `POST /api/shopify/sync-products` - Sincronizar productos
- `POST /api/shopify/cart-url` - Generar URL de carrito

## 📱 Panel de Administración

Accede a `/` y haz clic en "Administrador" para:
- Crear nuevas listas escolares
- Asignar listas a comunas
- Agregar productos de Shopify a las listas

## 🚢 Despliegue en Vercel

1. **Subir a GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Conectar a Vercel**
- Ve a https://vercel.com/new
- Selecciona tu repositorio
- Vercel detectará automáticamente la configuración

3. **Agregar variables de entorno**
- En Vercel, ve a Settings → Environment Variables
- Agrega todas las variables de `.env`

4. **Desplegar**
- Vercel desplegará automáticamente

## 🔐 Seguridad

- Nunca commits `.env` con secretos reales
- Usa variables de entorno en producción
- Protege el panel de administración con autenticación (próxima versión)

## 📝 Próximas Mejoras

- [ ] Autenticación admin
- [ ] Sincronización automática de stock
- [ ] Descuentos por lista completa
- [ ] Historial de compras
- [ ] Notificaciones por email

## 📞 Soporte

Para reportar bugs o sugerencias, crea un issue en GitHub.

## 📄 Licencia

MIT
