$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

function Find-CommandPath {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Name,
        [string[]]$CommonPaths = @()
    )

    $cmd = Get-Command $Name -ErrorAction SilentlyContinue
    if ($cmd) {
        return $cmd.Source
    }

    foreach ($path in $CommonPaths) {
        if (Test-Path $path) {
            return $path
        }
    }

    return $null
}

$npmPath = Find-CommandPath -Name "npm" -CommonPaths @(
    "C:\Program Files\nodejs\npm.cmd",
    "C:\Program Files (x86)\nodejs\npm.cmd",
    "$env:LOCALAPPDATA\Programs\nodejs\npm.cmd",
    "$env:LOCALAPPDATA\Microsoft\WindowsApps\npm.cmd",
    "$env:APPDATA\npm\npm.cmd"
)

$nodePath = Find-CommandPath -Name "node" -CommonPaths @(
    "C:\Program Files\nodejs\node.exe",
    "C:\Program Files (x86)\nodejs\node.exe",
    "$env:LOCALAPPDATA\Programs\nodejs\node.exe",
    "$env:LOCALAPPDATA\Microsoft\WindowsApps\node.exe"
)

if (-not $nodePath) {
    $nvmNode = Get-ChildItem "$env:APPDATA\nvm" -Filter "node.exe" -Recurse -ErrorAction SilentlyContinue |
        Sort-Object FullName -Descending |
        Select-Object -First 1
    if ($nvmNode) {
        $nodePath = $nvmNode.FullName
    }
}

if (-not $npmPath) {
    $nvmNpm = Get-ChildItem "$env:APPDATA\nvm" -Filter "npm.cmd" -Recurse -ErrorAction SilentlyContinue |
        Sort-Object FullName -Descending |
        Select-Object -First 1
    if ($nvmNpm) {
        $npmPath = $nvmNpm.FullName
    }
}

$crmUrl = "http://localhost:8080/crm.html"

# Se já estiver rodando, reinicia para carregar código novo
$portInUse = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "CRM já está rodando. Reiniciando para aplicar alterações..." -ForegroundColor Yellow
    if (Test-Path (Join-Path $projectRoot "stop-crm.ps1")) {
        & powershell.exe -ExecutionPolicy Bypass -File (Join-Path $projectRoot "stop-crm.ps1")
        Start-Sleep -Milliseconds 700
    }
}

if (-not $npmPath -and -not $nodePath) {
    Write-Host "Node.js/NPM não encontrado no PATH ou nos caminhos padrão." -ForegroundColor Red
    Write-Host "Instale Node.js (LTS) e execute novamente este script." -ForegroundColor Red
    Write-Host "Sugestão rápida: winget install OpenJS.NodeJS.LTS" -ForegroundColor Yellow
    Start-Process "https://nodejs.org/en/download"
    exit 1
}

Write-Host "Iniciando CRM em $projectRoot" -ForegroundColor Cyan
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 3
    Start-Process "http://localhost:8080/crm.html"
} | Out-Null

if ($npmPath) {
    Write-Host "Executando: npm run crm:start" -ForegroundColor Green
    Write-Host "npm: $npmPath" -ForegroundColor DarkGray
    & $npmPath run crm:start
    exit $LASTEXITCODE
}

Write-Host "NPM não encontrado. Usando fallback: node server-crm.js" -ForegroundColor Yellow
Write-Host "node: $nodePath" -ForegroundColor DarkGray
& $nodePath "server-crm.js"
exit $LASTEXITCODE
