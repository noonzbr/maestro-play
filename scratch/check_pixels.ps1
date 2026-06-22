Add-Type -AssemblyName System.Drawing
$files = Get-ChildItem -Path "public/images" -Filter "*.png"

foreach ($file in $files) {
    $name = $file.Name
    # Skip backgrounds, mockups, logos, and backup files
    if ($name -match "^bg-" -or $name -match "mockup" -or $name -match "logo" -or $name -match "\.bak" -or $name -match "\.original") {
        continue
    }
    
    $bmp = New-Object System.Drawing.Bitmap($file.FullName)
    $c00 = $bmp.GetPixel(0, 0)
    $cTopMid = $bmp.GetPixel([math]::floor($bmp.Width/2), 0)
    
    # If the corner or top-mid pixel has A=255, it might be a solid background (non-transparent)
    if ($c00.A -eq 255 -or $cTopMid.A -eq 255) {
        Write-Host "$name ($($bmp.Width)x$($bmp.Height)) has solid background:"
        Write-Host "  Corner (0,0): R=$($c00.R) G=$($c00.G) B=$($c00.B) A=$($c00.A)"
        Write-Host "  TopMid: R=$($cTopMid.R) G=$($cTopMid.G) B=$($cTopMid.B) A=$($cTopMid.A)"
    }
    $bmp.Dispose()
}
