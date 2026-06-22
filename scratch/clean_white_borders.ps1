Add-Type -AssemblyName System.Drawing

function Clean-WhiteBorders {
    param(
        [string]$ImagePath,
        [int]$WhiteThreshold = 205, # Pixels with R, G, B all greater than this will be checked
        [int]$Passes = 2
    )

    if (-not (Test-Path $ImagePath)) {
        Write-Host "File not found: $ImagePath"
        return
    }

    Write-Host "Cleaning white borders of $ImagePath over $Passes passes..."
    
    # Load image
    $srcBmp = New-Object System.Drawing.Bitmap($ImagePath)
    $width = $srcBmp.Width
    $height = $srcBmp.Height

    # We will work on a copy to read/write safely
    $workBmp = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($workBmp)
    $g.DrawImage($srcBmp, 0, 0, $width, $height)
    $g.Dispose()
    $srcBmp.Dispose()

    $transparent = [System.Drawing.Color]::FromArgb(0, 0, 0, 0)

    for ($pass = 1; $pass -le $Passes; $pass++) {
        # Create a read-only snapshot of the current state for neighbor checking
        $snapshot = $workBmp.Clone()
        $cleanedCount = 0

        # Loop through interior pixels
        for ($x = 1; $x -lt ($width - 1); $x++) {
            for ($y = 1; $y -lt ($height - 1); $y++) {
                $pixel = $snapshot.GetPixel($x, $y)

                # Skip if already transparent
                if ($pixel.A -eq 0) { continue }

                # Check if pixel is near-white
                if ($pixel.R -ge $WhiteThreshold -and $pixel.G -ge $WhiteThreshold -and $pixel.B -ge $WhiteThreshold) {
                    
                    # Check if any 8-way neighbor in the snapshot is transparent (Alpha = 0)
                    $hasTransparentNeighbor = $false
                    for ($dx = -1; $dx -le 1; $dx++) {
                        for ($dy = -1; $dy -le 1; $dy++) {
                            if ($dx -eq 0 -and $dy -eq 0) { continue }
                            $neighbor = $snapshot.GetPixel($x + $dx, $y + $dy)
                            if ($neighbor.A -eq 0) {
                                $hasTransparentNeighbor = $true
                                break
                            }
                        }
                        if ($hasTransparentNeighbor) { break }
                    }

                    # If it's a boundary near-white pixel, erase it
                    if ($hasTransparentNeighbor) {
                        $workBmp.SetPixel($x, $y, $transparent)
                        $cleanedCount++
                    }
                }
            }
        }

        $snapshot.Dispose()
        Write-Host "  Pass $($pass): Cleaned $cleanedCount border pixels."
        if ($cleanedCount -eq 0) { break }
    }

    # Backup original
    $bakPath = $ImagePath + ".borderbak"
    if (-not (Test-Path $bakPath)) {
        $fileItem = Get-Item $ImagePath
        Rename-Item -Path $ImagePath -NewName ($fileItem.Name + ".borderbak") -Force
        Write-Host "  Saved backup to $bakPath"
    } else {
        Remove-Item -Path $ImagePath -Force
    }

    $workBmp.Save($ImagePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $workBmp.Dispose()
    Write-Host "  Finished cleaning borders for $ImagePath."
}

# Clean borders for all main visual novel characters
$charImages = @(
    "public/images/tyler.png",
    "public/images/guitarplayer1.png",
    "public/images/guitarplayer1_excited.png",
    "public/images/guitarplayer1_tense.png",
    "public/images/guitarplayer1_thinking.png",
    "public/images/zoe.png",
    "public/images/carlos.png"
)

foreach ($img in $charImages) {
    Clean-WhiteBorders -ImagePath $img -WhiteThreshold 200 -Passes 2
}
