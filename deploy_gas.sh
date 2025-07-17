#!/bin/bash

# Límite de deployments permitidos
MAX_DEPLOYMENTS=15
KEEP_DEPLOYMENTS=10

echo "Verificando cantidad de deployments activos..."
DEPLOY_IDS=($(npx clasp deployments | grep -oE 'AKfy[\w-]+' | tac))
DEPLOY_COUNT=${#DEPLOY_IDS[@]}

if [ "$DEPLOY_COUNT" -gt "$MAX_DEPLOYMENTS" ]; then
  echo "Hay $DEPLOY_COUNT deployments. Eliminando los más antiguos..."
  # Eliminar los más antiguos, dejando solo los KEEP_DEPLOYMENTS más recientes
  for ((i=KEEP_DEPLOYMENTS; i<DEPLOY_COUNT; i++)); do
    echo "Eliminando deployment: ${DEPLOY_IDS[$i]}"
    npx clasp undeploy "${DEPLOY_IDS[$i]}"
  done
else
  echo "No es necesario limpiar deployments ($DEPLOY_COUNT activos)"
fi

# Deployment ID fijo para tu proyecto
DEPLOYMENT_ID="AKfycbxwMg6kP2_Ff49BK94aIJZhbNEGqht8pcUuU3x1lvLowo2Lx0z_rUVua0CPAHNKzL9sNg"

echo "Haciendo push..."
clasp push --force || { echo "Error en clasp push"; exit 1; }

echo "Creando nueva versión..."
clasp version "Auto: actualización rápida" || { echo "Error en clasp version"; exit 1; }

echo "Actualizando el deployment existente..."
OUTPUT=$(clasp deploy --deploymentId "$DEPLOYMENT_ID" --description "Auto: actualización rápida")

WEBAPP_URL=$(echo "$OUTPUT" | grep -Eo 'https://script.google.com/macros/s/[a-zA-Z0-9_-]*/exec')

if [ -n "$WEBAPP_URL" ]; then
  echo "\n¡Despliegue exitoso! Link de la app web:"
  echo "$WEBAPP_URL"
else
  echo "$OUTPUT"
  echo "\nNo se pudo extraer el link de la app web. Revisa la salida anterior."
fi

echo ""
echo "Link de la app web:"
echo "https://script.google.com/macros/s/$DEPLOYMENT_ID/exec" 