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
    if (!fs.existsSync(imgPath)) continue;
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
      
      // Let's find the vertical range of the face.
      // Search in a vertical column in the middle (x from 480 to 544)
      const rows = [];
      for (let y = 100; y < 300; y++) {
        let rSum = 0, gSum = 0, bSum = 0, count = 0;
        let maxRedness = 0;
        let bestX = 512;
        for (let x = 460; x <= 560; x++) {
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
            if (redness > maxRedness) {
              maxRedness = redness;
              bestX = x;
            }
          }
        }
        if (count > 0) {
          rows.push({
            y,
            cx: bestX,
            avgColor: [Math.round(rSum/count), Math.round(gSum/count), Math.round(bSum/count)],
            maxRedness
          });
        }
      }
      return { rows };
    }, dataUrl);

    // Sort by maxRedness
    const candidates = result.rows
      .filter(r => r.maxRedness > 10)
      .sort((a, b) => b.maxRedness - a.maxRedness);
      
    if (candidates.length > 0) {
      const best = candidates[0];
      console.log(`'${imgName.replace('.png', '')}': { top: "${(best.y/10.24).toFixed(1)}%", left: "${(best.cx/10.24).toFixed(1)}%" },`);
    } else {
      console.log(`'${imgName.replace('.png', '')}': { top: "18.5%", left: "50.0%" },`);
    }
  }

  await browser.close();
})();
