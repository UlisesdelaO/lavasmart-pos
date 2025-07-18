#!/bin/bash

# Script para actualizar el deployment existente de Lavasmart POS
# Evita crear múltiples versiones

DEPLOYMENT_ID="AKfycbzV2z4CYRUMUQ3A5snCR3-xm3IufW0fz4j-S2FOt-3p77_sUMGfBrFIrv7VImPbv21-"

echo "🔄 Actualizando Lavasmart POS..."

# Subir cambios
echo "📤 Subiendo archivos..."
clasp push

# Actualizar deployment existente
echo "🚀 Actualizando deployment..."
clasp deploy --deploymentId $DEPLOYMENT_ID

echo "✅ ¡Actualización completada!"
echo "🌐 URL: https://script.google.com/macros/s/1ZO6lE9ejNieRBE9qrZacqv27OgoOaYZhx2DySVYyMHuBGzQfebOvwH61/exec" 