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

  const images = [
    'guitarplayer1.png', 'tyler.png', 'senoravega.png',
    'zoe.png', 'carlos.png', 'aria.png', 'jordan.png',
    'kai.png', 'priya.png', 'alex.png', 'luna.png',
    'sam.png', 'vera.png', 'maya.png', 'nova.png'
  ];

  for (const imgName of images) {
    const imgPath = path.resolve('public/images', imgName);
    if (!fs.existsSync(imgPath)) {
      console.log(`File not found: ${imgName}`);
      continue;
    }
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
      
      let minY = 1024;
      for (let y = 0; y < 1024; y++) {
        for (let x = 0; x < 1024; x++) {
          if (data[(y * 1024 + x) * 4 + 3] > 10) {
            if (y < minY) minY = y;
          }
        }
      }
      
      const rows = [];
      for (let y = minY + 60; y < minY + 250; y++) {
        let left = 1024, right = 0;
        for (let x = 0; x < 1024; x++) {
          if (data[(y * 1024 + x) * 4 + 3] > 10) {
            if (x < left) left = x;
            if (x > right) right = x;
          }
        }
        
        if (left < right) {
          const cx = Math.round((left + right) / 2);
          let rSum = 0, gSum = 0, bSum = 0, count = 0;
          let maxRedness = 0;
          for (let x = cx - 15; x <= cx + 15; x++) {
            const idx = (y * 1024 + x) * 4;
            if (data[idx + 3] > 10) {
              const r = data[idx];
              const g = data[idx + 1];
              const b = data[idx + 2];
              rSum += r;
              gSum += g;
              bSum += b;
              count++;
              const redness = r - g;
              if (redness > maxRedness) maxRedness = redness;
            }
          }
          rows.push({
            y,
            cx,
            avgColor: count ? [Math.round(rSum/count), Math.round(gSum/count), Math.round(bSum/count)] : [0,0,0],
            maxRedness
          });
        }
      }
      return { minY, rows };
    }, dataUrl);

    // Find the candidate with the highest redness inside the head range (60px to 220px from head top)
    const headTop = result.minY;
    const candidates = result.rows
      .filter(r => r.y >= headTop + 90 && r.y <= headTop + 200)
      .sort((a, b) => b.maxRedness - a.maxRedness);
      
    if (candidates.length > 0) {
      const best = candidates[0];
      console.log(`'${imgName.replace('.png', '')}': { top: "${(best.y/10.24).toFixed(1)}%", left: "${(best.cx/10.24).toFixed(1)}%" },`);
    } else {
      console.log(`'${imgName.replace('.png', '')}': could not find mouth`);
    }
  }

  await browser.close();
})();
