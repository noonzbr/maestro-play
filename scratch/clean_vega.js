const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setContent(`
    <html>
      <body>
        <canvas id="canvas" width="1024" height="1024"></canvas>
      </body>
    </html>
  `);

  const imgName = 'senoravega.png';
  const imgPath = path.resolve('public/images', imgName);
  
  if (!fs.existsSync(imgPath)) {
    console.log("File not found!");
    await browser.close();
    return;
  }
  
  const buffer = fs.readFileSync(imgPath);
  const base64Data = buffer.toString('base64');
  const dataUrl = `data:image/png;base64,${base64Data}`;
  
  const cleanedBase64 = await page.evaluate(async (src) => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 1024, 1024);
    
    const img = new Image();
    img.src = src;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    ctx.drawImage(img, 0, 0);
    
    const imgData = ctx.getImageData(0, 0, 1024, 1024);
    const data = imgData.data;
    
    // Clean white fringe around transparent edges
    // For every pixel:
    for (let y = 0; y < 1024; y++) {
      for (let x = 0; x < 1024; x++) {
        const idx = (y * 1024 + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];
        
        if (a > 0) {
          // If a pixel is very bright/white (R, G, B all high) AND it's near transparent pixels,
          // it's likely a fringe pixel.
          const isWhite = r > 215 && g > 215 && b > 215;
          if (isWhite) {
            // Check neighbors in a 3x3 grid to see if there are transparent or low-alpha pixels
            let hasTransparentNeighbor = false;
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                const ny = y + dy;
                const nx = x + dx;
                if (ny >= 0 && ny < 1024 && nx >= 0 && nx < 1024) {
                  const nidx = (ny * 1024 + nx) * 4;
                  if (data[nidx + 3] < 180) { // neighboring low alpha or transparent
                    hasTransparentNeighbor = true;
                    break;
                  }
                }
              }
              if (hasTransparentNeighbor) break;
            }
            
            if (hasTransparentNeighbor) {
              // Set to transparent or blend it out
              data[idx + 3] = 0; // Make it completely transparent to remove the white line
            }
          }
        }
      }
    }
    
    ctx.putImageData(imgData, 0, 0);
    return canvas.toDataURL('image/png');
  }, dataUrl);

  // Save the cleaned image back
  const base64Image = cleanedBase64.replace(/^data:image\/png;base64,/, "");
  // Backup the original first
  const backupPath = imgPath + '.bak';
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(imgPath, backupPath);
    console.log(`Saved backup of original to ${backupPath}`);
  }
  
  fs.writeFileSync(imgPath, base64Image, 'base64');
  console.log(`Cleaned image saved back to ${imgPath}`);

  await browser.close();
})();
