const { chromium } = require('playwright');

async function scrapeSeed(seed) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`https://your-seed-url?seed=${seed}`);

  const numbers = await page.$$eval('table td', tds =>
    tds.map(td => parseFloat(td.innerText)).filter(n => !isNaN(n))
  );

  await browser.close();
  return numbers.reduce((a, b) => a + b, 0);
}

(async () => {
  let total = 0;
  for (let seed = 25; seed <= 34; seed++) {
    total += await scrapeSeed(seed);
  }
  console.log("TOTAL SUM:", total);
})();
