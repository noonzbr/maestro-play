$folders = @("app", "components")
foreach ($folder in $folders) {
    $files = Get-ChildItem -Path $folder -Recurse -Filter "*.tsx"
    $files += Get-ChildItem -Path $folder -Recurse -Filter "*.ts"
    
    foreach ($file in $files) {
        $lines = Get-Content $file.FullName
        for ($i = 0; $i -lt $lines.Length; $i++) {
            if ($lines[$i] -match "DailyChallenge") {
                Write-Host "$($file.FullName):$($i+1): $($lines[$i].Trim())"
            }
        }
    }
}
