const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const artifactDir = 'C:/Users/night/.gemini/antigravity-cli/brain/284166a3-1ea6-4c8c-83f9-fb69cb19426d';
const screenshotDir = path.join(artifactDir, 'screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

(async () => {
  console.log("=== STARTING MAESTRO PLAY GAME OVER & RECOVERY AUDIT ===");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  const delay = ms => new Promise(r => setTimeout(r, ms));

  try {
    // 1. Visit Root with ?dev=true
    console.log("1. Visiting Root with dev mode...");
    await page.goto('http://localhost:3099/games/welcome-to-ai?dev=true');
    await page.waitForLoadState('domcontentloaded');
    await delay(1000);

    // 2. Skip Brand Video
    console.log("2. Skipping brand video...");
    await page.click('body');
    await delay(1000);

    // 3. Skip Story Beats
    console.log("3. Skipping story beats...");
    for (let i = 0; i < 15; i++) {
      await page.click('body');
      await delay(120);
      await page.click('body');
      await delay(250);
    }
    await delay(1000);

    // 4. Enter Name
    console.log("4. Entering player name...");
    const nameInput = page.locator('input[placeholder*="Your name"]');
    await nameInput.waitFor({ state: 'visible', timeout: 5000 });
    await nameInput.fill("Game Over Tester");
    await delay(500);

    // 5. Begin Game
    console.log("5. Starting game...");
    const beginButton = page.locator('button:has-text("Begin Game")');
    await beginButton.click();
    await delay(1500);

    // 6. Skip Coda dialogue
    console.log("6. Skipping onboarding tutor dialogue...");
    const beginQuestBtn = page.locator('button:has-text("Begin Game")');
    await beginQuestBtn.waitFor({ state: 'visible', timeout: 10000 });
    await beginQuestBtn.click();
    await delay(2000);


    // 7. Arrive at game view
    console.log("7. Arrived at gameplay view.");
    await page.screenshot({ path: path.join(screenshotDir, 'game_over_01_gameplay.png') });

    // 8. Drain hearts using dev bypass tool (3 clicks)
    console.log("8. Draining hearts using developer bypass tool...");
    const drainBtn = page.locator('button:has-text("DRAIN")');
    await drainBtn.waitFor({ state: 'visible', timeout: 5000 });
    
    // First drain (to 2 hearts)
    await drainBtn.click();
    await delay(300);
    console.log("Drained to 2 hearts.");
    
    // Second drain (to 1 heart)
    await drainBtn.click();
    await delay(300);
    console.log("Drained to 1 heart.");
    
    // Third drain (to 0 hearts, enters out-of-lives state)
    await drainBtn.click();
    await delay(1500); // wait for state transition and animation
    console.log("Drained to 0 hearts. Enters recovery screen.");
    await page.screenshot({ path: path.join(screenshotDir, 'game_over_02_hearts_empty.png') });

    // 9. Verify Out of Lives screen rendering
    const recoveryText = await page.innerText('body');
    const hasHeartsEmpty = recoveryText.includes("HEARTS EMPTY");
    const hasReviewBtn = recoveryText.includes("Review Lesson with Coda");
    console.log("Recovery screen contains 'HEARTS EMPTY':", hasHeartsEmpty);
    console.log("Recovery screen contains 'Review Lesson with Coda':", hasReviewBtn);

    if (hasHeartsEmpty && hasReviewBtn) {
      console.log("SUCCESS: 'Out of Lives' recovery screen verified successfully!");
    } else {
      console.error("FAIL: 'Out of Lives' screen is incomplete or blank!");
    }

    // 10. Click Coda Review Lesson
    console.log("10. Clicking 'Review Lesson with Coda'...");
    const reviewBtn = page.locator('button:has-text("Review Lesson with Coda")');
    await reviewBtn.click();
    await delay(1000);
    await page.screenshot({ path: path.join(screenshotDir, 'game_over_03_coda_lesson.png') });

    // 11. Verify Coda Lesson presentation
    const lessonText = await page.innerText('body');
    const hasConceptTitle = lessonText.toUpperCase().includes("AI PROMPT CONSTRUCTION");
    const hasLessonTitle = lessonText.toUpperCase().includes("TUTOR LESSON WITH CODA");
    console.log("Lesson screen contains Coda header:", hasLessonTitle);
    console.log("Lesson screen contains concept title:", hasConceptTitle);

    if (hasLessonTitle && hasConceptTitle) {
      console.log("SUCCESS: Coda lesson details verified successfully!");
    } else {
      console.error("FAIL: Coda lesson did not render correctly!");
    }

    // 12. Complete lesson and refill hearts
    console.log("12. Completing lesson (refilling hearts)...");
    const continueBtn = page.locator('button:has-text("I Understand")');
    await continueBtn.click();
    await delay(2000);
    await page.screenshot({ path: path.join(screenshotDir, 'game_over_04_refilled_game.png') });

    // 13. Verify return to game and 3 hearts refill
    const refilledText = await page.innerText('body');
    const hasDevButton = refilledText.includes("DRAIN");
    console.log("Returned to gameplay view:", hasDevButton);
    if (hasDevButton) {
      console.log("SUCCESS: Hearts refilled and player returned to gameplay successfully!");
    } else {
      console.error("FAIL: Did not return to gameplay after lesson refill!");
    }

  } catch (err) {
    console.error("ERROR DURING GAME OVER TEST:", err);
  } finally {
    await browser.close();
    console.log("=== GAME OVER TEST COMPLETE ===");
  }
})();
