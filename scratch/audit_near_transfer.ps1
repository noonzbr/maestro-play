$games = Get-ChildItem -Path "lib/games" -Filter "game*.ts"

foreach ($game in $games) {
    $content = Get-Content -LiteralPath $game.FullName -Raw
    
    # Check if there is any ID matching "near-transfer" or "transfer"
    $matches = [regex]::Matches($content, "id\s*:\s*`"[^`"]*transfer[^`"]*`"|id\s*:\s*'[^']*transfer[^']*'")
    
    # Check if there is a boss scene
    $bossScenes = [regex]::Matches($content, "type\s*:\s*`"boss`"|type\s*:\s*'boss'")
    
    Write-Host "$($game.Name):"
    Write-Host "  near-transfer scene count: $($matches.Count)"
    Write-Host "  boss scene count: $($bossScenes.Count)"
}
