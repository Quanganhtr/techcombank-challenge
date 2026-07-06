const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1050 } });
  await page.goto('http://localhost:3000/screens/home');
  await page.waitForTimeout(1000);
  await page.mouse.move(700, 600);
  await page.mouse.wheel(0, 3000);
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/bottom_end.png' });
  await browser.close();
})();
