#!/bin/bash
# Script de instalación de la extensión Grails Test Runner
# Ejecutar una vez después de clonar el repositorio

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXTENSION_NAME="grails-test-runner"

# Detectar el directorio de extensiones según el editor
if [ -d "$HOME/.cursor/extensions" ]; then
    EXTENSIONS_DIR="$HOME/.cursor/extensions"
    EDITOR="Cursor"
elif [ -d "$HOME/.vscode/extensions" ]; then
    EXTENSIONS_DIR="$HOME/.vscode/extensions"
    EDITOR="VS Code"
else
    echo "❌ No se encontró el directorio de extensiones de Cursor ni VS Code"
    exit 1
fi

echo "📦 Instalando extensión $EXTENSION_NAME para $EDITOR..."

# Instalar dependencias y compilar
cd "$SCRIPT_DIR"
npm install
npm run compile

# Crear symlink
ln -sf "$SCRIPT_DIR" "$EXTENSIONS_DIR/$EXTENSION_NAME"

echo "✅ Extensión instalada correctamente en: $EXTENSIONS_DIR/$EXTENSION_NAME"
echo ""
echo "🔄 Reinicia $EDITOR para activar la extensión"
echo ""
echo "📝 Uso:"
echo "   1. Abre cualquier archivo *Spec.groovy"
echo "   2. Verás botones '▶ Run Test' sobre cada test"
echo "   3. Haz clic para ejecutar el test en terminal"
