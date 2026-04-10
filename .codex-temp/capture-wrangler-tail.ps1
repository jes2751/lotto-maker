$tailPath = Join-Path $PWD ".codex-temp\wrangler-tail.log"
$tailErrPath = Join-Path $PWD ".codex-temp\wrangler-tail.err.log"

if (Test-Path $tailPath) {
  Remove-Item $tailPath -Force
}

if (Test-Path $tailErrPath) {
  Remove-Item $tailErrPath -Force
}

$process = Start-Process `
  -FilePath "C:\Progra~1\nodejs\npx.cmd" `
  -ArgumentList "wrangler","tail","lotto-maker","--format","pretty" `
  -RedirectStandardOutput $tailPath `
  -RedirectStandardError $tailErrPath `
  -PassThru

Start-Sleep -Seconds 8
& "C:\WINDOWS\System32\curl.exe" -I "https://lotto-maker.cloud/" | Out-Null
Start-Sleep -Seconds 12

if (-not $process.HasExited) {
  Stop-Process -Id $process.Id -Force
}

Get-Content $tailPath
if (Test-Path $tailErrPath) {
  Get-Content $tailErrPath
}
