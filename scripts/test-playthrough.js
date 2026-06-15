const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Target paths for screenshots
const artifactDir = 'C:/Users/night/.gemini/antigravity-cli/brain/c3674a47-0041-4a61-8c3e-f07d71c39ba6';
const screenshotDir = path.join(artifactDir, 'screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

(async () => {
  console.log("=== STARTING MAESTRO PLAY END-TO-END VERIFICATION ===");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  // Helper to wait
  const delay = ms => new Promise(r => setTimeout(r, ms));

  try {
    // 1. Visit landing page
    console.log("1. Visiting root landing page...");
    await page.goto('http://localhost:3099/');
    await page.waitForLoadState('networkidle');
    console.log("Landing page loaded. Title:", await page.title());
    await page.screenshot({ path: path.join(screenshotDir, '01_landing_page.png') });

    // 2. Navigate to Game 1
    console.log("2. Navigating to Game 1...");
    await page.goto('http://localhost:3099/games/welcome-to-ai');
    await page.waitForLoadState('domcontentloaded');
    await delay(1000);
    await page.screenshot({ path: path.join(screenshotDir, '02_game_loaded_video_intro.png') });

    // 3. Skip Brand Video
    console.log("3. Skipping brand video...");
    // The screen click skips the intro video
    await page.click('body');
    await delay(1000);
    await page.screenshot({ path: path.join(screenshotDir, '03_story_beats_started.png') });

    // 4. Click through Story Beats
    console.log("4. Advancing through the story beats...");
    // 15 beats in the cinematic intro. We click twice per beat to skip typewriter and advance.
    for (let i = 0; i < 15; i++) {
      await page.click('body');
      await delay(120);
      await page.click('body');
      await delay(400);
    }
    await delay(1000); // Wait for transition animation
    await page.screenshot({ path: path.join(screenshotDir, '04_name_input_screen.png') });

    // 5. Enter Name
    console.log("5. Entering player name...");
    const nameInput = page.locator('input[placeholder*="Your name"]');
    await nameInput.waitFor({ state: 'visible', timeout: 5000 });
    await nameInput.fill("Felipe Fan");
    await delay(500);
    await page.screenshot({ path: path.join(screenshotDir, '05_name_entered.png') });

    // 6. Begin Game (transitions to koda-intro state)
    console.log("6. Clicking 'Begin Game'...");
    const beginButton = page.locator('button:has-text("Begin Game")');
    await beginButton.click();
    await delay(1500); // Wait for Coda intro entrance
    await page.screenshot({ path: path.join(screenshotDir, '06_coda_intro_started.png') });

    // 7. Click through Coda's 8 dialogue beats
    console.log("7. Advancing through Coda's onboarding dialogue...");
    // There are 7 "Continue" buttons, then 1 "Begin Game" button.
    for (let i = 0; i < 7; i++) {
      console.log(`Advancing Coda dialogue beat ${i + 1}/8...`);
      const continueBtn = page.locator('button:has-text("Continue")');
      await continueBtn.waitFor({ state: 'visible', timeout: 10000 });
      await continueBtn.click();
      await delay(800);
    }

    console.log("Clicking final Coda start button...");
    const beginQuestBtn = page.locator('button:has-text("Begin Game")');
    await beginQuestBtn.waitFor({ state: 'visible', timeout: 10000 });
    await page.screenshot({ path: path.join(screenshotDir, '07_coda_dialogue_finished.png') });
    await beginQuestBtn.click();
    await delay(2000); // Wait for transition to play state

    // 8. Verify first scenario text
    console.log("8. Verifying arrival at Scene 0 Branch Point 1...");
    await page.screenshot({ path: path.join(screenshotDir, '08_first_decision_scene.png') });
    const scenarioLocator = page.locator('text=Tyler\'s been raving');
    await scenarioLocator.waitFor({ state: 'visible', timeout: 10000 });
    console.log("SUCCESS: Arrived at Scene 0 Branch Point 1!");

    // 9. Select Option B (indie song early Arctic Monkeys vibe)
    console.log("9. Selecting Option B...");
    // The choices have text labels: "A", "B", "C", "D". Let's click B.
    const optionB = page.locator('button', { hasText: 'B' }).first();
    await optionB.click();
    await delay(2000); // Wait for path loading
    await page.screenshot({ path: path.join(screenshotDir, '09_path_b_dialogue_loaded.png') });

    // 10. Advance dialogue in path B (8 lines)
    console.log("10. Advancing through Dialogue in Path B...");
    for (let i = 0; i < 8; i++) {
      await page.click('body');
      await delay(120);
      await page.click('body');
      await delay(450);
    }
    await delay(1000);
    await page.screenshot({ path: path.join(screenshotDir, '10_path_b_completed.png') });
    console.log("SUCCESS: Playthrough completed successfully!");

  } catch (err) {
    console.error("ERROR DURING PLAYTHROUGH VERIFICATION:", err);
  } finally {
    await browser.close();
    console.log("=== VERIFICATION COMPLETE ===");
  }
})();
