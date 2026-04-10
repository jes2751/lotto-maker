$apiKeyLine = Select-String -Path ".env.local" -Pattern '^NEXT_PUBLIC_FIREBASE_API_KEY=' | Select-Object -First 1

if (-not $apiKeyLine) {
  throw "NEXT_PUBLIC_FIREBASE_API_KEY not found in .env.local"
}

$apiKey = ($apiKeyLine.Line -split "=", 2)[1].Trim().Trim('"')
$tmp = [System.IO.Path]::GetTempFileName()

try {
  Set-Content -Path $tmp -Value $apiKey -NoNewline
  C:\WINDOWS\System32\cmd.exe /c "set PATH=C:\Progra~1\nodejs;%PATH%&& C:\Progra~1\nodejs\npx.cmd -y wrangler secret put NEXT_PUBLIC_FIREBASE_API_KEY --config wrangler.jsonc < $tmp"
}
finally {
  Remove-Item -LiteralPath $tmp -Force -ErrorAction SilentlyContinue
}
