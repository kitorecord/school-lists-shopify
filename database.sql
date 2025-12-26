-- Crear tabla de regiones
CREATE TABLE IF NOT EXISTS regions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla de comunas
CREATE TABLE IF NOT EXISTS comunas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  regionId INT NOT NULL,
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (regionId) REFERENCES regions(id) ON DELETE CASCADE,
  INDEX idx_regionId (regionId)
);

-- Crear tabla de listas escolares
CREATE TABLE IF NOT EXISTS schoolLists (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  createdBy INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_createdAt (createdAt)
);

-- Crear tabla de asignaciones de listas a comunas
CREATE TABLE IF NOT EXISTS listAssignments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  listId INT NOT NULL,
  comunaId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (listId) REFERENCES schoolLists(id) ON DELETE CASCADE,
  FOREIGN KEY (comunaId) REFERENCES comunas(id) ON DELETE CASCADE,
  UNIQUE KEY unique_list_comuna (listId, comunaId)
);

-- Crear tabla de productos de Shopify
CREATE TABLE IF NOT EXISTS shopifyProducts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  shopifyId VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2),
  stock INT DEFAULT 0,
  imageUrl VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_shopifyId (shopifyId)
);

-- Crear tabla de relación entre listas y productos
CREATE TABLE IF NOT EXISTS listProducts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  listId INT NOT NULL,
  productId INT NOT NULL,
  quantity INT DEFAULT 1,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (listId) REFERENCES schoolLists(id) ON DELETE CASCADE,
  FOREIGN KEY (productId) REFERENCES shopifyProducts(id) ON DELETE CASCADE,
  UNIQUE KEY unique_list_product (listId, productId)
);

-- Insertar regiones de Chile
INSERT INTO regions (code, name) VALUES
('01', 'Arica y Parinacota'),
('02', 'Tarapacá'),
('03', 'Antofagasta'),
('04', 'Atacama'),
('05', 'Coquimbo'),
('06', 'Valparaíso'),
('07', 'Metropolitana'),
('08', 'Libertador General Bernardo O\'Higgins'),
('09', 'Maule'),
('10', 'Ñuble'),
('11', 'Biobío'),
('12', 'La Araucanía'),
('13', 'Los Ríos'),
('14', 'Los Lagos'),
('15', 'Aysén del General Carlos Ibáñez del Campo'),
('16', 'Magallanes y de la Antártica Chilena');

-- Insertar algunas comunas de ejemplo (Metropolitana)
INSERT INTO comunas (regionId, code, name) VALUES
(7, '1301', 'Santiago'),
(7, '1302', 'Providencia'),
(7, '1303', 'Ñuñoa'),
(7, '1304', 'La Florida'),
(7, '1305', 'Maipú'),
(7, '1306', 'Puente Alto'),
(7, '1307', 'San Bernardo'),
(7, '1308', 'La Pintana'),
(7, '1309', 'Peñalolén'),
(7, '1310', 'Vitacura');
