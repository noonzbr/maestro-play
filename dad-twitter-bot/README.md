# 🤖 Standalone X/Twitter Automated Bot

This is a lightweight, standalone Node.js bot that automatically generates high-engagement (SuperX style) educational posts using Claude and publishes them to X (Twitter) for free using Playwright browser automation.

---

## 🛠️ Step 1: Install Node.js
The bot runs on Node.js. 
1. Go to [nodejs.org](https://nodejs.org/) and download the **LTS (Long Term Support)** installer for Windows.
2. Run the installer and click "Next" through the prompts to finish the setup.

---

## 🔑 Step 2: Get an Anthropic API Key
The bot uses Claude to write the posts.
1. Sign up/Log in to the [Anthropic Console](https://console.anthropic.com/).
2. Create an API Key under **API Keys**.
3. In this bot folder, copy the file `.env.example` and rename it to `.env`.
4. Open `.env` in Notepad and paste your key:
   ```env
   ANTHROPIC_API_KEY=your_key_here
   ```

---

## 📦 Step 3: Install Dependencies
Open a command prompt in this folder (type `cmd` in the folder path bar and hit Enter) and run these two commands:

1. Install Node modules:
   ```bash
   npm install
   ```
2. Download the Chromium browser engine:
   ```bash
   npx playwright install chromium
   ```

---

## 🍪 Step 4: Add Your Twitter Cookies
To post without paying X API fees or getting blocked, the bot needs to use your active browser session cookies:

1. Open **Google Chrome** or **Microsoft Edge** and go to `x.com` (make sure you are logged in to the account you want to post from).
2. Right-click anywhere and click **Inspect** (or press `F12`) to open Developer Tools.
3. Click the **Application** tab at the top (click `>>` if you don't see it).
4. In the left panel, expand **Cookies** and click on `https://x.com`.
5. Look for these two cookies and copy their values:
   * **`auth_token`**
   * **`ct0`**
6. In this folder, create a new text file named **`auth.json`**, open it in Notepad, paste the following, and replace the placeholder values with your copied cookie values:

```json
{
  "cookies": [
    {
      "name": "auth_token",
      "value": "PASTE_YOUR_AUTH_TOKEN_HERE",
      "domain": ".x.com",
      "path": "/",
      "expires": 1900000000,
      "httpOnly": true,
      "secure": true,
      "sameSite": "None"
    },
    {
      "name": "ct0",
      "value": "PASTE_YOUR_CT0_HERE",
      "domain": ".x.com",
      "path": "/",
      "expires": 1900000000,
      "httpOnly": false,
      "secure": true,
      "sameSite": "None"
    },
    {
      "name": "auth_token",
      "value": "PASTE_YOUR_AUTH_TOKEN_HERE",
      "domain": ".twitter.com",
      "path": "/",
      "expires": 1900000000,
      "httpOnly": true,
      "secure": true,
      "sameSite": "None"
    },
    {
      "name": "ct0",
      "value": "PASTE_YOUR_CT0_HERE",
      "domain": ".twitter.com",
      "path": "/",
      "expires": 1900000000,
      "httpOnly": false,
      "secure": true,
      "sameSite": "None"
    }
  ],
  "origins": []
}
```

*Note: Twitter sessions expire occasionally. If the bot stops working, simply repeat this step to put fresh cookies in `auth.json`.*

---

## 📝 Step 5: Customize Your Topics
1. Open **`topics.json`** in Notepad.
2. Edit or add topics in the same format. The bot will walk through this list sequentially (Topic 1, then Topic 2, then Topic 3...) and write viral posts about them.

---

## 🚀 Step 6: Test the Bot
Double-click **`run-bot.bat`**. 
It will launch a terminal, generate a post, open a background browser, and tweet it!

---

## 🕰️ Step 7: Automate It (Windows Task Scheduler)
To have the bot run in the background (e.g. 3 times a day):
1. Press the **Windows Key**, type **Task Scheduler**, and press Enter.
2. Click **Create Basic Task...** on the right.
3. Give it a name like `Dad Twitter Bot`.
4. Choose **Daily** and set the time you want it to run.
5. In **Action**, select **Start a program**.
6. **Program/script**: Browse and select `run-bot.bat` in this folder.
7. **Start in (optional)**: Copy and paste the absolute path to this folder (e.g. `C:\Users\YourName\Documents\dad-twitter-bot`).
8. Click **Finish**.
