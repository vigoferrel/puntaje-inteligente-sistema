# Script para extraer funciones RPC utilizadas en el frontend
$matches = Get-ChildItem -Path "src" -Recurse -Include "*.tsx", "*.ts" -File | Select-String "\.rpc\("

$rpcFunctions = @()

foreach ($match in $matches) {
    $line = $match.Line
    if ($line -match "\.rpc\('([^']+)'") {
        $rpcFunctions += $Matches[1]
    }
}

$uniqueFunctions = $rpcFunctions | Sort-Object -Unique

Write-Host "=== FUNCIONES RPC UTILIZADAS EN EL FRONTEND ===" -ForegroundColor Green
Write-Host "Total de llamadas encontradas: $($matches.Count)" -ForegroundColor Yellow
Write-Host "Funciones únicas utilizadas: $($uniqueFunctions.Count)" -ForegroundColor Yellow
Write-Host ""

foreach ($func in $uniqueFunctions) {
    Write-Host "- $func" -ForegroundColor Cyan
}

# Exportar a archivo
$report = @{
    timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    total_calls = $matches.Count
    unique_functions = $uniqueFunctions.Count
    functions = $uniqueFunctions
}

$report | ConvertTo-Json -Depth 3 | Out-File -FilePath "frontend-rpc-usage.json" -Encoding UTF8

Write-Host ""
Write-Host "Reporte guardado en: frontend-rpc-usage.json" -ForegroundColor Green
