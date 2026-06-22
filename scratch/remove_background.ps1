Add-Type -AssemblyName System.Drawing

function Remove-EdgeBackground {
    param(
        [string]$ImagePath,
        [int]$Tolerance = 15
    )

    if (-not (Test-Path $ImagePath)) {
        Write-Host "File not found: $ImagePath"
        return
    }

    Write-Host "Processing $ImagePath..."
    $bmp = New-Object System.Drawing.Bitmap($ImagePath)
    $width = $bmp.Width
    $height = $bmp.Height

    # Create a new bitmap with transparency support (Format32bppArgb)
    $newBmp = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    
    # Copy original bitmap to new bitmap
    $g = [System.Drawing.Graphics]::FromImage($newBmp)
    $g.DrawImage($bmp, 0, 0, $width, $height)
    $g.Dispose()
    $bmp.Dispose()

    # We will sample the background color from top-left, top-right, top-center
    $bgColor = $newBmp.GetPixel(0, 0)
    # Check if corner is transparent. If so, let's find a solid border color at top middle
    if ($bgColor.A -eq 0) {
        $bgColor = $newBmp.GetPixel([math]::floor($width/2), 0)
    }

    # If the background color found is already transparent, skip
    if ($bgColor.A -eq 0) {
        Write-Host "  Edge color is already transparent. Skipping."
        $newBmp.Dispose()
        return
    }

    Write-Host "  Target background color: R=$($bgColor.R) G=$($bgColor.G) B=$($bgColor.B)"

    # Flood fill helper queue
    $queue = [System.Collections.Generic.Queue[System.Drawing.Point]]::new()
    $visited = New-Object 'bool[,]' $width, $height

    # Helper function to check if color matches the background color within tolerance
    function ColorMatch($c1, $c2, $tol) {
        if ($c1.A -eq 0) { return $false }
        $dr = [math]::Abs($c1.R - $c2.R)
        $dg = [math]::Abs($c1.G - $c2.G)
        $db = [math]::Abs($c1.B - $c2.B)
        return ($dr -le $tol -and $dg -le $tol -and $db -le $tol)
    }

    # Add all border pixels to the queue to initiate flood fill from edges
    for ($x = 0; $x -lt $width; $x++) {
        $pTop = [System.Drawing.Point]::new($x, 0)
        $pBot = [System.Drawing.Point]::new($x, $height - 1)
        if (ColorMatch ($newBmp.GetPixel($x, 0)) $bgColor $Tolerance) {
            $queue.Enqueue($pTop)
            $visited[$x, 0] = $true
        }
        if (ColorMatch ($newBmp.GetPixel($x, $height - 1)) $bgColor $Tolerance) {
            $queue.Enqueue($pBot)
            $visited[$x, $height - 1] = $true
        }
    }
    for ($y = 0; $y -lt $height; $y++) {
        $pLeft = [System.Drawing.Point]::new(0, $y)
        $pRight = [System.Drawing.Point]::new($width - 1, $y)
        if (ColorMatch ($newBmp.GetPixel(0, $y)) $bgColor $Tolerance) {
            if (-not $visited[0, $y]) {
                $queue.Enqueue($pLeft)
                $visited[0, $y] = $true
            }
        }
        if (ColorMatch ($newBmp.GetPixel($width - 1, $y)) $bgColor $Tolerance) {
            if (-not $visited[$width - 1, $y]) {
                $queue.Enqueue($pRight)
                $visited[$width - 1, $y] = $true
            }
        }
    }

    # Process queue
    $transparentColor = [System.Drawing.Color]::FromArgb(0, 0, 0, 0)
    $count = 0

    while ($queue.Count -gt 0) {
        $curr = $queue.Dequeue()
        $x = $curr.X
        $y = $curr.Y

        # Set this pixel to transparent
        $newBmp.SetPixel($x, $y, $transparentColor)
        $count++

        # Check 4-way neighbors
        $neighbors = @(
            [System.Drawing.Point]::new($x - 1, $y),
            [System.Drawing.Point]::new($x + 1, $y),
            [System.Drawing.Point]::new($x, $y - 1),
            [System.Drawing.Point]::new($x, $y + 1)
        )

        foreach ($n in $neighbors) {
            if ($n.X -ge 0 -and $n.X -lt $width -and $n.Y -ge 0 -and $n.Y -lt $height) {
                if (-not $visited[$n.X, $n.Y]) {
                    $pixelColor = $newBmp.GetPixel($n.X, $n.Y)
                    if (ColorMatch $pixelColor $bgColor $Tolerance) {
                        $queue.Enqueue($n)
                        $visited[$n.X, $n.Y] = $true
                    }
                }
            }
        }
    }

    Write-Host "  Made $count background pixels transparent."
    
    # Save the file back as transparent PNG
    # First, rename original to .bak if not already exist
    $bakPath = $ImagePath + ".bak"
    if (-not (Test-Path $bakPath)) {
        Rename-Item -Path $ImagePath -NewName ($ImagePath + ".bak")
        Write-Host "  Saved backup to $bakPath"
    } else {
        Remove-Item -Path $ImagePath
    }

    $newBmp.Save($ImagePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $newBmp.Dispose()
    Write-Host "  Saved transparent image to $ImagePath."
}

# Run on the detected solid-background character portraits
Remove-EdgeBackground -ImagePath "public/images/alex.png" -Tolerance 20
Remove-EdgeBackground -ImagePath "public/images/kai.png" -Tolerance 20
