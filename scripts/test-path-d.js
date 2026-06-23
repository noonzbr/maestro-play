const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const artifactDir = 'C:/Users/night/.gemini/antigravity-cli/brain/284166a3-1ea6-4c8c-83f9-fb69cb19426d';
const screenshotDir = path.join(artifactDir, 'screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

(async () => {
  console.log("=== STARTING JAKE PATH D & SCENE 6 TEST AND AUDIT ===");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  page.on('console', msg => {
    console.log(`BROWSER CONSOLE: [${msg.type()}] ${msg.text()}`);
  });
  page.on('pageerror', err => {
    console.error(`BROWSER ERROR: ${err.message}`);
  });

  const delay = ms => new Promise(r => setTimeout(r, ms));

  try {
    // 1. Visit landing page
    console.log("1. Visiting root landing page...");
    await page.goto('http://localhost:3099/');
    await page.waitForLoadState('networkidle');
    console.log("Landing page loaded.");
    await page.screenshot({ path: path.join(screenshotDir, 'path_d_01_landing.png') });

    // 2. Navigate to Game 1
    console.log("2. Navigating to Jake's Story (welcome-to-ai)...");
    await page.goto('http://localhost:3099/games/welcome-to-ai');
    await page.waitForLoadState('domcontentloaded');
    await delay(1000);

    // 3. Skip Brand Video
    console.log("3. Skipping brand video...");
    await page.click('body', { position: { x: 100, y: 100 } });
    await delay(1000);

    // 4. Click through Story Beats
    console.log("4. Advancing through the story beats...");
    for (let i = 0; i < 15; i++) {
      await page.click('body', { position: { x: 100, y: 100 } });
      await delay(120);
      await page.click('body', { position: { x: 100, y: 100 } });
      await delay(300);
    }
    await delay(1000);

    // 5. Enter Name
    console.log("5. Entering player name...");
    const nameInput = page.locator('input[placeholder*="Your name"]');
    await nameInput.waitFor({ state: 'visible', timeout: 5000 });
    await nameInput.fill("Jake Tester");
    await delay(500);

    // 6. Begin Game
    console.log("6. Clicking 'Begin Game'...");
    const beginButton = page.locator('button:has-text("Begin Game")');
    await beginButton.click();
    await delay(1500);

    // 7. Skip Coda dialogue
    console.log("7. Skipping Coda's onboarding dialogue...");
    // Finish typing first beat
    await page.click('body', { position: { x: 100, y: 100 } });
    await delay(200);
    
    const continueBtn = page.locator('button:has-text("Continue")');
    if (await continueBtn.count() > 0) {
      await continueBtn.click();
      await delay(500);
      // Finish typing second beat
      await page.click('body', { position: { x: 100, y: 100 } });
      await delay(200);
    }
    
    const beginQuestBtn = page.locator('button:has-text("Begin Game")');
    await beginQuestBtn.waitFor({ state: 'visible', timeout: 10000 });
    await beginQuestBtn.click();
    await delay(2000);


    // 8. Arrived at Scene 0 Branch Point 1
    console.log("8. Arrived at Branch Point 1.");
    await page.screenshot({ path: path.join(screenshotDir, 'path_d_08_branch1.png') });

    // Advance through the new scene 0 dialogue (4 lines)
    console.log("Advancing through scene 0 dialogue...");
    for (let i = 0; i < 4; i++) {
      await page.click('body', { position: { x: 100, y: 100 } });
      await delay(120);
      await page.click('body', { position: { x: 100, y: 100 } });
      await delay(350);
    }
    await delay(500);

    // Dismiss the "Meet Coda" onboarding popover if present
    const gotItBtn = page.locator('button:has-text("Got it")');
    if (await gotItBtn.count() > 0) {
      console.log("Dismissing Coda onboarding popover...");
      await gotItBtn.click();
      await delay(500);
    }

    // 9. Select Option D (Take fifteen minutes to write detailed prompt)
    console.log("9. Selecting Option D (The Conductor path)...");
    const optionD = page.locator('button:has-text("He takes fifteen minutes")');
    await optionD.waitFor({ state: 'visible', timeout: 5000 });
    await delay(1200); // Wait for the spring animation to settle completely
    await optionD.click({ force: true });
    await delay(2000);
    await page.screenshot({ path: path.join(screenshotDir, 'path_d_09_conductor1_loaded.png') });

    // 10. Walk through w1-conductor-1 dialogue (13 lines)
    console.log("10. Advancing through Scene 5 (w1-conductor-1) dialogue...");
    for (let i = 0; i < 13; i++) {
      await page.click('body', { position: { x: 100, y: 100 } });
      await delay(120);
      await page.click('body', { position: { x: 100, y: 100 } });
      await delay(350);
    }
    await delay(1000);
    await page.screenshot({ path: path.join(screenshotDir, 'path_d_10_conductor1_done.png') });

    // 11. Transition to w1-conductor-prompt (Prompt Challenge)
    console.log("11. Transitioning to w1-conductor-prompt (Prompt Challenge)...");
    const continueToPrompt = page.locator('button:has-text("Continue →")');
    await continueToPrompt.waitFor({ state: 'visible', timeout: 5000 });
    await continueToPrompt.click();
    await delay(1500);

    // 11b. Complete prompt challenge
    console.log("Completing the prompt challenge...");
    const textarea = page.locator('textarea[placeholder*="prompt"]');
    await textarea.waitFor({ state: 'visible', timeout: 5000 });
    await textarea.fill("Raw emotional indie guitar like early Arctic Monkeys, 17yo guitarist, grief about friendship ending with Tyler moving to Portland, raw, key of Dm, 120bpm, no cliches.");
    await delay(500);
    const sendBtn = page.locator('button:has-text("Send to AI")');
    await sendBtn.click();
    console.log("Sent prompt to AI...");

    // Wait for the next Continue button to appear
    const continueFromPrompt = page.locator('button:has-text("Continue →")');
    await continueFromPrompt.waitFor({ state: 'visible', timeout: 25000 });
    await continueFromPrompt.click();
    await delay(2000);
    await page.screenshot({ path: path.join(screenshotDir, 'path_d_11_scene6_loaded.png') });

    // 12. Walk through w1-conductor-2 dialogue (6 lines)
    console.log("12. Advancing through Scene 6 (w1-conductor-2) dialogue...");
    for (let i = 0; i < 8; i++) {
      await page.click('body', { position: { x: 100, y: 100 } });
      await delay(120);
      await page.click('body', { position: { x: 100, y: 100 } });
      await delay(350);
    }
    await delay(1500);

    // 13. Check if the screen is blank or has scenario wrap-up text
    console.log("13. Dialogue complete. Checking Scene 6 wrap-up screen...");
    await page.screenshot({ path: path.join(screenshotDir, 'path_d_13_scene6_wrapup.png') });

    const bodyText = await page.innerText('body');
    console.log("Page text contains 'Jake walked out feeling':", bodyText.includes("Jake walked out feeling"));
    console.log("Page text contains 'Continue':", bodyText.includes("Continue"));

    if (bodyText.includes("Jake walked out feeling") && bodyText.includes("Continue")) {
      console.log("SUCCESS: Scene 6 wrap-up text and Continue button are visible! Not blank!");
    } else {
      console.error("FAIL: Scene 6 wrap-up is blank or missing expected text!");
    }

    // 14. Click Continue to go to w1-match-terms
    console.log("14. Clicking Continue to transition to Matching Exercise...");
    const continueToMatch = page.locator('button:has-text("Continue →")');
    await continueToMatch.waitFor({ state: 'visible', timeout: 5000 });
    await continueToMatch.click();
    await delay(2000);
    await page.screenshot({ path: path.join(screenshotDir, 'path_d_14_match_terms.png') });

    const matchText = await page.innerText('body');
    console.log("Arrived at Matching Game:", matchText.includes("Match the prompt components"));
    if (matchText.includes("Match the prompt components")) {
      console.log("SUCCESS: Arrived at matching exercise successfully!");
    } else {
      console.error("FAIL: Did not arrive at matching exercise!");
    }

  } catch (err) {
    console.error("ERROR DURING TEST:", err);
    try {
      await page.screenshot({ path: path.join(screenshotDir, 'path_d_error.png') });
    } catch (e) {
      console.error("Failed to take error screenshot:", e);
    }
  } finally {
    await browser.close();
    console.log("=== TEST COMPLETE ===");
  }
})();
