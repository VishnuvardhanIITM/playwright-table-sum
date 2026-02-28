const { chromium } = require("playwright");

// 🔴 REPLACE THIS WITH THE REAL BASE URL
// Example format (DO NOT copy this blindly):
// const BASE_URL = "https://example.com/?seed=";

const BASE_URL = "PASTE_REAL_BASE_URL_HERE";

async function scrapeSeed(seed) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const url = `${BASE_URL}${seed}`;
  console.log("Visiting:", url);

  await page.goto(url, { waitUntil: "load" });

  // Wait until table appears (important for dynamic content)
  await page.waitForSelector("table");

  // Extract all numeric values from all tables
  const numbers = await page.$$eval("table td", cells =>
    cells
      .map(td => td.innerText.trim())
      .map(text => parseFloat(text))
      .filter(num => !isNaN(num))
  );

  await browser.close();

  const sum = numbers.reduce((a, b) => a + b, 0);
  return sum;
}

(async () => {
  let total = 0;

  for (let seed = 25; seed <= 34; seed++) {
    const seedSum = await scrapeSeed(seed);
    console.log(`Seed ${seed} sum:`, seedSum);
    total += seedSum;
  }

  console.log("FINAL TOTAL:", total);
})();
