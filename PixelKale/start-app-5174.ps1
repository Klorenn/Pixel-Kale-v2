# Script PowerShell para iniciar la aplicación en localhost:5174
Write-Host "🚀 Iniciando aplicación en localhost:5174" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host ""
Write-Host "📋 Verificando configuración..." -ForegroundColor Yellow

# Verificar si existe package.json
if (-not (Test-Path "package.json")) {
    Write-Host "❌ No se encontró package.json" -ForegroundColor Red
    Write-Host "💡 Asegúrate de estar en el directorio correcto" -ForegroundColor Yellow
    Read-Host "Presiona Enter para continuar"
    exit 1
}

Write-Host "✅ package.json encontrado" -ForegroundColor Green

# Verificar si existe node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error instalando dependencias" -ForegroundColor Red
        Read-Host "Presiona Enter para continuar"
        exit 1
    }
    Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
} else {
    Write-Host "✅ node_modules encontrado" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔧 Configurando para localhost:5174..." -ForegroundColor Yellow

# Crear archivo .env si no existe
if (-not (Test-Path ".env")) {
    Write-Host "Creando archivo .env..." -ForegroundColor Yellow
    @"
VITE_LAUNCHTUBE_URL=https://testnet.launchtube.xyz
VITE_LAUNCHTUBE_JWT=
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ Archivo .env creado" -ForegroundColor Green
} else {
    Write-Host "✅ Archivo .env existe" -ForegroundColor Green
}

Write-Host ""
Write-Host "🌐 Iniciando servidor de desarrollo..." -ForegroundColor Yellow
Write-Host "💡 La aplicación se abrirá en: http://localhost:5174" -ForegroundColor Cyan
Write-Host ""

# Intentar diferentes comandos de inicio
if (Test-Path "vite.config.js" -or Test-Path "vite.config.ts") {
    Write-Host "Usando Vite..." -ForegroundColor Yellow
    npx vite --port 5174 --host localhost
} else {
    Write-Host "Intentando con npm start..." -ForegroundColor Yellow
    npm start
}

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Error iniciando la aplicación" -ForegroundColor Red
    Write-Host "💡 Intenta manualmente:" -ForegroundColor Yellow
    Write-Host "   npm run dev" -ForegroundColor White
    Write-Host "   o" -ForegroundColor White
    Write-Host "   npx vite --port 5174" -ForegroundColor White
    Read-Host "Presiona Enter para continuar"
}


