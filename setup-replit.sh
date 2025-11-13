#!/bin/bash
# Script para configurar el Bot Linker en Replit automáticamente
# Uso: bash setup-replit.sh

echo "🚀 Configurando Discord Linker Bot en Replit..."
echo ""

# 1. Instalar dependencias
echo "📦 Instalando dependencias Node.js..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi

echo "✅ Dependencias instaladas"
echo ""

# 2. Verificar archivo config.json
if [ -f "config.json" ]; then
    echo "✅ config.json encontrado"
else
    echo "⚠️  config.json no encontrado, creando desde config_example.json..."
    cp config_example.json config.json
fi

echo ""

# 3. Verificar variables de entorno
echo "🔐 Verificando variables de entorno..."

if [ -z "$TOKEN" ]; then
    echo "❌ TOKEN no configurada en Secrets"
    exit 1
fi

if [ -z "$CLIENT_ID" ]; then
    echo "❌ CLIENT_ID no configurada en Secrets"
    exit 1
fi

if [ -z "$GUILD_ID" ]; then
    echo "❌ GUILD_ID no configurada en Secrets"
    exit 1
fi

if [ -z "$RCON_HOST" ]; then
    echo "❌ RCON_HOST no configurada en Secrets"
    exit 1
fi

echo "✅ Todas las variables de entorno configuradas"
echo ""

# 4. Crear directorio de logs si no existe
if [ ! -d "logs" ]; then
    mkdir -p logs
    echo "✅ Directorio logs/ creado"
fi

echo ""
echo "🎮 Bot listo para iniciar..."
echo ""
echo "Ejecutando: node index.js"
echo "═══════════════════════════════════════════"
echo ""

# 5. Iniciar el bot
node index.js
