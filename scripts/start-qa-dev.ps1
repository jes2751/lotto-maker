Set-Location 'c:\Users\jes27\OneDrive\code\lotto_v2'
$node = 'C:\Progra~1\nodejs\node.exe'
$next = 'node_modules\next\dist\bin\next'
$out = 'c:\Users\jes27\OneDrive\code\lotto_v2\.codex-temp\qa-dev.log'
$err = 'c:\Users\jes27\OneDrive\code\lotto_v2\.codex-temp\qa-dev.err.log'
New-Item -ItemType Directory -Force -Path 'c:\Users\jes27\OneDrive\code\lotto_v2\.codex-temp' | Out-Null
Start-Process -FilePath $node -ArgumentList $next, 'dev', '-p', '3000' -RedirectStandardOutput $out -RedirectStandardError $err -WindowStyle Hidden
