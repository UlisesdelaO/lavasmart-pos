# 🏪 Lavasmart POS - Sistema de Punto de Venta

Un sistema de punto de venta moderno y completo desarrollado con Google Apps Script, diseñado específicamente para lavanderías y servicios de limpieza.

## ✨ Características Principales

### 🛍️ **Gestión de Productos**
- Catálogo de productos organizado por categorías
- Búsqueda rápida de productos
- Imágenes de productos con fallbacks automáticos
- Precios con IVA incluido
- Tiempos estimados de servicio

### 🛒 **Gestión de Órdenes**
- Interfaz intuitiva para agregar productos
- Control de cantidades en tiempo real
- Cálculo automático de subtotales e impuestos
- **Sistema de descuentos sobre el total (con IVA)**
- Múltiples métodos de pago (Efectivo, Tarjeta, QRIS)

### 💰 **Sistema de Descuentos**
- Descuentos predefinidos (10%, 15%, 20%, $100, $200)
- Descuentos personalizados (porcentaje o monto fijo)
- **Aplicación sobre el total incluyendo IVA**
- Validación automática de valores
- Limpieza automática al completar venta

### 📊 **Reportes y Estadísticas**
- Historial de ventas
- Estadísticas de ingresos
- Reportes por período
- Exportación de datos

### 🎨 **Interfaz Moderna**
- Diseño responsive y compacto
- Iconos Unicode sin dependencias externas
- Animaciones suaves
- Manejo mejorado de imágenes
- Compatible con Google Apps Script

## 🚀 Acceso a la Aplicación

### 🌐 **URL de la Aplicación Web:**
```
https://script.google.com/a/macros/lavasmart.mx/s/AKfycbzFF_CN2sfktxRR5zo2KWo1GD8tqo9q_ESmWORAKcUpM1UYeWaqclPR0tmBnSUIn4tx/exec
```

### 📱 **Primera vez:**
1. Copia y pega la URL en tu navegador
2. Google solicitará autorización - acepta los permisos
3. ¡Listo para usar!

## 🛠️ Instalación y Desarrollo

### Prerrequisitos
- Node.js instalado
- Cuenta de Google con Google Apps Script habilitado
- Google Cloud Project configurado

### Instalación
```bash
# Clonar el repositorio
git clone [URL_DEL_REPO]
cd lavasmart-pos

# Instalar clasp globalmente
npm install -g @google-clasp

# Login a Google
clasp login

# Configurar el proyecto
clasp create --type webapp --title "Lavasmart POS"
```

### Deployment
```bash
# Desplegar automáticamente
./deploy_gas.sh

# O manualmente
clasp push
clasp deploy
```

## 📋 Estructura del Proyecto

```
lavasmart-pos/
├── index.html          # Página principal
├── styles-css.html     # Estilos CSS
├── script-js.html      # Lógica JavaScript
├── Code.js            # Código del servidor (Google Apps Script)
├── demo.html          # Versión demo offline
├── deploy_gas.sh      # Script de deployment
└── README.md          # Este archivo
```

## 💡 Uso del Sistema

### 1. **Agregar Productos**
- Busca productos usando la barra de búsqueda
- Filtra por categorías usando los botones
- Haz clic en "Agregar" para añadir al carrito

### 2. **Aplicar Descuentos**
- Haz clic en el botón 🎫 junto a "Descuentos"
- Selecciona un descuento predefinido o personalizado
- Los descuentos se aplican sobre el total (con IVA)

### 3. **Procesar Venta**
- Selecciona el método de pago
- Haz clic en "Cerrar Venta"
- Confirma la operación

### 4. **Ver Reportes**
- Usa los botones del sidebar para acceder a reportes
- Historial de ventas y estadísticas disponibles

## 🔧 Configuración de Google Sheets

El sistema requiere una hoja de cálculo de Google con las siguientes hojas:

### 📊 **Hoja "Menu"**
- Columnas: SKU, Descripción, Precio, IVA, Imagen, Tiempo, Categoría
- Datos de productos disponibles

### 📈 **Hoja "Ventas"**
- Columnas: Fecha, Número de Orden, SKU, Cantidad, Precio, IVA
- Registro automático de ventas

### 💳 **Hoja "Pagos"**
- Columnas: Fecha, Número de Orden, Total, Método de Pago, Cambio
- Registro de transacciones

## 🎨 Personalización

### Colores y Estilos
Los colores se pueden personalizar editando las variables CSS en `styles-css.html`:

```css
:root {
    --primary: #6C63FF;      /* Color principal */
    --secondary: #FF6584;    /* Color secundario */
    --accent: #00C9A7;       /* Color de acento */
    --success: #4CAF50;      /* Color de éxito */
    --danger: #FF5252;       /* Color de peligro */
}
```

### Productos
Edita la hoja "Menu" en Google Sheets para agregar, modificar o eliminar productos.

## 🔒 Seguridad

- Autenticación de Google
- Permisos limitados a la hoja de cálculo
- Validación de datos en cliente y servidor
- Sin almacenamiento de datos sensibles

## 📱 Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge
- ✅ Desktop y móvil
- ✅ Google Apps Script
- ✅ Sin dependencias externas

## 🐛 Solución de Problemas

### Error de Autorización
- Asegúrate de estar logueado en Google
- Verifica que el proyecto tenga permisos de Google Sheets

### Imágenes no se cargan
- El sistema usa fallbacks automáticos con iconos
- Las imágenes se muestran con `object-fit: contain`

### Deployment falla
- Verifica que clasp esté instalado: `npm install -g @google-clasp`
- Ejecuta `clasp login` para autenticarte

## 📞 Soporte

Para reportar problemas o solicitar características:
1. Revisa la documentación
2. Verifica la configuración de Google Sheets
3. Contacta al equipo de desarrollo

---

**Desarrollado con ❤️ para Lavasmart** 