const { chromium } = require("playwright");

const BASE_URL = "https://sanand0.github.io/tdsdata/js_table/?seed=";

async function scrapeSeed(seed) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const url = `${BASE_URL}${seed}`;
  console.log("Visiting:", url);

  await page.goto(url, { waitUntil: "load" });

  // wait for table to load (important for JS page)
  await page.waitForSelector("table");

  const numbers = await page.$$eval("table td", cells =>
    cells
      .map(td => td.innerText.trim())
      .map(text => parseFloat(text))
      .filter(num => !isNaN(num))
  );

  await browser.close();

  return numbers.reduce((a, b) => a + b, 0);
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
