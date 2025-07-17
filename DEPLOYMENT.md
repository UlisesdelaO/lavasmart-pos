# 🚀 Guía de Despliegue - Lavasmart POS

Esta guía te ayudará a desplegar el sistema Lavasmart POS en Google Apps Script.

## 📋 Prerrequisitos

- Cuenta de Google con acceso a Google Apps Script
- Google Sheets para la base de datos
- Google Clasp CLI instalado
- Node.js (opcional, para desarrollo local)

## 🔧 Instalación de Google Clasp

### 1. Instalar Node.js (si no lo tienes)
```bash
# Descargar desde https://nodejs.org/
# O usar Homebrew en macOS
brew install node
```

### 2. Instalar Google Clasp
```bash
npm install -g @google/clasp
```

### 3. Autenticarse con Google
```bash
clasp login
```

## 📁 Configuración del Proyecto

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/lavasmart-pos.git
cd lavasmart-pos
```

### 2. Crear Proyecto en Google Apps Script
```bash
clasp create --type standalone --title "Lavasmart POS"
```

### 3. Configurar .clasp.json
Reemplaza `YOUR_SCRIPT_ID_HERE` con el ID de tu proyecto:

```json
{
  "scriptId": "TU_SCRIPT_ID_REAL",
  "rootDir": ".",
  "fileExtension": "js"
}
```

## 🗄️ Configuración de Google Sheets

### 1. Crear Nueva Hoja de Cálculo
1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. Nómbrala "Lavasmart POS Database"

### 2. Crear Hojas Necesarias

#### Hoja "Items"
| A (SKU) | B (Descripción) | C (Precio) | D (Tasa Impuesto) | E (Imagen) | F (Tiempo) | G (Nombre Archivo) | H (Precio Ideal) | I (Categoría) |
|---------|-----------------|------------|-------------------|------------|------------|-------------------|------------------|---------------|
| 001     | Sala Chica (3,2,1) | 950.00 | 0.16 | https://... | 2 | sala_chica.jpg | 950.00 | Salas |

#### Hoja "Sales"
| A (Fecha) | B (Número Factura) | C (SKU) | D (Cantidad) | E (Precio) | F (Impuesto) |
|-----------|-------------------|---------|--------------|------------|-------------|
| 2025-01-15 | 001 | 001 | 1 | 950.00 | 152.00 |

#### Hoja "Payments"
| A (Fecha) | B (Número Factura) | C (Total) | D (Método Pago) | E (Cambio) |
|-----------|-------------------|-----------|-----------------|------------|
| 2025-01-15 | 001 | 1102.00 | credit | 0.00 |

### 3. Configurar Permisos
1. Haz clic en "Compartir" en la esquina superior derecha
2. Agrega tu cuenta de Google Apps Script
3. Dale permisos de "Editor"

## 🔄 Despliegue

### 1. Subir Archivos
```bash
clasp push
```

### 2. Crear Versión de Despliegue
```bash
clasp deploy
```

### 3. Configurar Web App
1. Ve a [Google Apps Script](https://script.google.com)
2. Abre tu proyecto "Lavasmart POS"
3. Haz clic en "Deploy" > "New deployment"
4. Selecciona "Web app"
5. Configura:
   - **Execute as**: Me
   - **Who has access**: Anyone
6. Haz clic en "Deploy"

## 🔗 URLs de Acceso

### URL Principal del POS
```
https://script.google.com/macros/s/TU_SCRIPT_ID/exec
```

### URL de Reportes
```
https://script.google.com/macros/s/TU_SCRIPT_ID/exec?mode=reports
```

### URL del Calendario
```
https://script.google.com/macros/s/TU_SCRIPT_ID/exec?mode=calendar
```

## 🛠️ Desarrollo Local

### 1. Clonar Archivos
```bash
clasp pull
```

### 2. Editar Archivos
Edita los archivos localmente con tu editor preferido.

### 3. Subir Cambios
```bash
clasp push
```

### 4. Desplegar Cambios
```bash
clasp deploy
```

## 🔍 Solución de Problemas

### Error: "invalid_grant"
```bash
# Reautenticarse
clasp logout
clasp login
```

### Error: "Script not found"
1. Verifica que el `scriptId` en `.clasp.json` sea correcto
2. Asegúrate de tener permisos en el proyecto

### Error: "Permission denied"
1. Verifica permisos en Google Sheets
2. Asegúrate de que la cuenta tenga acceso al proyecto

### Error: "Deployment failed"
1. Verifica que todos los archivos estén subidos
2. Revisa los logs en Google Apps Script
3. Intenta crear un nuevo deployment

## 📊 Monitoreo

### Ver Logs
1. Ve a [Google Apps Script](https://script.google.com)
2. Abre tu proyecto
3. Ve a "Executions" en el menú lateral
4. Revisa los logs de ejecución

### Ver Estadísticas
1. Ve a "Deployments" en el menú lateral
2. Haz clic en tu deployment
3. Revisa las estadísticas de uso

## 🔄 Actualizaciones

### Actualizar desde GitHub
```bash
git pull origin main
clasp push
clasp deploy
```

### Crear Nueva Versión
```bash
clasp version "v1.1.0"
clasp deploy
```

## 📞 Soporte

Si encuentras problemas durante el despliegue:

1. **Revisa los logs** en Google Apps Script
2. **Verifica permisos** en Google Sheets
3. **Consulta la documentación** oficial de Google Apps Script
4. **Abre un issue** en GitHub

---

**Nota**: Recuerda reemplazar `TU_SCRIPT_ID` con el ID real de tu proyecto de Google Apps Script. 