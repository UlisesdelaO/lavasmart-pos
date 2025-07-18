#!/bin/bash

# Script para crear versiones manualmente
echo "Creando nueva versión..."

# Solicitar descripción de la versión
read -p "Descripción de la versión (o presiona Enter para usar la fecha): " VERSION_DESC

if [ -z "$VERSION_DESC" ]; then
    VERSION_DESC="Versión $(date '+%Y-%m-%d %H:%M:%S')"
fi

echo "Creando versión: $VERSION_DESC"
clasp version "$VERSION_DESC"

echo "Versión creada exitosamente!" 