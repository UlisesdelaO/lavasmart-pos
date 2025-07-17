# 🧽 Lavasmart POS System

Un sistema de Punto de Venta (POS) moderno y completo desarrollado con Google Apps Script, diseñado específicamente para servicios de lavado y limpieza.

![Lavasmart POS](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Google Apps Script](https://img.shields.io/badge/Platform-Google%20Apps%20Script-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Reference](#-api-reference)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## ✨ Características

### 🎯 Funcionalidades Principales
- **Interfaz Moderna**: Diseño limpio y responsive con tema rosa personalizado
- **Gestión de Productos**: Categorización automática (Salas, Colchones, Vehículos, etc.)
- **Búsqueda Inteligente**: Filtrado por categoría y descripción con soporte para acentos
- **Control de Cantidades**: Botones + y - estéticos para ajustar cantidades
- **Múltiples Métodos de Pago**: Efectivo y Tarjeta
- **Generación de Facturas**: Números de orden únicos y automáticos
- **Reportes en Tiempo Real**: Estadísticas de ventas y análisis

### 🛠️ Características Técnicas
- **Base de Datos**: Google Sheets como backend
- **Autenticación**: Google Apps Script integrado
- **Responsive Design**: Optimizado para desktop y móvil
- **Offline Capable**: Funciona sin conexión una vez cargado
- **Deployment Automatizado**: Scripts de despliegue con Google Clasp

### 📊 Módulos Incluidos
- **POS Principal**: Interfaz de ventas principal
- **Sistema de Reportes**: Análisis de ventas y estadísticas
- **Calendario**: Gestión de citas y programación
- **Gestión de Órdenes**: Historial y reimpresión de facturas

## 🖼️ Capturas de Pantalla

### Interfaz Principal del POS
```
┌─────────────────────────────────────────────────────────────┐
│ 🏪 Lavasmart POS System                                     │
├─────────────────────────────────────────────────────────────┤
│ [🔍 Buscar producto...] [👤 Lavasmart]                     │
├─────────────────────────────────────────────────────────────┤
│ [📦] [🛋️] [🛏️] [🚗] [🏷️] [📦] [🎁] [🏷️]              │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│ │ Producto 1  │ │ Producto 2  │ │ Producto 3  │            │
│ │ $950.00     │ │ $850.00     │ │ $750.00     │            │
│ │ [Agregar]   │ │ [Agregar]   │ │ [Agregar]   │            │
│ └─────────────┘ └─────────────┘ └─────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

### Panel de Recibo
```
┌─────────────────────────────────────────────────────────────┐
│ 📄 Recibo                    # 001                          │
│ Orden: 15/07/25, 8:42 a.m.                                 │
├─────────────────────────────────────────────────────────────┤
│ Descripción    │ Cant. │ P.Unit │ Subtotal │ [X]           │
├─────────────────────────────────────────────────────────────┤
│ Sala Chica     │ [−] 3 [+] │ $950.00 │ $2,850.00 │ [🗑️]   │
│ Sofá 3 Plazas  │ [−] 4 [+] │ $950.00 │ $3,800.00 │ [🗑️]   │
│ Colchón Queen  │ [−] 2 [+] │ $850.00 │ $1,700.00 │ [🗑️]   │
├─────────────────────────────────────────────────────────────┤
│ Subtotal: $8,350.00                                         │
│ Descuento: $0.00                                            │
│ IVA: $0.00                                                  │
│ Total: $8,350.00                                            │
├─────────────────────────────────────────────────────────────┤
│ Método de pago: [Efectivo] [Tarjeta]                       │
│ [Cerrar Venta]                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Instalación

### Prerrequisitos
- Cuenta de Google con acceso a Google Apps Script
- Google Sheets para la base de datos
- Google Clasp CLI (opcional, para desarrollo)

### Pasos de Instalación

1. **Clonar el Repositorio**
   ```bash
   git clone https://github.com/tu-usuario/lavasmart-pos.git
   cd lavasmart-pos
   ```

2. **Configurar Google Apps Script**
   ```bash
   # Instalar Google Clasp CLI
   npm install -g @google/clasp
   
   # Autenticarse con Google
   clasp login
   ```

3. **Crear Proyecto en Google Apps Script**
   ```bash
   clasp create --type standalone --title "Lavasmart POS"
   ```

4. **Configurar .clasp.json**
   ```json
   {
     "scriptId": "TU_SCRIPT_ID",
     "rootDir": "."
   }
   ```

5. **Desplegar el Proyecto**
   ```bash
   clasp push
   clasp deploy
   ```

## ⚙️ Configuración

### 1. Configurar Google Sheets

Crear una nueva hoja de cálculo con las siguientes hojas:

#### Hoja "Items" (Productos)
| SKU | Descripción | Precio | Tasa Impuesto | Imagen | Tiempo | Nombre Archivo | Precio Ideal | Categoría |
|-----|-------------|--------|---------------|--------|--------|----------------|--------------|-----------|
| 001 | Sala Chica (3,2,1) | 950.00 | 0.16 | URL_IMAGEN | 2 | sala_chica.jpg | 950.00 | Salas |

#### Hoja "Sales" (Ventas)
| Fecha | Número Factura | SKU | Cantidad | Precio | Impuesto |
|-------|----------------|-----|----------|--------|----------|
| 2025-01-15 | 001 | 001 | 1 | 950.00 | 152.00 |

#### Hoja "Payments" (Pagos)
| Fecha | Número Factura | Total | Método Pago | Cambio |
|-------|----------------|-------|-------------|--------|
| 2025-01-15 | 001 | 1102.00 | credit | 0.00 |

### 2. Configurar Variables de Entorno

En el archivo `Code.js`, ajustar las siguientes variables:

```javascript
// Configuración de la aplicación
const APP_CONFIG = {
  TAX_RATE: 0.16,           // Tasa de impuestos
  CURRENCY: 'MXN',          // Moneda
  TIMEZONE: 'GMT-6',        // Zona horaria
  COMPANY_NAME: 'Lavasmart' // Nombre de la empresa
};
```

### 3. Personalizar Estilos

Editar `styles-css.html` para personalizar colores y estilos:

```css
:root {
  --primary: #6C63FF;        // Color principal
  --secondary: #FF6584;      // Color secundario (rosa)
  --background: #181A20;     // Fondo principal
  --surface: #23263A;        // Superficies
}
```

## 📖 Uso

### Interfaz Principal

1. **Agregar Productos**
   - Buscar productos usando la barra de búsqueda
   - Filtrar por categoría usando los botones de categoría
   - Hacer clic en "Agregar" para añadir al recibo

2. **Gestionar Cantidades**
   - Usar los botones + y - para ajustar cantidades
   - Los cambios se reflejan automáticamente en el total

3. **Procesar Venta**
   - Seleccionar método de pago (Efectivo/Tarjeta)
   - Hacer clic en "Cerrar Venta"
   - El sistema genera automáticamente el número de factura

### Reportes

1. **Acceder a Reportes**
   - Hacer clic en el icono de gráficos en la barra lateral
   - Seleccionar período de análisis

2. **Generar Reportes Mensuales**
   - Seleccionar mes y año
   - El sistema crea automáticamente una hoja con estadísticas

### Calendario

1. **Ver Calendario**
   - Hacer clic en el icono de calendario
   - Visualizar eventos y citas programadas

## 📁 Estructura del Proyecto

```
lavasmart-pos/
├── 📄 Code.js                 # Lógica principal de la aplicación
├── 📄 index.html              # Interfaz principal del POS
├── 📄 styles-css.html         # Estilos CSS principales
├── 📄 script-js.html          # JavaScript del frontend
├── 📄 reports.html            # Interfaz de reportes
├── 📄 calendar.html           # Interfaz del calendario
├── 📄 Calendar.js             # Lógica del calendario
├── 📄 .clasp.json             # Configuración de Google Clasp
├── 📄 .gitignore              # Archivos ignorados por Git
└── 📄 README.md               # Documentación del proyecto
```

### Descripción de Archivos

- **Code.js**: Contiene todas las funciones del servidor (Google Apps Script)
- **index.html**: Interfaz principal del sistema POS
- **styles-css.html**: Estilos CSS con diseño moderno y responsive
- **script-js.html**: Lógica JavaScript del frontend
- **reports.html**: Interfaz para generar y visualizar reportes
- **calendar.html**: Interfaz del calendario de citas
- **Calendar.js**: Funciones específicas para el manejo del calendario

## 🔧 API Reference

### Funciones Principales

#### `doGet(e)`
Función principal que maneja las solicitudes HTTP GET.

**Parámetros:**
- `e.parameter.mode`: Modo de la aplicación ('reports', 'calendar', o por defecto 'pos')

**Retorna:** HtmlOutput con la página correspondiente

#### `getData()`
Obtiene datos de productos y ventas desde Google Sheets.

**Retorna:** Object con arrays de items y sales

#### `setData(data)`
Guarda datos de una venta en las hojas correspondientes.

**Parámetros:**
- `data`: String JSON con datos de orden y pago

**Retorna:** Object con resultado de la operación

#### `generarReportePeriodo(fechaInicio, fechaFin)`
Genera reportes de ventas para un período específico.

**Parámetros:**
- `fechaInicio`: String en formato YYYY-MM-DD
- `fechaFin`: String en formato YYYY-MM-DD

**Retorna:** Object con datos del reporte y estadísticas

### Clases JavaScript

#### `Order`
Maneja la lógica de órdenes y cálculos.

**Métodos:**
- `addOrderLine(quantity, data)`: Agrega línea a la orden
- `updateItemQuantity(index, newQuantity)`: Actualiza cantidad
- `deleteOrderLine(index)`: Elimina línea de la orden
- `getSummary()`: Obtiene resumen de la orden

#### `Ui`
Maneja la interfaz de usuario.

**Métodos:**
- `menu(order)`: Renderiza el menú de productos
- `receiptDetails(orderInstance)`: Actualiza detalles del recibo
- `paymentSummary(order)`: Actualiza resumen de pagos

## 🤝 Contribución

### Cómo Contribuir

1. **Fork el Proyecto**
   ```bash
   git clone https://github.com/tu-usuario/lavasmart-pos.git
   ```

2. **Crear Rama de Feature**
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

3. **Hacer Cambios**
   - Implementar nueva funcionalidad
   - Actualizar documentación
   - Agregar tests si es necesario

4. **Commit y Push**
   ```bash
   git add .
   git commit -m "feat: agregar nueva funcionalidad"
   git push origin feature/nueva-funcionalidad
   ```

5. **Crear Pull Request**
   - Describir cambios realizados
   - Incluir capturas de pantalla si aplica

### Guías de Contribución

- **Código**: Seguir estándares de Google Apps Script
- **CSS**: Usar variables CSS para consistencia
- **JavaScript**: Comentar funciones complejas
- **Documentación**: Mantener README actualizado

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- **Google Apps Script** por la plataforma de desarrollo
- **Font Awesome** por los iconos
- **Google Fonts** por las tipografías
- **Comunidad de desarrolladores** por el soporte

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:

- 📧 **Email**: soporte@lavasmart.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/tu-usuario/lavasmart-pos/issues)
- 📖 **Documentación**: [Wiki del Proyecto](https://github.com/tu-usuario/lavasmart-pos/wiki)

---

**Desarrollado con ❤️ para Lavasmart**

*Última actualización: Enero 2025* 