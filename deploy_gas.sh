#!/bin/bash

echo "🚀 Desplegando Lavasmart POS a Google Apps Script..."

# Verificar que clasp esté instalado
if ! command -v clasp &> /dev/null; then
    echo "❌ Error: clasp no está instalado. Instálalo con: npm install -g @google/clasp"
    exit 1
fi

# Verificar que estemos en el directorio correcto
if [ ! -f ".clasp.json" ]; then
    echo "❌ Error: No se encontró .clasp.json. Asegúrate de estar en el directorio del proyecto."
    exit 1
fi

echo "📁 Directorio actual: $(pwd)"
echo "📋 Archivos a desplegar:"
ls -la *.html *.js 2>/dev/null || echo "No se encontraron archivos HTML/JS"

# Hacer push de los archivos
echo "📤 Subiendo archivos a Google Apps Script..."
clasp push

if [ $? -eq 0 ]; then
    echo "✅ Archivos subidos exitosamente"
else
    echo "❌ Error al subir archivos"
    exit 1
fi

# Crear nuevo deployment
echo "🚀 Creando nuevo deployment..."
DEPLOYMENT_ID=$(clasp deploy 2>&1 | grep -o 'AKfycb[^[:space:]]*')

if [ -n "$DEPLOYMENT_ID" ]; then
    echo "✅ Deployment creado: $DEPLOYMENT_ID"
else
    echo "❌ Error al crear deployment"
    exit 1
fi

# Obtener la URL de la aplicación web
SCRIPT_ID=$(grep -o '"scriptId": "[^"]*"' .clasp.json | cut -d'"' -f4)
WEB_APP_URL="https://script.google.com/a/macros/lavasmart.mx/s/$DEPLOYMENT_ID/exec"

echo ""
echo "🎉 ¡Deployment completado exitosamente!"
echo ""
echo "📱 URL de la aplicación web:"
echo "$WEB_APP_URL"
echo ""
echo "🔗 Deployment ID: $DEPLOYMENT_ID"
echo ""
echo "💡 Para abrir en el navegador, copia y pega la URL anterior"
echo "📝 Nota: La primera vez que accedas, Google puede pedir autorización" 