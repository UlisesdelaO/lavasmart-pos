# 📋 Guía de Usuario - Lavasmart POS

## 🚀 Acceso Rápido

### URLs del Sistema
- **POS Principal**: https://script.google.com/macros/s/1ZO6lE9ejNieRBE9qrZacqv27OgoOaYZhx2DySVYyMHuBGzQfebOvwH61/exec
- **Reportes**: https://script.google.com/macros/s/1ZO6lE9ejNieRBE9qrZacqv27OgoOaYZhx2DySVYyMHuBGzQfebOvwH61/exec?mode=reports
- **Calendario**: https://script.google.com/macros/s/1ZO6lE9ejNieRBE9qrZacqv27OgoOaYZhx2DySVYyMHuBGzQfebOvwH61/exec?mode=calendar
- **Demo Local**: `demo.html` (para pruebas sin conexión)

## 🎯 Cómo Usar el POS

### 1. **Inicio de Sesión**
- Abrir la URL principal en el navegador
- El sistema carga automáticamente los productos disponibles
- Se genera automáticamente un número de orden único

### 2. **Agregar Productos a la Venta**

#### 🔍 Buscar Productos
- **Barra de búsqueda**: Escribir el nombre del producto
- **Filtros por categoría**: Hacer clic en los botones de categoría:
  - 🛋️ **Salas**: Sofás, salas, muebles de sala
  - 🛏️ **Colchones**: Individual, matrimonial, queen, king
  - 🚗 **Vehículos**: Sedan, SUV, camionetas
  - 🏠 **Alfombras y Tapetes**: Pequeñas, medianas, grandes
  - 📦 **Otros**: Servicios adicionales
  - 🏷️ **Descuentos**: Descuentos disponibles
  - 🎁 **Promociones**: Ofertas especiales

#### ➕ Agregar al Carrito
1. Buscar o filtrar el producto deseado
2. Hacer clic en **"Agregar"** en la tarjeta del producto
3. El producto aparece automáticamente en el recibo

### 3. **Gestionar el Recibo**

#### 📝 Panel de Recibo (Lado Derecho)
- **Número de Orden**: Se genera automáticamente
- **Fecha y Hora**: Se registra automáticamente
- **Lista de Productos**: Muestra todos los productos agregados

#### 🔢 Ajustar Cantidades
- **Botón [+]**: Aumentar cantidad
- **Botón [-]**: Disminuir cantidad (mínimo 1)
- **Botón [🗑️]**: Eliminar producto completamente

#### 📊 Resumen Automático
- **Items**: Cuenta total de productos
- **Tiempo Total**: Suma de tiempo estimado de servicio
- **Subtotal**: Total sin impuestos
- **IVA (16%)**: Impuesto calculado automáticamente
- **Total**: Suma final a cobrar

### 4. **Procesar el Pago**

#### 💳 Métodos de Pago Disponibles
- **💵 Efectivo (Cash)**: Para pagos en efectivo
- **💳 Tarjeta (Debit)**: Para pagos con tarjeta
- **📱 QRIS**: Para pagos digitales

#### ✅ Cerrar la Venta
1. Verificar que todos los productos estén correctos
2. Seleccionar el método de pago
3. Hacer clic en **"Cerrar Venta"**
4. Confirmar la transacción
5. El sistema guarda automáticamente la venta

### 5. **Después de la Venta**
- El recibo se limpia automáticamente
- Se genera un nuevo número de orden
- El sistema está listo para la siguiente venta

## 🛠️ Funciones Especiales

### 🔄 Configuración Automática
Si es la primera vez que usas el sistema:
1. El sistema detecta automáticamente si no hay base de datos
2. Configura las hojas de Google Sheets necesarias
3. Carga productos de muestra de Lavasmart
4. Está listo para usar inmediatamente

### 📱 Responsive Design
- **Desktop**: Interfaz completa con 3 paneles
- **Tablet**: Interfaz adaptada para pantallas medianas
- **Móvil**: Interfaz optimizada para teléfonos

