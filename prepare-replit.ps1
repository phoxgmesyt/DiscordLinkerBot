# Script para preparar el bot Linker para Replit
# Uso: .\prepare-replit.ps1

param(
    [string]$GitHubRepo = "",
    [string]$RepoPath = "C:\Users\Yefrid Valverde\Desktop\ark-linker-bot"
)

function Write-Header {
    param([string]$Message)
    Write-Host "`n" -NoNewline
    Write-Host "=" * 60 -ForegroundColor Cyan
    Write-Host $Message -ForegroundColor Cyan
    Write-Host "=" * 60 -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️ $Message" -ForegroundColor Yellow
}

Write-Header "Preparador de Bot Linker para Replit"

# Paso 1: Verificar que estamos en la carpeta correcta
if (-not (Test-Path ".\index.js")) {
    Write-Host "❌ Error: Este script debe ejecutarse desde la carpeta del bot (ark-linker)" -ForegroundColor Red
    exit 1
}

Write-Success "Script ejecutado desde la carpeta correcta"

# Paso 2: Verificar archivos necesarios
Write-Header "Verificando archivos requeridos"

$requiredFiles = @(
    "index.js",
    "package.json",
    ".env.example",
    ".gitignore",
    "Dockerfile",
    "commands"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Success "$file ✓"
    } else {
        Write-Warning "$file ✗ (Falta, puede ser necesario)"
    }
}

# Paso 3: Verificar que dotenv está en package.json
Write-Header "Verificando dependencias"

if (Select-String -Path "package.json" -Pattern "dotenv" -Quiet) {
    Write-Success "dotenv está configurado ✓"
} else {
    Write-Warning "dotenv no está en package.json (necesario para variables de entorno)"
}

# Paso 4: Crear .env local si no existe
Write-Header "Configuración de variables de entorno"

if (-not (Test-Path ".env")) {
    Write-Host "Creando .env local..." -ForegroundColor Cyan
    
    $envContent = @"
TOKEN=your_discord_bot_token_here
CLIENT_ID=your_application_id_here
GUILD_ID=your_guild_id_here
RCON_HOST=your_ark_server_ip
RCON_PORT=30116
RCON_PASSWORD=your_rcon_password
NODE_ENV=production
"@
    
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-Success ".env creado (edita con tus valores)"
} else {
    Write-Success ".env ya existe"
}

# Paso 5: Listar configuración actual
Write-Header "Configuración actual"

Write-Host "Archivos listos para Replit:" -ForegroundColor Cyan
Write-Host "  📄 index.js - Punto de entrada"
Write-Host "  📦 package.json - Dependencias"
Write-Host "  🐳 Dockerfile - Para containerización"
Write-Host "  🔐 .env - Variables de entorno (LOCAL)"
Write-Host "  📋 .env.example - Ejemplo (para GitHub)"
Write-Host "  📂 commands/ - Comandos del bot"
Write-Host "  📝 REPLIT_SETUP.md - Guía completa"

# Paso 6: Instrucciones finales
Write-Header "Próximos pasos"

Write-Host @"
1️⃣  Edita .env con tus valores:
    - TOKEN: Tu bot token de Discord
    - CLIENT_ID: ID de aplicación (dev portal)
    - GUILD_ID: ID del servidor Discord
    - RCON_HOST: IP de tu servidor ARK
    - RCON_PASSWORD: Contraseña RCON

2️⃣  Sube a GitHub:
    git add .
    git commit -m "Add Discord Linker Bot for Replit"
    git push origin main

3️⃣  En Replit:
    - Import from GitHub repo
    - Configura las variables en Secrets
    - Haz clic en Run

4️⃣  Mantener 24/7:
    - Opción A: Replit Pro (Always On)
    - Opción B: UptimeRobot (Gratis, pings cada 5 min)

Para más detalles, lee REPLIT_SETUP.md
"@ -ForegroundColor Cyan

Write-Success "¡Bot preparado para Replit!"
Write-Host ""
