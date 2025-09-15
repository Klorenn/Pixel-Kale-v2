@echo off
echo 🚀 Iniciando aplicación en localhost:5174
echo ========================================

echo.
echo 📋 Verificando configuración...

REM Verificar si existe package.json
if not exist "package.json" (
    echo ❌ No se encontró package.json
    echo 💡 Asegúrate de estar en el directorio correcto
    pause
    exit /b 1
)

echo ✅ package.json encontrado

REM Verificar si existe node_modules
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    npm install
    if errorlevel 1 (
        echo ❌ Error instalando dependencias
        pause
        exit /b 1
    )
    echo ✅ Dependencias instaladas
) else (
    echo ✅ node_modules encontrado
)

echo.
echo 🔧 Configurando para localhost:5174...

REM Crear archivo .env si no existe
if not exist ".env" (
    echo Creando archivo .env...
    echo VITE_LAUNCHTUBE_URL=https://testnet.launchtube.xyz > .env
    echo VITE_LAUNCHTUBE_JWT= >> .env
    echo ✅ Archivo .env creado
) else (
    echo ✅ Archivo .env existe
)

echo.
echo 🌐 Iniciando servidor de desarrollo...
echo 💡 La aplicación se abrirá en: http://localhost:5174
echo.

REM Intentar diferentes comandos de inicio
if exist "vite.config.js" (
    echo Usando Vite...
    npx vite --port 5174 --host localhost
) else if exist "vite.config.ts" (
    echo Usando Vite (TypeScript)...
    npx vite --port 5174 --host localhost
) else (
    echo Intentando con npm start...
    npm start
)

if errorlevel 1 (
    echo.
    echo ❌ Error iniciando la aplicación
    echo 💡 Intenta manualmente:
    echo    npm run dev
    echo    o
    echo    npx vite --port 5174
    pause
)


