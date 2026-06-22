const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

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

  const characters = [
    { key: 'jake', file: 'guitarplayer1.png' },
    { key: 'tyler', file: 'tyler.png' },
    { key: 'senora_vega', file: 'senoravega.png' },
    { key: 'zoe', file: 'zoe.png' },
    { key: 'carlos', file: 'carlos.png' },
    { key: 'aria', file: 'aria.png' },
    { key: 'jordan', file: 'jordan.png' },
    { key: 'kai', file: 'kai.png' },
    { key: 'priya', file: 'priya.png' },
    { key: 'alex', file: 'alex.png' },
    { key: 'luna', file: 'luna.png' },
    { key: 'sam', file: 'sam.png' },
    { key: 'vera', file: 'vera.png' },
    { key: 'maya', file: 'maya.png' },
    { key: 'nova', file: 'nova.png' },
    { key: 'felipe', file: 'felipe.png' }
  ];

  const results = {};

  for (const char of characters) {
    const imgPath = path.join('C:/Users/night/Documents/ClaudeAgent/maestro-play/public/images', char.file);
    if (!fs.existsSync(imgPath)) {
      console.log(`File not found: ${char.file}`);
      continue;
    }
    
    const buffer = fs.readFileSync(imgPath);
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64Data}`;
    
    const res = await page.evaluate(async (src) => {
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
      
      let lipPixels = [];
      for (let y = 100; y < 650; y++) {
        for (let x = 250; x < 750; x++) {
          const idx = (y * 1024 + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];
          
          if (a > 150) {
            // Lip color heuristic: reddish/coral/pinkish/mauve
            const isLip = r > g + 20 && r > b + 20 && r > 100;
            if (isLip) {
              lipPixels.push({ x, y });
            }
          }
        }
      }
      
      if (lipPixels.length === 0) {
        return { success: false };
      }
      
      let sumX = 0, sumY = 0;
      lipPixels.forEach(p => {
        sumX += p.x;
        sumY += p.y;
      });
      const centerX = sumX / lipPixels.length;
      const centerY = sumY / lipPixels.length;
      
      return {
        success: true,
        top: ((centerY / 1024) * 100).toFixed(1) + "%",
        left: ((centerX / 1024) * 100).toFixed(1) + "%"
      };
    }, dataUrl);
    
    if (res.success) {
      results[char.key] = { top: res.top, left: res.left };
    } else {
      results[char.key] = null;
    }
  }

  console.log("FINAL_RESULTS_JSON:" + JSON.stringify(results, null, 2));
  await browser.close();
})();
