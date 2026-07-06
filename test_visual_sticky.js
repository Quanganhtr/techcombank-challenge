const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1050 } });
  await page.goto('http://localhost:3000/screens/home');
  await page.waitForTimeout(1000);
  await page.mouse.move(700, 600);
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, 150);
    await page.waitForTimeout(250);
    await page.screenshot({ path: `/tmp/vs_${i}.png` });
  }
  await browser.close();
})();
