$content = Get-Content -LiteralPath "lib/games/game3.ts" -Raw
$scenes = [regex]::Matches($content, "id\s*:\s*`"[^`"]*`"|type\s*:\s*`"[^`"]*`"")
foreach ($m in $scenes) {
    Write-Host $m.Value
}
