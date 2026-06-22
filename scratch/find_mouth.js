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

  const images = ['guitarplayer1.png', 'tyler.png', 'senoravega.png'];

  for (const imgName of images) {
    const imgPath = path.resolve('public/images', imgName);
    const buffer = fs.readFileSync(imgPath);
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64Data}`;
    
    const result = await page.evaluate(async (src) => {
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
      
      let minY = 1024, maxY = 0, minX = 1024, maxX = 0;
      
      for (let y = 0; y < 1024; y++) {
        for (let x = 0; x < 1024; x++) {
          const idx = (y * 1024 + x) * 4;
          const alpha = data[idx + 3];
          if (alpha > 10) {
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
          }
        }
      }
      
      const profiles = [];
      for (let y = minY; y < minY + 350; y++) {
        let left = 1024, right = 0;
        let count = 0;
        for (let x = 0; x < 1024; x++) {
          const idx = (y * 1024 + x) * 4;
          if (data[idx + 3] > 10) {
            if (x < left) left = x;
            if (x > right) right = x;
            count++;
          }
        }
        profiles.push({
          y,
          width: count ? right - left + 1 : 0,
          left: count ? left : 0,
          right: count ? right : 0
        });
      }
      
      return { minY, maxY, minX, maxX, profiles };
    }, dataUrl);

    console.log(`\n=== Image: ${imgName} ===`);
    console.log(`Bounding Box: Y [${result.minY} - ${result.maxY}], X [${result.minX} - ${result.maxX}]`);
    
    let headStart = result.minY;
    let maxHeadWidth = 0;
    let maxHeadWidthY = headStart;
    for (let i = 0; i < 200; i++) {
      const p = result.profiles[i];
      if (!p) continue;
      if (p.width > maxHeadWidth) {
        maxHeadWidth = p.width;
        maxHeadWidthY = p.y;
      }
    }
    
    let neckY = maxHeadWidthY;
    let minWidth = maxHeadWidth;
    for (let y = maxHeadWidthY; y < maxHeadWidthY + 120; y++) {
      const idx = y - headStart;
      const p = result.profiles[idx];
      if (!p) continue;
      if (p.width > 0 && p.width < minWidth) {
        minWidth = p.width;
        neckY = p.y;
      }
    }
    
    // Let's print the width profile to see where the head actually is
    // The head starts at headStart. Let's list the first 150 rows.
    console.log("Width Profile of Head region (every 10th pixel):");
    for (let i = 0; i < 150; i += 10) {
      const p = result.profiles[i];
      if (p) {
        console.log(`  y=${p.y} (row ${i}): width=${p.width}, left=${p.left}, right=${p.right}`);
      }
    }
    
    // We can also search for a potential mouth region:
    // In human sprites, the mouth is located between y = headStart + 50 and y = headStart + 180.
    // Let's make an estimate or we can look at the output to see where the chin/mouth sits.
  }

  await browser.close();
})();
