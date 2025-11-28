# 🚀 Script de inicialização do Cerrado Certo Conectado

Write-Host "🌿 Cerrado Certo Conectado - Inicializando..." -ForegroundColor Green
Write-Host ""

# Verificar se está na pasta raiz
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Execute este script na pasta raiz do projeto!" -ForegroundColor Red
    exit 1
}

# Função para verificar se uma porta está em uso
function Test-Port {
    param($Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue
    return $connection
}

# Instalar dependências do frontend (se necessário)
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências do frontend..." -ForegroundColor Yellow
    npm install
}

# Instalar dependências do backend (se necessário)
if (-not (Test-Path "backend\node_modules")) {
    Write-Host "📦 Instalando dependências do backend..." -ForegroundColor Yellow
    cd backend
    npm install
    cd ..
}

Write-Host ""
Write-Host "✅ Dependências instaladas!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Iniciando servidores..." -ForegroundColor Cyan
Write-Host ""

# Iniciar backend em nova janela
Write-Host "🔧 Backend: http://localhost:3001" -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Aguardar 3 segundos para o backend iniciar
Start-Sleep -Seconds 3

# Iniciar frontend em nova janela
Write-Host "🎨 Frontend: http://localhost:5173" -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host ""
Write-Host "✨ Servidores iniciados com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Instruções:" -ForegroundColor Cyan
Write-Host "  - Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  - Backend API: http://localhost:3001" -ForegroundColor White
Write-Host "  - API Docs: http://localhost:3001/health" -ForegroundColor White
Write-Host ""
Write-Host "🛑 Para parar os servidores, feche as janelas do PowerShell" -ForegroundColor Yellow
Write-Host ""
