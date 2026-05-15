$src   = "$PSScriptRoot\src\best-sellers"
$theme = "$PSScriptRoot\theme"

Copy-Item "$src\best-sellers.liquid"         "$theme\sections\best-sellers.liquid"        -Force
Copy-Item "$src\section-best-sellers.css"    "$theme\assets\section-best-sellers.css"     -Force
Copy-Item "$src\section-best-sellers.js"     "$theme\assets\section-best-sellers.js"      -Force

Write-Host "Synced src/best-sellers -> theme/" -ForegroundColor Green
