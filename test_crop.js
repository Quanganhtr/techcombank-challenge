const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1050 } });
  await page.goto('http://localhost:3000/screens/home');
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
    const sticky = document.querySelector('.sticky');
    const scrollContainer = sticky.closest('.overflow-y-auto');
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/tmp/crop_bottom.png', clip: { x: 480, y: 850, width: 440, height: 140 } });
  await browser.close();
})();