### ⚡ Funcionalidades Avanzadas
- **Búsqueda Inteligente**: Busca en nombres y categorías
- **Filtrado Dinámico**: Combina búsqueda con categorías
- **Cálculos Automáticos**: IVA y totales en tiempo real
- **Números de Orden Únicos**: Evita duplicados automáticamente

## 🎮 Atajos de Teclado

- **Ctrl + F**: Enfocar barra de búsqueda
- **Enter**: Agregar producto seleccionado
- **Escape**: Limpiar búsqueda
- **Ctrl + Enter**: Cerrar venta (si hay productos)

## 📋 Catálogo de Productos

### 🛋️ **Salas y Sofás**
| Producto | Precio | Tiempo |
|----------|--------|---------|
| Sala Chica (3,2,1) | $950.00 | 35 min |
| Sala Grande (+6p) | $950.00 | 40 min |
| Sofá 2 Plazas | $750.00 | 20 min |
| Sofá de 3 Plazas | $750.00 | 20 min |
| Sofá Esquinera Chica | $850.00 | 35 min |
| Sofá Esquinera Mediana | $950.00 | 35 min |

### 🛏️ **Colchones**
| Producto | Precio | Tiempo |
|----------|--------|---------|
| Colchón Individual | $450.00 | 15 min |
| Colchón Matrimonial | $550.00 | 20 min |
| Colchón Queen Size | $650.00 | 25 min |
| Colchón King Size | $750.00 | 30 min |

### 🚗 **Vehículos**
| Producto | Precio | Tiempo |
|----------|--------|---------|
| Auto Sedan | $450.00 | 45 min |
| Auto SUV/Camioneta | $550.00 | 60 min |

### 🏠 **Alfombras y Tapetes**
| Producto | Precio | Tiempo |
|----------|--------|---------|
| Alfombra Pequeña | $250.00 | 15 min |
| Alfombra Mediana | $350.00 | 25 min |
| Alfombra Grande | $450.00 | 35 min |
| Tapete de Auto | $150.00 | 10 min |

### 📦 **Otros Servicios**
| Producto | Precio | Tiempo |
|----------|--------|---------|
| Servicio Express | $200.00 | 15 min |

### 🏷️ **Descuentos y Promociones**
| Producto | Precio | Tiempo |
|----------|--------|---------|
| Descuento 10% | -$50.00 | 0 min |
| Promo 2x1 Colchones | $550.00 | 40 min |
| Paquete Sala Completa | $1,800.00 | 90 min |

## ❓ Solución de Problemas

### 🔧 Problemas Comunes

#### "Error al cargar datos"
1. Verificar conexión a internet
2. Recargar la página
3. El sistema intentará configurar automáticamente la base de datos

#### "No hay productos disponibles"
1. El sistema configurará automáticamente los productos
2. Esperar unos segundos y recargar
3. Los productos aparecerán automáticamente

#### "Error al generar número de orden"
1. Recargar la página
2. El sistema usará un número temporal
3. Las ventas se guardarán correctamente

#### Botones no responden
1. Verificar que el número de orden esté generado
2. Esperar a que aparezca "# XXX" en el recibo
3. Los botones se habilitarán automáticamente

### 🚀 Optimización de Rendimiento

#### Para mejor rendimiento:
- Usar Google Chrome o Firefox
- Mantener solo una pestaña del POS abierta
- Cerrar pestañas innecesarias
- Recargar la página si se vuelve lenta

#### Navegadores recomendados:
- ✅ Google Chrome (mejor rendimiento)
- ✅ Mozilla Firefox
- ✅ Microsoft Edge
- ⚠️ Safari (funcional, pero más lento)

## 📞 Soporte Técnico

### 🆘 Si necesitas ayuda:
1. **Documentación**: Consultar esta guía
2. **Reload**: Recargar la página suele resolver problemas
3. **Demo**: Usar `demo.html` para pruebas offline
4. **Reportes**: Acceder al módulo de reportes para verificar ventas

### 🔄 Actualizaciones del Sistema
El sistema se actualiza automáticamente. No es necesario hacer nada especial para recibir las mejoras y correcciones.

---

**💡 Tip**: Guarda esta guía en tus marcadores para acceso rápido.

**🎯 Objetivo**: Un POS simple, rápido y eficiente para Lavasmart. 