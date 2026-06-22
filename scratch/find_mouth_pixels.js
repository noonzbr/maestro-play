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

  const imgPath = 'C:/Users/night/Documents/ClaudeAgent/maestro-play/public/images/senoravega.png';
  if (!fs.existsSync(imgPath)) {
    console.log("File not found!");
    await browser.close();
    return;
  }
  
  const buffer = fs.readFileSync(imgPath);
  const base64Data = buffer.toString('base64');
  const dataUrl = `data:image/png;base64,${base64Data}`;
  
  const results = await page.evaluate(async (src) => {
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
    
    // Scan the image for non-transparent pixels in the head/face region.
    // The head is typically in the top 40% of the image.
    // Let's find pixels that match lip tones:
    // Lips are typically reddish/pinkish (R > G + 20 and R > B + 20 and R > 100, or similar).
    // Let's list candidate pixels and their coordinates.
    let lipPixels = [];
    for (let y = 50; y < 450; y++) {
      for (let x = 300; x < 700; x++) {
        const idx = (y * 1024 + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];
        
        if (a > 200) {
          // Check if it's lip-colored
          // A good heuristic for lips: R is significantly higher than G and B.
          const isReddish = r > g + 30 && r > b + 25 && r > 110 && g < 150;
          if (isReddish) {
            lipPixels.push({ x, y, r, g, b });
          }
        }
      }
    }
    
    if (lipPixels.length === 0) {
      return { success: false, message: "No lip-colored pixels found" };
    }
    
    // Cluster the lip pixels to find the center of the mouth
    let sumX = 0, sumY = 0;
    lipPixels.forEach(p => {
      sumX += p.x;
      sumY += p.y;
    });
    const centerX = sumX / lipPixels.length;
    const centerY = sumY / lipPixels.length;
    
    // Convert to percentages of 1024
    const pctX = (centerX / 1024) * 100;
    const pctY = (centerY / 1024) * 100;
    
    return {
      success: true,
      centerX,
      centerY,
      pctX: pctX.toFixed(1) + "%",
      pctY: pctY.toFixed(1) + "%",
      pixelCount: lipPixels.length
    };
  }, dataUrl);

  console.log("Analysis results:", JSON.stringify(results, null, 2));
  await browser.close();
})();
